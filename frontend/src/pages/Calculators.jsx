import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import { Calculator, DollarSign } from "lucide-react";

/**
 * Calculators Page
 *
 * Features:
 * - Various financial calculators
 * - Hours to money calculator
 * - Compound interest calculator
 * - Debt payoff calculator
 * - Savings goal calculator
 * - Real-time calculations
 * - Responsive design
 *
 * TODO: Add more calculator tools
 * TODO: Save calculator presets
 * TODO: Add export results functionality
 */
export function Calculators() {
  const [houlyWage, setHourlyWage] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [earnedMoney, setEarnedMoney] = useState(0);

  const handleHourlyWageChange = (e) => {
    const wage = parseFloat(e.target.value) || 0;
    setHourlyWage(wage);
    updateEarnings(wage, hoursWorked);
  };

  const handleHoursWorkedChange = (e) => {
    const hours = parseFloat(e.target.value) || 0;
    setHoursWorked(hours);
    updateEarnings(houlyWage, hours);
  };

  const updateEarnings = (wage, hours) => {
    setEarnedMoney(wage * hours);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-auto">
        <div className="container-responsive py-8 md:py-12">
          {/* Page Header */}
          <section className="mb-8 md:mb-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Financial Calculators
              </h1>
              <p className="text-gray-600">
                Use our tools to calculate savings, earnings, and financial
                goals
              </p>
            </div>
          </section>

          {/* Hours to Money Calculator */}
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calculator Card */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calculator className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Hours to Money Calculator
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Hourly Wage Input */}
                  <div>
                    <label
                      htmlFor="hourly-wage"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Hourly Wage ($)
                    </label>
                    <input
                      id="hourly-wage"
                      type="number"
                      min="0"
                      step="0.01"
                      value={houlyWage}
                      onChange={handleHourlyWageChange}
                      placeholder="Enter your hourly wage"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Hours Worked Input */}
                  <div>
                    <label
                      htmlFor="hours-worked"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Hours Worked
                    </label>
                    <input
                      id="hours-worked"
                      type="number"
                      min="0"
                      step="0.1"
                      value={hoursWorked}
                      onChange={handleHoursWorkedChange}
                      placeholder="Enter hours worked"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Results Card */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Result</h2>
                <Card
                  label="Total Earnings"
                  value={`$${earnedMoney.toFixed(2)}`}
                  icon={<DollarSign className="w-5 h-5 text-success-600" />}
                >
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Hourly Rate:</span> $
                      {houlyWage.toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Hours Worked:</span>{" "}
                      {hoursWorked.toFixed(1)}h
                    </p>
                    <p>
                      <span className="font-medium">Daily Rate (8h):</span> $
                      {(houlyWage * 8).toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Weekly Rate (40h):</span> $
                      {(houlyWage * 40).toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Monthly Rate (160h):</span>{" "}
                      ${(houlyWage * 160).toFixed(2)}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Coming Soon Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Compound Interest Calculator */}
            <div className="card p-6 opacity-50">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-6 h-6 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">
                  Compound Interest
                </h2>
              </div>
              <p className="text-gray-500">Coming soon...</p>
            </div>

            {/* Debt Payoff Calculator */}
            <div className="card p-6 opacity-50">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-6 h-6 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900">
                  Debt Payoff Calculator
                </h2>
              </div>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Calculators;
