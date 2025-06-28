import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Cấu hình multer để lưu file vào uploads/images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Route upload ảnh
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Trả về đường dẫn ảnh để client lưu vào DB
  const imageUrl = `/uploads/images/${req.file.filename}`;
  return res.json({ imageUrl });
});

export default router; 