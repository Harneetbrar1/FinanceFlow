/**
 * API Route Testing Script
 * 
 * Tests all API endpoints created in Day 4.
 * Verifies authentication, validation, CRUD operations, and error handling.
 * 
 * Usage: node backend/tests/testRoutes.js
 * 
 * Note: This is a simplified test suite. For production, consider using:
 * - Jest + Supertest
 * - Mocha + Chai
 * - Vitest
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Mock HTTP client (simplified version)
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000/api';
let testUser = null;
let authToken = null;
let testIds = {
  transaction: null,
  budget: null,
  creditCard: null
};

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
 * HTTP request helper with error handling
 */
async function request(method, url, data = null, token = null) {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {}
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.data = data;
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    // Return error response for testing
    if (error.response) {
      return error.response;
    }
    throw error;
  }
}

// =====================
// SETUP TESTS
// =====================
async function setupTests() {
  log.section('🔧 Test Setup');

  await test('Check if server is running', async () => {
    const res = await axios.get('http://localhost:5000');
    if (res.status !== 200) {
      throw new Error('Server not responding');
    }
  });

  await test('Register test user', async () => {
    const res = await request('POST', '/auth/register', {
      name: 'API Test User',
      email: `test-${Date.now()}@financeflow.com`,
      password: 'testpass123',
      hourlyWage: 30
    });

    if (res.status !== 201) {
      throw new Error(`Registration failed: ${res.status}`);
    }

    authToken = res.data.token;
    testUser = res.data.user;
  });
}

// =====================
// AUTH ROUTE TESTS
// =====================
async function testAuthRoutes() {
  log.section('🔐 Testing Auth Routes');

  await test('Login with valid credentials', async () => {
    const res = await request('POST', '/auth/login', {
      email: testUser.email,
      password: 'testpass123'
    });

    if (res.status !== 200 || !res.data.token) {
      throw new Error('Login failed');
    }
  });

  await test('Login with invalid password', async () => {
    const res = await request('POST', '/auth/login', {
      email: testUser.email,
      password: 'wrongpassword'
    });

    if (res.status !== 401) {
      throw new Error('Should return 401 for invalid password');
    }
  });

  await test('Get current user profile (auth)', async () => {
    const res = await request('GET', '/auth/me', null, authToken);

    if (res.status !== 200 || res.data.user.email !== testUser.email) {
      throw new Error('Failed to get user profile');
    }
  });

  await test('Access protected route without token', async () => {
    const res = await request('GET', '/auth/me');

    if (res.status !== 401) {
      throw new Error('Should return 401 without token');
    }
  });
}

// =====================
// TRANSACTION ROUTE TESTS
// =====================
async function testTransactionRoutes() {
  log.section('💰 Testing Transaction Routes');

  await test('Create income transaction', async () => {
    const res = await request('POST', '/transactions', {
      amount: 5000,
      category: 'Salary',
      type: 'income',
      description: 'Monthly salary'
    }, authToken);

    if (res.status !== 201) {
      throw new Error(`Failed to create transaction: ${res.status}`);
    }

    testIds.transaction = res.data.data._id || res.data.data.id;
  });

  await test('Create expense transaction', async () => {
    const res = await request('POST', '/transactions', {
      amount: 150,
      category: 'Groceries',
      type: 'expense',
      description: 'Weekly groceries'
    }, authToken);

    if (res.status !== 201) {
      throw new Error('Failed to create expense');
    }
  });

  await test('Get all transactions', async () => {
    const res = await request('GET', '/transactions', null, authToken);

    if (res.status !== 200 || res.data.count < 2) {
      throw new Error(`Expected 2+ transactions, got ${res.data.count}`);
    }
  });

  await test('Get single transaction', async () => {
    const res = await request('GET', `/transactions/${testIds.transaction}`, null, authToken);

    if (res.status !== 200) {
      throw new Error('Failed to get single transaction');
    }
  });

  await test('Update transaction', async () => {
    const res = await request('PUT', `/transactions/${testIds.transaction}`, {
      amount: 5500,
      description: 'Updated salary amount'
    }, authToken);

    if (res.status !== 200 || res.data.data.amount !== 5500) {
      throw new Error('Failed to update transaction');
    }
  });

  await test('Get transactions by month', async () => {
    const now = new Date();
    const res = await request('GET', `/transactions/month?month=${now.getMonth() + 1}&year=${now.getFullYear()}`, null, authToken);

    if (res.status !== 200) {
      throw new Error('Failed to get monthly transactions');
    }
  });

  await test('Get transaction totals', async () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    
    const res = await request('GET', `/transactions/totals?startDate=${startDate}&endDate=${endDate}`, null, authToken);

    if (res.status !== 200 || !res.data.data.totalIncome) {
      throw new Error('Failed to get totals');
    }
  });

  await test('Validate transaction type enum', async () => {
    const res = await request('POST', '/transactions', {
      amount: 100,
      category: 'Test',
      type: 'invalid-type'
    }, authToken);

    if (res.status !== 400) {
      throw new Error('Should reject invalid transaction type');
    }
  });

  await test('Validate negative amount', async () => {
    const res = await request('POST', '/transactions', {
      amount: -100,
      category: 'Test',
      type: 'expense'
    }, authToken);

    if (res.status !== 400) {
      throw new Error('Should reject negative amount');
    }
  });

  await test('Delete transaction', async () => {
    const res = await request('DELETE', `/transactions/${testIds.transaction}`, null, authToken);

    if (res.status !== 200) {
      throw new Error('Failed to delete transaction');
    }
  });
}

