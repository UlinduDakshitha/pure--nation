const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  photoUrl: {
    type: String,
    required: true
  },

  hours: {
    type: Number,
    required: true,
    min: 0
  },

  submittedAt: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
