const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const newsRoutes = require('./routes/news');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Configure CORS based on environment
if (process.env.NODE_ENV === 'production') {
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'https://dougsnews.com',
    credentials: true
  }));
} else {
  // In development, allow all origins
  app.use(cors({
    origin: '*',
    credentials: true
  }));
  console.log('CORS enabled for all origins in development mode');
}

app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/api', (req, res) => {
  res.json({ 
    message: "Welcome to Doug's News API",
    version: "1.0.0"
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid conflicts
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Doug's News API is available at http://localhost:${PORT}/api`);
});