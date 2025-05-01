// backend/controllers/adminController.js
const User = require('../models/User');
const Session = require('../models/Session');
const Report = require('../models/Report');

const mongoose = require('mongoose');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    const user = new User({ name, email, password, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User created', user: { id: user._id, name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  // try {
  //   const user = await User.findById(req.params.id);
  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }
  //   await user.remove();
  //   res.status(200).json({ message: 'User deleted' });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
  try {
    const { id } = req.params;

    // 1) Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // 2) Attempt deletion
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 3) Success
    return res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    // 4) Log the real error for inspection
    console.error('Error in deleteUser:', error);
    return res.status(500).json({ message: 'Server error while deleting user' });
  }
};

// @desc    Get all reports/disputes
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .populate('targetUser', 'name email')
      .populate('session');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve a report/dispute
// @route   PATCH /api/admin/reports/:id/resolve
// @access  Private/Admin
const resolveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    report.status = 'resolved';
    await report.save();
    res.status(200).json({ message: 'Report resolved', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    console.log(userCount);
    const sessionCount = await Session.countDocuments();
    const reportCount = await Report.countDocuments();

    res.status(200).json({ userCount, sessionCount, reportCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllUsers,
  addUser,
  deleteUser,
  getAllReports,
  resolveReport,
  getAnalytics,
};