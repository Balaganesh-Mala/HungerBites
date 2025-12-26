import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { razorpay } from "../config/razorpay.js"; // ✅ use shared instance
import crypto from "crypto";
import dotenv from "dotenv";
import { buildFinalOrderItems } from "../utils/order.utils.js";

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

//
// CREATE ORDER (COD or Online). Validates products first.
//
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, paymentMethod, shippingAddress } = req.body;

  if (paymentMethod !== "COD") {
    res.status(400);
    throw new Error("Only COD orders allowed here");
  }

  const { finalOrderItems, itemsPrice } = await buildFinalOrderItems(
    orderItems
  );

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
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

    const bulkOps = finalOrderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOps, { session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "COD Order placed",
      order: order[0],
    });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

//
// VERIFY PAYMENT → ONLY after success from Razorpay
//

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
  const orders = await Order.find({
    user: req.user._id,
    $or: [
      { paymentMethod: "COD" },
      { paymentStatus: "Paid" },
    ],
  }).populate({
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
