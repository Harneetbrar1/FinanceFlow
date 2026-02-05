/**
 * Transaction Model
 * 
 * Defines the schema for financial transactions (income and expenses).
 * Each transaction is linked to a user and contains amount, category, and date information.
 * 
 * Fields:
 * - userId: Reference to the User who owns this transaction
 * - amount: Transaction amount (positive for both income and expenses)
 * - category: Transaction category (e.g., "Groceries", "Salary", "Entertainment")
 * - description: Optional detailed description
 * - date: Date when the transaction occurred
 * - type: Either "income" or "expense"
 * - createdAt: Timestamp when transaction was created in the system
 */

const mongoose = require('mongoose');

/**
 * Transaction Schema Definition
 */
const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true // Index for faster queries by user
  },
  amount: {
    type: Number,
    required: [true, 'Please provide a transaction amount'],
    min: [0.01, 'Amount must be greater than zero']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
    default: ''
  },
  date: {
    type: Date,
    required: [true, 'Please provide a transaction date'],
    default: Date.now
  },
  type: {
    type: String,
    required: [true, 'Please specify transaction type'],
    enum: {
      values: ['income', 'expense'],
      message: 'Type must be either "income" or "expense"'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Index for efficient querying
 * Composite index on userId and date for faster filtering by month/year
 */
TransactionSchema.index({ userId: 1, date: -1 });

/**
 * Instance method: Format transaction for response
 * Returns a clean object with formatted date
 * @returns {Object} Formatted transaction object
 */
TransactionSchema.methods.toJSON = function() {
  const transaction = this.toObject();
  
  return {
    id: transaction._id,
    userId: transaction.userId,
    amount: transaction.amount,
    category: transaction.category,
    description: transaction.description,
    date: transaction.date,
    type: transaction.type,
    createdAt: transaction.createdAt
  };
};

/**
 * Static method: Get transactions by user and date range
 * @param {string} userId - User's ID
 * @param {Date} startDate - Start date for filtering
 * @param {Date} endDate - End date for filtering
 * @returns {Promise<Array>} Array of transactions
 */
TransactionSchema.statics.getByDateRange = async function(userId, startDate, endDate) {
  return await this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

/**
 * Static method: Calculate total income and expenses for a user in a date range
 * @param {string} userId - User's ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Object with totalIncome and totalExpense
 */
TransactionSchema.statics.getTotals = async function(userId, startDate, endDate) {
  const transactions = await this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense
  };
};

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
