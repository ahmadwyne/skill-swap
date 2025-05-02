// backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // New field for storing a profile picture URL
  profilePicture: {
    type: String,
    default: '',    // you may set a placeholder here
  },
  skillsToTeach: {
    type: [String],
    default: [],
  },
  skillsToLearn: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true    // adds createdAt & updatedAt
});

module.exports = mongoose.model('User', UserSchema);
