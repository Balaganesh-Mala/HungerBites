import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderTracking,
} from "../controllers/order.controller.js";
import {generateShipmentAWB, requestOrderPickup} from "../controllers/shipping.controller.js"

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";


const router = express.Router();

// User routes
router.post("/", protect, createOrder);

router.get("/my-orders", protect, getUserOrders);


// Admin routes
router.get("/", protect, isAdmin, getAllOrders);
router.put("/:id/status", protect, isAdmin, updateOrderStatus);
router.delete("/:id", protect, isAdmin, deleteOrder);


router.post(
  "/:id/generate-awb",
  protect,
  isAdmin,
  generateShipmentAWB
);
router.post(
  "/:id/request-pickup",
  protect,
  isAdmin,
  requestOrderPickup
);

router.get(
  "/:id/tracking",
  protect,
  getOrderTracking
);

export default router;
