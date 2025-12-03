import asyncHandler from "express-async-handler";
import Blog from "../models/blog.model.js";
import { uploadToCloudinary } from "../middleware/upload.middleware.js";
import cloudinary from "../config/cloudinary.js";

//
// ➕ CREATE BLOG
//
export const createBlog = asyncHandler(async (req, res) => {
  const { title, description, socialLinks, readMoreLink, readMore } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Blog title and description are required");
  }

  let imageData = {};

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "blogs");
    imageData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const blog = await Blog.create({
    title,
    description,
    image: imageData,
    socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
    readMoreLink: readMoreLink || "",
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    blog,
  });
});

//
// 📦 GET ALL BLOGS
//
export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isActive: true }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    blogs,
  });
});

//
// 🔍 GET SINGLE BLOG
//
export const getBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params.id;

  // ✅ Guard: Prevent DB call if ID is missing or undefined
  if (!blogId || blogId === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Invalid blogId provided",
    });
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  res.status(200).json({ success: true, blog });
});


//
// ✏ UPDATE BLOG
//
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (req.file) {
    if (blog.image?.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    const result = await uploadToCloudinary(req.file.buffer, "blogs");
    blog.image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  blog.title = req.body.title ?? blog.title;
  blog.description = req.body.description ?? blog.description;
  blog.readMoreLink = req.body.readMoreLink ?? blog.readMoreLink;
  blog.socialLinks = req.body.socialLinks ? JSON.parse(req.body.socialLinks) : blog.socialLinks;

  await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    blog,
  });
});

//
// ❌ DELETE BLOG
//
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  if (blog.image?.public_id) {
    await cloudinary.uploader.destroy(blog.image.public_id);
  }

  await blog.deleteOne();

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully",
  });
});
