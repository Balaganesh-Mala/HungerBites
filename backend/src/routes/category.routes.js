import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

// CREATE CATEGORY (with image)
router.post("/", upload.single("image"), createCategory);

// GET ALL CATEGORIES
router.get("/", getCategories);

// UPDATE CATEGORY (optional new image)
router.put("/:id", upload.single("image"), updateCategory);

// DELETE CATEGORY
router.delete("/:id", deleteCategory);

export default router;
