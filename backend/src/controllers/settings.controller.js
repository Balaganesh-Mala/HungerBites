import asyncHandler from "express-async-handler";
import Settings from "../models/settings.model.js";

// Get settings
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json({ success: true, settings });
});

// Update settings
export const updateSettings = asyncHandler(async (req, res) => {
  const data = req.body;

  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }

  res.json({ success: true, settings });
});
