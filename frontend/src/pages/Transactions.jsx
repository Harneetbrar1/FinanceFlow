import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { TransactionStats } from "../components/TransactionStats";
import { TransactionFilter } from "../components/TransactionFilter";
import { TransactionList } from "../components/TransactionList";
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
  const { transactions, loading, error, stats, fetchByMonth } =
    useTransactions();

  // Filter state
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const categories = [
    "Groceries",
    "Entertainment",
    "Utilities",
    "Transportation",
    "Salary",
    "Other",
  ];

  /**
   * Fetch transactions when component mounts or filters change
   */
  useEffect(() => {
    const loadTransactions = async () => {
      // Fetch transactions for selected month
      const data = await fetchByMonth(filterMonth + 1, filterYear);

      // Apply client-side filtering
      let filtered = data || [];

      // Filter by category
      if (filterCategory !== "all") {
        filtered = filtered.filter(
          (t) => t.category.toLowerCase() === filterCategory.toLowerCase(),
        );
      }

      // Filter by type
      if (filterType !== "all") {
        filtered = filtered.filter((t) => t.type === filterType);
      }

      setFilteredTransactions(filtered);
    };

    loadTransactions();
  }, [filterMonth, filterYear, filterCategory, filterType, fetchByMonth]);

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
    console.log("Edit transaction:", transaction);
    // TODO: Day 9 - Open edit modal/form
  };

  /**
   * Handle delete transaction (placeholder)
   */
  const handleDeleteTransaction = (transactionId) => {
    console.log("Delete transaction:", transactionId);
    // TODO: Day 10 - Show confirmation and delete
  };

  /**
   * Handle add transaction (placeholder)
   */
  const handleAddTransaction = () => {
    console.log("Add new transaction");
    // TODO: Day 9 - Open add modal/form
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-auto">
        <div className="container-responsive py-8 md:py-12">
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
                  className="text-red-600 flex-shrink-0 mt-0.5"
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
    </div>
  );
}

export default Transactions;
