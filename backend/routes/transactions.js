/**
 * Transaction Routes
 * 
 * Handles all transaction-related operations (income and expenses).
 * All routes are protected - require authentication.
 * 
 * Routes:
 * GET    /api/transactions           - Get all user transactions
 * GET    /api/transactions/month     - Get transactions by month
 * GET    /api/transactions/totals    - Get income/expense totals for date range
 * GET    /api/transactions/:id       - Get single transaction
 * POST   /api/transactions           - Create new transaction
 * PUT    /api/transactions/:id       - Update transaction
 * DELETE /api/transactions/:id       - Delete transaction
 */

const express = require('express');
const router = express.Router();
const { Transaction } = require('../models');
const { protect } = require('../middleware/auth');
const logger = require('../utils/logger');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for logged-in user
 * @access  Private
 * @query   startDate, endDate (optional) - Filter by date range
 */
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build query object
    const query = { userId: req.user._id };

    // Add date filtering if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Fetch transactions sorted by date (newest first)
    const transactions = await Transaction.find(query).sort({ date: -1 });

    logger.log(`Fetched ${transactions.length} transactions for user ${req.user.email}`);

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });

  } catch (error) {
    logger.error('Error fetching transactions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
});

/**
 * @route   GET /api/transactions/month
 * @desc    Get transactions for a specific month
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

    // Calculate date range for the specified month
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Fetch transactions for the month
    const transactions = await Transaction.getByDateRange(
      req.user._id,
      startDate,
      endDate
    );

    logger.log(`Fetched ${transactions.length} transactions for ${month}/${year}`);

    res.json({
      success: true,
      month: monthNum,
      year: parseInt(year),
      count: transactions.length,
      data: transactions
    });

  } catch (error) {
    logger.error('Error fetching monthly transactions:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch monthly transactions'
    });
  }
});

/**
 * @route   GET /api/transactions/totals
 * @desc    Get income/expense totals for a date range
 * @access  Private
 * @query   startDate, endDate (required)
 */
router.get('/totals', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate required parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both startDate and endDate'
      });
    }

    // Calculate totals using model static method
    const totals = await Transaction.getTotals(
      req.user._id,
      new Date(startDate),
      new Date(endDate)
    );

    logger.log(`Calculated totals for user ${req.user.email}: Income $${totals.totalIncome}, Expenses $${totals.totalExpense}`);

    res.json({
      success: true,
      startDate,
      endDate,
      data: totals
    });

  } catch (error) {
    logger.error('Error calculating totals:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate totals'
    });
  }
});

/**
 * @route   GET /api/transactions/:id
 * @desc    Get single transaction by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Verify ownership
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this transaction'
      });
    }

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    logger.error('Error fetching transaction:', error.message);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction'
    });
  }
});

/**
 * @route   POST /api/transactions
 * @desc    Create new transaction
 * @access  Private
 * @body    amount, category, type, date (optional), description (optional)
 */
router.post('/', async (req, res) => {
  try {
    const { amount, category, type, date, description } = req.body;

    // Validate required fields
    if (!amount || !category || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide amount, category, and type'
      });
    }

    // Validate transaction type
    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "income" or "expense"'
      });
    }

    // Validate amount is positive
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      });
    }

    // Create transaction with user ID
    const transaction = await Transaction.create({
      userId: req.user._id,
      amount,
      category,
      type,
      date: date || Date.now(),
      description: description || ''
    });

    logger.log(`Created ${type} transaction of $${amount} for user ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });

  } catch (error) {
    logger.error('Error creating transaction:', error.message);

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
      message: 'Failed to create transaction'
    });
  }
});

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update existing transaction
 * @access  Private
 * @body    amount, category, type, date, description (all optional)
 */
router.put('/:id', async (req, res) => {
  try {
    // Find transaction
    let transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Verify ownership
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this transaction'
      });
    }

    // Validate type if provided
    if (req.body.type && req.body.type !== 'income' && req.body.type !== 'expense') {
      return res.status(400).json({
        success: false,
        message: 'Type must be either "income" or "expense"'
      });
    }

    // Validate amount if provided
    if (req.body.amount !== undefined && req.body.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      });
    }

    // Update transaction
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true 
      }
    );

    logger.log(`Updated transaction ${req.params.id} for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction
    });

  } catch (error) {
    logger.error('Error updating transaction:', error.message);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
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
      message: 'Failed to update transaction'
    });
  }
});

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    // Find transaction
    const transaction = await Transaction.findById(req.params.id);

    // Check if transaction exists
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Verify ownership
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction'
      });
    }

    // Delete transaction
    await Transaction.findByIdAndDelete(req.params.id);

    logger.log(`Deleted transaction ${req.params.id} for user ${req.user.email}`);

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting transaction:', error.message);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction'
    });
  }
});

module.exports = router;
