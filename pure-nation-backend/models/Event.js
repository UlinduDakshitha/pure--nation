const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  date: {
    type: Date,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  coverImage: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  durationHours: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  maxParticipants: {
    type: Number,
    required: true,
  },

  // ✅ Add this new status field
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
});

module.exports = mongoose.model("Event", EventSchema);
