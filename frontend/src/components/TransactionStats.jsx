import React from "react";
import PropTypes from "prop-types";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./Card";

/**
 * TransactionStats Component
 *
 * Displays summary statistics for transactions.
 * Follows DRY principle - reusable stats display.
 *
 * Features:
 * - Shows Total Income
 * - Shows Total Expenses
 * - Shows Net Income (Balance)
 * - Color-coded by type (green/red)
 * - Loading state support
 *
 * @param {Object} stats - Stats object with totalIncome, totalExpense, netIncome
 * @param {Boolean} loading - Is data loading
 * @param {String} className - Optional CSS classes
 */
export function TransactionStats({
  stats = {
    totalIncome: 0,
    totalExpense: 0,
    netIncome: 0,
  },
  loading = false,
  className = "",
}) {
  /**
   * Format currency for display
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Loading state
  if (loading) {
    return (
      <section
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </section>
    );
  }

  // Determine balance status (for styling)
  const isPositiveBalance = stats.netIncome >= 0;

  return (
    <section
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${className}`}
    >
      {/* Total Income Card */}
      <Card
        label="Total Income"
        value={formatCurrency(stats.totalIncome)}
        icon={<TrendingUp className="w-5 h-5 text-success-600" />}
        trend="up"
        trendValue={0}
      />

      {/* Total Expenses Card */}
      <Card
        label="Total Expenses"
        value={formatCurrency(stats.totalExpense)}
        icon={<TrendingDown className="w-5 h-5 text-danger-600" />}
        trend="down"
        trendValue={0}
      />

      {/* Net Income Card */}
      <div
        className={`stat-card rounded-lg border-2 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300 ${
          isPositiveBalance
            ? "border-green-200 bg-green-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="stat-label text-sm font-medium text-gray-600 mb-1">
              Net Income
            </p>
            <p
              className={`stat-value text-2xl md:text-3xl font-bold ${
                isPositiveBalance ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(stats.netIncome)}
            </p>
          </div>
          <div
            className={`p-2 rounded ${
              isPositiveBalance
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>
    </section>
  );
}

TransactionStats.propTypes = {
  stats: PropTypes.shape({
    totalIncome: PropTypes.number,
    totalExpense: PropTypes.number,
    netIncome: PropTypes.number,
  }),
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default TransactionStats;
