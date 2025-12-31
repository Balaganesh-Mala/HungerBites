import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";

const SHIPROCKET_STATUS_MAP = {
  NEW: "Booked",
  AWB_ASSIGNED: "Booked",

  PICKUP_SCHEDULED: "Booked",
  PICKED_UP: "Shipped",

  IN_TRANSIT: "In Transit",
  "In Transit": "In Transit",

  OUT_FOR_DELIVERY: "Out for Delivery",
  "Out for Delivery": "Out for Delivery",

  DELIVERED: "Delivered",

  CANCELLED: "Cancelled",

  RTO_INITIATED: "In Transit",
  RTO_DELIVERED: "Delivered"
};

export const shiprocketWebhook = asyncHandler(async (req, res) => {
  console.log("🔥 WEBHOOK HIT 🔥");
  console.log("📦 Shiprocket Webhook HIT");
  console.log("Body:", req.body);

  const { awb, current_status, scan } = req.body;

  if (!awb || !current_status) {
    return res.status(200).json({ success: true });
  }

  const order = await Order.findOne({ trackingId: awb });
  if (!order) {
    return res.status(200).json({ success: true });
  }

  // 🔹 Map status safely
  const mappedStatus =
    SHIPROCKET_STATUS_MAP[current_status] || order.shipmentStatus;

  order.shipmentStatus = mappedStatus;

  // 🔹 Save tracking history
  if (scan) {
    order.trackingHistory.push({
      status: mappedStatus,
      location: scan.location || "",
      time: scan.time || new Date()
    });
  }

  // 🔹 Auto-complete order
  if (mappedStatus === "Delivered") {
    order.orderStatus = "Delivered";
    order.paymentStatus = "Paid";
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({ success: true });
});
