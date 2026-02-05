/**
 * Models Index
 * 
 * Central export point for all database models.
 * This file allows importing all models from a single location.
 * 
 * Usage:
 *   const { User, Transaction, Budget } = require('./models');
 */

const User = require('./User');
const Transaction = require('./Transaction');
const Budget = require('./Budget');
const EmergencyFund = require('./EmergencyFund');
const CreditCard = require('./CreditCard');

module.exports = {
  User,
  Transaction,
  Budget,
  EmergencyFund,
  CreditCard
};
