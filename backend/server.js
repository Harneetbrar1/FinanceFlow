/**
 * FinanceFlow Backend Server
 * 
 * Main entry point for the Express application.
 * Sets up middleware, routes, and database connection.
 */

// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ---------------------
// MIDDLEWARE
// ---------------------

// Enable CORS for frontend requests
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ---------------------
// ROUTES
// ---------------------

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FinanceFlow API is running',
    environment: process.env.NODE_ENV
  });
});

// API Routes
// Day 2: Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Day 4: Data routes (to be added)
// app.use('/api/transactions', require('./routes/transactions'));
// app.use('/api/budgets', require('./routes/budgets'));
// app.use('/api/emergency-fund', require('./routes/emergencyFund'));
// app.use('/api/credit-cards', require('./routes/creditCards'));
// app.use('/api/user', require('./routes/user'));

// ---------------------
// ERROR HANDLING
// ---------------------

// 404 Handler - Route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Server Error:', err.message);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Server Error' 
      : err.message
  });
});

// ---------------------
// START SERVER
// ---------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
