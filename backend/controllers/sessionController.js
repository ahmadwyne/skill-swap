// src/controllers/sessionController.js
const Session = require('../models/Session');
const Message = require('../models/Message');  // Import Message model
const User = require('../models/User');  // Import User model
const multer = require('multer');
const path = require('path');
const { sendNewMeetingScheduledNotification, sendNotification, sendNotificationForFeedbackRequest, sendNotificationForSessionCancellation } = require('./notificationController');
const mongoose = require('mongoose');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/message-uploads');  // Save files to the 'uploads/message-uploads' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Get the file extension
    cb(null, `${Date.now()}${ext}`);  // Use timestamp to prevent filename collisions
  }
});

// Apply multer middleware to handle file upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Max file size is 10MB
}).single('file');  // Handle single file uploads (make sure 'file' matches the input field name)

// Pass io to the controller to enable real-time messaging
let sessionSocket;  // Declare io at the top

const setSocketIO = (socketIO) => {
  sessionSocket = socketIO;  // Set io from server.js
};

// Create a new session request
const sendSessionRequest = async (req, res) => {
  const { userId2, sessionDate, sessionTime, skill } = req.body;

  if (!userId2 || !sessionDate || !sessionTime || !skill) {
    return res.status(400).json({ msg: 'Please provide all required fields (userId2, sessionDate, sessionTime)' });
  }

  try {
    const userId1 = req.user.id;

    const newSession = new Session({
      userId1,
      userId2,
      sessionDate,
      sessionTime,
      skill,  // Store the skill in the session
      status: 'pending',
    });

    await newSession.save();

    res.json({ msg: 'Session request sent successfully', session: newSession });
  } catch (err) {
    console.error('Error creating session:', err.message);
    res.status(500).send('Server error');
  }
};

// Accept session request
const acceptSessionRequest = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ msg: 'Session request not found' });
    }

    if (session.userId2.toString() !== req.user.id) {
      return res.status(400).json({ msg: 'You are not authorized to accept this session' });
    }

    session.status = 'accepted'; // Change status to accepted
    await session.save();

    res.json({ msg: 'Session request accepted', session });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get pending session requests for the logged-in user
const getPendingSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await Session.find({
      userId2: userId,
      status: 'pending',
    }).populate('userId1'); // Populate requestor details

    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getAcceptedSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await Session.find({
      $or: [
        { userId1: userId, status: 'accepted' },
        { userId2: userId, status: 'accepted' },
        { userId1: userId, status: 'completed' },
        { userId2: userId, status: 'completed' },
        { userId1: userId, status: 'canceled' },
        { userId2: userId, status: 'canceled' },
      ],
    })
      .populate('userId1', 'name email profilePicture')  // Populate userId1 with specific fields
      .populate('userId2', 'name email profilePicture'); // Populate userId2 with specific fields

    console.log('Populated sessions:', sessions);  // Debugging: Log to verify populated data

    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get completed sessions for the logged-in user
const getCompletedSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await Session.find({
      $or: [
        { userId1: userId, status: 'completed' },
        { userId2: userId, status: 'completed' },
      ],
    }).populate('userId1').populate('userId2'); // Populate user details

    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get canceled sessions for the logged-in user
const getCanceledSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await Session.find({
      $or: [
        { userId1: userId, status: 'canceled' },
        { userId2: userId, status: 'canceled' },
      ],
    }).populate('userId1').populate('userId2'); // Populate user details

    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Send a new message in a session
const sendMessage = async (req, res) => {
  console.log('Received sessionId:', req.body.sessionId);  // Log received sessionId
  console.log('Received content:', req.body.content);  // Log received content
  console.log('Received file:', req.file);  // Log received file
  
  const { sessionId, content } = req.body;

  if (!sessionId) {
    return res.status(400).json({ msg: 'Session ID is required' });
  }

  // Check if sessionId exists
  const session = await Session.findById(sessionId);
  if (!session) {
    console.error('Session not found:', sessionId);
    return res.status(400).json({ msg: 'Session ID unknown' });
  }

  let mediaUrl = null;
  let mediaType = null;

  if (req.file) {
    // If there's a file uploaded, get the file URL and type
    mediaUrl = `http://localhost:5000/uploads/message-uploads/${req.file.filename}`;
    mediaType = req.file.mimetype.startsWith('image') ? 'image' :
                req.file.mimetype.startsWith('video') ? 'video' :
                req.file.mimetype.startsWith('audio') ? 'audio' : null;
  }

  // Determine the other user in the session
  const receiverId = session.userId1.toString() === req.user.id ? session.userId2 : session.userId1;

  const sender = await User.findById(req.user.id); // Get sender user details
  const receiver = await User.findById(receiverId); // Get receiver user details

  console.log('sender.name:', sender.name);
  console.log('receiver.name:', receiver.name);

  // Create a new message
  const newMessage = new Message({
    sessionId,
    senderId: req.user.id,
    receiverId: receiverId,
    content,
    mediaUrl,  // Store the media URL
    mediaType, // Store the media type (image/video/audio)
  });

  await newMessage.save();  // Save the message in the database

  // Emit message with media details to the frontend
  sessionSocket.emit('receive_message', {
    content,
    sender: { name: sender.name, id: sender._id }, // Include sender's name and ID
    receiver: { name: receiver.name, id: receiver._id }, // Include receiver's name and ID
    sessionId,
    mediaUrl,  // Emit media URL
    mediaType, // Emit media type
  });

  res.json({ msg: 'Message sent successfully', message: newMessage });
};

