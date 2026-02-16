import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { useBudgets } from "../hooks/useBudgets";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

/**
 * Dashboard Page - Main authenticated view
 *
 * Features:
 * - Real-time financial stats from transactions
 * - Recent transactions display
 * - Budget utilization tracking
 * - Quick action links
 * - Responsive design with mobile support
 *
 * Updates (Day 11):
 * - Integrated real transaction data for stats
 * - Display recent transactions (last 5)
 * - Calculate budget utilization from budgets
 * - Removed mock data
 */
export function Dashboard() {
  const { user } = useAuth();
  const {
    transactions,
    stats,
    fetchTransactions,
    loading: transactionsLoading,
  } = useTransactions();
  const { budgets, fetchBudgets, loading: budgetsLoading } = useBudgets();

  useEffect(() => {
    // Fetch all transactions and current month budgets
    fetchTransactions();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    fetchBudgets({ month: currentMonth, year: currentYear });
  }, [fetchTransactions, fetchBudgets]);

  /**
   * Calculate budget utilization percentage
   * Shows what percentage of total budget has been spent
   */
  const calculateBudgetUtilization = () => {
    if (budgets.length === 0) return 0;

    const totalBudget = budgets.reduce((sum, b) => sum + (b.limit || 0), 0);
    if (totalBudget === 0) return 0;

    // Calculate spending per budget category
    const totalSpent = budgets.reduce((sum, budget) => {
      const categorySpending = transactions
        .filter((t) => {
          const transactionDate = new Date(t.date);
          const transactionMonth = transactionDate.getMonth() + 1;
          const transactionYear = transactionDate.getFullYear();

          return (
            t.type === "expense" &&
            t.category.toLowerCase() === budget.category.toLowerCase() &&
            transactionMonth === budget.month &&
            transactionYear === budget.year
          );
        })
        .reduce((acc, t) => acc + (t.amount || 0), 0);

      return sum + categorySpending;
    }, 0);

    return Math.round((totalSpent / totalBudget) * 100);
  };

  /**
   * Format currency for display
   */
  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const budgetUtilization = calculateBudgetUtilization();
  const loading = transactionsLoading || budgetsLoading;

  // Get recent transactions (last 5)
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

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
          {/* Welcome Section */}
          <section className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name || "User"}! 👋
            </h1>
            <p className="text-gray-600">Here's your financial overview</p>
          </section>

          {/* Quick Stats */}
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card
                label="Total Income"
                value={`$${stats.totalIncome.toLocaleString()}`}
                icon={<TrendingUp className="w-5 h-5 text-success-600" />}
                trend="up"
              />
              <Card
                label="Total Expenses"
                value={`$${stats.totalExpense.toLocaleString()}`}
                icon={<TrendingDown className="w-5 h-5 text-danger-600" />}
                trend="down"
              />
              <Card
                label="Balance"
                value={`$${stats.netIncome.toLocaleString()}`}
                icon={<TrendingUp className="w-5 h-5 text-primary-600" />}
              />
              <Card
                label="Budget Used"
                value={`${budgetUtilization}%`}
                icon={<AlertCircle className="w-5 h-5 text-warning-600" />}
              />
            </div>
          </section>

          {/* Main Content Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Larger content area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Transactions */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Transactions
                  </h2>
                  <a
                    href="/transactions"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View All →
                  </a>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  {recentTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction._id || transaction.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                transaction.type === "income"
                                  ? "bg-success-50"
                                  : "bg-danger-50"
                              }`}
                            >
                              {transaction.type === "income" ? (
                                <ArrowUpRight className="w-4 h-4 text-success-600" />
                              ) : (
                                <ArrowDownLeft className="w-4 h-4 text-danger-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {transaction.category}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(transaction.date)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              transaction.type === "income"
                                ? "text-success-600"
                                : "text-danger-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">
                      No transactions yet. Start tracking your finances!
                    </p>
                  )}
                </div>
              </div>

              {/* Spending by Category */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Spending by Category
                </h2>
                <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <p>Chart placeholder - Coming soon</p>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Budget Overview */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Budget Overview
                </h3>
                {budgets.length > 0 ? (
                  <div className="space-y-4">
                    {budgets.slice(0, 3).map((budget) => {
                      const categorySpending = transactions
                        .filter((t) => {
                          const transactionDate = new Date(t.date);
                          const transactionMonth =
                            transactionDate.getMonth() + 1;
                          const transactionYear = transactionDate.getFullYear();

                          return (
                            t.type === "expense" &&
                            t.category.toLowerCase() ===
                              budget.category.toLowerCase() &&
                            transactionMonth === budget.month &&
                            transactionYear === budget.year
                          );
                        })
                        .reduce((sum, t) => sum + (t.amount || 0), 0);

                      const percentage = Math.min(
                        (categorySpending / budget.limit) * 100,
                        100,
                      );
                      const isOverBudget = categorySpending > budget.limit;

                      return (
                        <div key={budget._id || budget.id}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {budget.category}
                            </span>
                            <span className="text-sm text-gray-600">
                              ${categorySpending.toFixed(0)} / $
                              {budget.limit.toFixed(0)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isOverBudget
                                  ? "bg-danger-600"
                                  : percentage > 75
                                    ? "bg-warning-600"
                                    : "bg-success-600"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No budgets set for this month
                  </p>
                )}
                <a
                  href="/budgets"
                  className="mt-4 block text-center btn-secondary py-2 text-sm"
                >
                  Manage Budgets
                </a>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition text-sm font-medium"
                  >
                    + Add Transaction
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition text-sm font-medium"
                  >
                    + Set Budget
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition text-sm font-medium"
                  >
                    📊 View Reports
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
