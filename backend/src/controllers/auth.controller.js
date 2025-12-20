import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";



export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token: user.generateAuthToken(),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
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
// 📌 Email + Password Login
//
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
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
