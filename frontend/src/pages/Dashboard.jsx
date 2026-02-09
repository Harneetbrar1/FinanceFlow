import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

/**
 * Dashboard Page - Main authenticated view
 * Shows financial overview and quick stats
 */
export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    budgetUtilization: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    const loadStats = async () => {
      try {
        // TODO: Fetch real data from API
        setStats({
          totalIncome: 4500,
          totalExpenses: 2800,
          balance: 1700,
          budgetUtilization: 65,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <main id="main-content" className="container-responsive py-8 md:py-12">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="container-responsive py-8 md:py-12">
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
          <StatCard
            label="Total Income"
            value={`$${stats.totalIncome.toLocaleString()}`}
            icon={<TrendingUp className="w-5 h-5 text-success-600" />}
            trend="up"
          />
          <StatCard
            label="Total Expenses"
            value={`$${stats.totalExpenses.toLocaleString()}`}
            icon={<TrendingDown className="w-5 h-5 text-danger-600" />}
            trend="down"
          />
          <StatCard
            label="Balance"
            value={`$${stats.balance.toLocaleString()}`}
            icon={<TrendingUp className="w-5 h-5 text-primary-600" />}
          />
          <StatCard
            label="Budget Used"
            value={`${stats.budgetUtilization}%`}
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
              <p className="text-center py-8 text-gray-500">
                No transactions yet. Start tracking your finances!
              </p>
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
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Groceries
                  </span>
                  <span className="text-sm text-gray-600">$340 / $400</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-success-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Entertainment
                  </span>
                  <span className="text-sm text-gray-600">$125 / $100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-warning-600 h-2 rounded-full"
                    style={{ width: "125%" }}
                  ></div>
                </div>
              </div>
            </div>
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
    </main>
  );
}

/**
 * Stat Card Component
 */
function StatCard({ label, value, icon, trend }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
        </div>
        <div className="flex-shrink-0">{icon}</div>
      </div>
      {trend && (
        <p
          className={`stat-change ${trend === "up" ? "positive" : "negative"}`}
        >
          {trend === "up" ? "↑" : "↓"}{" "}
          {Math.abs(Math.floor(Math.random() * 15 + 5))}% from last month
        </p>
      )}
    </div>
  );
}

export default Dashboard;
