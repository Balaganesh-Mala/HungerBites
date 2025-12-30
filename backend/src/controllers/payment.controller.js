import Product from "../models/product.model.js";
import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";
import Cart from "../models/cart.model.js";
import Coupon from "../models/Coupon.model.js";
import { ShiprocketService } from "../services/shiprocket.service.js";
import { buildShiprocketOrderPayload } from "../utils/shiprocketOrderBuilder.js";

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

  try {
  const payload = buildShiprocketOrderPayload(order);

  const shiprocketRes = await ShiprocketService.request(
    "post",
    "/orders/create",
    payload
  );

  order.shipmentId = shiprocketRes.shipment_id;
  order.trackingId = shiprocketRes.awb_code;
  order.courierName = shiprocketRes.courier_name;
  order.shipmentStatus = "Booked";

  await order.save();
} catch (err) {
  console.error("Shiprocket booking failed:", err.response?.data || err.message);
}

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

  // 1️⃣ Verify Razorpay signature
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    res.status(400);
    throw new Error("Invalid payment signature");
  }

  // 2️⃣ Lock product prices & validate stock
  const { finalOrderItems, itemsPrice } =
    await buildFinalOrderItems(orderData.orderItems);

  // 3️⃣ Re-apply coupon on backend (CRITICAL)
  let discount = 0;
  let appliedCoupon = null;

  if (orderData?.couponCode) {
    const coupon = await Coupon.findOne({
      code: orderData.couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) throw new Error("Invalid coupon");

    if (new Date(coupon.expiry) < new Date())
      throw new Error("Coupon expired");

    if (itemsPrice < coupon.minCartValue)
      throw new Error(
        `Minimum cart value ₹${coupon.minCartValue} required`
      );

    if (coupon.type === "PERCENT") {
      discount = (itemsPrice * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    if (coupon.type === "FLAT") {
      discount = coupon.value;
    }

    discount = Math.min(discount, itemsPrice);
    appliedCoupon = coupon.code;
  }

  const finalTotal = Math.max(itemsPrice - discount, 0);

  // 4️⃣ Create Order (ONLINE PAYMENT)
  const order = await Order.create({
    user: req.user._id,
    orderItems: finalOrderItems,
    shippingAddress: orderData.shippingAddress,

    itemsPrice,
    totalPrice: finalTotal,

    coupon: appliedCoupon
      ? { code: appliedCoupon, discount }
      : null,

    paymentMethod: "online",
    paymentStatus: "Paid",
    orderStatus: "Processing",

    paymentInfo: {
      id: razorpay_payment_id,
      status: "Paid",
      method: "Razorpay",
    },
  });

  // 5️⃣ Reduce stock
  const bulkOps = finalOrderItems.map((item) => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { stock: -item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkOps);

  // 6️⃣ Clear cart
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
  const { orderItems, couponCode, shippingAddress } = req.body;

  // 1️⃣ Validate & lock product prices
  const { finalOrderItems, itemsPrice } =
    await buildFinalOrderItems(orderItems);

  // 2️⃣ Apply coupon (same logic as COD)
  let discount = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) throw new Error("Invalid coupon");
    if (new Date(coupon.expiry) < new Date())
      throw new Error("Coupon expired");

    if (itemsPrice < coupon.minCartValue)
      throw new Error(`Minimum cart value ₹${coupon.minCartValue} required`);

    if (coupon.type === "PERCENT") {
      discount = (itemsPrice * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    if (coupon.type === "FLAT") {
      discount = coupon.value;
    }

    discount = Math.min(discount, itemsPrice);
  }

  const finalAmount = Math.max(itemsPrice - discount, 0);

  // 3️⃣ Create Razorpay order (PAISE)
  const razorpayOrder = await razorpay.orders.create({
    amount: finalAmount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  res.status(200).json({
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,

    // frontend will resend this in verify
    orderData: {
      orderItems: finalOrderItems,
      shippingAddress,
      coupon: couponCode
        ? { code: couponCode, discount }
        : null,
      itemsPrice,
      discount,
      totalPrice: finalAmount,
    },
  });
});



