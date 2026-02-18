import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const DEFAULT_CATEGORIES = [
  "Groceries",
  "Entertainment",
  "Utilities",
  "Transportation",
  "Salary",
  "Other",
];

const formatDateInput = (value) => {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
};

/**
 * TransactionForm Component
 *
 * Modal form for adding and editing transactions.
 *
 * @param {boolean} isOpen - Controls modal visibility
 * @param {string} mode - "add" or "edit"
 * @param {object|null} initialData - Existing transaction data for edit
 * @param {array} categories - Category list
 * @param {function} onSubmit - Submit handler
 * @param {function} onClose - Close handler
 * @param {boolean} isSubmitting - Disable actions while submitting
 */
export function TransactionForm({
  isOpen,
  mode,
  initialData,
  categories,
  onSubmit,
  onClose,
  isSubmitting,
}) {
  const categoryOptions = useMemo(() => {
    if (Array.isArray(categories) && categories.length > 0) {
      return categories;
    }
    return DEFAULT_CATEGORIES;
  }, [categories]);

  const createInitialFormData = () => {
    if (mode === "edit" && initialData) {
      return {
        amount: String(initialData.amount ?? ""),
        category: initialData.category || categoryOptions[0] || "Other",
        type: initialData.type || "expense",
        date: formatDateInput(initialData.date),
        description: initialData.description || "",
      };
    }

    return {
      amount: "",
      category: categoryOptions[0] || "Other",
      type: "expense",
      date: formatDateInput(),
      description: "",
    };
  };

  const [formData, setFormData] = useState(createInitialFormData);

  const [formError, setFormError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (formError) {
      setFormError("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const amount = Number(formData.amount);
    if (!formData.amount || amount <= 0) {
      return "Amount must be greater than zero.";
    }
    if (amount > 250000) {
      return "Amount cannot exceed $250,000.";
    }
    if (!formData.category) {
      return "Category is required.";
    }
    if (!formData.type) {
      return "Type is required.";
    }
    if (!formData.date) {
      return "Date is required.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");

    await onSubmit({
      amount: Number(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date,
      description: formData.description.trim(),
    });
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-form-title"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2
            id="transaction-form-title"
            className="text-xl font-semibold text-gray-900"
          >
            {mode === "edit" ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                max="250000"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a short note about this transaction"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-5 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                  ? "Update Transaction"
                  : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

TransactionForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["add", "edit"]).isRequired,
  initialData: PropTypes.shape({
    amount: PropTypes.number,
    category: PropTypes.string,
    type: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    description: PropTypes.string,
  }),
  categories: PropTypes.arrayOf(PropTypes.string),
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

TransactionForm.defaultProps = {
  initialData: null,
  categories: DEFAULT_CATEGORIES,
  isSubmitting: false,
};

export default TransactionForm;
