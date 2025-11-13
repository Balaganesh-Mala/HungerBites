import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

//
// 💳 Razorpay Setup
//
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//
// 🛍️ Create New Order (COD or Online)
//
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, paymentMethod, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No items in the order");
  }

  //
  // 🟩 Build clean orderItems array (fetch product details properly)
  //
  const finalOrderItems = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        throw new Error(`${product.title} is out of stock`);
      }

      return {
        productId: product._id,     // correctly reference product
        name: product.title,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  //
  // 🟧 Razorpay Online Payment
  //
  if (paymentMethod === "online") {
    const options = {
      amount: totalPrice * 100, // ₹ -> paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  }

  //
  // 🟦 Cash on Delivery (COD)
  //
  const order = await Order.create({
    user: req.user._id,
    orderItems: finalOrderItems,
    itemsPrice: totalPrice,
    totalPrice,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    shippingAddress,
    orderStatus: "Processing",
  });

  // Decrease product stock
  for (const item of finalOrderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

//
// ✅ Verify Razorpay Payment
//
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderData,
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid payment signature");
  }

  //
  // Build clean order items again for online payment
  //
  const finalOrderItems = await Promise.all(
    orderData.orderItems.map(async (item) => {
      const product = await Product.findById(item.productId);

      return {
        productId: product._id,
        name: product.title,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  const order = await Order.create({
    user: req.user._id,
    orderItems: finalOrderItems,
    itemsPrice: orderData.totalPrice,
    totalPrice: orderData.totalPrice,
    paymentMethod: "online",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    shippingAddress: orderData.shippingAddress,
    paymentInfo: {
      id: razorpay_payment_id,
      status: "Paid",
      method: "Razorpay",
    },
  });

  // Update stock
  for (const item of finalOrderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  res.status(201).json({
    success: true,
    message: "Payment verified & order created",
    order,
  });
});

//
// 📋 Admin: Get All Orders
//
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("orderItems.productId", "title price images");

  res.status(200).json({ success: true, orders });
});

//
// 👤 User: Get My Orders
//
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate({
      path: "orderItems.productId",
      select: "title price images flavor",
    });

  res.status(200).json({ success: true, orders });
});

//
// ✏️ Update Order Status (Admin)
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

  res.status(200).json({
    success: true,
    message: "Order updated",
    order,
  });
});

//
// ❌ Delete Order
//
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted",
  });
});
