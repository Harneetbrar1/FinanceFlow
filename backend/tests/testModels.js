/**
 * Model Testing Script
 * 
 * Tests all database models, their validations, calculator methods, and relationships.
 * Run this to verify Day 3 implementation before moving to Day 4.
 * 
 * Usage: node backend/tests/testModels.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { User, Transaction, Budget, EmergencyFund, CreditCard } = require('../models');
const logger = require('../utils/logger');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`)
};

let testUser = null;
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

/**
 * Test helper function
 */
async function test(name, fn) {
  testResults.total++;
  try {
    await fn();
    log.success(name);
    testResults.passed++;
  } catch (error) {
    log.error(`${name}: ${error.message}`);
    testResults.failed++;
  }
}

/**
 * Connect to test database
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log.success('Connected to MongoDB');
  } catch (error) {
    log.error('MongoDB connection failed: ' + error.message);
    process.exit(1);
  }
}

/**
 * Clean up test data
 */
async function cleanup() {
  try {
    if (testUser) {
      await Transaction.deleteMany({ userId: testUser._id });
      await Budget.deleteMany({ userId: testUser._id });
      await EmergencyFund.deleteMany({ userId: testUser._id });
      await CreditCard.deleteMany({ userId: testUser._id });
      await User.findByIdAndDelete(testUser._id);
    }
    log.info('Test data cleaned up');
  } catch (error) {
    log.error('Cleanup error: ' + error.message);
  }
}

// =====================
// USER MODEL TESTS
// =====================
async function testUserModel() {
  log.section('📝 Testing User Model');

  await test('Create user with valid data', async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@financeflow.com',
      password: 'password123',
      hourlyWage: 25.50
    });
    if (!testUser._id) throw new Error('User not created');
  });

  await test('Password is hashed', async () => {
    const user = await User.findById(testUser._id).select('+password');
    if (user.password === 'password123') {
      throw new Error('Password is not hashed');
    }
  });

  await test('Generate JWT token', async () => {
    const token = testUser.generateAuthToken();
    if (!token || typeof token !== 'string') {
      throw new Error('Token not generated');
    }
  });

  await test('Compare password method works', async () => {
    const user = await User.findById(testUser._id).select('+password');
    const isMatch = await user.comparePassword('password123');
    if (!isMatch) throw new Error('Password comparison failed');
  });

  await test('Find by credentials (correct password)', async () => {
    const user = await User.findByCredentials('test@financeflow.com', 'password123');
    if (!user) throw new Error('User not found with correct credentials');
  });

  await test('Find by credentials (wrong password)', async () => {
    const user = await User.findByCredentials('test@financeflow.com', 'wrongpassword');
    if (user) throw new Error('Found user with wrong password');
  });

  await test('Validate email format', async () => {
    try {
      await User.create({
        name: 'Invalid User',
        email: 'invalid-email',
        password: 'password123'
      });
      throw new Error('Invalid email was accepted');
    } catch (error) {
      if (!error.message.includes('valid email')) {
        throw error;
      }
    }
  });
}