// Get all messages for a specific session
const getMessages = async (req, res) => {
  const { sessionId } = req.params;  // Get sessionId from the request parameters
   
  try {
    // Fetch messages for this session and populate senderId and receiverId
    const messages = await Message.find({ sessionId })
      .populate('senderId', 'name')  // Populate the sender's name
      .populate('receiverId', 'name'); // Populate the receiver's name

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).send('Server error');
  }
};  

// Schedule a new session
const scheduleSession = async (req, res) => {
  const { sessionId, newMeetingDate, newMeetingTime } = req.body;
  
  console.log('Received sessionId:', sessionId);  // Log sessionId to debug
  
  if (!sessionId || !newMeetingDate || !newMeetingTime) {
    return res.status(400).json({ msg: 'SessionId, newMeetingDate, and newMeetingTime are required' });
  }

  try {
    // Ensure the sessionId is properly converted to ObjectId
    const session = await Session.findById(new mongoose.Types.ObjectId(sessionId));  // Fixed here
    if (!session) {
      console.log('Session not found in database!');
      return res.status(404).json({ msg: 'Session not found' });
    }

    console.log('Found session:', session);  // Log session details

    // Update the session with the new scheduled date and time
    session.newMeetingDate = new Date(newMeetingDate);  // Update new meeting date
    session.newMeetingTime = newMeetingTime;  // Update new meeting time
    await session.save();

    // Log the session after save to ensure it is properly updated
    console.log('Updated session after save:', session);

    // Extract the skill from the session
    const skill = session.skill;

    // Send the scheduled session notification via WebSockets
    const message = `You have a new meeting scheduled for ${newMeetingDate} at ${newMeetingTime} regarding the skill: ${skill}.`;
    sendNewMeetingScheduledNotification(session, message);  // Emit notification for both users

    res.json({ msg: 'Session scheduled successfully', session });
  } catch (err) {
    console.error('Error scheduling session:', err.message);
    res.status(500).send('Server error');
  }
};

// sessionController.js

const markSessionAsCompletedOrCanceled = async (req, res) => {
  const { sessionId, status, rating, feedback } = req.body;
  const userId = req.user.id;

  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    if (![session.userId1.toString(), session.userId2.toString()].includes(userId)) {
      return res.status(403).json({ msg: 'You are not authorized to mark this session' });
    }

    // Build the update object
    const update = {
      status,
    };

    if (status === 'completed') {
      if (session.userId1.toString() === userId) {
        update.ratingByUser1 = rating;
        update.feedbackByUser1 = feedback;
        update.feedbackGivenByUser1 = true;
      } else {
        update.ratingByUser2 = rating;
        update.feedbackByUser2 = feedback;
        update.feedbackGivenByUser2 = true;
      }

      // If both users have given feedback, close the session
      if (session.feedbackGivenByUser1 && session.feedbackGivenByUser2) {
        session.sessionClosed = true;
      }

      await Session.findByIdAndUpdate(sessionId, update, { new: true });

      const otherUserId = session.userId1.toString() === userId ? session.userId2 : session.userId1;
      await sendNotificationForFeedbackRequest(otherUserId);

      return res.json({ msg: 'Session updated successfully' });
    } else {
      update.sessionClosed = true;
      await Session.findByIdAndUpdate(sessionId, update, { new: true });

      await sendNotificationForSessionCancellation(session.userId1);
      await sendNotificationForSessionCancellation(session.userId2);

      return res.json({ msg: 'Session canceled successfully' });
    }
  } catch (error) {
    console.error('Error marking session as completed or canceled:', error);
    return res.status(500).send('Server error');
  }
};

// Calculate the average rating for a given user
const getUserAverageRating = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL

  try {
    // Fetch all sessions where this user is either userId1 or userId2
    const sessions = await Session.find({
      $or: [
        { userId1: userId },
        { userId2: userId }
      ]
    });

    let totalRating = 0;
    let count = 0;

    // Loop through all sessions and sum up the ratings
    sessions.forEach(session => {
      // If the user is userId1, we look at the ratingByUser2
      // If the user is userId2, we look at the ratingByUser1
      if (session.userId1.toString() === userId && session.ratingByUser2 !== null) {
        totalRating += session.ratingByUser2;
        count++;
      } else if (session.userId2.toString() === userId && session.ratingByUser1 !== null) {
        totalRating += session.ratingByUser1;
        count++;
      }
    });

    // Calculate the average rating
    const averageRating = count > 0 ? (totalRating / count).toFixed(2) : 'N/A';

    res.json({ averageRating });
  } catch (err) {
    console.error('Error fetching user ratings:', err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { upload, io: sessionSocket, sendSessionRequest, acceptSessionRequest, getPendingSessions, getAcceptedSessions, getCompletedSessions, getCanceledSessions, sendMessage, getMessages, setSocketIO, scheduleSession, markSessionAsCompletedOrCanceled, getUserAverageRating  };  // Export setSocketIO to set io