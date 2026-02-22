const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find({});
    res.json(achievements);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch achievements',
      error: error.message
    });
  }
});

module.exports = router;