// =====================
// TRANSACTION MODEL TESTS
// =====================
async function testTransactionModel() {
  log.section('💰 Testing Transaction Model');

  let transaction1, transaction2, transaction3;

  await test('Create income transaction', async () => {
    transaction1 = await Transaction.create({
      userId: testUser._id,
      amount: 3000,
      category: 'Salary',
      description: 'Monthly salary',
      type: 'income',
      date: new Date('2026-02-01')
    });
    if (!transaction1._id) throw new Error('Transaction not created');
  });

  await test('Create expense transaction', async () => {
    transaction2 = await Transaction.create({
      userId: testUser._id,
      amount: 150.50,
      category: 'Groceries',
      description: 'Weekly shopping',
      type: 'expense',
      date: new Date('2026-02-05')
    });
    if (!transaction2._id) throw new Error('Expense not created');
  });

  await test('Create another expense', async () => {
    transaction3 = await Transaction.create({
      userId: testUser._id,
      amount: 75.25,
      category: 'Entertainment',
      description: 'Movie tickets',
      type: 'expense',
      date: new Date('2026-02-03')
    });
    if (!transaction3._id) throw new Error('Expense not created');
  });

  await test('Validate amount must be positive', async () => {
    try {
      await Transaction.create({
        userId: testUser._id,
        amount: -50,
        category: 'Invalid',
        type: 'expense'
      });
      throw new Error('Negative amount was accepted');
    } catch (error) {
      if (!error.message.includes('greater than zero')) {
        throw error;
      }
    }
  });

  await test('Get transactions by date range', async () => {
    const transactions = await Transaction.getByDateRange(
      testUser._id,
      new Date('2026-02-01'),
      new Date('2026-02-10')
    );
    if (transactions.length !== 3) {
      throw new Error(`Expected 3 transactions, got ${transactions.length}`);
    }
  });

  await test('Calculate totals (income vs expenses)', async () => {
    const totals = await Transaction.getTotals(
      testUser._id,
      new Date('2026-02-01'),
      new Date('2026-02-10')
    );
    
    if (totals.totalIncome !== 3000) {
      throw new Error(`Expected income 3000, got ${totals.totalIncome}`);
    }
    
    const expectedExpense = 150.50 + 75.25;
    if (totals.totalExpense !== expectedExpense) {
      throw new Error(`Expected expense ${expectedExpense}, got ${totals.totalExpense}`);
    }
    
    const expectedNet = 3000 - expectedExpense;
    if (totals.netAmount !== expectedNet) {
      throw new Error(`Expected net ${expectedNet}, got ${totals.netAmount}`);
    }
  });

  await test('Transaction type enum validation', async () => {
    try {
      await Transaction.create({
        userId: testUser._id,
        amount: 100,
        category: 'Test',
        type: 'invalid'
      });
      throw new Error('Invalid transaction type was accepted');
    } catch (error) {
      if (!error.message.includes('income') && !error.message.includes('expense')) {
        throw error;
      }
    }
  });
}

// =====================
// BUDGET MODEL TESTS
// =====================
async function testBudgetModel() {
  log.section('📊 Testing Budget Model');

  let budget1;

  await test('Create monthly budget', async () => {
    budget1 = await Budget.create({
      userId: testUser._id,
      category: 'Groceries',
      limit: 500,
      month: 2,
      year: 2026
    });
    if (!budget1._id) throw new Error('Budget not created');
  });

  await test('Check if current month', async () => {
    const isCurrent = budget1.isCurrentMonth();
    if (!isCurrent) throw new Error('Should be current month');
  });

  await test('Calculate utilization percentage', async () => {
    const spent = 150.50; // From our transaction
    const percentage = budget1.getUtilizationPercentage(spent);
    const expected = Math.round((150.50 / 500) * 100);
    if (percentage !== expected) {
      throw new Error(`Expected ${expected}%, got ${percentage}%`);
    }
  });

  await test('Get budgets by month', async () => {
    const budgets = await Budget.getByMonth(testUser._id, 2, 2026);
    if (budgets.length !== 1) {
      throw new Error(`Expected 1 budget, got ${budgets.length}`);
    }
  });

  await test('Upsert budget (update existing)', async () => {
    const updated = await Budget.upsertBudget(
      testUser._id,
      'Groceries',
      600, // New limit
      2,
      2026
    );
    if (updated.limit !== 600) {
      throw new Error(`Expected limit 600, got ${updated.limit}`);
    }
  });

  await test('Upsert budget (create new)', async () => {
    const newBudget = await Budget.upsertBudget(
      testUser._id,
      'Entertainment',
      200,
      2,
      2026
    );
    if (!newBudget._id) throw new Error('New budget not created');
  });

  await test('Get current month budgets', async () => {
    const budgets = await Budget.getCurrentMonthBudgets(testUser._id);
    if (budgets.length !== 2) {
      throw new Error(`Expected 2 budgets, got ${budgets.length}`);
    }
  });

  await test('Validate month range (1-12)', async () => {
    try {
      await Budget.create({
        userId: testUser._id,
        category: 'Test',
        limit: 100,
        month: 13,
        year: 2026
      });
      throw new Error('Invalid month was accepted');
    } catch (error) {
      if (!error.message.includes('between 1 and 12')) {
        throw error;
      }
    }
  });
}

