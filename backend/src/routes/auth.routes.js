import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  registerPhoneUser,
  checkEmailExists, 
  checkPhoneExists,
  resetPasswordPhone,
} from "../controllers/auth.controller.js";

import { verifyFirebaseToken } from "../middleware/firebaseVerify.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Phone OTP registration (Firebase verified)
router.post("/register-phone", verifyFirebaseToken, registerPhoneUser);
router.post("/reset-password-phone", verifyFirebaseToken, resetPasswordPhone);

// Normal email registration
router.post("/register", registerUser);
router.post("/check-email", checkEmailExists);
router.post("/check-phone", checkPhoneExists);
router.post("/check-phone-reset", checkPhoneExists);


// Login (email/password only)
router.post("/login", loginUser);

// Profile (protected)
router.get("/profile", protect, getProfile);

export default router;
