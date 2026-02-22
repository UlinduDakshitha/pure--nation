const User = require("../models/User");
const Submission = require("../models/Submission");

// Helper: Sort leaderboard
function filterLeaderboard(users, type) {
  if (type === "weekly") {
    return users.sort((a, b) => (b.weeklyHours || 0) - (a.weeklyHours || 0));
  } else if (type === "monthly") {
    return users.sort((a, b) => (b.monthlyHours || 0) - (a.monthlyHours || 0));
  } else {
    return users.sort(
      (a, b) => (b.volunteerHours || 0) - (a.volunteerHours || 0)
    );
  }
}

// Helper: Get hours based on type
function getHoursByType(user, type) {
  if (type === "weekly") return user.weeklyHours || 0;
  if (type === "monthly") return user.monthlyHours || 0;
  return user.volunteerHours || 0;
}

// GET /api/leaderboard?type=weekly|monthly|all-time
exports.getLeaderboard = async (req, res) => {
  const { type = "all-time" } = req.query;

  try {
    const users = await User.find(
      {},
      "firstName lastName volunteerHours weeklyHours monthlyHours profilePicture"
    ).lean();

    // Fetch eventsParticipated count per user from Submission collection
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const distinctEvents = await Submission.distinct("eventId", {
          userId: user._id,
        });
        const hours = getHoursByType(user, type);
        const fullName = `${user.firstName || ""} ${
          user.lastName || ""
        }`.trim();

        return {
          id: user._id,
          name: fullName,
          points: hours * 50,
          eventsParticipated: distinctEvents.length,
          hoursContributed: hours,
          profilePicture: user.profilePicture || null,
        };
      })
    );

    // Sort leaderboard based on hours
    const sortedLeaderboard = filterLeaderboard(leaderboard, type);

    res.json(sortedLeaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
      error: error.message,
    });
  }
};
