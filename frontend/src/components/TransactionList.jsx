import React from "react";
import PropTypes from "prop-types";
import { Trash2, Edit2, DollarSign } from "lucide-react";

/**
 * TransactionList Component
 *
 * Displays a list of transactions in a table format.
 * Follows DRY principle - reusable across multiple pages.
 *
 * Features:
 * - Responsive table layout
 * - Type-based color coding (income/expense)
 * - Formatted dates and amounts
 * - Edit/Delete action buttons
 * - Empty state handling
 * - Loading skeleton support
 *
 * @param {Array} transactions - Array of transaction objects
 * @param {Boolean} loading - Is data loading
 * @param {Function} onEdit - Callback when edit button clicked
 * @param {Function} onDelete - Callback when delete button clicked
 * @param {String} className - Optional CSS classes
 */
export function TransactionList({
  transactions = [],
  loading = false,
  onEdit = () => {},
  onDelete = () => {},
  className = "",
}) {
  /**
   * Format currency for display
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  /**
   * Format date for display
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /**
   * Get color classes based on transaction type and status
   */
  const getTypeClasses = (type) => {
    return type === "income"
      ? "text-green-600 bg-green-50"
      : "text-red-600 bg-red-50";
  };

  /**
   * Get badge styling based on category
   */
  const getCategoryColor = (category) => {
    const colors = {
      groceries: "bg-blue-100 text-blue-800",
      utilities: "bg-yellow-100 text-yellow-800",
      entertainment: "bg-purple-100 text-purple-800",
      transportation: "bg-orange-100 text-orange-800",
      salary: "bg-green-100 text-green-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category.toLowerCase()] || colors.other;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`card p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Transaction History
        </h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className={`card p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Transaction History
        </h2>
        <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Start by adding your first transaction
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Table render
  return (
    <div className={`card p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Transaction History
      </h2>

      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Category
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                Amount
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                Type
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction._id || transaction.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-600">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                      transaction.category,
                    )}`}
                  >
                    {transaction.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 max-w-xs truncate">
                  {transaction.description || "-"}
                </td>
                <td className="px-4 py-3 font-semibold text-right text-gray-900">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getTypeClasses(
                      transaction.type,
                    )}`}
                  >
                    {transaction.type === "income" ? "+" : "-"}{" "}
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      title="Edit transaction"
                      aria-label="Edit transaction"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        onDelete(transaction._id || transaction.id)
                      }
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Delete transaction"
                      aria-label="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Card layout */}
      <div className="md:hidden space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction._id || transaction.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {formatDate(transaction.date)}
                </p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                    transaction.category,
                  )}`}
                >
                  {transaction.category}
                </span>
              </div>
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getTypeClasses(
                  transaction.type,
                )}`}
              >
                {transaction.type === "income" ? "+" : "-"}{" "}
                {transaction.type.charAt(0).toUpperCase() +
                  transaction.type.slice(1)}
              </span>
            </div>

            {transaction.description && (
              <p className="text-sm text-gray-600 mb-2">
                {transaction.description}
              </p>
            )}

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              <p className="font-semibold text-gray-900">
                {formatCurrency(transaction.amount)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                  title="Edit transaction"
                  aria-label="Edit transaction"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(transaction._id || transaction.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                  title="Delete transaction"
                  aria-label="Delete transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

TransactionList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      category: PropTypes.string.isRequired,
      description: PropTypes.string,
      amount: PropTypes.number.isRequired,
      type: PropTypes.oneOf(["income", "expense"]).isRequired,
    }),
  ),
  loading: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string,
};

export default TransactionList;
