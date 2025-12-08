import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import cloudinary from "../config/cloudinary.js";
import { uploadMultipleToCloudinary } from "../middleware/upload.middleware.js";

//
// ➕ CREATE PRODUCT
//
export const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      mrp,
      weight,
      flavor,
      category,
      brand,
      isFeatured,
      isBestSeller,
    } = req.body;

    if (!name || !description || !price || !category) {
      res.status(400);
      throw new Error("Required fields missing");
    }

    // Upload multiple images (max 6)
    let imageData = [];
    if (req.files && req.files.length > 0) {
      imageData = await uploadMultipleToCloudinary(req.files, "products");
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      mrp,
      weight,
      flavor,
      category,
      brand,
      isFeatured,
      isBestSeller,
      images: imageData,
    });

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

//
// 📦 GET ALL PRODUCTS
//
//
// 📦 GET ALL PRODUCTS — WITH FILTERS (PRICE + FLAVOR)
//
export const getAllProducts = asyncHandler(async (req, res) => {
  const { search, category, featured, bestseller, flavor, sort } = req.query;

  let query = {};

  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (featured) query.isFeatured = featured === "true";
  if (bestseller) query.isBestSeller = bestseller === "true";

  // ⭐ Flavor filter
  if (flavor) query.flavor = { $regex: flavor, $options: "i" };

  // Build base query
  let dbQuery = Product.find(query).populate("category", "name");

  // ⭐ Sorting (price low-high / high-low)
  if (sort === "low-high") {
    dbQuery = dbQuery.sort({ price: 1 }); // ascending
  }
  if (sort === "high-low") {
    dbQuery = dbQuery.sort({ price: -1 }); // descending
  }

  // Default sorting by latest
  if (!sort) {
    dbQuery = dbQuery.sort({ createdAt: -1 });
  }

  const products = await dbQuery;

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

  // 🌟 If new images uploaded
  if (req.files && req.files.length > 0) {
    // Delete old Cloudinary images
    for (const img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Upload new images
    const newImageData = await uploadMultipleToCloudinary(
      req.files,
      "products"
    );

    product.images = newImageData;
  }

  // Update text values
  const fields = [
    "name",
    "description",
    "price",
    "mrp",
    "stock",
    "category",
    "flavor",
    "weight",
    "brand",
    "isFeatured",
    "isBestSeller",
  ];

  fields.forEach((key) => {
    if (req.body[key] !== undefined) {
      product[key] = req.body[key];
    }
  });

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
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


export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user purchased and delivered
  const deliveredOrder = await Order.findOne({
    user: req.user._id,
    "orderItems.productId": productId,
    orderStatus: "Delivered",
  });

  if (!deliveredOrder) {
    res.status(400);
    throw new Error("You can review only after delivery");
  }

  // Check duplicate review
  const existing = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (existing) {
    res.status(400);
    throw new Error("You already reviewed this product");
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    createdAt: new Date(),
  };

  product.reviews.push(review);

  // update rating
  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Review added",
    product, // 👈 send full product to refresh UI
  });
});



export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { productId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // filter out review
  const updatedReviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId
  );

  if (updatedReviews.length === product.reviews.length) {
    res.status(400);
    throw new Error("Review not found");
  }

  product.reviews = updatedReviews;

  // Update rating + count
  product.numOfReviews = updatedReviews.length;
  product.ratings =
    updatedReviews.reduce((acc, item) => acc + item.rating, 0) /
    (updatedReviews.length || 1);

  await product.save();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    reviews: product.reviews,
  });
});
