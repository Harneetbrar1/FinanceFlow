import React from "react";
import PropTypes from "prop-types";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useBudgetCalculations } from "../hooks/useBudgetCalculations";
import { formatCurrency } from "../utils/formatters";

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
 * Updates (Day 12):
 * - Refactored to use useBudgetCalculations hook (DRY principle)
 * - Uses formatCurrency utility (DRY principle)
 * - Improved code reusability and maintainability
 *
 * @component
 * @param {Object} props
 * @param {Array} props.budgets - Array of budget objects
 * @param {Array} props.transactions - Array of transaction objects (to calculate spending)
 */
export function BudgetList({ budgets = [], transactions = [] }) {
  const { getEnrichedBudgets, getProgressColor } = useBudgetCalculations(
    budgets,
    transactions,
  );

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

  const enrichedBudgets = getEnrichedBudgets;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {enrichedBudgets.map((budget) => {
        const remainingColor =
          budget.remaining < 0
            ? "text-danger-600"
            : budget.remaining < 50
              ? "text-warning-600"
              : "text-success-600";

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
                className={`w-5 h-5 ${budget.remaining >= 0 ? "text-success-600" : "text-danger-600"}`}
              />
            </div>

            {/* Budget vs Spent */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Spent</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(budget.spent)} /{" "}
                  {formatCurrency(budget.limit)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(budget.status)} transition-all duration-300`}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  role="progressbar"
                  aria-valuenow={budget.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`Budget used: ${budget.percentage}%`}
                />
              </div>
            </div>

            {/* Remaining Amount */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className={`text-lg font-bold ${remainingColor}`}>
                {budget.remaining < 0 ? "-" : ""}
                {formatCurrency(budget.remaining)}
              </span>
            </div>

            {/* Over Budget Warning */}
            {budget.isOverBudget && (
              <div className="mt-3 px-3 py-2 bg-danger-50 border border-danger-200 rounded-md">
                <p className="text-sm text-danger-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Over budget by {formatCurrency(Math.abs(budget.remaining))}
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