// =====================
// EMERGENCY FUND MODEL TESTS
// =====================
async function testEmergencyFundModel() {
  log.section('🚨 Testing EmergencyFund Model');

  let fund;

  await test('Create emergency fund', async () => {
    fund = await EmergencyFund.create({
      userId: testUser._id,
      targetAmount: 18000, // 6 months * $3000
      currentAmount: 5000,
      monthlyExpenses: 3000
    });
    if (!fund._id) throw new Error('Emergency fund not created');
  });

  await test('Calculate progress percentage', async () => {
    const percentage = fund.getProgressPercentage();
    const expected = Math.round((5000 / 18000) * 100);
    if (percentage !== expected) {
      throw new Error(`Expected ${expected}%, got ${percentage}%`);
    }
  });

  await test('Calculate remaining amount', async () => {
    const remaining = fund.getRemainingAmount();
    if (remaining !== 13000) {
      throw new Error(`Expected 13000, got ${remaining}`);
    }
  });

  await test('Calculate months covered', async () => {
    const months = fund.getMonthsCovered();
    const expected = (5000 / 3000).toFixed(1);
    if (months !== expected) {
      throw new Error(`Expected ${expected} months, got ${months}`);
    }
  });

  await test('Check if goal is met (false)', async () => {
    const isMet = fund.isGoalMet();
    if (isMet) throw new Error('Goal should not be met yet');
  });

  await test('Check if goal is met (true)', async () => {
    fund.currentAmount = 20000;
    const isMet = fund.isGoalMet();
    if (!isMet) throw new Error('Goal should be met');
    fund.currentAmount = 5000; // Reset
  });

  await test('Get recommended target (6 months)', async () => {
    const recommended = fund.getRecommendedTarget(6);
    if (recommended !== 18000) {
      throw new Error(`Expected 18000, got ${recommended}`);
    }
  });

  await test('Upsert emergency fund', async () => {
    const updated = await EmergencyFund.upsertFund(testUser._id, {
      monthlyExpenses: 3500,
      currentAmount: 7000
    });
    if (updated.currentAmount !== 7000) {
      throw new Error('Upsert failed');
    }
  });

  await test('Update amount (add)', async () => {
    const updated = await EmergencyFund.updateAmount(testUser._id, 1000);
    if (updated.currentAmount !== 8000) {
      throw new Error(`Expected 8000, got ${updated.currentAmount}`);
    }
  });

  await test('Update amount (subtract)', async () => {
    const updated = await EmergencyFund.updateAmount(testUser._id, -2000);
    if (updated.currentAmount !== 6000) {
      throw new Error(`Expected 6000, got ${updated.currentAmount}`);
    }
  });

  await test('Validate negative amounts not allowed', async () => {
    try {
      await EmergencyFund.create({
        userId: new mongoose.Types.ObjectId(),
        targetAmount: -1000,
        currentAmount: 0,
        monthlyExpenses: 1000
      });
      throw new Error('Negative amount was accepted');
    } catch (error) {
      if (!error.message.includes('cannot be negative')) {
        throw error;
      }
    }
  });
}

