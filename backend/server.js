// server.js
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
const sessionRoutes = require('./routes/sessionRoutes');  // Your session routes
const { setSocketIO } = require('./controllers/sessionController');  // Import the setSocketIO function

dotenv.config();

const app = express();
const server = http.createServer(app);  // Create the HTTP server using Express
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',  // Allow requests from your React app
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,  // Allow cookies if needed
  },
});

// Set the io instance in the controller
setSocketIO(io);

// Middleware
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
app.use('/api/sessions', sessionRoutes);  // Ensure this is properly linked

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected');
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
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});