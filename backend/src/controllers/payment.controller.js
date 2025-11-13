import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

//
// 💳 Razorpay setup
//
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
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
    orderId,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Missing payment data");
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid signature. Payment verification failed.");
  }

  // 💾 Save payment record
  const payment = await Payment.create({
    user: req.user._id,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    amount: req.body.amount,
    status: "Success",
  });

  // 🧾 Update order status if exists
  if (orderId) {
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = "Paid";
      order.paymentMethod = "Online";
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();
    }
  }

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    payment,
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
