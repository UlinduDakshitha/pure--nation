const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },

  icon: {
    type: String,
    required: true
  },

  criteria: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Achievement', AchievementSchema);
