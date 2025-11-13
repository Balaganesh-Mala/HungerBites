import express from "express";
import {
  getAllUsers,
  getMyProfile,
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  updateAddress,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// 👑 Admin
router.get("/", protect, isAdmin, getAllUsers);

// 👤 User profile
router.get("/me", protect, getMyProfile);
router.put("/update", protect, updateUserProfile);

// 🧺 Wishlist
router.post("/wishlist/add", protect, addToWishlist);
router.post("/wishlist/remove", protect, removeFromWishlist);

// 🏠 Address
router.put("/address", protect, updateAddress);

export default router;
