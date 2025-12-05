import express from "express";
import { registerUser, loginUser, getProfile, loginPhoneUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.post("/login-phone", loginPhoneUser);

export default router;
