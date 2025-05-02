// backend/models/Report.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for user-generated reports or disputes
const ReportSchema = new Schema({
  // The user who filed the report
  reporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The user being reported (if applicable)
  targetUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // The session associated with this report (if any)
  session: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    default: null
  },
  // Reason or description of the report
  reason: {
    type: String,
    required: true,
    trim: true
  },
  // Status of the report: open, resolved, or rejected
  status: {
    type: String,
    enum: ['open', 'resolved', 'rejected'],
    default: 'open'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the model to use in controllers and elsewhere
module.exports = mongoose.model('Report', ReportSchema);
