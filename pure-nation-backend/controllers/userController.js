exports.getUserProfile = async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  try {
    const user = await User.findById(userId).select('firstName lastName email district city volunteerHours eventsParticipated');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    // Debug log before sending response
    console.log("Sending user profile:", {
      name: fullName,
      email: user.email,
      district: user.district,
      city: user.city,
      volunteerHours: user.volunteerHours || 0,
      eventsParticipated: user.eventsParticipated || 0
    });

    res.status(200).json({
      name: fullName,
      email: user.email,
      district: user.district,
      city: user.city,
      volunteerHours: user.volunteerHours || 0,
      eventsParticipated: user.eventsParticipated || 0
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile',
      error: error.message
    });
  }
};
