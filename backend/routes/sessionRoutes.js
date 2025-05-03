const express = require('express');
const router = express.Router();
const { upload, sendSessionRequest, acceptSessionRequest, getPendingSessions, getAcceptedSessions, sendMessage, getMessages } = require('../controllers/sessionController');
const verifyToken = require('../middlewares/auth');

// Send session request
router.post('/request', verifyToken, sendSessionRequest);

// Accept session request
router.post('/accept', verifyToken, acceptSessionRequest);

// Get pending session requests
router.get('/pending', verifyToken, getPendingSessions);

// Route to get accepted session requests for the logged-in user
router.get('/accepted', verifyToken, getAcceptedSessions);

// Send message in session
router.post('/message', verifyToken, upload, sendMessage);  // Apply 'upload' middleware here

// Get messages for a session
router.get('/message/:sessionId', verifyToken, getMessages);

module.exports = router;