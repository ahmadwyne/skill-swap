const User = require('../models/User');
const bcrypt = require('bcrypt');

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
  const { name, profilePicture, status, socials, skillsToTeach, skillsToLearn } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields if they are provided in the request
    if (name !== undefined) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (status !== undefined) user.status = status;
    if (socials !== undefined) {
      user.socials = {
        facebook: socials.facebook || user.socials.facebook,
        twitter: socials.twitter || user.socials.twitter,
        linkedin: socials.linkedin || user.socials.linkedin,
      };
    }
    if (skillsToTeach !== undefined) user.skillsToTeach = skillsToTeach;
    if (skillsToLearn !== undefined) user.skillsToLearn = skillsToLearn;

    await user.save();

    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    res.json(sanitizedUser);
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

module.exports = { getUserProfile, updateUserProfile };