const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Configure multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save the image to the 'uploads/profile-pictures' folder
    cb(null, './uploads/profile-pictures');
  },
  filename: (req, file, cb) => {
    // Use timestamp to avoid filename conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter to ensure only images are accepted
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);
  
  if (extname && mimeType) {
    return cb(null, true); // Accept the file
  } else {
    cb('Error: Only images are allowed!');
  }
};

// Initialize multer with storage and file filter settings
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Middleware for handling file upload (single file for profile picture)
const uploadProfilePicture = upload.single('profilePicture');

// Route to fetch user profile (GET)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user); // Send the user data as response
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Route to update user profile (with image upload handling)
// Example code in the userController.js
const updateUserProfile = async (req, res) => {
  const { name, status, socials, skillsToTeach, skillsToLearn } = req.body;
  let profilePicture = req.file ? req.file.filename : ''; // Handling the file upload

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update profile data
    user.name = name;
    user.status = status;
    user.socials = socials;
    user.skillsToTeach = skillsToTeach;
    user.skillsToLearn = skillsToLearn;

    if (profilePicture) {
      user.profilePicture = profilePicture; // Set the new image
    }

    await user.save();
    res.json(user); // Send updated user back to frontend
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Change Password Controller
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;

    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Export functions and upload middleware
module.exports = { getUserProfile, updateUserProfile, changePassword, uploadProfilePicture };
