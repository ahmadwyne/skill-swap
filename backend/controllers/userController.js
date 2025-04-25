const User = require('../models/User');

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

// Update user profile
const updateUserProfile = async (req, res) => {
  const { skillsToTeach, skillsToLearn } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update profile data
    user.skillsToTeach = skillsToTeach;
    user.skillsToLearn = skillsToLearn;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getUserProfile, updateUserProfile };