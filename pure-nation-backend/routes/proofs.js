const express = require("express");
const router = express.Router();
const upload = require("../middleware/imageUpload"); // Multer setup
const { submitProof } = require("../controllers/proofController");

// @route   POST /api/proof
// @desc    Submit proof with file
// @access  Public or Private (depends on auth middleware)
router.post("/", upload.single("file"), submitProof);

module.exports = router;
