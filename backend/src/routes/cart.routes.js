import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// User cart operations
router.post("/add", protect, addToCart);
router.get("/", protect, getUserCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove", protect, removeFromCart);
router.delete("/clear", protect, clearCart);

export default router;
