import express from "express";
import { shiprocketWebhook } from "../controllers/shiprocketWebhook.controller.js";

const router = express.Router();

// Shiprocket webhook (NO AUTH)
router.post("/webhook", shiprocketWebhook);

export default router;
