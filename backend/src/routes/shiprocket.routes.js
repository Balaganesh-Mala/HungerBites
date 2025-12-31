import express from "express";
import { shiprocketWebhook } from "../controllers/shiprocketWebhook.controller.js";
import { ShiprocketService } from "../services/shiprocket.service.js";


const router = express.Router();

// Shiprocket webhook (NO AUTH)
router.post("/webhook", shiprocketWebhook);
router.get("/channels", async (req, res) => {
  try {
    const response = await ShiprocketService.request(
      "get",
      "/channels"
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
});


export default router;
