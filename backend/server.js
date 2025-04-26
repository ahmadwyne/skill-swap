const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');  // Import HTTP module to work with Socket.io
const socketIo = require('socket.io');  // Import Socket.io

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const sessionRoutes = require('./routes/sessionRoutes'); // Add session routes

dotenv.config();

const app = express();
const server = http.createServer(app);  // Use HTTP server to integrate with Socket.io
const io = socketIo(server);  // Initialize Socket.io with the server

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);  // Ensure this is linked correctly
app.use('/api/sessions', sessionRoutes);  // Add session routes

// Socket.io connection for real-time chat
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for incoming messages and emit to all users
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.emit('receive_message', data);  // Emit message to all connected clients
  });
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Simple route to test if server is working
app.get('/', (req, res) => {
  res.send('SkillSwap API is running');
});

// Server
const port = process.env.PORT || 5000;
server.listen(port, () => {  // Use server.listen instead of app.listen
  console.log(`Server is running on port ${port}`);
});