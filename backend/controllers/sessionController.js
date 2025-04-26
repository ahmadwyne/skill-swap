// src/controllers/sessionController.js
const Session = require('../models/Session');
const Message = require('../models/Message');  // Import Message model
const User = require('../models/User');  // Import User model

// Pass io to the controller to enable real-time messaging
let io;  // Declare io at the top

const setSocketIO = (socketIO) => {
  io = socketIO;  // Set io from server.js
};

// Create a new session request
const sendSessionRequest = async (req, res) => {
  const { userId2, sessionDate, sessionTime } = req.body;

  if (!userId2 || !sessionDate || !sessionTime) {
    return res.status(400).json({ msg: 'Please provide all required fields (userId2, sessionDate, sessionTime)' });
  }

  try {
    const userId1 = req.user.id;

    const newSession = new Session({
      userId1,
      userId2,
      sessionDate,
      sessionTime,
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
      $or: [{ userId1: userId, status: 'accepted' }, { userId2: userId, status: 'accepted' }],
    }).populate('userId1 userId2'); // Populate user details

    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Send a new message in a session
const sendMessage = async (req, res) => {
  const { sessionId, content } = req.body;  // Get sessionId and message content from request
    
  if (!sessionId || !content) {
    return res.status(400).json({ msg: 'Session ID and message content are required' });
  }
  
  try {
    const session = await Session.findById(sessionId);  // Check if the session exists
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
  
    // Determine the other user in the session
    const receiverId = session.userId1.toString() === req.user.id ? session.userId2 : session.userId1;
  
    // Create a new message
    const newMessage = new Message({
      sessionId,
      senderId: req.user.id,  // Logged-in user's ID
      receiverId: receiverId,  // The other user in the session
      content,
    });
  
    // Save the message
    await newMessage.save();
  
    // Fetch the sender and receiver details
    const sender = await User.findById(req.user.id);  // Get sender details
    const receiver = await User.findById(receiverId);  // Get receiver details
  
    if (!sender || !receiver) {
      return res.status(404).json({ msg: 'User not found' });
    }
  
    // Emit message with full user details (sender and receiver)
    io.emit('receive_message', {
      content,
      senderId: { name: sender.name, id: sender._id },
      receiverId: { name: receiver.name, id: receiver._id },
      sessionId: sessionId,
    });
  
    res.json({ msg: 'Message sent successfully', message: newMessage });
  } catch (err) {
    console.error('Error sending message:', err.message);
    res.status(500).send('Server error');
  }
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

module.exports = { sendSessionRequest, acceptSessionRequest, getPendingSessions, getAcceptedSessions, sendMessage, getMessages, setSocketIO };  // Export setSocketIO to set io