import asyncHandler from "express-async-handler";
import Category from "../models/category.model.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";

//
// ➕ Create Category
//
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  let imageData = {};

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    imageData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const category = await Category.create({
    name,
    description,
    image: imageData,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

//
// 📦 Get All Categories
//
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    categories,
  });
});

//
// 📄 Get Single Category
//
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.status(200).json({ success: true, category });
});

//
// ✏ Update Category
//
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  let category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  let imageData = category.image;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path);
    imageData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  category.name = name ?? category.name;
  category.description = description ?? category.description;
  category.image = imageData;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

//
// ❌ Delete Category
//
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
