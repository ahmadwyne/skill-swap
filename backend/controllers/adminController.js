// backend/controllers/adminController.js

const User = require('../models/User');
const Session = require('../models/Session');
const Report = require('../models/Report');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Environment vars for admin
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

// ─── Get all users ───────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Add a new user ──────────────────────────────────────────────
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (await User.exists({ email })) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    // 1️⃣ Hash password just like in your normal register flow
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2️⃣ Create user with hashed password
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    await user.save();
    res.status(201).json({
      message: 'User created',
      user: { id: user._id, name, email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete a user ───────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

// ─── Get all reports ─────────────────────────────────────────────
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

// ─── Resolve a report ────────────────────────────────────────────
const resolveReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    report.status = 'resolved';
    await report.save();
    res.status(200).json({ message: 'Report resolved', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get analytics ───────────────────────────────────────────────
const getAnalytics = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const sessionCount = await Session.countDocuments();
    const reportCount = await Report.countDocuments();
    res.status(200).json({ userCount, sessionCount, reportCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get profile ─────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || 'https://placehold.co/150x150?text=Admin',
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Update profile ──────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update name if provided
    if (req.body.name) user.name = req.body.name;

    // Support direct image URL from frontend
    if (req.body.profilePicture) {
      user.profilePicture = req.body.profilePicture;
    }
    // OR use uploaded file
    else if (req.file) {
      user.profilePicture = req.file.filename;
    }

    await user.save();

    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // profilePicture: user.profilePicture || 'https://placehold.co/150x150?text=Admin',
        profilePicture: user.profilePicture || null,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Change password ─────────────────────────────────────────────
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Both current and new passwords are required.' });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res
        .status(400)
        .json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// const getEngagementStats = async (req, res) => {
//   try {
//     // 1. Top 5 Skills To Teach
//     const topSkillsToTeach = await User.aggregate([
//       { $unwind: '$skillsToTeach' },
//       { $group: { _id: '$skillsToTeach', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 5 }
//     ]);
//     console.log(topSkillsToTeach);

//     // 2. Top 5 Skills To Learn
//     const topSkillsToLearn = await User.aggregate([
//       { $unwind: '$skillsToLearn' },
//       { $group: { _id: '$skillsToLearn', count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 5 }
//     ]);
//     console.log("Top 5 Skills To Learn:", topSkillsToLearn);

//     // 3. Most Active Users by Session Participation
//     const mostActiveUsers = await Session.aggregate([
//       // create an array of the two participants
//       { $project: { participants: [ '$userId1', '$userId2' ] } },
//       // unwind so each doc has one participant
//       { $unwind: '$participants' },
//       // count sessions per user
//       { $group: { _id: '$participants', sessionCount: { $sum: 1 } } },
//       { $sort: { sessionCount: -1 } },
//       { $limit: 5 },
//       // lookup user details
//       {
//         $lookup: {
//           from: 'users',           // your users collection
//           localField: '_id',       // the userId
//           foreignField: '_id',     // matches User._id
//           as: 'user'
//         }
//       },
//       { $unwind: '$user' },
//       {
//         $project: {
//           _id: 0,
//           userId: '$_id',
//           name: '$user.name',
//           email: '$user.email',
//           sessionCount: 1
//         }
//       }
//     ]);
//     console.log("Most Activated Users", mostActiveUsers);

//     // 4. Session Status Statistics
//     const sessionStatusStats = await Session.aggregate([
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);
//     console.log("Session Status Stats",sessionStatusStats);

//     return res.json({
//       topSkillsToTeach,
//       topSkillsToLearn,
//       mostActiveUsers,
//       sessionStatusStats
//     });
//   } catch (error) {
//     console.error('Engagement Stats Error:', error);
//     return res.status(500).json({ message: 'Failed to fetch engagement stats' });
//   }
// };

// ─── Engagement Stats ───────────────────────────────────────────────
const getEngagementStats = async (req, res) => {
  try {
    // 1) All Skills To Teach sorted by usage
    const skillsToTeachStats = await User.aggregate([
      { $unwind: '$skillsToTeach' },
      { $group:    { _id: '$skillsToTeach', count: { $sum: 1 } } },
      { $sort:     { count: -1 } }
    ]);

    // 2) All Skills To Learn sorted by usage
    const skillsToLearnStats = await User.aggregate([
      { $unwind: '$skillsToLearn' },
      { $group:    { _id: '$skillsToLearn', count: { $sum: 1 } } },
      { $sort:     { count: -1 } }
    ]);

    // 3) All Users by session participation
    const mostActiveUsers = await Session.aggregate([
      { $project: { participants: [ '$userId1', '$userId2' ] } },
      { $unwind:  '$participants' },
      { $group:   { _id: '$participants', sessionCount: { $sum: 1 } } },
      { $sort:    { sessionCount: -1 } },
      {
        $lookup: {
          from:         'users',
          localField:   '_id',
          foreignField: '_id',
          as:           'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id:          0,
          userId:       '$_id',
          name:         '$user.name',
          email:        '$user.email',
          sessionCount: 1
        }
      }
    ]);

    // 4) Session Status stats
    const sessionStatusStats = await Session.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // 5) All sessions with both users populated
    const allSessions = await Session.find()
      .populate('userId1', 'name email')
      .populate('userId2', 'name email')
      .sort({ createdAt: -1 }); // most recent first

    return res.status(200).json({
      skillsToTeachStats,
      skillsToLearnStats,
      mostActiveUsers,
      sessionStatusStats,
      allSessions
    });
  } catch (error) {
    console.error('Engagement Stats Error:', error);
    return res.status(500).json({ message: 'Failed to fetch engagement stats' });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  deleteUser,
  getAllReports,
  resolveReport,
  getAnalytics,
  getProfile,
  updateProfile,
  changePassword,
  getEngagementStats
};
