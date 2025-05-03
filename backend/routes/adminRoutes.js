
const express = require('express');
const router = express.Router();
const  verifyToken  = require('../middlewares/auth');
const adminCtrl = require('../controllers/adminController');

// Protect all admin routes
router.use(verifyToken);

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

//Analytics routes
// Get analytics
router.get('/analytics', adminCtrl.getAnalytics);

// Profile section
router.get('/profile', adminCtrl.getProfile);
router.put('/profile', adminCtrl.updateProfile);
router.put('/profile/password', adminCtrl.changePassword);

module.exports = router;
