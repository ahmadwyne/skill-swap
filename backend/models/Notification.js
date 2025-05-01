// src/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User to receive the notification
  message: { type: String, required: true }, // Notification message
  type: { type: String, enum: ['session_request', 'reminder'], required: true }, // Type of notification
  isRead: { type: Boolean, default: false }, // Whether the notification is read
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);