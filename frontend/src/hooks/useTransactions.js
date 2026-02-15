import { useState, useEffect, useCallback } from 'react';
import { transactionAPI } from '../utils/api';
import logger from '../utils/logger';

/**
 * Custom Hook: useTransactions
 * 
 * Handles all transaction-related API calls and state management.
 * Follows DRY principle - centralized logic for fetching, filtering, and calculating totals.
 * 
 * Features:
 * - Fetch all transactions or filter by date/category
 * - Calculate income/expense totals
 * - Handle loading and error states
 * - Memoized functions to prevent unnecessary re-renders
 * 
 * Returns:
 * {
 *   transactions: Array - List of transactions
 *   loading: Boolean - Is data fetching
 *   error: String - Error message if any
 *   stats: Object - { totalIncome, totalExpense, netIncome }
 *   fetchTransactions: Function - Fetch all transactions
 *   fetchByMonth: Function - Fetch by month/year
 *   calculateTotals: Function - Calculate income/expense totals
 *   refreshTransactions: Function - Refetch current transactions
 * }
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netIncome: 0
  });

  /**
   * Fetch all transactions with optional filters
   */
  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionAPI.getAll(params);
      setTransactions(response.data.data || []);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch transactions';
      setError(errorMsg);
      logger.error('Transaction fetch error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch transactions for a specific month
   */
  const fetchByMonth = useCallback(async (month, year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionAPI.getByMonth(month, year);
      setTransactions(response.data.data || []);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch monthly transactions';
      setError(errorMsg);
      logger.error('Monthly fetch error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new transaction
   */
  const createTransaction = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionAPI.create(payload);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create transaction';
      setError(errorMsg);
      logger.error('Transaction create error:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing transaction
   */
  const updateTransaction = useCallback(async (transactionId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionAPI.update(transactionId, payload);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update transaction';
      setError(errorMsg);
      logger.error('Transaction update error:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a transaction
   * Performs DELETE request and does NOT refetch automatically
   * (calling component handles refetch based on UI context)
   */
  const deleteTransaction = useCallback(async (transactionId) => {
    setError(null);
    try {
      const response = await transactionAPI.delete(transactionId);
      logger.log(`Transaction ${transactionId} deleted successfully`);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete transaction';
      setError(errorMsg);
      logger.error('Transaction delete error:', err);
      return { success: false, message: errorMsg };
    }
  }, []);

  /**
   * Calculate income and expense totals from transactions
   * Uses client-side calculation to avoid extra API calls
   */
  const calculateTotals = useCallback((transactionList) => {
    const totalIncome = transactionList
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpense = transactionList
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const newStats = {
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      netIncome: parseFloat((totalIncome - totalExpense).toFixed(2))
    };

    setStats(newStats);
    return newStats;
  }, []);

  /**
   * Update stats whenever transactions change
   */
  useEffect(() => {
    if (transactions.length > 0) {
      calculateTotals(transactions);
    } else {
      setStats({ totalIncome: 0, totalExpense: 0, netIncome: 0 });
    }
  }, [transactions, calculateTotals]);

  /**
   * Refresh transactions (useful after add/edit/delete)
   */
  const refreshTransactions = useCallback(async () => {
    return await fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    stats,
    fetchTransactions,
    fetchByMonth,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    calculateTotals,
    refreshTransactions,
    setTransactions
  };
};

export default useTransactions;