// =====================
// BUDGET ROUTE TESTS
// =====================
async function testBudgetRoutes() {
  log.section('📊 Testing Budget Routes');

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  await test('Create budget', async () => {
    const res = await request('POST', '/budgets', {
      category: 'Groceries',
      limit: 500,
      month: currentMonth,
      year: currentYear
    }, authToken);

    if (res.status !== 201) {
      throw new Error('Failed to create budget');
    }

    testIds.budget = res.data.data._id || res.data.data.id;
  });

  await test('Get all budgets', async () => {
    const res = await request('GET', '/budgets', null, authToken);

    if (res.status !== 200 || res.data.count < 1) {
      throw new Error('Failed to get budgets');
    }
  });

  await test('Get budgets by month', async () => {
    const res = await request('GET', `/budgets/month?month=${currentMonth}&year=${currentYear}`, null, authToken);

    if (res.status !== 200) {
      throw new Error('Failed to get monthly budgets');
    }
  });

  await test('Get current month budgets', async () => {
    const res = await request('GET', '/budgets/current', null, authToken);

    if (res.status !== 200) {
      throw new Error('Failed to get current month budgets');
    }
  });

  await test('Update budget', async () => {
    const res = await request('PUT', `/budgets/${testIds.budget}`, {
      limit: 600
    }, authToken);

    if (res.status !== 200 || res.data.data.limit !== 600) {
      throw new Error('Failed to update budget');
    }
  });

  await test('Validate month range', async () => {
    const res = await request('POST', '/budgets', {
      category: 'Test',
      limit: 100,
      month: 13,
      year: currentYear
    }, authToken);

    if (res.status !== 400) {
      throw new Error('Should reject invalid month');
    }
  });

  await test('Delete budget', async () => {
    const res = await request('DELETE', `/budgets/${testIds.budget}`, null, authToken);

    if (res.status !== 200) {
      throw new Error('Failed to delete budget');
    }
  });
}

// =====================
// EMERGENCY FUND ROUTE TESTS
// =====================
async function testEmergencyFundRoutes() {
  log.section('🚨 Testing EmergencyFund Routes');

  await test('Create emergency fund', async () => {
    const res = await request('POST', '/emergency-fund', {
      monthlyExpenses: 3000,
      targetAmount: 18000,
      currentAmount: 5000
    }, authToken);

    if (res.status !== 201) {
      throw new Error('Failed to create emergency fund');
    }
  });

  await test('Get emergency fund', async () => {
    const res = await request('GET', '/emergency-fund', null, authToken);

    if (res.status !== 200 || !res.data.data) {
      throw new Error('Failed to get emergency fund');
    }

    // Check calculated fields
    if (!res.data.data.progressPercentage || !res.data.data.monthsCovered) {
      throw new Error('Missing calculated fields');
    }
  });

  await test('Update emergency fund amount (add)', async () => {
    const res = await request('PUT', '/emergency-fund/amount', {
      amount: 1000
    }, authToken);

    if (res.status !== 200 || res.data.data.currentAmount !== 6000) {
      throw new Error('Failed to add to emergency fund');
    }
  });

  await test('Update emergency fund amount (subtract)', async () => {
    const res = await request('PUT', '/emergency-fund/amount', {
      amount: -500
    }, authToken);

    if (res.status !== 200 || res.data.data.currentAmount !== 5500) {
      throw new Error('Failed to subtract from emergency fund');
    }
  });

  await test('Upsert emergency fund (update existing)', async () => {
    const res = await request('POST', '/emergency-fund', {
      monthlyExpenses: 3500,
      currentAmount: 7000
    }, authToken);

    if (res.status !== 201 || res.data.data.monthlyExpenses !== 3500) {
      throw new Error('Failed to upsert emergency fund');
    }
  });

  await test('Delete emergency fund', async () => {
    const res = await request('DELETE', '/emergency-fund', null, authToken);

    if (res.status !== 200) {
      throw new Error('Failed to delete emergency fund');
    }
  });
}

