import asyncHandler from "express-async-handler";
import HeroSlide from "../models/hero.model.js";
import cloudinary from "../config/cloudinary.js";
import sharp from "sharp";

//
// ➕ Create Hero Slide (Admin)
//
export const createHeroSlide = asyncHandler(async (req, res) => {
  const { title, subtitle, buttonText, order } = req.body;

  if (!title || !subtitle || !buttonText) {
    return res.status(400).json({
      success: false,
      message: "Title, subtitle and button text are required",
    });
  }

  if (order !== undefined && order < 0) {
    return res.status(400).json({
      success: false,
      message: "Order must be a positive number",
    });
  }

  let imageData = {};

  if (req.file) {
    const optimizedImage = await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "ecommerce-hero-banners", resource_type: "image" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(optimizedImage);
    });

    imageData = {
      public_id: uploadRes.public_id,
      url: uploadRes.secure_url,
    };
  }

  const slide = await HeroSlide.create({
    title,
    subtitle,
    buttonText,
    image: imageData,
    order,
  });

  res.status(201).json({
    success: true,
    message: "Hero slide created",
    slide,
  });
});

//
// 📦 Get Active Slides (Public)
//
export const getHeroSlides = asyncHandler(async (req, res) => {
  const slides = await HeroSlide.find({ isActive: true }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    slides,
  });
});

//
// ✏ Update Hero Slide (Admin)
//
export const updateHeroSlide = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);

  if (!slide) {
    return res.status(404).json({
      success: false,
      message: "Hero slide not found",
    });
  }

  const { title, subtitle, buttonText, order, isActive } = req.body;

  // 🔥 Validate order
  if (order !== undefined && order < 0) {
    return res.status(400).json({
      success: false,
      message: "Order must be a positive number",
    });
  }

  // 🔥 Replace image safely
  let imageData = slide.image;

  if (req.file) {
    // delete old image
    if (slide.image?.public_id) {
      await cloudinary.uploader.destroy(slide.image.public_id);
    }

    const optimizedImage = await sharp(req.file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    const uploadRes = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "ecommerce-hero-banners", resource_type: "image" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(optimizedImage);
    });

    imageData = {
      public_id: uploadRes.public_id,
      url: uploadRes.secure_url,
    };
  }

  // 🔹 Update fields safely
  if (title !== undefined) slide.title = title;
  if (subtitle !== undefined) slide.subtitle = subtitle;
  if (buttonText !== undefined) slide.buttonText = buttonText;
  if (order !== undefined) slide.order = order;
  if (typeof isActive === "boolean") slide.isActive = isActive;

  slide.image = imageData;

  await slide.save();

  res.status(200).json({
    success: true,
    message: "Hero slide updated",
    slide,
  });
});

//
// ❌ Delete Hero Slide (Admin)
//
export const deleteHeroSlide = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);

  if (!slide) {
    return res.status(404).json({
      success: false,
      message: "Hero slide not found",
    });
  }

  // 🔥 Delete Cloudinary image
  if (slide.image?.public_id) {
    await cloudinary.uploader.destroy(slide.image.public_id);
  }

  await slide.deleteOne();

  res.status(200).json({
    success: true,
    message: "Hero slide deleted",
  });
});
