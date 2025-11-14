import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import cloudinary from "cloudinary";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";

//
// ➕ CREATE PRODUCT
//
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    mrp,
    category,
    stock,
    weight,
    flavor,
    brand,
    isFeatured,
    isBestSeller
  } = req.body;

  if (!name || !price || !category) {
    res.status(400);
    throw new Error("Name, price and category are required");
  }

  let images = [];

  if (req.file) {
    const imgUpload = await uploadToCloudinary(
      req.file.buffer,
      "hungerbites/products"
    );

    images.push({
      public_id: imgUpload.public_id,
      url: imgUpload.secure_url,
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    mrp,
    category,
    stock: stock || 0,
    weight,
    flavor,
    brand,
    isFeatured: isFeatured || false,
    isBestSeller: isBestSeller || false,
    images
  });

  res.status(201).json({
    success: true,
    message: "Product created",
    product,
  });
});

//
// 📦 GET ALL PRODUCTS
//
export const getAllProducts = asyncHandler(async (req, res) => {
  const { search, category, featured, bestseller } = req.query;

  let query = {};

  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (featured) query.isFeatured = featured === "true";
  if (bestseller) query.isBestSeller = bestseller === "true";

  const products = await Product.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    products,
  });
});

//
// 🔍 GET PRODUCT BY ID
//
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({ success: true, product });
});

//
// ✏ UPDATE PRODUCT
//
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Replace image if new one uploaded
  if (req.file) {
    for (let img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "hungerbites/products"
    );

    product.images = [
      {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      },
    ];
  }

  const fields = [
    "name", "description", "price", "mrp",
    "stock", "category", "flavor", "weight",
    "brand", "isFeatured", "isBestSeller"
  ];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      product[f] = req.body[f];
    }
  });

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated",
    product,
  });
});

//
// ❌ DELETE PRODUCT
//
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  for (let img of product.images) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});
