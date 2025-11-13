import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ✅ Helper function to upload to Cloudinary
export const uploadToCloudinary = (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
