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

// Configure CORS to allow requests from any origin
app.use(cors({
  origin: true, // Reflect the request origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('CORS enabled with credentials support');

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
  const buildPath = path.join(__dirname, '../../build');
  
  // Check if the build directory exists
  try {
    if (require('fs').existsSync(buildPath)) {
      app.use(express.static(buildPath));
      
      app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
      });
    } else {
      console.warn('Build directory not found. Static file serving is disabled.');
      
      // Fallback for all non-API routes
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.json({ 
            message: "Frontend not built. Please run 'npm run build' to create the frontend build.",
            apiStatus: "API is running and available at /api"
          });
        }
      });
    }
  } catch (err) {
    console.error('Error checking build directory:', err);
  }
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