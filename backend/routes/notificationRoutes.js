// src/routes/notificationRoutes.js

const express = require('express');
const { sendNotification, getNotifications, markAsRead, markAllAsRead, sendNewMeetingScheduledNotification, sendReminderNotification } = require('../controllers/notificationController');
const router = express.Router();

// Send a new notification
router.post('/send', sendNotification);

// Get all notifications for a user
router.get('/:userId', getNotifications);

// Mark a notification as read
router.patch('/:notificationId/read', markAsRead);

// Mark all notifications as read
router.patch('/:userId/read-all', markAllAsRead);

// Send a new meeting scheduled notification
router.post('/send-new-meeting-scheduled', sendNewMeetingScheduledNotification);

// Send a reminder notification for a session
router.post('/send-reminder', sendReminderNotification);

module.exports = router;