// =====================
// CREDIT CARD MODEL TESTS
// =====================
async function testCreditCardModel() {
  log.section('💳 Testing CreditCard Model');

  let card1;

  await test('Create credit card', async () => {
    card1 = await CreditCard.create({
      userId: testUser._id,
      name: 'Chase Freedom',
      balance: 5000,
      apr: 18.99,
      minimumPayment: 150,
      creditLimit: 10000
    });
    if (!card1._id) throw new Error('Credit card not created');
  });

  await test('Calculate monthly interest', async () => {
    const interest = card1.getMonthlyInterest();
    const expectedRate = (18.99 / 100) / 12;
    const expectedInterest = Math.round(5000 * expectedRate * 100) / 100;
    if (interest !== expectedInterest) {
      throw new Error(`Expected ${expectedInterest}, got ${interest}`);
    }
  });

  await test('Calculate credit utilization', async () => {
    const utilization = card1.getUtilization();
    if (utilization !== 50) {
      throw new Error(`Expected 50%, got ${utilization}%`);
    }
  });

  await test('Calculate payoff months with minimum payment', async () => {
    const months = card1.getPayoffMonths();
    if (typeof months !== 'number' || months <= 0) {
      throw new Error(`Invalid payoff months: ${months}`);
    }
    log.info(`  Payoff time with minimum payments: ${months} months`);
  });

  await test('Calculate total interest paid', async () => {
    const totalInterest = card1.getTotalInterest();
    if (totalInterest < 0) {
      throw new Error('Total interest cannot be negative');
    }
    log.info(`  Total interest with minimum payments: $${totalInterest.toFixed(2)}`);
  });

  await test('Calculate required payment for 12 months', async () => {
    const payment = card1.getRequiredPayment(12);
    if (payment < card1.minimumPayment) {
      throw new Error('Required payment less than minimum');
    }
    log.info(`  Payment needed to pay off in 12 months: $${payment.toFixed(2)}`);
  });

  await test('Test minimum payment < interest scenario', async () => {
    const cardNeverPayoff = await CreditCard.create({
      userId: testUser._id,
      name: 'High Interest Card',
      balance: 10000,
      apr: 29.99,
      minimumPayment: 50, // Too low
      creditLimit: 10000
    });
    
    const months = cardNeverPayoff.getPayoffMonths();
    if (months !== 'Never') {
      throw new Error('Should return "Never" when payment < interest');
    }
  });

  await test('Get all user cards', async () => {
    const cards = await CreditCard.getUserCards(testUser._id);
    if (cards.length !== 2) {
      throw new Error(`Expected 2 cards, got ${cards.length}`);
    }
  });

  await test('Calculate total debt across all cards', async () => {
    const totals = await CreditCard.getTotalDebt(testUser._id);
    if (totals.totalDebt !== 15000) {
      throw new Error(`Expected total debt 15000, got ${totals.totalDebt}`);
    }
    if (totals.cardCount !== 2) {
      throw new Error(`Expected 2 cards, got ${totals.cardCount}`);
    }
  });

  await test('Validate APR range (0-100)', async () => {
    try {
      await CreditCard.create({
        userId: testUser._id,
        name: 'Invalid Card',
        balance: 1000,
        apr: 150,
        minimumPayment: 25
      });
      throw new Error('Invalid APR was accepted');
    } catch (error) {
      if (!error.message.includes('cannot exceed 100')) {
        throw error;
      }
    }
  });
}

