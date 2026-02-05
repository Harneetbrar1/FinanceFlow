/**
 * CreditCard Model
 * 
 * Defines the schema for credit card tracking and debt management.
 * Helps users monitor credit card balances, APR, and calculate payoff strategies.
 * 
 * Fields:
 * - userId: Reference to the User who owns this credit card
 * - name: Credit card name/identifier (e.g., "Chase Freedom", "Visa Card")
 * - balance: Current outstanding balance
 * - apr: Annual Percentage Rate (interest rate)
 * - minimumPayment: Monthly minimum payment required
 * - creditLimit: Total credit limit (optional)
 * - createdAt: Timestamp when card was added
 * - updatedAt: Timestamp of last update
 */

const mongoose = require('mongoose');

/**
 * CreditCard Schema Definition
 */
const CreditCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true // Index for faster queries by user
  },
  name: {
    type: String,
    required: [true, 'Please provide a card name'],
    trim: true,
    maxlength: [50, 'Card name cannot exceed 50 characters']
  },
  balance: {
    type: Number,
    required: [true, 'Please provide current balance'],
    min: [0, 'Balance cannot be negative'],
    default: 0
  },
  apr: {
    type: Number,
    required: [true, 'Please provide APR (Annual Percentage Rate)'],
    min: [0, 'APR cannot be negative'],
    max: [100, 'APR cannot exceed 100%']
  },
  minimumPayment: {
    type: Number,
    required: [true, 'Please provide minimum payment amount'],
    min: [0, 'Minimum payment cannot be negative']
  },
  creditLimit: {
    type: Number,
    min: [0, 'Credit limit cannot be negative'],
    default: null
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
 * Composite index for user and card name
 */
CreditCardSchema.index({ userId: 1, name: 1 });

/**
 * Pre-save middleware: Update the updatedAt timestamp
 */
CreditCardSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

/**
 * Instance method: Calculate monthly interest charge
 * @returns {number} Monthly interest amount
 */
CreditCardSchema.methods.getMonthlyInterest = function() {
  const monthlyRate = (this.apr / 100) / 12;
  return Math.round(this.balance * monthlyRate * 100) / 100;
};

/**
 * Instance method: Calculate credit utilization percentage
 * @returns {number|null} Utilization percentage or null if no limit set
 */
CreditCardSchema.methods.getUtilization = function() {
  if (!this.creditLimit || this.creditLimit === 0) return null;
  return Math.round((this.balance / this.creditLimit) * 100);
};

/**
 * Instance method: Calculate months to pay off with minimum payments
 * Accounts for compound interest
 * @returns {number|string} Number of months or "Never" if payment < interest
 */
CreditCardSchema.methods.getPayoffMonths = function() {
  if (this.balance === 0) return 0;
  
  const monthlyInterest = this.getMonthlyInterest();
  
  // If minimum payment doesn't cover interest, debt will never be paid off
  if (this.minimumPayment <= monthlyInterest) {
    return 'Never';
  }

  let balance = this.balance;
  let months = 0;
  const monthlyRate = (this.apr / 100) / 12;

  // Simulate payment schedule
  while (balance > 0 && months < 600) { // Cap at 50 years
    const interest = balance * monthlyRate;
    const principal = this.minimumPayment - interest;
    balance -= principal;
    months++;
  }

  return months;
};

/**
 * Instance method: Calculate total interest paid with minimum payments
 * @returns {number} Total interest amount
 */
CreditCardSchema.methods.getTotalInterest = function() {
  const months = this.getPayoffMonths();
  
  if (months === 'Never' || months === 0) return 0;

  const totalPaid = this.minimumPayment * months;
  return Math.round((totalPaid - this.balance) * 100) / 100;
};

/**
 * Instance method: Calculate payment needed to pay off in specific months
 * @param {number} targetMonths - Desired payoff timeline
 * @returns {number} Required monthly payment
 */
CreditCardSchema.methods.getRequiredPayment = function(targetMonths) {
  if (this.balance === 0) return 0;
  if (targetMonths <= 0) return this.balance;

  const monthlyRate = (this.apr / 100) / 12;
  
  // Formula: P = (r * B) / (1 - (1 + r)^(-n))
  // Where: P = payment, r = monthly rate, B = balance, n = months
  const payment = (monthlyRate * this.balance) / 
                 (1 - Math.pow(1 + monthlyRate, -targetMonths));

  return Math.ceil(payment * 100) / 100;
};

/**
 * Instance method: Format credit card for response
 * @returns {Object} Formatted credit card object with calculations
 */
CreditCardSchema.methods.toJSON = function() {
  const card = this.toObject();
  
  return {
    id: card._id,
    userId: card.userId,
    name: card.name,
    balance: card.balance,
    apr: card.apr,
    minimumPayment: card.minimumPayment,
    creditLimit: card.creditLimit,
    monthlyInterest: this.getMonthlyInterest(),
    utilization: this.getUtilization(),
    payoffMonths: this.getPayoffMonths(),
    totalInterest: this.getTotalInterest(),
    createdAt: card.createdAt,
    updatedAt: card.updatedAt
  };
};

/**
 * Static method: Get all cards for a user sorted by balance
 * @param {string} userId - User's ID
 * @returns {Promise<Array>} Array of credit cards
 */
CreditCardSchema.statics.getUserCards = async function(userId) {
  return await this.find({ userId }).sort({ balance: -1 });
};

/**
 * Static method: Calculate total debt across all cards for a user
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} Object with totalDebt and totalMinPayment
 */
CreditCardSchema.statics.getTotalDebt = async function(userId) {
  const cards = await this.find({ userId });
  
  const totalDebt = cards.reduce((sum, card) => sum + card.balance, 0);
  const totalMinPayment = cards.reduce((sum, card) => sum + card.minimumPayment, 0);

  return {
    totalDebt,
    totalMinPayment,
    cardCount: cards.length
  };
};

const CreditCard = mongoose.model('CreditCard', CreditCardSchema);

module.exports = CreditCard;
