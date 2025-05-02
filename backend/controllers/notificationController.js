// src/controllers/notificationController.js
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
let notificationSocket; // Declare a separate socket for notifications

// Import setSocketIO from sessionController.js
const { setSocketIO: setSessionSocketIO } = require('./sessionController'); 

// Set socket.io instance for notifications
const setSocket = (socketIO) => {
  notificationSocket = socketIO;  // Set the notification socket
};

// Create a new notification (e.g., when a session request is made or a reminder)
const sendNotification = async (req, res) => {
  const { userId, message, type } = req.body;
  
  console.log('Received notification request:', req.body);
  
  if (!userId || !message || !type) {
    console.error('Missing required fields: userId, message, or type');
    return res.status(400).json({ msg: 'Please provide all required fields (userId, message, type)' });
  }
  
  try {
    // Convert userId to ObjectId
    const validUserId = new mongoose.Types.ObjectId(userId);
  
    const newNotification = new Notification({
      userId: validUserId,  // Ensure userId is an ObjectId
      message,
      type,
    });
  
    console.log('Saving new notification:', newNotification);
  
    await newNotification.save();  // Save notification to database
  
    // Emit notification to the user through the notification socket
    if (notificationSocket) {
      console.log('Emitting notification to user:', userId);
      notificationSocket.emit('new_notification', {
        userId,
        message,
        type,
      });
    } else {
      console.error('Notification Socket.IO is not initialized!');
    }
  
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

module.exports = { sendNotification, getNotifications, markAsRead, markAllAsRead, setSocket };  // Export setSocket