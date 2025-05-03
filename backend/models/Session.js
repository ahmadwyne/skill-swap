// src/models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionDate: { type: Date, required: true },
    sessionTime: { type: String, required: true },
    newMeetingDate: { type: Date, required: false },  // New field to store the scheduled time
    newMeetingTime: { type: String, required: false },  // New field to store the scheduled time
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;