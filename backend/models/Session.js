// src/models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // First user (initiator)
    userId2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Second user (matched user)
    sessionDate: { type: Date, required: true }, // Date for the session
    sessionTime: { type: String, required: true }, // Time for the session
    status: { type: String, default: 'pending' }, // Status: pending, accepted, etc.
  },
  { timestamps: true } // Store creation and update times
);

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;