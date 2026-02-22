const express = require('express');
const router = express.Router();
const upload = require('../middleware/imageUpload');
const eventController = require('../controllers/eventController');

// @route   GET /api/events
// @desc    Get list of all events (sorted by date)
// @access  Public
router.get('/', eventController.getAllEvents);

// @route   POST /api/events
// @desc    Create a new event with optional cover image upload
// @access  Admin or Organizer
// @body    Use multipart/form-data with fields and 'coverImage' as file
router.post('/', upload.single('coverImage'), eventController.createEvent);

// @route   POST /api/events/register
// @desc    Register a user for an event
// @access  Authenticated user
// @body    { userId, eventId }
router.post('/register', eventController.registerForEvent);

// @route   GET /api/events/:id
// @desc    Get event details by event ID
// @access  Public
router.get('/:id', eventController.getEventById);

module.exports = router;
