// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Participation = require('../models/Participation');
const User = require('../models/User');
const Event = require('../models/Event');

// Approve participation
router.post('/participation/approve', async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    await Participation.updateOne(
      { userId, eventId },
      { adminApproved: true, approvedAt: new Date() }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Approval failed', error: err.message });
  }
});

// Reject participation
router.post('/participation/reject', async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    await Participation.updateOne(
      { userId, eventId },
      { adminApproved: false, approvedAt: new Date() }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Rejection failed', error: err.message });
  }
});

// GET /api/admin/participations
router.get('/participations', async (req, res) => {
  try {
    // Fetch all pending participations (not yet approved)
    const participations = await Participation.find({ adminApproved: null })
      .populate('userId')
      .populate('eventId');

    // Fetch all approved participations to count for each event
    const approvedParticipations = await Participation.find({ adminApproved: true });

    // Count approved participants per eventId
    const participantCountMap = {};
    approvedParticipations.forEach(p => {
      const eventId = p.eventId.toString();
      participantCountMap[eventId] = (participantCountMap[eventId] || 0) + 1;
    });

    // Format pending participations + inject count for their event
    const formatted = participations.map(p => {
      const eventId = p.eventId?._id?.toString() || '';
      const approvedCount = participantCountMap[eventId] || 0;
      const max = p.eventId?.maxParticipants || 30;

      return {
        _id: p._id,
        userName: `${p.userId?.firstName || ''} ${p.userId?.lastName || ''}`.trim(),
        eventName: p.eventId?.title || 'Unknown Event',
        hours: p.eventId?.durationHours || 0,
        proofUrl: p.proofUrl || '#',
        eventId,
        approvedCount,
        maxParticipants: max,
        spotsLeft: max - approvedCount
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to load pending participations',
      error: err.message
    });
  }
});

// POST /api/admin/approve/:id
router.post('/approve/:id', async (req, res) => {
  const participationId = req.params.id;

  try {
    await Participation.findByIdAndUpdate(participationId, {
      adminApproved: true,
      approvedAt: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Approval failed', error: err.message });
  }
});

// POST /api/admin/reject/:id
router.post('/reject/:id', async (req, res) => {
  const participationId = req.params.id;

  try {
    await Participation.findByIdAndUpdate(participationId, {
      adminApproved: false,
      approvedAt: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Rejection failed', error: err.message });
  }
});

// POST /api/admin/reject/:id
router.post('/reject/:id', async (req, res) => {
  const participationId = req.params.id;

  try {
    await Participation.findByIdAndUpdate(participationId, {
      adminApproved: false,
      approvedAt: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Rejection failed', error: err.message });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin';

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Admin login successful' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
});

module.exports = router;
