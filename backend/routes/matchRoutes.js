// routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');  // Make sure this import is correct
const {verifyToken, ensureAdmin} = require('../middlewares/auth'); // Ensure the auth middleware is correct

// Simple match function that checks for common skills
const matchSkills = (skillsToTeach, skillsToLearn) => {
  const matches = [];

  skillsToTeach.forEach((teachSkill) => {
    skillsToLearn.forEach((learnSkill) => {
      if (teachSkill === learnSkill) {
        matches.push({ teachSkill, learnSkill });
      }
    });
  });

  return matches;
};

// Route to fetch skill matches for the current user
router.get('/', verifyToken, async (req, res) => {
  try {
    // Find the current user from JWT token
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find all other users in the database
    const users = await User.find();

    // Create a list of matches between the current user and other users
    const matches = users.map((user) => {
      const matchedSkills = matchSkills(currentUser.skillsToTeach, user.skillsToLearn);
      return { user, matchedSkills };
    });

    res.json(matches); // Return the list of matches
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;