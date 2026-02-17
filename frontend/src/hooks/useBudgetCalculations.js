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
    const percentage = Math.min((spent / budget.limit) * 100, 100);
    
    let status = 'good'; // under 75%
    if (percentage > 100) status = 'over';
    else if (percentage > 75) status = 'warning';

    return {
      spent,
      limit: budget.limit,
      percentage: Math.round(percentage),
      status,
      remaining: Math.max(budget.limit - spent, 0),
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
   */
  const getProgressColor = (status) => {
    const colors = {
      good: 'bg-success-600',
      warning: 'bg-warning-600',
      over: 'bg-danger-600',
    };
    return colors[status] || colors.good;
  };

  return {
    calculateSpending,
    calculateTotalUtilization,
    getBudgetStatus,
    getEnrichedBudgets,
    getProgressColor,
  };
};
