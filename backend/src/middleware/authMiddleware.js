const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
exports.protect = async (req, res, next) => {
  let token;
  
  console.log('Auth headers:', req.headers.authorization);
  
  // For development environment, allow requests without authentication
  if (process.env.NODE_ENV !== 'production') {
    // Check if we're in development mode and want to bypass auth
    const bypassAuth = process.env.BYPASS_AUTH === 'true';
    if (bypassAuth) {
      console.log('Bypassing authentication in development mode');
      req.user = {
        _id: 'dev-user',
        name: 'Development User',
        email: 'dev@example.com',
        isAdmin: true
      };
      return next();
    }
  }
  
  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      console.log('Token extracted:', token);
      
      // For demo mode - allow demo tokens
      if (token && token.startsWith('demo_token_')) {
        console.log('Using demo token');
        // Set a demo user
        req.user = {
          _id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          isAdmin: true
        };
        return next();
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.log('User not found for token');
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};