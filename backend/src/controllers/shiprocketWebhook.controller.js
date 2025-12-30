import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";

export const shiprocketWebhook = asyncHandler(async (req, res) => {
  const payload = req.body;

  /*
    Important fields from Shiprocket:
    payload.awb
    payload.current_status
    payload.current_status_code
    payload.scan
  */

  const awb = payload?.awb;

  if (!awb) {
    return res.status(200).json({ success: true });
  }

  const order = await Order.findOne({ trackingId: awb });

  if (!order) {
    return res.status(200).json({ success: true });
  }

  // Update shipment status
  order.shipmentStatus = payload.current_status;

  // Save tracking history
  if (payload.scan) {
    order.trackingHistory.push({
      status: payload.current_status,
      location: payload.scan.location,
      time: payload.scan.time,
    });
  }

  // Mark delivered
  if (payload.current_status === "Delivered") {
    order.orderStatus = "Delivered";
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({ success: true });
});
