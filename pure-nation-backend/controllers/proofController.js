const Submission = require("../models/Submission");
const User = require("../models/User");
const Event = require("../models/Event");

const submitProof = async (req, res) => {
  try {
    const { email, event, hours, description } = req.body;
    const file = req.file;

    // 1. Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    const userId = user._id;

    // 3. Validate other fields
    if (!event || !hours || !description || !file) {
      return res
        .status(400)
        .json({ message: "All fields including file are required." });
    }

    const parsedHours = parseFloat(hours);
    if (isNaN(parsedHours) || parsedHours <= 0) {
      return res
        .status(400)
        .json({ message: "Hours must be a positive number." });
    }

    // 4. Find event by title
    const eventData = await Event.findOne({ title: event });
    if (!eventData) {
      return res.status(404).json({ message: "Event not found." });
    }

    // 5. Build photo URL (adjust path if needed)
    const photoUrl = `${req.protocol}://${req.get("host")}/${file.path}`;

    // 6. Create new submission
    const submission = new Submission({
      userId,
      eventId: eventData._id,
      hours: parsedHours,
      description,
      photoUrl,
      fileType: file.mimetype,
      originalFileName: file.originalname,
    });

    await submission.save();

    // 7. Update user's volunteer hours
    user.volunteerHours = (user.volunteerHours || 0) + parsedHours;
    await user.save();

    // 8. Send success response
    res.status(201).json({
      message: "Proof submitted successfully!",
      submission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to submit proof",
      error: error.message,
    });
  }
};

module.exports = { submitProof };
