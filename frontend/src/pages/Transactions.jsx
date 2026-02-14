import React, { useCallback, useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { TransactionStats } from "../components/TransactionStats";
import { TransactionFilter } from "../components/TransactionFilter";
import { TransactionList } from "../components/TransactionList";
import { TransactionForm } from "../components/TransactionForm";
import { Toast } from "../components/Toast";
import { Plus, AlertCircle } from "lucide-react";
import { useTransactions } from "../hooks/useTransactions";

/**
 * Transactions Page
 *
 * Fully functional transaction management interface.
 *
 * Features:
 * ✅ Real transaction list from API
 * ✅ Filter by month, year, category, and type
 * ✅ Income vs expense summary with calculations
 * ✅ Loading and error states
 * ✅ Responsive design (table on desktop, cards on mobile)
 * ✅ Edit/Delete placeholder callbacks
 * ✅ Add transaction button
 *
 * Day 8 Implementation Status:
 * ✅ GET all transactions
 * ✅ Fetch by month with filters
 * ✅ Calculate and display totals
 * ✅ Handle loading states
 * ✅ Handle error states
 * 🔄 TODO (Day 9): Add/Edit transaction forms
 * 🔄 TODO (Day 10): Delete with confirmation
 */
export function Transactions() {
  // Hooks
  const {
    loading,
    error,
    stats,
    fetchByMonth,
    createTransaction,
    updateTransaction,
  } = useTransactions();

  // Filter state
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [activeTransaction, setActiveTransaction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const categories = [
    "Groceries",
    "Entertainment",
    "Utilities",
    "Transportation",
    "Salary",
    "Other",
  ];

  const applyFilters = useCallback(
    (data) => {
      let filtered = data || [];

      if (filterCategory !== "all") {
        filtered = filtered.filter(
          (t) => t.category.toLowerCase() === filterCategory.toLowerCase(),
        );
      }

      if (filterType !== "all") {
        filtered = filtered.filter((t) => t.type === filterType);
      }

      setFilteredTransactions(filtered);
      return filtered;
    },
    [filterCategory, filterType],
  );

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Fetch transactions when component mounts or filters change
   */
  useEffect(() => {
    const loadTransactions = async () => {
      // Fetch transactions for selected month
      const data = await fetchByMonth(filterMonth + 1, filterYear);
      applyFilters(data);
    };

    loadTransactions();
  }, [filterMonth, filterYear, fetchByMonth, applyFilters]);

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filters) => {
    setFilterMonth(filters.month);
    setFilterYear(filters.year);
    setFilterCategory(filters.category);
    setFilterType(filters.type);
  };

  /**
   * Handle filter clear
   */
  const handleClearFilters = () => {
    const now = new Date();
    setFilterMonth(now.getMonth());
    setFilterYear(now.getFullYear());
    setFilterCategory("all");
    setFilterType("all");
  };

  /**
   * Handle edit transaction (placeholder)
   */
  const handleEditTransaction = (transaction) => {
    setActiveTransaction(transaction);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  /**
   * Handle delete transaction (placeholder)
   */
  const handleDeleteTransaction = (transactionId) => {
    addToast("Delete is planned for Day 10.", "info");
    return transactionId;
  };

  /**
   * Handle add transaction (placeholder)
   */
  const handleAddTransaction = () => {
    setActiveTransaction(null);
    setFormMode("add");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setActiveTransaction(null);
  };

  const handleSubmitForm = async (payload) => {
    setIsSubmitting(true);

    const result =
      formMode === "edit" && activeTransaction
        ? await updateTransaction(
            activeTransaction._id || activeTransaction.id,
            payload,
          )
        : await createTransaction(payload);

    if (!result.success) {
      addToast(result.message || "Something went wrong.", "error");
      setIsSubmitting(false);
      return;
    }

    addToast(
      formMode === "edit"
        ? "Transaction updated successfully."
        : "Transaction added successfully.",
      "success",
    );

    const refreshed = await fetchByMonth(filterMonth + 1, filterYear);
    applyFilters(refreshed);

    setIsSubmitting(false);
    handleCloseForm();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-auto">
        <div className="container-responsive py-8 md:py-12">
          <div className="fixed top-4 right-4 z-50 space-y-3">
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </div>
          {/* Page Header */}
          <section className="mb-8 md:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Transactions
                </h1>
                <p className="text-gray-600">
                  Track and manage your income and expenses
                </p>
              </div>
              <button
                onClick={handleAddTransaction}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Plus size={20} />
                Add Transaction
              </button>
            </div>
          </section>

          {/* Error Alert */}
          {error && (
            <section className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle
                  className="text-red-600 shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <p className="font-semibold text-red-900">
                    Error loading transactions
                  </p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </section>
          )}

          {/* Summary Stats */}
          <section className="mb-8 md:mb-12">
            <TransactionStats stats={stats} loading={loading} />
          </section>

          {/* Filters Section */}
          <section className="mb-8">
            <TransactionFilter
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
              currentFilters={{
                month: filterMonth,
                year: filterYear,
                category: filterCategory,
                type: filterType,
              }}
              categories={categories}
            />
          </section>

          {/* Transactions List */}
          <section>
            <TransactionList
              transactions={filteredTransactions}
              loading={loading}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </section>
        </div>
      </main>

      <TransactionForm
        key={`${formMode}-${activeTransaction?._id || activeTransaction?.id || "new"}`}
        isOpen={isFormOpen}
        mode={formMode}
        initialData={activeTransaction}
        categories={categories}
        onSubmit={handleSubmitForm}
        onClose={handleCloseForm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default Transactions;
