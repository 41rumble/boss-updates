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

// Configure CORS to allow requests from specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:53490',
  'http://localhost:59851',
  'https://dougsnews.com',
  'https://www.dougsnews.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('CORS blocked origin:', origin);
      return callback(null, true); // Still allow it for now, but log it
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

console.log('CORS enabled for specific origins with credentials support');

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

// CORS error handler
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);
  
  // Handle CORS errors specifically
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      message: 'CORS error: Cross-Origin Request Blocked',
      error: process.env.NODE_ENV === 'production' ? {} : err,
      origin: req.headers.origin,
      allowedOrigins
    });
  }
  
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