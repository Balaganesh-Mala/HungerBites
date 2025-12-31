import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import {
  ShiprocketService,
  requestPickup,
} from "../services/shiprocket.service.js";


export const generateShipmentAWB = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order || !order.shipmentId) {
    return res.status(400).json({ message: "Shipment not created" });
  }

  if (order.trackingId) {
    return res.status(400).json({ message: "AWB already generated" });
  }

  // ✅ AUTO ASSIGN COURIER + AWB
  const awbRes = await ShiprocketService.request(
    "post",
    "/courier/assign/awb",
    {
      shipment_id: order.shipmentId,
    }
  );

  order.trackingId = awbRes.data.awb_code;
  order.courierName = awbRes.data.courier_name;
  order.shipmentStatus = "Shipped";

  await order.save();

  res.json({
    success: true,
    awb: order.trackingId,
    courier: order.courierName,
  });
});



export const requestOrderPickup = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order || !order.shipmentId || !order.trackingId) {
    res.status(400);
    throw new Error("AWB not generated yet");
  }

  await requestPickup(order.shipmentId);

  order.shipmentStatus = "Out for Pickup";
  await order.save();

  res.json({
    success: true,
    message: "Pickup requested successfully",
  });
});
