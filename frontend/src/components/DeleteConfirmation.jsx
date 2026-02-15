import React from "react";
import PropTypes from "prop-types";
import { Trash2, X } from "lucide-react";

/**
 * DeleteConfirmation Modal Component
 *
 * Provides a safe confirmation dialog before deleting transactions.
 * Prevents accidental deletions with explicit user confirmation.
 *
 * Features:
 * - Clear warning about irreversible action
 * - Displays transaction details (amount, date, category)
 * - Cancel and Confirm buttons
 * - Loading state during deletion
 * - Keyboard support (Escape to cancel)
 *
 * @param {Boolean} isOpen - Controls modal visibility
 * @param {Function} onClose - Callback to close modal
 * @param {Function} onConfirm - Callback on delete confirmation
 * @param {Object} transaction - Transaction to delete { _id, amount, category, date, type }
 * @param {Boolean} isDeleting - Loading state during API call
 */
export function DeleteConfirmation({
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
  transaction = null,
  isDeleting = false,
}) {
  if (!isOpen || !transaction) return null;

  /**
   * Handle confirm deletion - prevents multiple submissions
   */
  const handleConfirm = () => {
    if (!isDeleting) {
      onConfirm(transaction._id);
    }
  };

  /**
   * Handle modal close on backdrop click
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  /**
   * Handle escape key
   */
  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !isDeleting) {
      onClose();
    }
  };

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
   * Get type-based styling
   */
  const getTypeColor = (type) => {
    return type === "income" ? "text-green-600" : "text-red-600";
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-labelledby="delete-confirm-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2
              id="delete-confirm-title"
              className="text-lg font-semibold text-gray-900"
            >
              Delete Transaction?
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Warning Message */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            This action cannot be undone. The transaction will be permanently
            deleted.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="mb-6 space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-600">Amount</span>
            <span
              className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-600">Category</span>
            <span className="text-sm font-medium text-gray-900 capitalize">
              {transaction.category}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-600">Date</span>
            <span className="text-sm font-medium text-gray-900">
              {formatDate(transaction.date)}
            </span>
          </div>
          {transaction.description && (
            <div className="flex justify-between items-start">
              <span className="text-sm text-gray-600">Description</span>
              <span className="text-sm text-gray-700">
                {transaction.description}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteConfirmation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["income", "expense"]).isRequired,
    description: PropTypes.string,
  }),
  isDeleting: PropTypes.bool,
};

export default DeleteConfirmation;