// =====================
// CREDIT CARD ROUTE TESTS
// =====================
async function testCreditCardRoutes() {
  log.section('💳 Testing CreditCard Routes');

  await test('Create credit card', async () => {
    const res = await request('POST', '/credit-cards', {
      name: 'Test Visa',
      balance: 5000,
      apr: 18.99,
      minimumPayment: 150,
      creditLimit: 10000
    }, authToken);

    if (res.status !== 201) {
      throw new Error('Failed to create credit card');
    }

    testIds.creditCard = res.data.data._id || res.data.data.id;

    // Check calculated fields
    if (!res.data.data.monthlyInterest || !res.data.data.utilization) {
      throw new Error('Missing calculated fields');
    }
  });

  await test('Get all credit cards', async () => {
    const res = await request('GET', '/credit-cards', null, authToken);

    if (res.status !== 200 || res.data.count < 1) {
      throw new Error('Failed to get credit cards');
    }
  });

  await test('Get debt totals', async () => {
    const res = await request('GET', '/credit-cards/totals', null, authToken);

    if (res.status !== 200 || !res.data.data.totalDebt) {
      throw new Error('Failed to get debt totals');
    }
  });

  await test('Get single credit card', async () => {
    const res = await request('GET', `/credit-cards/${testIds.creditCard}`, null, authToken);

    if (res.status !== 200) {
      throw new Error('Failed to get single credit card');
    }
  });

  await test('Update credit card', async () => {
    const res = await request('PUT', `/credit-cards/${testIds.creditCard}`, {
      balance: 4500,
      minimumPayment: 135
    }, authToken);

    if (res.status !== 200 || res.data.data.balance !== 4500) {
      throw new Error('Failed to update credit card');
    }
  });

  await test('Validate APR range', async () => {
    const res = await request('POST', '/credit-cards', {
      name: 'Invalid Card',
      balance: 1000,
      apr: 150,
      minimumPayment: 25
    }, authToken);

    if (res.status !== 400) {
      throw new Error('Should reject invalid APR');
    }
  });

  await test('Delete credit card', async () => {
    const res = await request('DELETE', `/credit-cards/${testIds.creditCard}`, null, authToken);

    if (res.status !== 200) {
      throw new Error('Failed to delete credit card');
    }
  });
}

// =====================
// USER PROFILE ROUTE TESTS
// =====================
async function testUserRoutes() {
  log.section('👤 Testing User Profile Routes');

  await test('Get user profile', async () => {
    const res = await request('GET', '/user/profile', null, authToken);

    if (res.status !== 200 || !res.data.data.email) {
      throw new Error('Failed to get user profile');
    }
  });

  await test('Update user profile (name)', async () => {
    const res = await request('PUT', '/user/profile', {
      name: 'Updated Test User'
    }, authToken);

    if (res.status !== 200 || res.data.data.name !== 'Updated Test User') {
      throw new Error('Failed to update name');
    }
  });

  await test('Update user profile (hourlyWage)', async () => {
    const res = await request('PUT', '/user/profile', {
      hourlyWage: 35
    }, authToken);

    if (res.status !== 200 || res.data.data.hourlyWage !== 35) {
      throw new Error('Failed to update hourly wage');
    }
  });

  await test('Validate name length', async () => {
    const res = await request('PUT', '/user/profile', {
      name: 'X'
    }, authToken);

    if (res.status !== 400) {
      throw new Error('Should reject short name');
    }
  });

  await test('Validate hourlyWage is non-negative', async () => {
    const res = await request('PUT', '/user/profile', {
      hourlyWage: -10
    }, authToken);

    if (res.status !== 400) {
      throw new Error('Should reject negative wage');
    }
  });
}

// =====================
// CLEANUP
// =====================
async function cleanup() {
  try {
    // Delete test user
    if (testUser) {
      const { User, Transaction, Budget, EmergencyFund, CreditCard } = require('../models');
      await mongoose.connect(process.env.MONGO_URI);
      
      await Transaction.deleteMany({ userId: testUser.id });
      await Budget.deleteMany({ userId: testUser.id });
      await EmergencyFund.deleteMany({ userId: testUser.id });
      await CreditCard.deleteMany({ userId: testUser.id });
      await User.findByIdAndDelete(testUser.id);
      
      await mongoose.connection.close();
      log.info('Test data cleaned up');
    }
  } catch (error) {
    log.error('Cleanup error: ' + error.message);
  }
}

// =====================
// RUN ALL TESTS
// =====================
async function runAllTests() {
  console.log(`\n${colors.bold}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}  FinanceFlow - API Route Testing Suite${colors.reset}`);
  console.log(`${colors.bold}${'='.repeat(60)}${colors.reset}\n`);

  log.info('Make sure the server is running: npm run dev');
  log.info('Waiting 2 seconds before starting tests...\n');
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    await setupTests();
    await testAuthRoutes();
    await testTransactionRoutes();
    await testBudgetRoutes();
    await testEmergencyFundRoutes();
    await testCreditCardRoutes();
    await testUserRoutes();
  } catch (error) {
    log.error('Unexpected error: ' + error.message);
    console.error(error);
  } finally {
    await cleanup();
    
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

// Check if axios is installed
try {
  require.resolve('axios');
} catch {
  console.error(`${colors.red}Error: axios not installed${colors.reset}`);
  console.log('Run: npm install axios --save-dev');
  process.exit(1);
}

// Run tests
runAllTests();
