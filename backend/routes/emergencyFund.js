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
 * @desc    Get emergency fund - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.get('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Emergency fund feature coming in Phase 2 (post-capstone)',
    feature: 'Emergency fund tracking',
    status: 'planned',
    note: 'Calculator component works but does not persist to database'
  });
});

/**
 * @route   POST /api/emergency-fund
 * @desc    Create/update emergency fund - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.post('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Emergency fund feature coming in Phase 2 (post-capstone)',
    feature: 'Emergency fund creation',
    status: 'planned'
  });
});

/**
 * @route   PUT /api/emergency-fund/amount
 * @desc    Update emergency fund amount - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.put('/amount', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Emergency fund feature coming in Phase 2 (post-capstone)',
    feature: 'Emergency fund updates',
    status: 'planned'
  });
});

/**
 * @route   DELETE /api/emergency-fund
 * @desc    Delete emergency fund - NOT IMPLEMENTED (Placeholder only)
 * @access  Private
 */
router.delete('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Emergency fund feature coming in Phase 2 (post-capstone)',
    feature: 'Emergency fund deletion',
    status: 'planned'
  });
});

module.exports = router;
