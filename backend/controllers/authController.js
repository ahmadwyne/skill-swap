// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register a new user
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({ name, email, password });

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT token
    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // // ─── 1) HARD-CODED ADMIN CHECK ─────────────────────────────────────────
  // if (
  //   email === process.env.ADMIN_EMAIL &&
  //   password === process.env.ADMIN_PASSWORD
  // ) {
  //   // Issue an admin token (no DB lookup)
  //   const payload = { user: { id: 'admin', role: 'admin' } };
  //   const token = jwt.sign(payload, process.env.JWT_SECRET, {
  //     expiresIn: '2h',
  //   });
  //   return res.json({
  //     token,
  //     name: 'Admin',
  //     email: process.env.ADMIN_EMAIL,
  //     id: 'admin',
  //   });
  // }

  // 1) Hard‑coded admin check
  // if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
  //   // Find the seeded admin record
  //   const admin = await User.findOne({ email });
  //   const payload = { user: { id: admin._id.toString(), role: 'admin' } };
  //   const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
  //   return res.json({
  //     token,
  //     name: admin.name,
  //     email: admin.email,
  //     id: admin._id
  //   });
  // }
  if (email === process.env.ADMIN_EMAIL) {
    const adminUser = await User.findOne({ email });

    if (!adminUser) {
      return res.status(500).json({ msg: 'Admin record missing in DB' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    const payload = { user: { id: adminUser._id.toString(), role: 'admin' } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    return res.json({
      token,
      name: adminUser.name,
      email: adminUser.email,
      id: adminUser._id
    });
  }

  // ─── 2) NORMAL USER LOGIN FLOW ─────────────────────────────────────────
  try {
    // Find in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Issue a standard user token
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
module.exports = { registerUser, loginUser };

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');
// const User = require('../models/User');

// // Register a new user
// const registerUser = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, email, password } = req.body;

//   try {
//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     // Create a new user instance
//     user = new User({ name, email, password });

//     // Encrypt the password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     // Generate JWT token
//     const payload = { user: { id: user.id } };

//     jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
//       if (err) throw err;
//       res.json({ token });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// // Login user
// const loginUser = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Check if password matches
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Generate JWT token
//     const payload = { user: { id: user.id } };

//     // In authController.js (loginUser function)
//     jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
//       if (err) throw err;
//       res.json({
//         token,
//         name: user.name,
//         email: user.email,
//         id: user._id,  // Send user data along with the token
//       });
//     });

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// module.exports = { registerUser, loginUser }; 