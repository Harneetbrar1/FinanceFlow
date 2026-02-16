import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

/**
 * Default category list for budgets
 * Should match transaction categories for accurate tracking
 */
const DEFAULT_CATEGORIES = [
  "Groceries",
  "Entertainment",
  "Utilities",
  "Transportation",
  "Dining",
  "Healthcare",
  "Shopping",
  "Other",
];

/**
 * AddBudget Component
 *
 * Modal form for creating new budgets.
 * Features:
 * - Category selection (matches transaction categories)
 * - Budget limit input with validation
 * - Month/year selection
 * - Form validation with user-friendly error messages
 * - Loading state during submission
 * - Keyboard support (Escape to close)
 *
 * Note: Per Day 11 requirements, this component only handles ADD (no edit mode)
 *
 * @component
 * @param {Object} props
 * @param {Boolean} props.isOpen - Controls modal visibility
 * @param {Array} props.categories - Optional custom category list
 * @param {Function} props.onSubmit - Submit handler (receives budget data)
 * @param {Function} props.onClose - Close handler
 * @param {Boolean} props.isSubmitting - Disable form during submission
 */
export function AddBudget({
  isOpen,
  categories,
  onSubmit,
  onClose,
  isSubmitting = false,
}) {
  // Use provided categories or default list
  const categoryOptions = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    return DEFAULT_CATEGORIES;
  }, [categories]);

  // Get current month/year as defaults
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed
  const currentYear = currentDate.getFullYear();

  // Form state
  const [formData, setFormData] = useState({
    category: categoryOptions[0] || "Other",
    limit: "",
    month: currentMonth,
    year: currentYear,
  });

  const [formError, setFormError] = useState("");

  // Don't render if modal is closed
  if (!isOpen) {
    return null;
  }

  /**
   * Handle input changes
   * Clears form error when user starts typing
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (formError) {
      setFormError("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Validate form data before submission
   * @returns {String|null} - Error message or null if valid
   */
  const validateForm = () => {
    if (!formData.limit || Number(formData.limit) <= 0) {
      return "Budget limit must be greater than zero";
    }
    if (!formData.category) {
      return "Category is required";
    }
    if (!formData.month || formData.month < 1 || formData.month > 12) {
      return "Valid month is required (1-12)";
    }
    if (!formData.year || formData.year < 2020) {
      return "Valid year is required";
    }
    return null;
  };

  /**
   * Handle form submission
   * Validates data and calls onSubmit callback
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    // Convert to proper types before submission
    const budgetData = {
      category: formData.category,
      limit: parseFloat(formData.limit),
      month: parseInt(formData.month, 10),
      year: parseInt(formData.year, 10),
    };

    onSubmit(budgetData);
  };

  /**
   * Handle modal close
   * Resets form and clears errors
   */
  const handleClose = () => {
    setFormData({
      category: categoryOptions[0] || "Other",
      limit: "",
      month: currentMonth,
      year: currentYear,
    });
    setFormError("");
    onClose();
  };

  /**
   * Handle Escape key to close modal
   */
  const handleKeyDown = (event) => {
    if (event.key === "Escape" && !isSubmitting) {
      handleClose();
    }
  };

  /**
   * Prevent backdrop click from closing during submission
   */
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-budget-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="add-budget-title" className="text-xl font-bold text-gray-900">
            Add New Budget
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {formError && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-md">
              <p className="text-sm text-danger-800">{formError}</p>
            </div>
          )}

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Limit */}
          <div>
            <label
              htmlFor="limit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Budget Limit ($)
            </label>
            <input
              type="number"
              id="limit"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>

          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Month
              </label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleDateString("en-US", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Year
              </label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                {Array.from({ length: 5 }, (_, i) => currentYear + i).map(
                  (y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddBudget.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string),
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default AddBudget;
