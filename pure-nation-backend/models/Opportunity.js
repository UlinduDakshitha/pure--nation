const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ['volunteer', 'sponsor', 'donation', 'campaign'],
    required: true
  },

  link: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
