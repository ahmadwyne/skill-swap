// models/User.js
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
  skillsToTeach: {
    type: [String], // Array of skills user can teach
    default: [],
  },
  skillsToLearn: {
    type: [String], // Array of skills user wants to learn
    default: [],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profilePicture: { 
    type: String, 
    default: "" 
  },
  socials: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
  status: { 
    type: String, 
    default: "" 
  }
});

module.exports = mongoose.model('User', UserSchema);