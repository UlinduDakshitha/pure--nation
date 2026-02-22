const mongoose = require('mongoose');

const SponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  organization: {
    type: String
  },

  phone: {
    type: String
  },

  message: {
    type: String,
    required: true
  },

isFeatured: {
  type: Boolean,
  default: false
},

  logoUrl: {
    type: String
  },

  description: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sponsor', SponsorSchema);
