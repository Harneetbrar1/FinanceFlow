import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import { BudgetList } from "../components/BudgetList";
import { AddBudget } from "../components/AddBudget";
import { Toast } from "../components/Toast";
import { useBudgets } from "../hooks/useBudgets";
import { useTransactions } from "../hooks/useTransactions";
import { BarChart3, Plus, TrendingDown } from "lucide-react";

/**
 * Budgets Page
 *
 * Features:
 * - Real-time budget tracking with API integration
 * - Current month budgets displayed by default
 * - Category-based budget tracking with spending calculation
 * - Progress indicators with color coding (green/yellow/red)
 * - Add budget functionality (no edit/delete per Day 11 scope)
 * - Responsive design
 * - Loading and error states
 *
 * Implementation:
 * - Uses useBudgets hook for budget data
 * - Uses useTransactions hook for spending calculation
 * - BudgetList component displays budgets with real-time spending
 * - AddBudget modal for creating new budgets
 */
export function Budgets() {
  const {
    budgets,
    loading: budgetsLoading,
    fetchBudgets,
    createBudget,
  } = useBudgets();
  const {
    transactions,
    loading: transactionsLoading,
    fetchTransactions,
  } = useTransactions();

  const [addBudgetOpen, setAddBudgetOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  /**
   * Fetch budgets and transactions on component mount
   * Defaults to current month for focused view
   */
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    fetchBudgets({ month: currentMonth, year: currentYear });
    fetchTransactions();
  }, [fetchBudgets, fetchTransactions]);

  /**
   * Calculate spending per category from transactions
   * @param {String} category - Category name
   * @param {Number} month - Month number (1-12)
   * @param {Number} year - Year
   * @returns {Number} - Total spending for category in that month
   */
  const calculateSpending = (category, month, year) => {
    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const transactionMonth = transactionDate.getMonth() + 1;
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
   * Calculate total budget and spending across all budgets
   */
  const totalBudget = budgets.reduce((sum, b) => sum + (b.limit || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => {
    const spent = calculateSpending(b.category, b.month, b.year);
    return sum + spent;
  }, 0);
  const totalRemaining = totalBudget - totalSpent;

  /**
   * Handle opening the AddBudget modal
   */
  const handleAddBudgetClick = () => {
    setAddBudgetOpen(true);
  };

  /**
   * Handle closing the AddBudget modal
   */
  const handleCloseAddBudget = () => {
    setAddBudgetOpen(false);
  };

  /**
   * Handle budget creation
   * Creates budget via API and refreshes list
   * @param {Object} budgetData - Budget data from form
   */
  const handleCreateBudget = async (budgetData) => {
    setIsCreating(true);

    const result = await createBudget(budgetData);

    if (result.success) {
      setToast({
        show: true,
        message: `Budget for ${budgetData.category} created successfully!`,
        type: "success",
      });
      setAddBudgetOpen(false);

      // Refresh budgets to show the new one
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      fetchBudgets({ month: currentMonth, year: currentYear });
    } else {
      setToast({
        show: true,
        message: result.message || "Failed to create budget",
        type: "error",
      });
    }

    setIsCreating(false);
  };

  /**
   * Handle toast close
   */
  const handleCloseToast = () => {
    setToast({ ...toast, show: false });
  };

  // Loading state
  const loading = budgetsLoading || transactionsLoading;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main id="main-content" className="flex-1 overflow-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </main>
      </div>
    );
  }

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
                  Budgets
                </h1>
                <p className="text-gray-600">
                  Monitor and control your spending
                </p>
              </div>
              <button
                onClick={handleAddBudgetClick}
                className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Plus size={20} />
                Add Budget
              </button>
            </div>
          </section>

          {/* Budget Summary */}
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card
                label="Total Budget"
                value={`$${totalBudget.toLocaleString()}`}
                icon={<BarChart3 className="w-5 h-5 text-primary-600" />}
              />
              <Card
                label="Total Spent"
                value={`$${totalSpent.toLocaleString()}`}
                icon={<TrendingDown className="w-5 h-5 text-danger-600" />}
              />
              <Card
                label="Remaining"
                value={`$${totalRemaining.toLocaleString()}`}
                icon={
                  <BarChart3
                    className={`w-5 h-5 ${totalRemaining > 0 ? "text-success-600" : "text-danger-600"}`}
                  />
                }
              />
            </div>
          </section>

          {/* Budgets List */}
          <section>
            <BudgetList budgets={budgets} transactions={transactions} />
          </section>
        </div>
      </main>

      {/* AddBudget Modal */}
      <AddBudget
        isOpen={addBudgetOpen}
        onSubmit={handleCreateBudget}
        onClose={handleCloseAddBudget}
        isSubmitting={isCreating}
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
    </div>
  );
}

export default Budgets;
