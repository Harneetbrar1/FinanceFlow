/**
 * Credit Card Routes
 * 
 * Handles credit card management and debt tracking.
 * Includes payoff calculations and debt statistics.
 * All routes are protected - require authentication.
 * 
 * Routes:
 * GET    /api/credit-cards           - Get all user credit cards
 * GET    /api/credit-cards/totals    - Get total debt statistics
 * GET    /api/credit-cards/:id       - Get single credit card
 * POST   /api/credit-cards           - Create new credit card
 * PUT    /api/credit-cards/:id       - Update credit card
 * DELETE /api/credit-cards/:id       - Delete credit card
 */

const express = require('express');
const router = express.Router();
const { CreditCard } = require('../models');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/credit-cards
 * @desc    Get all credit cards for logged-in user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    // Fetch credit cards using model static method (sorted by balance)
    const cards = await CreditCard.getUserCards(req.user._id);

    logger.log(`Fetched ${cards.length} credit cards for user ${req.user.email}`);

    // Cards are returned with calculated fields via toJSON method
    res.json({
      success: true,
      count: cards.length,
      data: cards
    });

  } catch (error) {
    logger.error('Error fetching credit cards:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit cards'
    });
  }
});

/**
 * @route   GET /api/credit-cards/totals
 * @desc    Get total debt statistics across all cards
 * @access  Private
 */
router.get('/totals', async (req, res) => {
  try {
    // Calculate totals using model static method
    const totals = await CreditCard.getTotalDebt(req.user._id);

    logger.log(`Calculated debt totals for user ${req.user.email}: $${totals.totalDebt}`);

    res.json({
      success: true,
      data: totals
    });

  } catch (error) {
    logger.error('Error calculating debt totals:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate debt totals'
    });
  }
});

/**
 * @route   GET /api/credit-cards/:id
 * @desc    Get single credit card by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const card = await CreditCard.findById(req.params.id);

    // Check if card exists
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found'
      });
    }

    // Verify ownership
    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this credit card'
      });
    }

    res.json({
      success: true,
      data: card
    });

  } catch (error) {
    logger.error('Error fetching credit card:', error.message);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit card ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit card'
    });
  }
});

/**
 * @route   POST /api/credit-cards
 * @desc    Create new credit card
 * @access  Private
 * @body    name, balance, apr, minimumPayment (required), creditLimit (optional)
 */
router.post('/', async (req, res) => {
  try {
    const { name, balance, apr, minimumPayment, creditLimit } = req.body;

    // Validate required fields
    if (!name || balance === undefined || apr === undefined || minimumPayment === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, balance, apr, and minimumPayment'
      });
    }

    // Validate balance is non-negative
    if (balance < 0) {
      return res.status(400).json({
        success: false,
        message: 'Balance cannot be negative'
      });
    }

    // Validate APR range
    if (apr < 0 || apr > 100) {
      return res.status(400).json({
        success: false,
        message: 'APR must be between 0 and 100'
      });
    }

    // Validate minimum payment is non-negative
    if (minimumPayment < 0) {
      return res.status(400).json({
        success: false,
        message: 'Minimum payment cannot be negative'
      });
    }

    // Validate credit limit if provided
    if (creditLimit !== undefined && creditLimit < 0) {
      return res.status(400).json({
        success: false,
        message: 'Credit limit cannot be negative'
      });
    }

    // Create credit card with user ID
    const card = await CreditCard.create({
      userId: req.user._id,
      name,
      balance,
      apr,
      minimumPayment,
      creditLimit: creditLimit || null
    });

    logger.log(`Created credit card "${name}" with balance $${balance} for user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Credit card added successfully',
      data: card
    });

  } catch (error) {
    logger.error('Error creating credit card:', error.message);

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
      message: 'Failed to create credit card'
    });
  }
});

/**
 * @route   PUT /api/credit-cards/:id
 * @desc    Update existing credit card
 * @access  Private
 * @body    name, balance, apr, minimumPayment, creditLimit (all optional)
 */
router.put('/:id', async (req, res) => {
  try {
    // Find credit card
    let card = await CreditCard.findById(req.params.id);

    // Check if card exists
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found'
      });
    }

    // Verify ownership
    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this credit card'
      });
    }

    // Validate balance if provided
    if (req.body.balance !== undefined && req.body.balance < 0) {
      return res.status(400).json({
        success: false,
        message: 'Balance cannot be negative'
      });
    }

    // Validate APR if provided
    if (req.body.apr !== undefined && (req.body.apr < 0 || req.body.apr > 100)) {
      return res.status(400).json({
        success: false,
        message: 'APR must be between 0 and 100'
      });
    }

    // Validate minimum payment if provided
    if (req.body.minimumPayment !== undefined && req.body.minimumPayment < 0) {
      return res.status(400).json({
        success: false,
        message: 'Minimum payment cannot be negative'
      });
    }

    // Validate credit limit if provided
    if (req.body.creditLimit !== undefined && req.body.creditLimit < 0) {
      return res.status(400).json({
        success: false,
        message: 'Credit limit cannot be negative'
      });
    }

    // Update credit card
    card = await CreditCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );

    logger.log(`Updated credit card ${req.params.id} for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Credit card updated successfully',
      data: card
    });

  } catch (error) {
    logger.error('Error updating credit card:', error.message);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit card ID format'
      });
    }

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
      message: 'Failed to update credit card'
    });
  }
});

/**
 * @route   DELETE /api/credit-cards/:id
 * @desc    Delete credit card
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    // Find credit card
    const card = await CreditCard.findById(req.params.id);

    // Check if card exists
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found'
      });
    }

    // Verify ownership
    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this credit card'
      });
    }

    // Delete credit card
    await CreditCard.findByIdAndDelete(req.params.id);

    logger.log(`Deleted credit card "${card.name}" for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Credit card deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting credit card:', error.message);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit card ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete credit card'
    });
  }
});

module.exports = router;
