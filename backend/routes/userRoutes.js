const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const verifyToken = require('../middlewares/auth'); // Token verification middleware
const router = express.Router();

// Route to fetch user profile (GET)
router.get('/profile', verifyToken, getUserProfile);

// Update user profile (PUT)
router.put('/profile', verifyToken, updateUserProfile);

module.exports = router;