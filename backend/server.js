const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Import routes and controllers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { setSocketIO: setSessionSocketIO } = require('./controllers/sessionController');
const { setSocket: setNotificationSocketIO } = require('./controllers/notificationController');

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Create Socket.IO instance ONCE
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

// ✅ Create namespaces from single instance
const sessionSocket = io.of('/sessions');
const notificationSocket = io.of('/notifications');

// Pass the socket instances to controllers
setSessionSocketIO(sessionSocket);
setNotificationSocketIO(notificationSocket);

// Express Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/notifications', notificationRoutes);

// ✅ Session namespace handling
sessionSocket.on('connection', (socket) => {
  console.log('A user connected to session socket');

  socket.on('disconnect', () => {
    console.log('A user disconnected from session socket');
  });
});

// ✅ Notification namespace handling
notificationSocket.on('connection', (socket) => {
  console.log('A user connected to notification socket');

  socket.on('disconnect', () => {
    console.log('A user disconnected from notification socket');
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('SkillSwap API is running');
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});