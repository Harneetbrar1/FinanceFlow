import React from "react";
import PropTypes from "prop-types";
import { AlertCircle, TrendingUp } from "lucide-react";

/**
 * BudgetList Component
 *
 * Displays a list of budgets with their current spending and progress.
 * Features:
 * - Shows budget limit vs actual spending per category
 * - Color-coded progress bars (green/yellow/red)
 * - Calculates spending from transactions array
 * - Responsive grid layout
 * - Empty state when no budgets exist
 *
 * @component
 * @param {Object} props
 * @param {Array} props.budgets - Array of budget objects
 * @param {Array} props.transactions - Array of transaction objects (to calculate spending)
 */
export function BudgetList({ budgets = [], transactions = [] }) {
  /**
   * Calculate total spending for a specific category from transactions
   * Only counts expense transactions for the category
   *
   * @param {String} category - Category name to calculate spending for
   * @param {Number} month - Month number (1-12)
   * @param {Number} year - Year (e.g., 2026)
   * @returns {Number} - Total spending for the category in that month
   */
  const calculateSpending = (category, month, year) => {
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const transactionMonth = transactionDate.getMonth() + 1; // getMonth() is 0-indexed
        const transactionYear = transactionDate.getFullYear();

        return (
          t.type === "expense" &&
          t.category.toLowerCase() === category.toLowerCase() &&
          transactionMonth === month &&
          transactionYear === year
        );
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  /**
   * Determine progress bar color based on spending percentage
   * Green: 0-75% (safe)
   * Yellow: 75-100% (warning)
   * Red: 100%+ (over budget)
   *
   * @param {Number} spent - Amount spent
   * @param {Number} budget - Budget limit
   * @returns {String} - Tailwind CSS color classes
   */
  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return "bg-danger-600";
    if (percentage > 75) return "bg-warning-600";
    return "bg-success-600";
  };

  /**
   * Get text color for remaining amount based on budget status
   *
   * @param {Number} remaining - Remaining budget amount
   * @returns {String} - Tailwind CSS text color class
   */
  const getRemainingColor = (remaining) => {
    if (remaining < 0) return "text-danger-600";
    if (remaining < 50) return "text-warning-600";
    return "text-success-600";
  };

  /**
   * Format currency values
   *
   * @param {Number} amount - Amount to format
   * @returns {String} - Formatted currency string
   */
  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  // Empty state
  if (!budgets || budgets.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No budgets set yet</p>
        <p className="text-sm text-gray-500">
          Create your first budget to start tracking spending
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {budgets.map((budget) => {
        const spent = calculateSpending(
          budget.category,
          budget.month,
          budget.year,
        );
        const remaining = budget.limit - spent;
        const percentage = Math.min((spent / budget.limit) * 100, 100);
        const progressColor = getProgressColor(spent, budget.limit);
        const remainingColor = getRemainingColor(remaining);

        return (
          <div key={budget._id || budget.id} className="card p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {budget.category}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(budget.year, budget.month - 1).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
              <TrendingUp
                className={`w-5 h-5 ${remaining >= 0 ? "text-success-600" : "text-danger-600"}`}
              />
            </div>

            {/* Budget vs Spent */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Spent</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${progressColor} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`Budget used: ${percentage.toFixed(0)}%`}
                />
              </div>
            </div>

            {/* Remaining Amount */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className={`text-lg font-bold ${remainingColor}`}>
                {remaining < 0 ? "-" : ""}
                {formatCurrency(remaining)}
              </span>
            </div>

            {/* Over Budget Warning */}
            {remaining < 0 && (
              <div className="mt-3 px-3 py-2 bg-danger-50 border border-danger-200 rounded-md">
                <p className="text-sm text-danger-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Over budget by {formatCurrency(Math.abs(remaining))}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

BudgetList.propTypes = {
  budgets: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      category: PropTypes.string.isRequired,
      limit: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    }),
  ),
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      category: PropTypes.string,
      amount: PropTypes.number,
      date: PropTypes.string,
    }),
  ),
};

export default BudgetList;
