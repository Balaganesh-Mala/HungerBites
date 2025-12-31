import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";

export const shiprocketWebhook = asyncHandler(async (req, res) => {
console.log("🔥 WEBHOOK HIT 🔥");
  console.log("📦 Shiprocket Webhook Headers:", req.headers);
console.log("📦 Shiprocket Webhook Body:", req.body);

  /* 🔐 VERIFY WEBHOOK TOKEN */
  const receivedToken = req.headers["x-api-key"];
  if (receivedToken !== process.env.SHIPROCKET_WEBHOOK_TOKEN) {
    return res.status(401).json({ success: false });
  }

  const payload = req.body;
  let order = null;

  // 1️⃣ Try by AWB
  if (payload.awb) {
    order = await Order.findOne({ trackingId: payload.awb });
  }

  // 2️⃣ Fallback by shipment_id (FIRST WEBHOOK)
  if (!order && payload.shipment_id) {
    order = await Order.findOne({
      shipmentId: payload.shipment_id.toString(),
    });
  }

  if (!order) {
    return res.status(200).json({ success: true });
  }

  // 3️⃣ Save AWB & courier (first time)
  if (!order.trackingId && payload.awb) {
    order.trackingId = payload.awb;
  }

  if (!order.courierName && payload.courier_name) {
    order.courierName = payload.courier_name;
  }

  // 4️⃣ Update shipment status
  if (payload.current_status) {
    order.shipmentStatus = payload.current_status;
  }

  // 5️⃣ Tracking history
  if (payload.scan) {
    order.trackingHistory.push({
      status: payload.current_status,
      location: payload.scan.location,
      time: payload.scan.time,
    });
  }

  // 6️⃣ Delivered logic
  if (payload.current_status === "Delivered") {
    order.orderStatus = "Delivered";
    order.paymentStatus = "Paid";
    order.deliveredAt = new Date();
  }

  await order.save();

  return res.status(200).json({ success: true });
});
