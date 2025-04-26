const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },  // Associate with session
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Sender of the message
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Receiver of the message
  content: { type: String, required: true },  // Message content
  timestamp: { type: Date, default: Date.now },  // Timestamp of the message
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;