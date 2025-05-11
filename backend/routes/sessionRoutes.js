// src/routes/sessionRoutes.js
const express = require("express");
const router = express.Router();
const { upload, sendSessionRequest, acceptSessionRequest, getPendingSessions, getAcceptedSessions, getCompletedSessions, getCanceledSessions, sendMessage, getMessages, scheduleSession, markSessionAsCompletedOrCanceled, getUserAverageRating } = require('../controllers/sessionController');
const {verifyToken} = require('../middlewares/auth');

// Send session request
router.post("/request", verifyToken, sendSessionRequest);

// Accept session request
router.post("/accept", verifyToken, acceptSessionRequest);

// Get pending session requests
router.get("/pending", verifyToken, getPendingSessions);

// Route to get accepted session requests for the logged-in user
router.get("/accepted", verifyToken, getAcceptedSessions);

// Get completed sessions for the logged-in user
router.get('/completed', verifyToken, getCompletedSessions);

// Get canceled sessions for the logged-in user
router.get('/canceled', verifyToken, getCanceledSessions);

// Send message in session
router.post("/message", verifyToken, upload, sendMessage); // Apply 'upload' middleware here

// Get messages for a session
router.get("/message/:sessionId", verifyToken, getMessages);

// Schedule a new session (new meeting time)
router.post("/schedule", verifyToken, scheduleSession); // New route for scheduling

// Mark session as completed or canceled and submit feedback
router.post("/mark-session", verifyToken, markSessionAsCompletedOrCanceled);

// Route to get the average rating for a user
router.get('/ratings/:userId', verifyToken, getUserAverageRating);

module.exports = router;
