import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { useBudgets } from "../hooks/useBudgets";
import { useBudgetCalculations } from "../hooks/useBudgetCalculations";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import { DashboardSkeleton } from "../components/LoadingSkeleton";
import { formatCurrency, formatDate } from "../utils/formatters";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  BarChart3,
  Wallet,
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
 * - Loading skeletons for better UX
 * - Optimized performance with useMemo
 *
 * Updates (Day 11):
 * - Integrated real transaction data for stats
 * - Display recent transactions (last 5)
 * - Calculate budget utilization from budgets
 * - Removed mock data
 *
 * Updates (Day 12):
 * - Extracted formatting utils (DRY principle)
 * - Created useBudgetCalculations hook (DRY principle)
 * - Added loading skeletons
 * - Fixed Quick Actions navigation
 * - Optimized with useMemo
 * - Improved empty states
 * - Enhanced responsiveness
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
  const { calculateTotalUtilization, getEnrichedBudgets, getProgressColor } =
    useBudgetCalculations(budgets, transactions);

  useEffect(() => {
    // Fetch all transactions and current month budgets
    fetchTransactions();

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    fetchBudgets({ month: currentMonth, year: currentYear });
  }, []);

  // Memoized calculations for performance
  const recentTransactions = useMemo(() => {
    return transactions
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const enrichedBudgets = useMemo(() => {
    return getEnrichedBudgets.slice(0, 3); // Show top 3 budgets
  }, [getEnrichedBudgets]);

  const budgetUtilization = useMemo(() => {
    return calculateTotalUtilization;
  }, [calculateTotalUtilization]);

  const loading = transactionsLoading || budgetsLoading;

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main id="main-content" className="flex-1 overflow-auto">
          <DashboardSkeleton />
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
                  <Link
                    to="/transactions"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                  >
                    View All →
                  </Link>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  {recentTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {recentTransactions.map((transaction) => (
                        <div
                          key={transaction._id || transaction.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
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
                            {formatCurrency(transaction.amount, true)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium mb-1">
                        No transactions yet
                      </p>
                      <p className="text-sm text-gray-400 mb-4">
                        Start tracking your finances by adding your first
                        transaction
                      </p>
                      <Link
                        to="/transactions"
                        className="inline-flex items-center gap-2 btn-primary px-4 py-2 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Transaction
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Spending by Category */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Spending by Category
                </h2>
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                  <BarChart3 className="w-12 h-12 mb-3" />
                  <p className="font-medium">Chart Coming Soon</p>
                  <p className="text-sm mt-1">
                    Visualize your spending patterns
                  </p>
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
                {enrichedBudgets.length > 0 ? (
                  <div className="space-y-4">
                    {enrichedBudgets.map((budget) => (
                      <div key={budget._id || budget.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {budget.category}
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatCurrency(budget.spent)} /{" "}
                            {formatCurrency(budget.limit)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(
                              budget.status,
                            )}`}
                            style={{
                              width: `${Math.min(budget.percentage, 100)}%`,
                            }}
                          ></div>
                        </div>
                        {budget.isOverBudget && (
                          <p className="text-xs text-danger-600 mt-1">
                            Over budget by{" "}
                            {formatCurrency(budget.spent - budget.limit)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      No budgets set
                    </p>
                    <p className="text-xs text-gray-400">
                      Create budgets to track spending
                    </p>
                  </div>
                )}
                <Link
                  to="/budgets"
                  className="mt-4 block text-center btn-secondary py-2 text-sm"
                >
                  Manage Budgets
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/transactions"
                    className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Transaction
                  </Link>
                  <Link
                    to="/budgets"
                    className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition text-sm font-medium"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Set Budget
                  </Link>
                  <Link
                    to="/transactions"
                    className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition text-sm font-medium"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Reports
                  </Link>
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
