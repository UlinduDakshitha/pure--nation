const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Assuming your server is running on localhost:5000
  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({ success: true, url: fileUrl });
});

module.exports = router;
