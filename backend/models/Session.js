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
    ratingByUser1: { type: Number, min: 1, max: 5, default: null },
    feedbackByUser1: { type: String, default: '' },
    ratingByUser2: { type: Number, min: 1, max: 5, default: null },
    feedbackByUser2: { type: String, default: '' },
    sessionClosed: { type: Boolean, default: false },
    feedbackGivenByUser1: { type: Boolean, default: false },
    feedbackGivenByUser2: { type: Boolean, default: false },
    skill: { type: String, required: true },  // Added skill field
  },
  { timestamps: true }
);

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;