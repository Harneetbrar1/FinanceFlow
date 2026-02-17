/**
 * Formatting Utility Functions
 * 
 * Centralized formatting functions for consistent display across the application.
 * Follows DRY principle to avoid code duplication.
 */

/**
 * Format a number as currency (USD)
 * @param {number} amount - The amount to format
 * @param {boolean} showSign - Whether to show +/- sign (default: false)
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (amount, showSign = false) => {
  const absAmount = Math.abs(amount);
  const formatted = `$${absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  
  if (showSign && amount !== 0) {
    return amount > 0 ? `+${formatted}` : `-${formatted}`;
  }
  
  return formatted;
};

/**
 * Format a date for display
 * @param {string|Date} dateString - The date to format
 * @param {string} format - Format type: 'short' | 'medium' | 'long' (default: 'short')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'short') => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const options = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' },
  };
  
  return date.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format a percentage value
 * @param {number} value - The percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage string (e.g., "75%")
 */
export const formatPercentage = (value, decimals = 0) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text to a maximum length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length (default: 50)
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter of each word
 * @param {string} text - The text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format a number with thousand separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number string (e.g., "1,234")
 */
export const formatNumber = (num) => {
  return num.toLocaleString('en-US');
};
