/**
 * Logger Utility
 * 
 * This utility ensures that console.log and console.error messages
 * are only displayed in development mode, NOT in production.
 * 
 * INSTRUCTOR REQUIREMENT: No logging messages in deployed app
 * 
 * Usage:
 *   const logger = require('./utils/logger');
 *   logger.log('This will only show in development');
 *   logger.error('Errors also only in development');
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = {
  /**
   * Log informational messages (only in development)
   * @param  {...any} args - Arguments to log
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log('[DEV LOG]:', ...args);
    }
  },

  /**
   * Log error messages (only in development)
   * @param  {...any} args - Arguments to log
   */
  error: (...args) => {
    if (isDevelopment) {
      console.error('[DEV ERROR]:', ...args);
    }
  },

  /**
   * Log warning messages (only in development)
   * @param  {...any} args - Arguments to log
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('[DEV WARN]:', ...args);
    }
  },

  /**
   * Log info messages (only in development)
   * @param  {...any} args - Arguments to log
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info('[DEV INFO]:', ...args);
    }
  }
};

module.exports = logger;
