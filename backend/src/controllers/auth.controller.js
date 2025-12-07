import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


//
// 📌 REGISTER PHONE USER (OTP Verified)
//
export const registerPhoneUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const firebasePhone = req.firebaseUser.phone_number;

  if (!firebasePhone || !name || !email || !password) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  let existingUser = await User.findOne({ 
    $or: [{ email }, { phone: firebasePhone }] 
  });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,        // ⚠️ store plain — model hashes it
    phone: firebasePhone,
    authProvider: "phone",
  });

  res.status(201).json({
    success: true,
    message: "Registration success",
    token: user.generateAuthToken(),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
});



export const resetPasswordPhone = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const firebasePhone = req.firebaseUser.phone_number;

  if (!firebasePhone || !newPassword) {
    res.status(400);
    throw new Error("Missing phone or new password");
  }

  const user = await User.findOne({ phone: firebasePhone });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.password = newPassword;  // ⚡ let model hash it
  await user.save();

  res.json({
    success: true,
    message: "Password reset successful",
  });
});



export const checkEmailExists = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const exists = await User.findOne({ email });
  res.json({ exists: !!exists });
});

export const checkPhoneExists = asyncHandler(async (req, res) => {
  let { phone } = req.body;

  // normalize stored format → +91XXXXXXXXXX
  if (phone.length === 10) phone = `+91${phone}`;

  const exists = await User.findOne({ phone });
  res.json({ exists: !!exists });
});



//
// 📌 Normal Email REGISTER
//
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,      // ⚡ plain — model hashes
    phone,
    authProvider: "email"
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: user.generateAuthToken(),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});




//
// 📌 Email + Password Login
//
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: user.generateAuthToken(),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});


//
// 👤 Get Profile
//
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({
    success: true,
    user,
  });
});
