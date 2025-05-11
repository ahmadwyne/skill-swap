
const express = require('express');
const router = express.Router();
const { verifyToken, ensureAdmin } = require('../middlewares/auth');
const adminCtrl = require('../controllers/adminController');
const upload = require('../middlewares/upload');

// Protect all admin routes
router.use(verifyToken, ensureAdmin);

//User management routes
// Get all users
router.get('/users', adminCtrl.getAllUsers);
// Add a user
router.post('/users', adminCtrl.addUser);
// Delete a user
router.delete('/users/:id', adminCtrl.deleteUser);


//Report management routes
// Get all reports
router.get('/reports', adminCtrl.getAllReports);
// Resolve a report
router.patch('/reports/:id/resolve', adminCtrl.resolveReport);
// ─── Session chat viewer ────────────────────────────────────────────
// Fetch all chat messages for a given session
router.get('/session-chats/:sessionId', adminCtrl.getSessionChats);
// Block a user (admin only)
router.patch('/users/:id/block', adminCtrl.blockUser);
router.patch('/users/:id/unblock', adminCtrl.unblockUser);



//Analytics routes
// Get analytics
router.get('/analytics', adminCtrl.getAnalytics);

// Profile section
// router.get('/profile', adminCtrl.getProfile);
// router.put('/profile', adminCtrl.updateProfile);
// router.put('/profile/password', adminCtrl.changePassword);
// Profile section
router.get('/profile', adminCtrl.getProfile);
// parse multipart/form-data (for file + name)
router.put(
    '/profile',
    upload.single('profilePicture'),
    adminCtrl.updateProfile
);
router.put('/profile/password', adminCtrl.changePassword);

// Engagement statistics route
router.get('/engagement-stats', adminCtrl.getEngagementStats);


module.exports = router;
