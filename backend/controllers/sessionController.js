const Session = require('../models/Session');

// Create a new session
const createSession = async (req, res) => {
  try {
    const { userId2, sessionDate, sessionTime } = req.body;
    const userId1 = req.user.id;  // The logged-in user

    const session = new Session({
      userId1,
      userId2,
      sessionDate,
      sessionTime,
    });

    await session.save();
    res.status(201).json(session);  // Send the created session in the response
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = { createSession };