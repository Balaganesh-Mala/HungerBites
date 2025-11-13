import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Payment from "../models/payment.model.js";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config();

//
// 🔐 Admin Login
//
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  const admin = await User.findOne({ email, role: "admin" }).select("+password");

  if (!admin) {
    res.status(401);
    throw new Error("Admin not found or unauthorized");
  }

  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid admin credentials");
  }

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    token: generateToken(admin._id),
  });
});

//
// 🧭 Dashboard stats
//
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  const totalRevenue = await Payment.aggregate([
    { $match: { status: "Success" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  });
});

//
// 📊 Monthly revenue
//
export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const monthlyData = await Payment.aggregate([
    { $match: { status: "Success" } },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const formatted = monthlyData.map((d) => ({
    month: `${d._id.month}-${d._id.year}`,
    total: d.total,
  }));

  res.status(200).json({ success: true, monthlyRevenue: formatted });
});

//
// 🧮 Top products
//
export const getTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.productId",
        totalSold: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        name: "$product.name",
        images: "$product.images",
        totalSold: 1,
      },
    },
  ]);

  res.status(200).json({ success: true, topProducts });
});

//
// 📦 All orders
//
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("orderItems.productId", "name price images")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, orders });
});

//
// 🧑‍💼 All users
//
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(200).json({ success: true, users });
});

//
// ⚙️ Update order status
//
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const order = await Order.findById(id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = status; // ✅ FIXED
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated",
    order,
  });
});

//
// 🆕 Register Admin
//
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    res.status(403);
    throw new Error("Unauthorized to create admin");
  }

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    res.status(400);
    throw new Error("Admin already exists with this email");
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token: generateToken(admin._id),
  });
});
