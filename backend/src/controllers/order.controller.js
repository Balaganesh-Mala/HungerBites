import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { razorpay } from "../config/razorpay.js";   // ✅ use shared instance
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

/**
 * Helper: load product map for given productIds (single DB call)
 * returns Map(productId -> productDoc)
 */
const loadProductsMap = async (productIds) => {
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const map = new Map();
  for (const p of products) map.set(String(p._id), p);
  return map;
};

/**
 * Build validated order items:
 * - ensures every product exists
 * - ensures stock >= qty
 * - returns finalOrderItems array and itemsPrice (calculated)
 */
const buildFinalOrderItems = async (orderItems) => {
  const productIds = orderItems.map((it) => it.productId);
  const productMap = await loadProductsMap(productIds);

  const finalOrderItems = [];
  let itemsPrice = 0;

  for (const item of orderItems) {
    const pid = String(item.productId);
    const product = productMap.get(pid);

    if (!product) {
      const e = new Error(`Product not found: ${pid}`);
      e.code = "PRODUCT_NOT_FOUND";
      throw e;
    }

    const qty = Number(item.quantity) || 0;
    if (qty <= 0) {
      const e = new Error(`Invalid quantity for product ${product.name}`);
      e.code = "INVALID_QTY";
      throw e;
    }

    if (product.stock < qty) {
      const e = new Error(`Not enough stock for ${product.name}`);
      e.code = "OUT_OF_STOCK";
      throw e;
    }

    const price = Number(product.price || 0);
    finalOrderItems.push({
      productId: product._id,
      name: product.name,
      quantity: qty,
      price,
    });

    itemsPrice += price * qty;
  }

  return { finalOrderItems, itemsPrice };
};

//
// CREATE ORDER (COD or Online). Validates products first.
//
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, paymentMethod, shippingAddress } = req.body;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error("No items in the order");
  }

  // Validate products and compute price
  const { finalOrderItems, itemsPrice } = await buildFinalOrderItems(orderItems);

  // ONLINE PAYMENT → create Razorpay order
  if (paymentMethod === "online") {
    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // ✅ using shared Razorpay instance (fixed)
    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  }

  // COD → create order + decrease stock
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await Order.create(
      [
        {
          user: req.user._id,
          orderItems: finalOrderItems,
          itemsPrice: totalPrice ?? itemsPrice,
          totalPrice: totalPrice ?? itemsPrice,
          paymentMethod: "COD",
          paymentStatus: "Pending",
          shippingAddress,
          orderStatus: "Processing",
        },
      ],
      { session }
    );

    const bulkOps = finalOrderItems.map((it) => ({
      updateOne: {
        filter: { _id: it.productId },
        update: { $inc: { stock: -it.quantity } },
      },
    }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: order[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

//
// VERIFY PAYMENT → ONLY after success from Razorpay
//
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderData,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Invalid payment verification payload");
  }

  // verify signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid payment signature");
  }

  // Validate orderData
  if (!orderData || !Array.isArray(orderData.orderItems)) {
    res.status(400);
    throw new Error("Invalid order data");
  }

  const { finalOrderItems, itemsPrice } = await buildFinalOrderItems(
    orderData.orderItems
  );

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const order = await Order.create(
      [
        {
          user: req.user._id,
          orderItems: finalOrderItems,
          itemsPrice: orderData.totalPrice ?? itemsPrice,
          totalPrice: orderData.totalPrice ?? itemsPrice,
          paymentMethod: "online",
          paymentStatus: "Paid",
          orderStatus: "Processing",
          shippingAddress: orderData.shippingAddress,
          paymentInfo: {
            id: razorpay_payment_id,
            status: "Paid",
            method: "Razorpay",
          },
        },
      ],
      { session }
    );

    const bulkOps = finalOrderItems.map((it) => ({
      updateOne: {
        filter: { _id: it.productId },
        update: { $inc: { stock: -it.quantity } },
      },
    }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps, { session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Payment verified & order created",
      order: order[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

//
// ADMIN: get all orders
//
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("orderItems.productId", "name price images");

  res.status(200).json({ success: true, orders });
});

//
// USER: get my orders
//
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate({
    path: "orderItems.productId",
    select: "name price images flavor",
  });

  res.status(200).json({ success: true, orders });
});

//
// ADMIN: update order status
//
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = status;

  if (status === "Delivered") {
    order.paymentStatus = "Paid";
    order.deliveredAt = new Date();
  }

  await order.save();
  res.status(200).json({ success: true, message: "Order updated", order });
});

//
// DELETE order
//
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  await order.deleteOne();
  res.status(200).json({ success: true, message: "Order deleted" });
});
