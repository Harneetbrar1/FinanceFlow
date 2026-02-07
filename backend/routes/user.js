/**
 * User Profile Routes
 * 
 * Handles user profile management (separate from auth routes).
 * All routes are protected - require authentication.
 * 
 * Routes:
 * GET    /api/user/profile    - Get current user profile
 * PUT    /api/user/profile    - Update user profile (name, hourlyWage)
 */

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/user/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', async (req, res) => {
  try {
    // User already attached to request by auth middleware
    // req.user contains the user data (password excluded)
    
    logger.log(`Fetched profile for user ${req.user.email}`);

    res.json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        hourlyWage: req.user.hourlyWage,
        createdAt: req.user.createdAt
      }
    });

  } catch (error) {
    logger.error('Error fetching user profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile
 * @access  Private
 * @body    name, hourlyWage (both optional)
 */
router.put('/profile', async (req, res) => {
  try {
    const { name, hourlyWage } = req.body;

    // Build update object with only allowed fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (hourlyWage !== undefined) updateData.hourlyWage = hourlyWage;

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Name must be at least 2 characters'
        });
      }
      if (name.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot exceed 50 characters'
        });
      }
    }

    // Validate hourlyWage if provided
    if (hourlyWage !== undefined) {
      if (typeof hourlyWage !== 'number' || hourlyWage < 0) {
        return res.status(400).json({
          success: false,
          message: 'Hourly wage must be a non-negative number'
        });
      }
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name or hourlyWage to update'
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        select: '-password' // Exclude password from response
      }
    );

    logger.log(`Updated profile for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        hourlyWage: user.hourlyWage,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    logger.error('Error updating user profile:', error.message);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update user profile'
    });
  }
});

module.exports = router;
