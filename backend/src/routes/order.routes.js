import express from "express";
import {
  createOrder,
  verifyPayment,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";
import { shipOrder,getTrackingDetails } from "../controllers/shipping.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";


const router = express.Router();

// User routes
router.post("/", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/my-orders", protect, getUserOrders);
router.get("/track/:trackingId", protect, getTrackingDetails);

// Admin routes
router.get("/", protect, isAdmin, getAllOrders);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);
router.delete("/:id", protect, isAdmin, deleteOrder);
router.post("/ship/:id", protect, isAdmin, shipOrder);
router.get("/track/:trackingId", protect, isAdmin, getTrackingDetails);


export default router;
