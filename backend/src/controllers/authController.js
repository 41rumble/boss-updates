const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: false // Default to regular user
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      // Record login history
      const loginInfo = {
        timestamp: new Date(),
        ipAddress: req.ip || req.connection.remoteAddress || '',
        userAgent: req.headers['user-agent'] || ''
      };
      
      // Add to login history
      user.loginHistory.push(loginInfo);
      await user.save();
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get login history (admin only)
exports.getLoginHistory = async (req, res) => {
  try {
    // Check if the requesting user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to access login history' });
    }
    
    // Get all users with their login history
    const users = await User.find({}).select('name email loginHistory isAdmin');
    
    // Format the data for the frontend
    const loginHistory = users.flatMap(user => {
      return user.loginHistory.map(login => ({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        isAdmin: user.isAdmin,
        timestamp: login.timestamp,
        ipAddress: login.ipAddress,
        userAgent: login.userAgent
      }));
    });
    
    // Sort by timestamp descending (most recent first)
    loginHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(loginHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};