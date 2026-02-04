/**
 * User Model
 * 
 * Defines the schema for user accounts in FinanceFlow.
 * Handles password hashing, JWT token generation, and password comparison.
 * 
 * Fields:
 * - name: User's display name
 * - email: Unique email for authentication
 * - password: Hashed password (never stored in plain text)
 * - hourlyWage: Used for "Hours Worked" calculator feature
 * - createdAt: Account creation timestamp
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Schema Definition
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  hourlyWage: {
    type: Number,
    default: 0,
    min: [0, 'Hourly wage cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save middleware: Hash password before saving
 * Only runs if password field is modified (new user or password change)
 * Note: Using async/await without next() for Mongoose 5+
 */
UserSchema.pre('save', async function() {
  // Skip hashing if password hasn't been modified
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt with 12 rounds (recommended for security)
  const salt = await bcrypt.genSalt(12);
  // Hash the password with the generated salt
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method: Generate JWT token
 * Creates a signed token containing the user's ID
 * @returns {string} Signed JWT token
 */
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

/**
 * Instance method: Compare entered password with hashed password
 * Used during login to verify credentials
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Static method: Find user by credentials (email and password)
 * Used for login functionality
 * @param {string} email - User's email
 * @param {string} password - Plain text password
 * @returns {Promise<Object|null>} User document if found and password matches
 */
UserSchema.statics.findByCredentials = async function(email, password) {
  // Find user by email and explicitly include password field
  const user = await this.findOne({ email }).select('+password');
  
  if (!user) {
    return null;
  }

  // Verify password matches
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    return null;
  }

  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
