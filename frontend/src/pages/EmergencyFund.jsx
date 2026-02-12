import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import { TrendingUp, CheckCircle } from "lucide-react";

/**
 * Emergency Fund Page
 *
 * Features:
 * - Calculate emergency fund targets (4-6 months expenses)
 * - Track current savings progress
 * - Monthly expense input
 * - Visual progress indicators
 * - Time to goal estimation
 * - Responsive design
 *
 * The industry standard is 3-6 months of living expenses
 * This calculator provides options for different levels of financial security.
 *
 * TODO: Hook up to backend API
 * TODO: Add savings rate calculation
 * TODO: Add automated savings tracking
 * TODO: Add goal adjustment over time
 */
export function EmergencyFund() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(3500);
  const [monthlySavingsRate, setMonthlySavingsRate] = useState(500);

  // Calculate targets for different month ranges
  const target4Months = monthlyExpenses * 4;
  const target5Months = monthlyExpenses * 5;
  const target6Months = monthlyExpenses * 6;

  // Calculate progress percentages
  const progress4 =
    monthlyExpenses > 0 ? (currentSavings / target4Months) * 100 : 0;
  const progress5 =
    monthlyExpenses > 0 ? (currentSavings / target5Months) * 100 : 0;
  const progress6 =
    monthlyExpenses > 0 ? (currentSavings / target6Months) * 100 : 0;

  // Calculate months to reach goal
  const monthsTo4 =
    monthlyExpenses > 0 && monthlySavingsRate > 0
      ? Math.ceil((target4Months - currentSavings) / monthlySavingsRate)
      : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-auto">
        <div className="container-responsive py-8 md:py-12">
          {/* Page Header */}
          <section className="mb-8 md:mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Emergency Fund Calculator
              </h1>
              <p className="text-gray-600">
                Build financial security with an emergency fund
              </p>
            </div>
          </section>

          {/* Input Section */}
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inputs Card */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Your Information
                </h2>

                <div className="space-y-4">
                  {/* Monthly Expenses */}
                  <div>
                    <label
                      htmlFor="monthly-expenses"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Monthly Expenses ($)
                    </label>
                    <input
                      id="monthly-expenses"
                      type="number"
                      min="0"
                      step="100"
                      value={monthlyExpenses}
                      onChange={(e) =>
                        setMonthlyExpenses(parseFloat(e.target.value) || 0)
                      }
                      placeholder="Enter your monthly expenses"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Current Savings */}
                  <div>
                    <label
                      htmlFor="current-savings"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Current Emergency Savings ($)
                    </label>
                    <input
                      id="current-savings"
                      type="number"
                      min="0"
                      step="100"
                      value={currentSavings}
                      onChange={(e) =>
                        setCurrentSavings(parseFloat(e.target.value) || 0)
                      }
                      placeholder="How much have you saved?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Monthly Savings Rate */}
                  <div>
                    <label
                      htmlFor="monthly-savings"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Monthly Savings Rate ($)
                    </label>
                    <input
                      id="monthly-savings"
                      type="number"
                      min="0"
                      step="50"
                      value={monthlySavingsRate}
                      onChange={(e) =>
                        setMonthlySavingsRate(parseFloat(e.target.value) || 0)
                      }
                      placeholder="How much can you save monthly?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Summary
                </h2>

                <div className="space-y-4">
                  <Card
                    label="Current Savings"
                    value={`$${currentSavings.toLocaleString()}`}
                    icon={<TrendingUp className="w-5 h-5 text-primary-600" />}
                  />

                  {monthlyExpenses > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Time to 4-Month Goal:
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {monthsTo4} months
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        At ${monthlySavingsRate}/month
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Goals Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Emergency Fund Goals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 4 Months Goal */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle
                    size={24}
                    className={
                      progress4 >= 100 ? "text-success-600" : "text-gray-400"
                    }
                  />
                  <h3 className="text-lg font-bold text-gray-900">
                    4 Months Goal
                  </h3>
                </div>

                <p className="text-3xl font-bold text-gray-900 mb-2">
                  ${target4Months.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  (Minimum recommended)
                </p>

                {monthlyExpenses > 0 && (
                  <>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress4, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.round(Math.min(progress4, 100))}% complete
                    </p>
                  </>
                )}
              </div>

              {/* 5 Months Goal */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle
                    size={24}
                    className={
                      progress5 >= 100 ? "text-success-600" : "text-gray-400"
                    }
                  />
                  <h3 className="text-lg font-bold text-gray-900">
                    5 Months Goal
                  </h3>
                </div>

                <p className="text-3xl font-bold text-gray-900 mb-2">
                  ${target5Months.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-4">(Good safety net)</p>

                {monthlyExpenses > 0 && (
                  <>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-success-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress5, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.round(Math.min(progress5, 100))}% complete
                    </p>
                  </>
                )}
              </div>

              {/* 6 Months Goal */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle
                    size={24}
                    className={
                      progress6 >= 100 ? "text-success-600" : "text-gray-400"
                    }
                  />
                  <h3 className="text-lg font-bold text-gray-900">
                    6 Months Goal
                  </h3>
                </div>

                <p className="text-3xl font-bold text-gray-900 mb-2">
                  ${target6Months.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-4">(Maximum security)</p>

                {monthlyExpenses > 0 && (
                  <>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-success-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress6, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.round(Math.min(progress6, 100))}% complete
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default EmergencyFund;
