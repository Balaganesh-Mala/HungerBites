import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";
import Cart from "../models/cart.model.js";
import { buildFinalOrderItems } from "../utils/order.utils.js";


dotenv.config();

//
// 💳 Razorpay setup
//
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

//
// 🧾 Create a payment order (called before payment UI opens)
//
export const createPaymentOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Invalid amount");
  }

  const options = {
    amount: Math.round(amount * 100), // Razorpay requires amount in paisa
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    orderId: order.id,
    currency: order.currency,
    amount: order.amount,
  });
});

//
// ✅ Verify payment & store in DB
//
export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderData,
  } = req.body;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  // ✅ NOW payment is confirmed
  const { finalOrderItems, itemsPrice } =
    await buildFinalOrderItems(orderData.orderItems);

  const order = await Order.create({
    user: req.user._id,
    orderItems: finalOrderItems,
    itemsPrice,
    totalPrice: orderData.totalPrice,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: "online",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    paymentInfo: {
      id: razorpay_payment_id,
      status: "Paid",
      method: "Razorpay",
    },
  });

  // Reduce stock
  const bulkOps = finalOrderItems.map((item) => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { stock: -item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkOps);

  // Clear cart
  await Cart.deleteOne({ user: req.user._id });

  res.status(201).json({
    success: true,
    message: "Payment successful, order created",
    order,
  });
});




//
// ❌ Handle failed payments (for logging)
//
export const recordFailedPayment = asyncHandler(async (req, res) => {
  const { amount, reason } = req.body;

  const payment = await Payment.create({
    user: req.user._id,
    amount,
    status: "Failed",
    reason,
  });

  res.status(201).json({
    success: true,
    message: "Failed payment logged",
    payment,
  });
});

//
// 👤 Get user’s payment history
//
export const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, payments });
});

//
// 🧮 Admin: Get all payments
//
export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, payments });
});

export const initiateOnlinePayment = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, shippingAddress } = req.body;

  // Validate items but DO NOT create order
  await buildFinalOrderItems(orderItems);

  const razorpayOrder = await razorpay.orders.create({
    amount: totalPrice * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  res.status(200).json({
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,

    // Send order data back (frontend will resend on verify)
    orderData: {
      orderItems,
      totalPrice,
      shippingAddress,
    },
  });
});


