/**
 * Authentication Middleware
 * 
 * Protects routes by verifying JWT tokens from the Authorization header.
 * Adds the decoded user information to req.user for use in route handlers.
 * 
 * Usage:
 * const { protect } = require('../middleware/auth');
 * router.get('/protected-route', protect, (req, res) => { ... });
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Protect middleware - Verifies JWT token and attaches user to request
 * 
 * Expected Header Format:
 * Authorization: Bearer <token>
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // ---------------------
    // EXTRACT TOKEN
    // ---------------------
    
    // Check for Authorization header with Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from "Bearer <token>" format
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, return unauthorized error
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - No token provided'
      });
    }

    // ---------------------
    // VERIFY TOKEN
    // ---------------------
    
    try {
      // Decode and verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ---------------------
      // ATTACH USER TO REQUEST
      // ---------------------
      
      // Find user by ID from token payload (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized - User not found'
        });
      }

      // Attach user to request object for use in route handlers
      req.user = user;
      
      logger.log(`Authenticated user: ${user.email}`);
      
      // Continue to the next middleware/route handler
      next();

    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized - Token has expired'
        });
      }

      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized - Invalid token'
        });
      }

      // Re-throw other errors
      throw jwtError;
    }

  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

/**
 * Optional protect middleware - Attaches user if token provided, continues either way
 * Useful for routes that have different behavior for logged-in vs anonymous users
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const optionalProtect = async (req, res, next) => {
  try {
    let token;

    // Check for Authorization header with Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, continue without user (anonymous access)
    if (!token) {
      return next();
    }

    try {
      // Decode and verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user and attach to request
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        req.user = user;
      }
      
      next();
    } catch (jwtError) {
      // Token invalid but optional, so continue without user
      next();
    }

  } catch (error) {
    logger.error('Optional auth middleware error:', error.message);
    next();
  }
};

module.exports = { protect, optionalProtect };
