import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview, 
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// USER
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/:id/review", protect, addReview);


// ADMIN
router.post("/", protect, isAdmin, upload.array("images", 6), createProduct);
router.put("/:id", protect, isAdmin, upload.array("images", 6), updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.delete("/:productId/review/:reviewId", protect, isAdmin, deleteReview);


export default router;

