const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Submission = require("../models/Submission");

router.get("/profile", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    // Step 1: Get user info
    const user = await User.findById(userId).select(
      "firstName lastName email district city volunteerHours"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Step 2: Count distinct events the user submitted for
    const distinctEvents = await Submission.distinct("eventId", { userId });

    // Step 3: Construct full response
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    res.json({
      name: fullName,
      email: user.email,
      district: user.district,
      city: user.city,
      volunteerHours: user.volunteerHours || 0,
      eventsParticipated: distinctEvents.length, // ✅ Correct event count from submissions
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
