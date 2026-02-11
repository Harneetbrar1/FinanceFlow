import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import { BarChart3, Plus, TrendingDown } from "lucide-react";

/**
 * Budgets Page
 *
 * Features:
 * - Overall budget summary
 * - Category-based budget tracking
 * - Progress indicators with color coding (green/yellow/red)
 * - Add/Edit budget functionality
 * - Responsive design
 * - Placeholder for upcoming features
 *
 * TODO: Hook up to backend API for real budget data
 * TODO: Implement budget CRUD operations
 * TODO: Add budget alerts/notifications
 * TODO: Add monthly budget comparison chart
 */
export function Budgets() {
  const [budgets] = useState([
    { category: "Groceries", budget: 400, spent: 340, id: 1 },
    { category: "Entertainment", budget: 100, spent: 125, id: 2 },
    { category: "Utilities", budget: 200, spent: 180, id: 3 },
    { category: "Transportation", budget: 150, spent: 140, id: 4 },
  ]);

  /**
   * Determine progress bar color based on spending percentage
   * Green: 0-75%
   * Yellow: 75-100%
   * Red: 100%+
   */
  const getProgressColor = (spent, budget) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return "bg-danger-600";
    if (percentage > 75) return "bg-warning-600";
    return "bg-success-600";
  };

  /**
   * Calculate total budget and spending
   */
  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

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
              <button className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {budgets.map((budget) => {
                const percentage = Math.min(
                  (budget.spent / budget.budget) * 100,
                  100,
                );
                const isOver = budget.spent > budget.budget;

                return (
                  <div key={budget.id} className="card p-6">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {budget.category}
                      </h3>
                      <button className="text-gray-400 hover:text-gray-600 transition">
                        ⋮
                      </button>
                    </div>

                    {/* Spending Summary */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ${budget.spent.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          of ${budget.budget.toLocaleString()}
                        </p>
                      </div>
                      <div
                        className={`
                          text-center px-3 py-1 rounded-lg
                          ${isOver ? "bg-danger-50 text-danger-700" : "bg-success-50 text-success-700"}
                        `}
                      >
                        <p className="font-semibold text-sm">
                          {isOver ? "Over" : "On track"}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${getProgressColor(budget.spent, budget.budget)} h-3 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Percentage */}
                    <div className="text-right text-sm text-gray-600">
                      {Math.round(percentage)}% used
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {budgets.length === 0 && (
              <div className="card p-12">
                <div className="text-center">
                  <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-900">
                    No budgets yet
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Create your first budget to monitor spending
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Budgets;
