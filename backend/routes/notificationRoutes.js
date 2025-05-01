// src/routes/notificationRoutes.js
const express = require('express');
const { sendNotification, getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const router = express.Router();

// Send a new notification
router.post('/send', sendNotification);

// Get all notifications for a user
router.get('/:userId', getNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.patch('/:userId/read-all', markAllAsRead);

module.exports = router;