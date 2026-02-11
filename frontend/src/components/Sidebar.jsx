import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  DollarSign,
  Home,
  Menu,
  Settings,
  X,
  TrendingUp,
  Calculator,
} from "lucide-react";

/**
 * Sidebar Component
 *
 * Features:
 * - Responsive sidebar with collapsible menu
 * - Mobile-first design with hamburger menu
 * - Active link highlighting
 * - Keyboard navigation support
 * - Accessibility features (ARIA labels, semantic HTML)
 * - Smooth transitions and visual feedback
 *
 * @returns {JSX.Element} Sidebar navigation component
 */
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  // Check if a link is active
  const isActive = (path) => location.pathname === path;

  /**
   * Navigation items with icons and paths
   */
  const navItems = [
    { path: "/dashboard", label: "Overview", icon: Home },
    { path: "/transactions", label: "Transactions", icon: DollarSign },
    { path: "/budgets", label: "Budgets", icon: BarChart3 },
    { path: "/credit-cards", label: "Credit Cards", icon: CreditCard },
    { path: "/calculators", label: "Calculators", icon: Calculator },
    { path: "/emergency-fund", label: "Emergency Fund", icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="fixed bottom-6 right-6 md:hidden z-50 lg:hidden p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors focus-visible:outline-2 focus-visible:outline-primary-400"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out z-40
          md:relative md:top-0 md:transform-none md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          shadow-lg md:shadow-none
        `}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        {/* Sidebar Header */}
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Menu</h2>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 md:p-6 space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
                ${
                  isActive(path)
                    ? "bg-primary-50 text-primary-600 border-l-4 border-primary-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
              onClick={() => setIsOpen(false)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 border-t border-gray-200 bg-gray-50">
          <Link
            to="/settings"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
              ${
                isActive("/settings")
                  ? "bg-primary-50 text-primary-600 font-semibold"
                  : "text-gray-700 hover:bg-white hover:text-gray-900"
              }
            `}
            onClick={() => setIsOpen(false)}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
