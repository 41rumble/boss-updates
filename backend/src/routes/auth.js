const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Register a new user (admin only)
router.post('/register', protect, admin, authController.register);

// Login user
router.post('/login', authController.login);

// Get user profile
router.get('/profile', protect, authController.getUserProfile);

// Update user profile
router.put('/profile', protect, authController.updateUserProfile);

// Get login history (admin only)
router.get('/login-history', protect, authController.getLoginHistory);

module.exports = router;