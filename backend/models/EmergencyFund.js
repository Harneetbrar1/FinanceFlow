/**
 * EmergencyFund Model
 * 
 * Defines the schema for emergency fund tracking.
 * Helps users build and monitor their emergency fund based on monthly expenses.
 * Financial advisors recommend 3-6 months of expenses as an emergency fund.
 * 
 * Fields:
 * - userId: Reference to the User who owns this emergency fund
 * - targetAmount: Goal amount for the emergency fund
 * - currentAmount: Current saved amount
 * - monthlyExpenses: User's average monthly expenses (used to calculate target)
 * - createdAt: Timestamp when emergency fund tracking was created
 * - updatedAt: Timestamp of last update
 */

const mongoose = require('mongoose');

/**
 * EmergencyFund Schema Definition
 */
const EmergencyFundSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true, // Each user can only have one emergency fund record
    index: true
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please provide a target amount'],
    min: [0, 'Target amount cannot be negative']
  },
  currentAmount: {
    type: Number,
    required: [true, 'Please provide current amount'],
    min: [0, 'Current amount cannot be negative'],
    default: 0
  },
  monthlyExpenses: {
    type: Number,
    required: [true, 'Please provide monthly expenses'],
    min: [0, 'Monthly expenses cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save middleware: Update the updatedAt timestamp
 */
EmergencyFundSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

/**
 * Instance method: Calculate progress percentage
 * @returns {number} Percentage of target reached (0-100)
 */
EmergencyFundSchema.methods.getProgressPercentage = function() {
  if (this.targetAmount === 0) return 0;
  const percentage = (this.currentAmount / this.targetAmount) * 100;
  return Math.min(Math.round(percentage), 100); // Cap at 100%
};

/**
 * Instance method: Calculate remaining amount needed
 * @returns {number} Amount still needed to reach target
 */
EmergencyFundSchema.methods.getRemainingAmount = function() {
  return Math.max(0, this.targetAmount - this.currentAmount);
};

/**
 * Instance method: Calculate months of expenses covered
 * @returns {number} Number of months covered by current amount
 */
EmergencyFundSchema.methods.getMonthsCovered = function() {
  if (this.monthlyExpenses === 0) return 0;
  return (this.currentAmount / this.monthlyExpenses).toFixed(1);
};

/**
 * Instance method: Check if emergency fund goal is met
 * @returns {boolean} True if current amount meets or exceeds target
 */
EmergencyFundSchema.methods.isGoalMet = function() {
  return this.currentAmount >= this.targetAmount;
};

/**
 * Instance method: Get recommended target (3-6 months of expenses)
 * @param {number} months - Number of months to cover (default: 6)
 * @returns {number} Recommended target amount
 */
EmergencyFundSchema.methods.getRecommendedTarget = function(months = 6) {
  return this.monthlyExpenses * months;
};

/**
 * Instance method: Format emergency fund for response
 * @returns {Object} Formatted emergency fund object with calculated fields
 */
EmergencyFundSchema.methods.toJSON = function() {
  const fund = this.toObject();
  
  return {
    id: fund._id,
    userId: fund.userId,
    targetAmount: fund.targetAmount,
    currentAmount: fund.currentAmount,
    monthlyExpenses: fund.monthlyExpenses,
    progressPercentage: this.getProgressPercentage(),
    remainingAmount: this.getRemainingAmount(),
    monthsCovered: this.getMonthsCovered(),
    isGoalMet: this.isGoalMet(),
    createdAt: fund.createdAt,
    updatedAt: fund.updatedAt
  };
};

/**
 * Static method: Get or create emergency fund for a user
 * If record exists, returns it. If not, creates a new one with defaults.
 * @param {string} userId - User's ID
 * @param {Object} data - Emergency fund data (monthlyExpenses, targetAmount, currentAmount)
 * @returns {Promise<Object>} EmergencyFund document
 */
EmergencyFundSchema.statics.upsertFund = async function(userId, data) {
  // Calculate target if not provided (default to 6 months)
  if (!data.targetAmount && data.monthlyExpenses) {
    data.targetAmount = data.monthlyExpenses * 6;
  }

  return await this.findOneAndUpdate(
    { userId },
    { ...data, updatedAt: Date.now() },
    { new: true, upsert: true, runValidators: true }
  );
};

/**
 * Static method: Update current amount (for deposits/withdrawals)
 * @param {string} userId - User's ID
 * @param {number} amount - Amount to add (positive) or subtract (negative)
 * @returns {Promise<Object>} Updated EmergencyFund document
 */
EmergencyFundSchema.statics.updateAmount = async function(userId, amount) {
  const fund = await this.findOne({ userId });
  
  if (!fund) {
    throw new Error('Emergency fund not found for this user');
  }

  fund.currentAmount = Math.max(0, fund.currentAmount + amount);
  fund.updatedAt = Date.now();
  
  return await fund.save();
};

const EmergencyFund = mongoose.model('EmergencyFund', EmergencyFundSchema);

module.exports = EmergencyFund;
