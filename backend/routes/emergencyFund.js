/**
 * Emergency Fund Routes
 * 
 * Handles emergency fund tracking and progress management.
 * Each user has one emergency fund record (unique constraint).
 * All routes are protected - require authentication.
 * 
 * Routes:
 * GET    /api/emergency-fund        - Get user's emergency fund
 * POST   /api/emergency-fund        - Create/update emergency fund (upsert)
 * PUT    /api/emergency-fund/amount - Update current amount (add/subtract)
 * DELETE /api/emergency-fund        - Delete emergency fund
 */

const express = require('express');
const router = express.Router();
const { EmergencyFund } = require('../models');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/emergency-fund
 * @desc    Get emergency fund for logged-in user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    // Find emergency fund for user
    const fund = await EmergencyFund.findOne({ userId: req.user._id });

    // If no fund exists, return empty response
    if (!fund) {
      return res.json({
        success: true,
        message: 'No emergency fund set up yet',
        data: null
      });
    }

    logger.log(`Fetched emergency fund for user ${req.user.email}`);

    // Return fund with calculated fields via toJSON method
    res.json({
      success: true,
      data: fund
    });

  } catch (error) {
    logger.error('Error fetching emergency fund:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency fund'
    });
  }
});

/**
 * @route   POST /api/emergency-fund
 * @desc    Create or update emergency fund (upsert)
 * @access  Private
 * @body    monthlyExpenses (required), targetAmount (optional), currentAmount (optional)
 */
router.post('/', async (req, res) => {
  try {
    const { monthlyExpenses, targetAmount, currentAmount } = req.body;

    // Validate required field
    if (monthlyExpenses === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide monthlyExpenses'
      });
    }

    // Validate monthlyExpenses is non-negative
    if (monthlyExpenses < 0) {
      return res.status(400).json({
        success: false,
        message: 'Monthly expenses cannot be negative'
      });
    }

    // Validate targetAmount if provided
    if (targetAmount !== undefined && targetAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Target amount cannot be negative'
      });
    }

    // Validate currentAmount if provided
    if (currentAmount !== undefined && currentAmount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Current amount cannot be negative'
      });
    }

    // Prepare data object
    const fundData = { monthlyExpenses };
    if (targetAmount !== undefined) fundData.targetAmount = targetAmount;
    if (currentAmount !== undefined) fundData.currentAmount = currentAmount;

    // Use upsert method from model (creates or updates)
    const fund = await EmergencyFund.upsertFund(req.user._id, fundData);

    logger.log(`Created/updated emergency fund for user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Emergency fund saved successfully',
      data: fund
    });

  } catch (error) {
    logger.error('Error creating/updating emergency fund:', error.message);

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
      message: 'Failed to save emergency fund'
    });
  }
});

/**
 * @route   PUT /api/emergency-fund/amount
 * @desc    Update current amount (for deposits/withdrawals)
 * @access  Private
 * @body    amount (required) - Positive to add, negative to subtract
 */
router.put('/amount', async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate required field
    if (amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide amount to add or subtract'
      });
    }

    // Validate amount is a number
    if (typeof amount !== 'number' || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a valid number'
      });
    }

    // Update amount using model static method
    const fund = await EmergencyFund.updateAmount(req.user._id, amount);

    const action = amount > 0 ? 'Added' : 'Subtracted';
    logger.log(`${action} $${Math.abs(amount)} to emergency fund for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Emergency fund updated successfully',
      data: fund
    });

  } catch (error) {
    logger.error('Error updating emergency fund amount:', error.message);

    // Handle "fund not found" error from model
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Emergency fund not found. Please create one first.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update emergency fund amount'
    });
  }
});

/**
 * @route   DELETE /api/emergency-fund
 * @desc    Delete emergency fund
 * @access  Private
 */
router.delete('/', async (req, res) => {
  try {
    // Find fund
    const fund = await EmergencyFund.findOne({ userId: req.user._id });

    // Check if fund exists
    if (!fund) {
      return res.status(404).json({
        success: false,
        message: 'Emergency fund not found'
      });
    }

    // Delete fund
    await EmergencyFund.findByIdAndDelete(fund._id);

    logger.log(`Deleted emergency fund for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Emergency fund deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting emergency fund:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete emergency fund'
    });
  }
});

module.exports = router;
