import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// USER
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// ADMIN
router.post("/", protect, isAdmin, upload.single("image"), createProduct);
router.put("/:id", protect, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);

export default router;
