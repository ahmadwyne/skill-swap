const express = require('express');
const router = express.Router();
const { createReport, upload } = require('../controllers/reportController');
const { verifyToken } = require('../middlewares/auth'); // Ensure the user is logged in

// Route for submitting reports
router.post('/', verifyToken, upload.single('screenshot'), createReport);

module.exports = router;
