// routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const User = require('../models/User');  // Make sure this import is correct
const {verifyToken, ensureAdmin} = require('../middlewares/auth'); // Ensure the auth middleware is correct
const { getSkillMatches } = require('../controllers/matchController');

router.get('/', verifyToken, getSkillMatches);

module.exports = router;
