import { useState, useCallback } from 'react';
import { budgetAPI } from '../utils/api';
import logger from '../utils/logger';

/**
 * Custom Hook: useBudgets
 * 
 * Handles all budget-related API calls and state management.
 * Follows DRY principle - centralized logic for fetching, creating budgets.
 * 
 * Features:
 * - Fetch all budgets or filter by month/year
 * - Create new budgets (no edit/delete per Day 11 scope)
 * - Handle loading and error states
 * - Memoized functions to prevent unnecessary re-renders
 * 
 * Returns:
 * {
 *   budgets: Array - List of budgets
 *   loading: Boolean - Is data fetching
 *   error: String - Error message if any
 *   fetchBudgets: Function - Fetch all budgets
 *   fetchByMonth: Function - Fetch budgets by month/year
 *   createBudget: Function - Create new budget
 *   refreshBudgets: Function - Refetch current budgets
 * }
 */
export const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all budgets with optional filters
   * @param {Object} params - Query parameters (e.g., { month, year })
   * @returns {Promise<Array>} - Array of budget objects
   */
  const fetchBudgets = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await budgetAPI.getAll(params);
      setBudgets(response.data.data || []);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch budgets';
      setError(errorMsg);
      logger.error('Budget fetch error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch budgets for a specific month/year
   * @param {Number} month - Month (1-12)
   * @param {Number} year - Year (e.g., 2026)
   * @returns {Promise<Array>} - Array of budget objects for that month
   */
  const fetchByMonth = useCallback(async (month, year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await budgetAPI.getByMonth(month, year);
      setBudgets(response.data.data || []);
      return response.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch monthly budgets';
      setError(errorMsg);
      logger.error('Monthly budget fetch error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new budget
   * @param {Object} payload - Budget data { category, limit, month, year }
   * @returns {Promise<Object>} - { success: Boolean, data?: Object, message?: String }
   */
  const createBudget = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await budgetAPI.create(payload);
      logger.log('Budget created successfully:', response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create budget';
      setError(errorMsg);
      logger.error('Budget create error:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh budgets (useful after add operation)
   * Refetches the current budget list from the API
   * @returns {Promise<Array>} - Updated array of budgets
   */
  const refreshBudgets = useCallback(async () => {
    return await fetchBudgets();
  }, [fetchBudgets]);

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    fetchByMonth,
    createBudget,
    refreshBudgets,
    setBudgets
  };
};

export default useBudgets;
