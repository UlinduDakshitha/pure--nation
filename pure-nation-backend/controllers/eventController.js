const Event = require("../models/Event");
const User = require("../models/User");
const Participation = require("../models/Participation");

// GET /api/events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    // Add approvedParticipants to each event
    const eventsWithApprovedCount = await Promise.all(
      events.map(async (event) => {
        const approvedCount = await Participation.countDocuments({
          eventId: event._id,
          adminApproved: true,
        });

        return {
          ...event.toObject(),
          approvedParticipants: approvedCount,
        };
      })
    );


    res.status(200).json(eventsWithApprovedCount);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
      error: error.message,
    });
  }
};

// POST /api/events/register
exports.registerForEvent = async (req, res) => {
  const { userId, eventId } = req.body;

  if (!userId || !eventId) {
    return res.status(400).json({
      success: false,
      message: "Both userId and eventId are required",
    });
  }

  try {
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json({
        success: false,
        message: "User or Event not found",
      });
    }

    // Check if event is full
    const approvedCount = await Participation.countDocuments({
      eventId: event._id,
      adminApproved: true,
    });

    if (event.maxParticipants && approvedCount >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Event has reached maximum capacity",
      });
    }

    const existing = await Participation.findOne({ userId, eventId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Already registered for this event",
      });
    }

    const participation = new Participation({
      userId,
      eventId,
      proofSubmitted: null,
      adminApproved: null,
      approvedAt: null,
    });

    await participation.save();

    res.status(201).json({
      success: true,
      message:
        "Registered successfully. Pending proof submission and admin approval.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Event registration failed",
      error: error.message,
    });
  }
};

// GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const approvedCount = await Participation.countDocuments({
      eventId: event._id,
      adminApproved: true,
    });

    res.status(200).json({
      ...event.toObject(),
      approvedParticipants: approvedCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: err.message });
  }
};

// POST /api/events
exports.createEvent = async (req, res) => {
  const {
    title,
    date,
    location,
    type,
    description,
    durationHours,
    maxParticipants,
  } = req.body;

  const coverImage = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.coverImage || "";

  if (
    !title ||
    !date ||
    !location ||
    !type ||
    !description ||
    !durationHours ||
    !maxParticipants
  ) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided",
    });
  }

  try {
    const event = new Event({
      title,
      date,
      location,
      description,
      durationHours,
      type,
      coverImage,
      maxParticipants,
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};
