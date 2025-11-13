import multer from "multer";
import path from "path";

// Store files temporarily before uploading to Cloudinary
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  }
});

const upload = multer({ storage });

export default upload;
