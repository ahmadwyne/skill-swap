const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const verifyToken = require('../middlewares/auth'); // Token verification middleware
const router = express.Router();
const { getUserProfile, updateUserProfile, changePassword } = require('../controllers/userController');

// Route to fetch user profile (GET)
router.get('/profile', verifyToken, getUserProfile);

// Update user profile (PUT)
router.put('/profile', verifyToken, updateUserProfile);

// Change password
router.put('/change-password', verifyToken, changePassword);

module.exports = router;