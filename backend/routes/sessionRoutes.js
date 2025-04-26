const express = require('express');
const router = express.Router();
const { createSession } = require('../controllers/sessionController');
const verifyToken = require('../middlewares/auth');

// Route to create a session
router.post('/schedule', verifyToken, createSession);

module.exports = router;