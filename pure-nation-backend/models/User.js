const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  companyName: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true, unique: true },
  country: { type: String },
  district: { type: String },
  city: { type: String },
  password: { type: String, required: true },
  volunteerHours: { type: Number, default: 0 },
  eventsParticipated: { type: Number, default: 0 },
  joinedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  profilePicture: { type: String, default: null }
});

module.exports = mongoose.model('User', UserSchema);
