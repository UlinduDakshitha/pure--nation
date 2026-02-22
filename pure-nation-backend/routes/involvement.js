const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

// @desc    Get all involvement opportunities (volunteer, sponsor, etc.)
// @route   GET /api/involvement/involvement-opportunities
// @access  Public
router.get('/involvement-opportunities', async (req, res) => {
  try {
    const opportunities = await Opportunity.find({});
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch opportunities',
      error: error.message
    });
  }
});

// @desc    Join a volunteer opportunity (authenticated users)
// @route   POST /api/involvement/join-volunteer
// @access  Private (assumes frontend sends userId)
router.post('/join-volunteer', async (req, res) => {
  const { userId, opportunityId } = req.body;

  if (!userId || !opportunityId) {
    return res.status(400).json({ success: false, message: 'Missing userId or opportunityId' });
  }

  try {
    // This is where you would save the user-opportunity join info (depends on DB structure)
    // For now, just respond with success.
    res.json({
      success: true,
      message: 'You have successfully joined the event.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error joining opportunity',
      error: error.message
    });
  }
});

// @desc    Submit interest request (non-authenticated users)
// @route   POST /api/involvement/interest-request
// @access  Public
router.post('/interest-request', async (req, res) => {
  const { name, email, interest } = req.body;

  if (!name || !email || !interest) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    res.json({
      success: true,
      message: 'Thank you for your interest! We will contact you soon.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not submit your interest',
      error: error.message
    });
  }
});

module.exports = router;
