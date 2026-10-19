import multer from "multer";

// Use memory storage for buffer-based uploads to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

export default upload;
