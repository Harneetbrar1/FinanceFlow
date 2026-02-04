/**
 * Authentication Routes
 * 
 * Handles user registration, login, and profile retrieval.
 * All routes return consistent JSON responses with success status.
 * 
 * Routes:
 * POST /api/auth/register - Create new user account
 * POST /api/auth/login    - Authenticate user and get token
 * GET  /api/auth/me       - Get current logged-in user (protected)
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const logger = require('../utils/logger');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * 
 * Request Body:
 * - name: string (required)
 * - email: string (required)
 * - password: string (required, min 6 chars)
 * - hourlyWage: number (optional, defaults to 0)
 * 
 * Response:
 * - success: boolean
 * - token: JWT token
 * - user: user data (excluding password)
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, hourlyWage } = req.body;

    // ---------------------
    // INPUT VALIDATION
    // ---------------------
    
    // Check for required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Validate name length
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 50 characters'
      });
    }

    // ---------------------
    // CHECK EXISTING USER
    // ---------------------
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // ---------------------
    // CREATE USER
    // ---------------------
    
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      hourlyWage: hourlyWage || 0
    });

    // Generate JWT token
    const token = user.generateAuthToken();

    logger.info(`New user registered: ${user.email}`);

    // Return success response (password excluded via select: false in schema)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hourlyWage: user.hourlyWage,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    logger.error('Registration error:', error.message);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle duplicate key error (backup for email uniqueness)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 * 
 * Request Body:
 * - email: string (required)
 * - password: string (required)
 * 
 * Response:
 * - success: boolean
 * - token: JWT token
 * - user: user data (excluding password)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ---------------------
    // INPUT VALIDATION
    // ---------------------
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // ---------------------
    // AUTHENTICATE USER
    // ---------------------
    
    // Use the static method to find and verify user
    const user = await User.findByCredentials(email, password);

    if (!user) {
      // Use generic message to prevent email enumeration attacks
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    logger.info(`User logged in: ${user.email}`);

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hourlyWage: user.hourlyWage,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    logger.error('Login error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user's profile
 * @access  Private (requires authentication)
 * 
 * Headers:
 * - Authorization: Bearer <token>
 * 
 * Response:
 * - success: boolean
 * - user: user data (excluding password)
 */
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        hourlyWage: user.hourlyWage,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    logger.error('Get profile error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

module.exports = router;
