/**
 * Budget Routes
 * 
 * Handles monthly budget management operations.
 * All routes are protected - require authentication.
 * 
 * Routes:
 * GET    /api/budgets               - Get all user budgets
 * GET    /api/budgets/month         - Get budgets for specific month
 * GET    /api/budgets/current       - Get current month budgets
 * GET    /api/budgets/:id           - Get single budget
 * POST   /api/budgets               - Create new budget
 * PUT    /api/budgets/:id           - Update budget
 * DELETE /api/budgets/:id           - Delete budget
 */

const express = require('express');
const router = express.Router();
const { Budget } = require('../models');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/budgets
 * @desc    Get all budgets for logged-in user
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    // Fetch all budgets for the user, sorted by year and month
    const budgets = await Budget.find({ userId: req.user._id })
      .sort({ year: -1, month: -1 });

    logger.log(`Fetched ${budgets.length} budgets for user ${req.user.email}`);

    res.json({
      success: true,
      count: budgets.length,
      data: budgets
    });

  } catch (error) {
    logger.error('Error fetching budgets:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budgets'
    });
  }
});

/**
 * @route   GET /api/budgets/month
 * @desc    Get budgets for a specific month
 * @access  Private
 * @query   month (1-12), year (required)
 */
router.get('/month', async (req, res) => {
  try {
    const { month, year } = req.query;

    // Validate required parameters
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both month and year'
      });
    }

    // Validate month range
    const monthNum = parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 1 and 12'
      });
    }

    // Fetch budgets using model static method
    const budgets = await Budget.getByMonth(
      req.user._id,
      monthNum,
      parseInt(year)
    );

    logger.log(`Fetched ${budgets.length} budgets for ${month}/${year}`);

    res.json({
      success: true,
      month: monthNum,
      year: parseInt(year),
      count: budgets.length,
      data: budgets
    });

  } catch (error) {
    logger.error('Error fetching monthly budgets:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly budgets'
    });
  }
});

/**
 * @route   GET /api/budgets/current
 * @desc    Get budgets for current month
 * @access  Private
 */
router.get('/current', async (req, res) => {
  try {
    // Fetch current month budgets using model static method
    const budgets = await Budget.getCurrentMonthBudgets(req.user._id);

    const now = new Date();
    logger.log(`Fetched ${budgets.length} budgets for current month (${now.getMonth() + 1}/${now.getFullYear()})`);

    res.json({
      success: true,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      count: budgets.length,
      data: budgets
    });

  } catch (error) {
    logger.error('Error fetching current month budgets:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current month budgets'
    });
  }
});

/**
 * @route   GET /api/budgets/:id
 * @desc    Get single budget by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    // Check if budget exists
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // Verify ownership
    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this budget'
      });
    }

    res.json({
      success: true,
      data: budget
    });

  } catch (error) {
    logger.error('Error fetching budget:', error.message);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget'
    });
  }
});

/**
 * @route   POST /api/budgets
 * @desc    Create new budget (or update if exists for same category/month/year)
 * @access  Private
 * @body    category, limit, month, year (all required)
 */
router.post('/', async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;

    // Validate required fields
    if (!category || limit === undefined || !month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, limit, month, and year'
      });
    }

    // Validate limit is non-negative
    if (limit < 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget limit cannot be negative'
      });
    }

    // Validate month range
    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 1 and 12'
      });
    }

    // Validate year
    if (year < 2020 || year > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Year must be between 2020 and 2100'
      });
    }

    // Use upsert to create or update budget
    const budget = await Budget.upsertBudget(
      req.user._id,
      category,
      limit,
      month,
      year
    );

    logger.log(`Created/updated budget for ${category} (${month}/${year}) for user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Budget saved successfully',
      data: budget
    });

  } catch (error) {
    logger.error('Error creating budget:', error.message);

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
      message: 'Failed to create budget'
    });
  }
});

/**
 * @route   PUT /api/budgets/:id
 * @desc    Update existing budget
 * @access  Private
 * @body    category, limit, month, year (all optional)
 */
router.put('/:id', async (req, res) => {
  try {
    // Find budget
    let budget = await Budget.findById(req.params.id);

    // Check if budget exists
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // Verify ownership
    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this budget'
      });
    }

    // Validate limit if provided
    if (req.body.limit !== undefined && req.body.limit < 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget limit cannot be negative'
      });
    }

    // Validate month if provided
    if (req.body.month && (req.body.month < 1 || req.body.month > 12)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be between 1 and 12'
      });
    }

    // Validate year if provided
    if (req.body.year && (req.body.year < 2020 || req.body.year > 2100)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be between 2020 and 2100'
      });
    }

    // Update budget
    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );

    logger.log(`Updated budget ${req.params.id} for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: budget
    });

  } catch (error) {
    logger.error('Error updating budget:', error.message);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID format'
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

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Budget already exists for this category, month, and year'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update budget'
    });
  }
});

/**
 * @route   DELETE /api/budgets/:id
 * @desc    Delete budget
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    // Find budget
    const budget = await Budget.findById(req.params.id);

    // Check if budget exists
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    // Verify ownership
    if (budget.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this budget'
      });
    }

    // Delete budget
    await Budget.findByIdAndDelete(req.params.id);

    logger.log(`Deleted budget ${req.params.id} for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting budget:', error.message);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid budget ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete budget'
    });
  }
});

module.exports = router;
