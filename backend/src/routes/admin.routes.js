import express from "express";
import {
  registerAdmin,
  adminLogin,
  getDashboardStats,
  getMonthlyRevenue,
  getTopProducts,
  getAllOrders,
  getAllUsers,
  updateOrderStatus,
} from "../controllers/admin.controller.js";


import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", adminLogin);

router.get("/dashboard", protect, isAdmin, getDashboardStats);
router.get("/revenue", protect, isAdmin, getMonthlyRevenue);
router.get("/top-products", protect, isAdmin, getTopProducts);
router.get("/orders", protect, isAdmin, getAllOrders);
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/order/:id/status", protect, isAdmin, updateOrderStatus);



export default router;
