// // backend/routes/adminRoutes.js

// const express = require('express');
// const { verifyToken, ensureAdmin } = require('../middlewares/auth');
// const adminCtrl = require('../controllers/adminController');

// const router = express.Router();
// // Controller functions
// const {
//     getAllUsers,
//     addUser,
//     deleteUser,
//     getAllReports,
//     resolveReport,
//     getAnalytics
//   } = require('../controllers/adminController');
  

// // Apply authentication and admin-check to all admin routes
// router.use(verifyToken, ensureAdmin);

// /**
//  * @route   GET /api/admin/users
//  * @desc    Retrieve a list of all users (excluding sensitive data)
//  * @access  Private/Admin
//  */
// router.get('/users', adminCtrl.getAllUsers);

// /**
//  * @route   POST /api/admin/users
//  * @desc    Create a new user with provided details
//  * @access  Private/Admin
//  */
// router.post('/users', adminCtrl.addUser);

// /**
//  * @route   DELETE /api/admin/users/:id
//  * @desc    Delete a user by their ID
//  * @access  Private/Admin
//  */
// router.delete('/users/:id', adminCtrl.deleteUser);

// /**
//  * @route   GET /api/admin/reports
//  * @desc    Fetch all user reports/disputes for review
//  * @access  Private/Admin
//  */
// router.get('/reports', adminCtrl.getAllReports);

// /**
//  * @route   PATCH /api/admin/reports/:id/resolve
//  * @desc    Mark a specific report as resolved
//  * @access  Private/Admin
//  */
// router.patch('/reports/:id/resolve', adminCtrl.resolveReport);

// /**
//  * @route   GET /api/admin/analytics
//  * @desc    Retrieve key platform metrics (user, session, report counts)
//  * @access  Private/Admin
//  */
// router.get('/analytics', adminCtrl.getAnalytics);

// module.exports = router;

// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();

const  verifyToken  = require('../middlewares/auth');
const adminCtrl = require('../controllers/adminController');

// Protect all admin routes
router.use(verifyToken);

// Get all users
router.get('/users', adminCtrl.getAllUsers);

// Add a user
router.post('/users', adminCtrl.addUser);

// Delete a user
router.delete('/users/:id', adminCtrl.deleteUser);

// Get all reports
router.get('/reports', adminCtrl.getAllReports);

// Resolve a report
router.patch('/reports/:id/resolve', adminCtrl.resolveReport);

// Get analytics
router.get('/analytics', adminCtrl.getAnalytics);

module.exports = router;
