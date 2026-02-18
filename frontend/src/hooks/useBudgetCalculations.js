import { useMemo } from 'react';

/**
 * Custom hook for budget-related calculations
 * 
 * Centralizes budget spending calculations to avoid code duplication.
 * Follows DRY principle and optimizes performance with memoization.
 * 
 * @param {Array} budgets - Array of budget objects
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Budget calculation utilities
 */
export const useBudgetCalculations = (budgets = [], transactions = []) => {
  /**
   * Calculate spending for a specific budget
   * @param {Object} budget - Budget object with category, month, year, limit
   * @returns {number} Total spending amount
   */
  const calculateSpending = (budget) => {
    if (!budget || !transactions.length) return 0;

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const transactionMonth = transactionDate.getMonth() + 1;
        const transactionYear = transactionDate.getFullYear();

        return (
          t.type === 'expense' &&
          t.category.toLowerCase() === budget.category.toLowerCase() &&
          transactionMonth === budget.month &&
          transactionYear === budget.year
        );
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  /**
   * Calculate budget utilization percentage across all budgets
   * @returns {number} Percentage of total budget spent (0-100)
   */
  const calculateTotalUtilization = useMemo(() => {
    if (budgets.length === 0) return 0;

    const totalBudget = budgets.reduce((sum, b) => sum + (b.limit || 0), 0);
    if (totalBudget === 0) return 0;

    const totalSpent = budgets.reduce((sum, budget) => {
      return sum + calculateSpending(budget);
    }, 0);

    return Math.round((totalSpent / totalBudget) * 100);
  }, [budgets, transactions]);

  /**
   * Get budget status with spending details
   * @param {Object} budget - Budget object
   * @returns {Object} Budget status with spent, limit, percentage, and status
   */
  const getBudgetStatus = (budget) => {
    const spent = calculateSpending(budget);
    const percentage = (spent / budget.limit) * 100; // Allow over 100% for proper color coding
    
    let status = 'good'; // 0-75% (green)
    if (percentage > 100) status = 'over'; // >100% (red)
    else if (percentage >= 75) status = 'warning'; // 75-100% (yellow)

    return {
      spent,
      limit: budget.limit,
      percentage: Math.round(percentage),
      status,
      remaining: budget.limit - spent, // Allow negative for over-budget
      isOverBudget: spent > budget.limit,
    };
  };

  /**
   * Get enriched budgets with spending calculations
   * @returns {Array} Budgets with added spending data
   */
  const getEnrichedBudgets = useMemo(() => {
    return budgets.map(budget => ({
      ...budget,
      ...getBudgetStatus(budget),
    }));
  }, [budgets, transactions]);

  /**
   * Get color class for budget status
   * @param {string} status - Budget status ('good' | 'warning' | 'over')
   * @returns {string} Tailwind color classes
   * 
   * Tailwind safelist (ensures these classes are included in build):
   * bg-success-600 bg-warning-600 bg-danger-600
   */
  const getProgressColor = (status) => {
    // Return color class based on budget status
    if (status === 'over') return 'bg-danger-600';
    if (status === 'warning') return 'bg-warning-600';
    return 'bg-success-600';
  };

  return {
    calculateSpending,
    calculateTotalUtilization,
    getBudgetStatus,
    getEnrichedBudgets,
    getProgressColor,
  };
};
