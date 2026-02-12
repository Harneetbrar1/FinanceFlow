import React, { useState } from "react";
import PropTypes from "prop-types";
import { Filter, X } from "lucide-react";

/**
 * TransactionFilter Component
 *
 * Filter transactions by date range, category, and type.
 * Follows DRY principle - reusable across multiple pages.
 *
 * Features:
 * - Filter by month
 * - Filter by category
 * - Filter by type (income/expense)
 * - Clear filters
 * - Responsive design
 *
 * @param {Function} onFilterChange - Callback with filter params
 * @param {Function} onClear - Callback when clearing filters
 * @param {Object} currentFilters - Current filter values
 * @param {Array} categories - Available categories
 */
export function TransactionFilter({
  onFilterChange = () => {},
  onClear = () => {},
  currentFilters = {},
  categories = [],
}) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentFilters.month || currentDate.getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState(
    currentFilters.year || currentDate.getFullYear(),
  );
  const [selectedCategory, setSelectedCategory] = useState(
    currentFilters.category || "all",
  );
  const [selectedType, setSelectedType] = useState(
    currentFilters.type || "all",
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate year options (current year ± 2 years)
  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 2 + i,
  );

  /**
   * Handle filter changes
   */
  const handleFilterChange = (filters) => {
    onFilterChange(filters);
  };

  /**
   * Handle month change
   */
  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    handleFilterChange({
      month,
      year: selectedYear,
      category: selectedCategory,
      type: selectedType,
    });
  };

  /**
   * Handle year change
   */
  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    handleFilterChange({
      month: selectedMonth,
      year,
      category: selectedCategory,
      type: selectedType,
    });
  };

  /**
   * Handle category change
   */
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    handleFilterChange({
      month: selectedMonth,
      year: selectedYear,
      category,
      type: selectedType,
    });
  };

  /**
   * Handle type change
   */
  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    handleFilterChange({
      month: selectedMonth,
      year: selectedYear,
      category: selectedCategory,
      type,
    });
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
    setSelectedCategory("all");
    setSelectedType("all");
    onClear();
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = selectedCategory !== "all" || selectedType !== "all";

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            title="Clear all filters"
          >
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label
            htmlFor="year-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Year
          </label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={handleYearChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
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
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label
            htmlFor="type-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Type
          </label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={handleTypeChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>
    </div>
  );
}

TransactionFilter.propTypes = {
  onFilterChange: PropTypes.func,
  onClear: PropTypes.func,
  currentFilters: PropTypes.shape({
    month: PropTypes.number,
    year: PropTypes.number,
    category: PropTypes.string,
    type: PropTypes.string,
  }),
  categories: PropTypes.arrayOf(PropTypes.string),
};

export default TransactionFilter;
