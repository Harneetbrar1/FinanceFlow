import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable Card Component
 *
 * A flexible card component for displaying stats, metrics, and information.
 *
 * Features:
 * - Conditional trend indicator (up/down)
 * - Icon support
 * - Responsive design
 * - Tailwind styling for consistency
 * - Accessibility features (semantic HTML, proper contrast)
 *
 * @param {string} label - The label/title for the stat
 * @param {string|number} value - The main value to display
 * @param {JSX.Element} icon - Icon component from lucide-react
 * @param {string} trend - Optional trend indicator: 'up' or 'down'
 * @param {number} trendValue - Optional percentage value for the trend
 * @param {string} className - Optional custom classes
 * @param {JSX.Element} children - Optional children content
 * @returns {JSX.Element} Card component
 */
export function Card({
  label,
  value,
  icon,
  trend,
  trendValue,
  className = "",
  children,
}) {
  // Display trend value (use provided value or default to 0)
  const displayTrendValue = trendValue || 0;

  // CSS classes for the card container
  const cardClasses = `
    stat-card rounded-lg border border-gray-200 bg-white p-6 
    shadow-sm hover:shadow-md transition-shadow duration-300
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {/* Card Header with Icon and Content */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {/* Label */}
          <p className="stat-label text-sm font-medium text-gray-600 mb-1">
            {label}
          </p>

          {/* Main Value */}
          <p className="stat-value text-2xl md:text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        {/* Icon on the right */}
        {icon && <div className="shrink-0 ml-4">{icon}</div>}
      </div>

      {/* Trend Indicator */}
      {trend && (
        <p
          className={`
            stat-change text-sm font-medium mt-2
            ${trend === "up" ? "positive text-success-600" : "negative text-danger-600"}
          `}
        >
          {trend === "up" ? "↑" : "↓"}{" "}
          <span className="font-semibold">{displayTrendValue}%</span> from last
          month
        </p>
      )}

      {/* Optional children content */}
      {children && (
        <div className="mt-4 pt-4 border-t border-gray-200">{children}</div>
      )}
    </div>
  );
}

Card.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element,
  trend: PropTypes.oneOf(["up", "down"]),
  trendValue: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Card;
