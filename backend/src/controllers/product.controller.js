import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";

//
// 📦 Create new product (Admin only)
//
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, weight, flavor, isFeatured } = req.body;

  if (!name || !price || !category) {
    res.status(400);
    throw new Error("Name, price, and category are required");
  }

  let images = [];

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer, "hungerbites/products");
    images.push({
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock: stock || 0,
    weight,
    flavor,
    isFeatured: isFeatured || false,
    images,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

//
// 📋 Get all products (Public)
//
export const getAllProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 10, featured } = req.query;

  const query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: "i" };
  if (featured) query.isFeatured = featured === "true";

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    products,
  });
});

//
// 🔍 Get single product by ID
//
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true, product });
});

//
// ✏️ Update product (Admin only)
//
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, weight, flavor, isFeatured } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // ✅ Update image if new file uploaded
  if (req.file) {
  if (product.images.length > 0) {
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  const uploaded = await uploadToCloudinary(req.file.buffer, "hungerbites/products");

  product.images = [{
    public_id: uploaded.public_id,
    url: uploaded.secure_url,
  }];
}


  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.stock = stock ?? product.stock;
  product.weight = weight || product.weight;
  product.flavor = flavor || product.flavor;
  product.isFeatured = isFeatured ?? product.isFeatured;

  const updatedProduct = await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

//
// ❌ Delete product (Admin only)
//
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // ✅ Delete product images from Cloudinary
  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: "Product deleted successfully" });
});
