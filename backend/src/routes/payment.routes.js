import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  recordFailedPayment,
  getUserPayments,
  getAllPayments,
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";

const router = express.Router();

// User routes
router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);
router.post("/failed", protect, recordFailedPayment);
router.get("/my-payments", protect, getUserPayments);

// Admin routes
router.get("/", protect, adminOnly, getAllPayments);

export default router;
