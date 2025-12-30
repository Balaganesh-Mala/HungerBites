import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/Coupon.model.js";
import { ShiprocketService } from "../services/shiprocket.service.js";
import { buildShiprocketOrderPayload } from "../utils/shiprocketOrderBuilder.js";

import dotenv from "dotenv";
import { buildFinalOrderItems } from "../utils/order.utils.js";

dotenv.config();

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
  const { orderItems, paymentMethod, shippingAddress, couponCode } = req.body;

  if (paymentMethod !== "COD") {
    res.status(400);
    throw new Error("Only COD orders allowed here");
  }

  const { finalOrderItems, itemsPrice } = await buildFinalOrderItems(
    orderItems
  );

  // ===== COUPON LOGIC =====
  let discount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    });

    if (!coupon) throw new Error("Invalid coupon");
    if (new Date(coupon.expiry) < new Date()) throw new Error("Coupon expired");
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
    appliedCoupon = coupon.code;
  }

  const finalTotal = itemsPrice - discount;
  // =======================

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.create(
      [
        {
          user: req.user._id,
          orderItems: finalOrderItems,
          itemsPrice,
          discount,
          totalPrice: finalTotal,
          coupon: appliedCoupon ? { code: appliedCoupon, discount } : null,
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

    // AFTER session.commitTransaction()

    try {
      const payload = buildShiprocketOrderPayload(order[0]);

      const shiprocketRes = await ShiprocketService.request(
        "post",
        "/orders/create",
        payload
      );

      order[0].shipmentId = shiprocketRes.shipment_id;
      order[0].trackingId = shiprocketRes.awb_code;
      order[0].courierName = shiprocketRes.courier_name;
      order[0].shipmentStatus = "Booked";

      await order[0].save();
    } catch (err) {
      console.error(
        "Shiprocket booking failed:",
        err.response?.data || err.message
      );
      // ❗ DO NOT throw — order should still succeed
    }

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
    $or: [{ paymentMethod: "COD" }, { paymentStatus: "Paid" }],
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


export const getOrderTracking = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id, // 🔐 user can see only own order
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({
    success: true,
    trackingId: order.trackingId,
    courier: order.courierName,
    shipmentStatus: order.shipmentStatus,
    trackingHistory: order.trackingHistory,
  });
});