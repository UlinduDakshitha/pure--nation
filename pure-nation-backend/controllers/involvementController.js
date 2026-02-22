const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

// GET /api/involvement-opportunities
exports.getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find().lean();

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch involvement opportunities.',
      error: error.message,
    });
  }
};

// POST /api/join-volunteer
exports.joinVolunteer = async (req, res) => {
  const { userId, opportunityId } = req.body;

  if (!userId || !opportunityId) {
    return res.status(400).json({ success: false, message: 'User ID and Opportunity ID are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (!user.opportunitiesJoined) {
      user.opportunitiesJoined = [];
    }

    if (!user.opportunitiesJoined.includes(opportunityId)) {
      user.opportunitiesJoined.push(opportunityId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'You have successfully joined the event.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to join the opportunity.',
      error: error.message,
    });
  }
};

// POST /api/interest-request
exports.submitInterestRequest = async (req, res) => {
  const { name, email, interest } = req.body;

  if (!name || !email || !interest) {
    return res.status(400).json({ success: false, message: 'Name, email, and interest are required.' });
  }

  try {
    console.log('Interest submission received:', { name, email, interest });

    res.status(200).json({
      success: true,
      message: 'Thank you for your interest. We will contact you shortly.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit interest request.',
      error: error.message,
    });
  }
};