// =====================
// MODEL RELATIONSHIPS TEST
// =====================
async function testModelRelationships() {
  log.section('🔗 Testing Model Relationships');

  await test('Transaction references User correctly', async () => {
    const transaction = await Transaction.findOne({ userId: testUser._id });
    const populated = await Transaction.findById(transaction._id).populate('userId');
    
    if (!populated.userId.email) {
      throw new Error('User not populated correctly');
    }
  });

  await test('Budget references User correctly', async () => {
    const budget = await Budget.findOne({ userId: testUser._id });
    const populated = await Budget.findById(budget._id).populate('userId');
    
    if (!populated.userId.email) {
      throw new Error('User not populated correctly');
    }
  });

  await test('Emergency Fund is unique per user', async () => {
    try {
      await EmergencyFund.create({
        userId: testUser._id,
        targetAmount: 10000,
        currentAmount: 0,
        monthlyExpenses: 2000
      });
      throw new Error('Duplicate emergency fund was allowed');
    } catch (error) {
      if (!error.message.includes('duplicate') && !error.code === 11000) {
        throw error;
      }
    }
  });

  await test('Can query all user financial data', async () => {
    const [transactions, budgets, fund, cards] = await Promise.all([
      Transaction.find({ userId: testUser._id }),
      Budget.find({ userId: testUser._id }),
      EmergencyFund.findOne({ userId: testUser._id }),
      CreditCard.find({ userId: testUser._id })
    ]);

    if (!transactions.length) throw new Error('No transactions found');
    if (!budgets.length) throw new Error('No budgets found');
    if (!fund) throw new Error('No emergency fund found');
    if (!cards.length) throw new Error('No credit cards found');

    log.info(`  User has: ${transactions.length} transactions, ${budgets.length} budgets, 1 emergency fund, ${cards.length} cards`);
  });
}

// =====================
// REALISTIC SCENARIO TEST
// =====================
async function testRealisticScenario() {
  log.section('🎯 Testing Realistic Financial Scenario');

  await test('Scenario: User checking February finances', async () => {
    // Get February totals
    const totals = await Transaction.getTotals(
      testUser._id,
      new Date('2026-02-01'),
      new Date('2026-02-28')
    );

    // Get February budgets
    const budgets = await Budget.getByMonth(testUser._id, 2, 2026);
    
    // Get emergency fund status
    const fund = await EmergencyFund.findOne({ userId: testUser._id });
    
    // Get credit card debt
    const debtInfo = await CreditCard.getTotalDebt(testUser._id);

    log.info(`\n  📊 February Financial Summary:`);
    log.info(`     Income: $${totals.totalIncome.toFixed(2)}`);
    log.info(`     Expenses: $${totals.totalExpense.toFixed(2)}`);
    log.info(`     Net: $${totals.netAmount.toFixed(2)}`);
    log.info(`     Active Budgets: ${budgets.length}`);
    log.info(`     Emergency Fund: $${fund.currentAmount.toFixed(2)} / $${fund.targetAmount.toFixed(2)} (${fund.getProgressPercentage()}%)`);
    log.info(`     Credit Card Debt: $${debtInfo.totalDebt.toFixed(2)} across ${debtInfo.cardCount} cards`);
    log.info(`     Minimum Payments: $${debtInfo.totalMinPayment.toFixed(2)}/month`);

    if (!totals.totalIncome) throw new Error('No income found');
  });
}

// =====================
// RUN ALL TESTS
// =====================
async function runAllTests() {
  console.log(`\n${colors.bold}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}  FinanceFlow - Model Testing Suite${colors.reset}`);
  console.log(`${colors.bold}${'='.repeat(60)}${colors.reset}\n`);

  await connectDB();

  try {
    await testUserModel();
    await testTransactionModel();
    await testBudgetModel();
    await testEmergencyFundModel();
    await testCreditCardModel();
    await testModelRelationships();
    await testRealisticScenario();
  } catch (error) {
    log.error('Unexpected error: ' + error.message);
    console.error(error);
  } finally {
    await cleanup();
    await mongoose.connection.close();
    
    // Print summary
    console.log(`\n${colors.bold}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.bold}  Test Results${colors.reset}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`  Total Tests: ${testResults.total}`);
    console.log(`  ${colors.green}Passed: ${testResults.passed}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${testResults.failed}${colors.reset}`);
    console.log(`  Success Rate: ${((testResults.passed/testResults.total)*100).toFixed(1)}%`);
    console.log(`${'='.repeat(60)}\n`);

    process.exit(testResults.failed > 0 ? 1 : 0);
  }
}

// Run tests
runAllTests();
