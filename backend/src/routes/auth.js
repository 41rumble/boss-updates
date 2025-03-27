const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get user profile
router.get('/profile', protect, authController.getUserProfile);

// Update user profile
router.put('/profile', protect, authController.updateUserProfile);

module.exports = router;