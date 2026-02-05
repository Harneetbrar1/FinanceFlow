/**
 * Budget Model
 * 
 * Defines the schema for monthly budget limits per category.
 * Users can set spending limits for different categories to track against actual expenses.
 * 
 * Fields:
 * - userId: Reference to the User who owns this budget
 * - category: Budget category (must match transaction categories)
 * - limit: Monthly spending limit for this category
 * - month: Month number (1-12)
 * - year: Four-digit year
 * - createdAt: Timestamp when budget was created
 */

const mongoose = require('mongoose');

/**
 * Budget Schema Definition
 */
const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true // Index for faster queries by user
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  limit: {
    type: Number,
    required: [true, 'Please provide a budget limit'],
    min: [0, 'Budget limit cannot be negative']
  },
  month: {
    type: Number,
    required: [true, 'Please provide a month'],
    min: [1, 'Month must be between 1 and 12'],
    max: [12, 'Month must be between 1 and 12']
  },
  year: {
    type: Number,
    required: [true, 'Please provide a year'],
    min: [2020, 'Year must be 2020 or later'],
    max: [2100, 'Year must be before 2100']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Composite index to ensure one budget per category per month per user
 * This prevents duplicate budgets for the same category in the same month
 */
BudgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

/**
 * Instance method: Check if budget is for current month
 * @returns {boolean} True if budget is for current month
 */
BudgetSchema.methods.isCurrentMonth = function() {
  const now = new Date();
  return this.month === now.getMonth() + 1 && this.year === now.getFullYear();
};

/**
 * Instance method: Calculate budget utilization percentage
 * @param {number} spent - Amount spent in this category
 * @returns {number} Percentage of budget used (0-100+)
 */
BudgetSchema.methods.getUtilizationPercentage = function(spent) {
  if (this.limit === 0) return 0;
  return Math.round((spent / this.limit) * 100);
};

/**
 * Instance method: Format budget for response
 * @returns {Object} Formatted budget object
 */
BudgetSchema.methods.toJSON = function() {
  const budget = this.toObject();
  
  return {
    id: budget._id,
    userId: budget.userId,
    category: budget.category,
    limit: budget.limit,
    month: budget.month,
    year: budget.year,
    createdAt: budget.createdAt
  };
};

/**
 * Static method: Get all budgets for a specific month and user
 * @param {string} userId - User's ID
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<Array>} Array of budgets
 */
BudgetSchema.statics.getByMonth = async function(userId, month, year) {
  return await this.find({
    userId,
    month,
    year
  }).sort({ category: 1 });
};

/**
 * Static method: Get or create budget for a category
 * If budget exists, returns it. If not, creates a new one.
 * @param {string} userId - User's ID
 * @param {string} category - Category name
 * @param {number} limit - Budget limit
 * @param {number} month - Month (1-12)
 * @param {number} year - Year
 * @returns {Promise<Object>} Budget document
 */
BudgetSchema.statics.upsertBudget = async function(userId, category, limit, month, year) {
  return await this.findOneAndUpdate(
    { userId, category, month, year },
    { limit },
    { new: true, upsert: true, runValidators: true }
  );
};

/**
 * Static method: Get current month's budgets for a user
 * @param {string} userId - User's ID
 * @returns {Promise<Array>} Array of current month budgets
 */
BudgetSchema.statics.getCurrentMonthBudgets = async function(userId) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  return await this.getByMonth(userId, month, year);
};

const Budget = mongoose.model('Budget', BudgetSchema);

module.exports = Budget;
