// src/controllers/notificationController.js
const Notification = require('../models/Notification');
let io; // Declare io at the top to use Socket.IO

// Import setSocketIO from sessionController.js and set the io instance
const { setSocketIO } = require('./sessionController'); 

// Set socket.io instance from sessionController.js
const setSocket = () => {
  io = setSocketIO(); // Reusing the existing setSocketIO for notifications
};

// Create a new notification (e.g., when a session request is made or a reminder)
const sendNotification = async (req, res) => {
  const { userId, message, type } = req.body;

  if (!userId || !message || !type) {
    return res.status(400).json({ msg: 'Please provide all required fields (userId, message, type)' });
  }

  try {
    const newNotification = new Notification({
      userId,
      message,
      type,
    });

    await newNotification.save();

    // Emit notification to the user through socket.io
    io.emit('new_notification', {
      userId,
      message,
      type,
    });

    res.json({ msg: 'Notification created successfully', notification: newNotification });
  } catch (err) {
    console.error('Error creating notification:', err.message);
    res.status(500).send('Server error');
  }
};

// Get all notifications for a specific user
const getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }); // Latest notifications first
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).send('Server error');
  }
};

// Mark a specific notification as read
const markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    res.json(updatedNotification);
  } catch (err) {
    console.error('Error marking notification as read:', err.message);
    res.status(500).send('Server error');
  }
};

// Mark all notifications for a user as read
const markAllAsRead = async (req, res) => {
  const { userId } = req.params;

  try {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error('Error marking all notifications as read:', err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { sendNotification, getNotifications, markAsRead, markAllAsRead, setSocket };