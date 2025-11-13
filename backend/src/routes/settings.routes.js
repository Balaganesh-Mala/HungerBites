import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", protect, isAdmin, getSettings);
router.put("/", protect, isAdmin, updateSettings);

export default router;
