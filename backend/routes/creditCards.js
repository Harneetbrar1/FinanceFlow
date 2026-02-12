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
 * @desc    Get all credit cards - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Credit card management coming in Phase 2 (post-capstone)',
    feature: 'Credit card tracking',
    status: 'planned'
  });
});


/**
 * @route   GET /api/credit-cards/totals
 * @desc    Get total debt statistics - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.get('/totals', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Credit card management coming in Phase 2 (post-capstone)',
    feature: 'Debt calculations',
    status: 'planned'
  });
});

/**
 * @route   GET /api/credit-cards/:id
 * @desc    Get single credit card - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.get('/:id', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Credit card management coming in Phase 2 (post-capstone)',
    feature: 'Credit card details',
    status: 'planned'
  });
});

/**
 * @route   POST /api/credit-cards
 * @desc    Create new credit card - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.post('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Credit card management coming in Phase 2 (post-capstone)',
    feature: 'Add credit card',
    status: 'planned'
  });
});

/**
 * @route   PUT /api/credit-cards/:id
 * @desc    Update credit card - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.put('/:id', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Credit card management coming in Phase 2 (post-capstone)',
    feature: 'Update credit card',
    status: 'planned'
  });
});

/**
 * @route   DELETE /api/credit-cards/:id
 * @desc    Delete credit card - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.delete('/:id', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Credit card management coming in Phase 2 (post-capstone)',
    feature: 'Delete credit card',
    status: 'planned'
  });
});

module.exports = router;
