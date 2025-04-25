const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const userRoutes = require('./routes/userRoutes'); // Import user routes

dotenv.config();

const app = express();

// Middleware
app.use(express.json());  // For parsing JSON bodies
app.use(cors()); // Enable CORS

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Authentication routes
app.use('/api/auth', authRoutes); // Link the authentication routes

// User routes (for profile, etc.)
app.use('/api/users', userRoutes); // Link the user routes (profile, etc.)

// Simple route to test
app.get('/', (req, res) => {
  res.send('SkillSwap API is running');
});

// Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});