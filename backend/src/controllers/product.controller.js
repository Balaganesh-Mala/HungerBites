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


export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You already reviewed this product");
  }

  // Check if user purchased and delivered
  const deliveredOrder = await Order.findOne({
    user: req.user._id,
    "orderItems.productId": productId,
    orderStatus: "Delivered",
  });

  if (!deliveredOrder) {
    res.status(400);
    throw new Error("You can review only after the product is delivered");
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    createdAt: new Date(),
  };

  product.reviews.push(review);

  // Update rating
  product.numOfReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) /
    product.reviews.length;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Review added",
    reviews: product.reviews,
  });
});

