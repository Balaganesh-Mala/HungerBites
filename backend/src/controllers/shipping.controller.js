import asyncHandler from "express-async-handler";
import Order from "../models/order.model.js";
import { generateAWB, requestPickup } from "../services/shiprocket.service.js";

export const generateShipmentAWB = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order || !order.shipmentId) {
    res.status(400);
    throw new Error("Shipment not created for this order");
  }

  if (order.trackingId) {
    res.status(400);
    throw new Error("AWB already generated");
  }

  const response = await generateAWB(order.shipmentId);

  order.trackingId = response.awb_code;
  order.courierName = response.courier_name;
  order.shipmentStatus = "Shipped";

  await order.save();

  res.json({
    success: true,
    message: "AWB generated successfully",
    awb: response.awb_code,
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
