const mongoose = require('mongoose'); // Ensure mongoose is imported
const Report = require('../models/Report');
const Session = require('../models/Session'); // Session model to get the session details
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/report-images'); // Path to store uploaded screenshots
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename using timestamp
  },
});

const upload = multer({ storage: storage });

// Create a report
const createReport = async (req, res) => {
  try {
    const { reason, description, reporter, targetUser, session } = req.body;

    // Log for debugging
    console.log('Received Report Data:', req.body);

    // Ensure that valid ObjectIds are passed for reporter, targetUser, and session
    if (!mongoose.Types.ObjectId.isValid(reporter)) {
      return res.status(400).json({ message: 'Invalid reporter ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(targetUser)) {
      return res.status(400).json({ message: 'Invalid target user ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(session)) {
      return res.status(400).json({ message: 'Invalid session ID' });
    }

    // Ensure session exists
    const existingSession = await Session.findById(session);
    if (!existingSession) {
      return res.status(400).json({ message: 'Session not found' });
    }

    // Create a new report instance
    const report = new Report({
      reporter,
      targetUser,
      session,
      reason,
      description,
    });

    // If a screenshot was uploaded, store its file path
    if (req.file) {
      report.screenshot = `/uploads/report-images/${req.file.filename}`;
    }

    // Save the report to the database
    await report.save();
    res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ message: 'Error submitting report', error });
  }
};

module.exports = { createReport, upload };
