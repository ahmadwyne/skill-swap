const User = require('../models/User');

const matchSkills = (skillsToTeach, skillsToLearn) => {
  const matches = [];
  if (!skillsToTeach || !skillsToLearn) return matches;  // Ensure both arrays exist

  skillsToTeach.forEach((teachSkill) => {
    skillsToLearn.forEach((learnSkill) => {
      // Log the skills being compared
      console.log(`Comparing: "${teachSkill.trim().toLowerCase()}" with "${learnSkill.trim().toLowerCase()}"`);
      
      // Trim and compare case-insensitively
      if (teachSkill.trim().toLowerCase() === learnSkill.trim().toLowerCase()) {
        matches.push({ teachSkill, learnSkill });
      }
    });
  });

  return matches;
};
  
const getSkillMatches = async (req, res) => {
  try {
    const users = await User.find();
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ msg: 'Current user not found' });
    }

    console.log('Current User Skills:', currentUser.skillsToTeach, currentUser.skillsToLearn);

    const matches = users.map((user) => {
      const matchedSkills = matchSkills(currentUser.skillsToTeach, user.skillsToLearn);
      console.log('Matched Skills:', matchedSkills);  // Check if matches are found
      return { user, matchedSkills };
    });

    res.json(matches);  // Return the matched users and skills
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
  
module.exports = { getSkillMatches };  