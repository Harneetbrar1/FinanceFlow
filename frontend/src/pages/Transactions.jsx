import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/Card";
import { DollarSign, Plus, Filter } from "lucide-react";

/**
 * Transactions Page
 *
 * Features:
 * - Complete transaction list view
 * - Filter by month and category
 * - Income vs expense summary
 * - Add transaction button
 * - Responsive design
 * - Placeholder state for upcoming features
 *
 * TODO: Hook up to backend API for real transaction data
 * TODO: Add Edit/Delete transaction functionality
 * TODO: Add export transactions feature
 */
export function Transactions() {
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = [
    "All",
    "Groceries",
    "Entertainment",
    "Utilities",
    "Transportation",
    "Salary",
    "Other",
  ];

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
              <button className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                <Plus size={20} />
                Add Transaction
              </button>
            </div>
          </section>

          {/* Summary Stats */}
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <Card
                label="Total Income"
                value="$4,500.00"
                icon={<DollarSign className="w-5 h-5 text-success-600" />}
                trend="up"
                trendValue={12}
              />
              <Card
                label="Total Expenses"
                value="$2,800.00"
                icon={<DollarSign className="w-5 h-5 text-danger-600" />}
                trend="down"
                trendValue={8}
              />
              <Card
                label="Net Income"
                value="$1,700.00"
                icon={<DollarSign className="w-5 h-5 text-primary-600" />}
              />
            </div>
          </section>

          {/* Filters Section */}
          <section className="mb-8">
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Month Filter */}
                <div>
                  <label
                    htmlFor="month-filter"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Month
                  </label>
                  <select
                    id="month-filter"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={0}>January</option>
                    <option value={1}>February</option>
                    <option value={2}>March</option>
                    <option value={3}>April</option>
                    <option value={4}>May</option>
                    <option value={5}>June</option>
                    <option value={6}>July</option>
                    <option value={7}>August</option>
                    <option value={8}>September</option>
                    <option value={9}>October</option>
                    <option value={10}>November</option>
                    <option value={11}>December</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label
                    htmlFor="category-filter"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category-filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Transactions List */}
          <section>
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Transaction History
              </h2>
              <div className="overflow-x-auto">
                <div className="h-64 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <DollarSign
                      size={48}
                      className="mx-auto mb-4 text-gray-400"
                    />
                    <p className="text-lg font-medium">No transactions yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Start by adding your first transaction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Transactions;
