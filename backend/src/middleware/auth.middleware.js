import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.authorization) {
    // Accept raw token fallback
    token = req.headers.authorization.trim();
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach role for RBAC later
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("🔐 JWT Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, login again" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(401).json({ message: "Authentication failed" });
  }
});
