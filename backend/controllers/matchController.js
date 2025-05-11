// controllers/matchController.js

const User = require('../models/User');

const matchSkills = (skillsToTeach, skillsToLearn) => {
  const matches = [];

  if (!skillsToTeach || !skillsToLearn) return matches;

  // Normalize skills (convert to lowercase and remove leading/trailing spaces)
  const normalizedTeachSkills = skillsToTeach
    .map(skill => skill.trim().toLowerCase());
  const normalizedLearnSkills = skillsToLearn
    .map(skill => skill.trim().toLowerCase());

  console.log('Normalized teach skills:', normalizedTeachSkills); // Debug log for teach skills
  console.log('Normalized learn skills:', normalizedLearnSkills); // Debug log for learn skills

  // Compare each skill to see if there's a match
  normalizedLearnSkills.forEach((learnSkill) => {
    normalizedTeachSkills.forEach((teachSkill) => {
      if (teachSkill === learnSkill) {
        console.log(`Match found: ${teachSkill} === ${learnSkill}`); // Debug log for matching skills
        matches.push({ teachSkill, learnSkill });
      }
    });
  });

  return matches;
};

const getSkillMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ msg: 'Current user not found' });
    }

    // Get all users who have at least one skill to teach
    const users = await User.find({ _id: { $ne: req.user.id }, 'skillsToTeach.0': { $exists: true } });

    console.log('Current User Skills to Learn:', currentUser.skillsToLearn); // Debug log for current user's skills to learn
    console.log('Other Users Skills to Teach:', users.map(user => user.skillsToTeach)); // Debug log for other users' skills to teach

    const matches = users.flatMap((user) => {
      const matchedSkills = matchSkills(currentUser.skillsToLearn, user.skillsToTeach);
      if (matchedSkills.length > 0) {
        return matchedSkills.map((skill) => ({
          user: user,
          teachSkill: skill.teachSkill,
          learnSkill: skill.learnSkill,
        }));
      }
      return [];
    });

    console.log('Matches found:', matches); // Debug log for the matches found

    res.json(matches);
  } catch (err) {
    console.error('Error fetching matches:', err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { getSkillMatches };  