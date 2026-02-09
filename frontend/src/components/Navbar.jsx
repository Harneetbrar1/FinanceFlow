import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, Home, Settings } from "lucide-react";

/**
 * Navbar component with sticky positioning
 * Features:
 * - Sticky header that stays on top while scrolling
 * - Mobile-responsive hamburger menu
 * - Accessibility: ARIA labels, keyboard navigation, focus management
 * - Dark mode ready
 * - Responsive design for all screen sizes
 */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-skip-link">
        Skip to main content
      </a>

      {/* Sticky navigation header */}
      <header
        className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm"
        role="banner"
      >
        <nav
          className="container-responsive flex items-center justify-between h-16 md:h-20"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo / Home Link */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded-lg px-2 py-1"
            aria-label="FinanceFlow Home"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold hidden sm:flex">
              FF
            </div>
            <span className="hidden sm:inline">FinanceFlow</span>
            <span className="sm:hidden">FF</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div
            className="hidden md:flex items-center gap-1 lg:gap-2"
            role="menubar"
          >
            {isAuthenticated && (
              <>
                <NavLink
                  to="/dashboard"
                  active={isActive("/dashboard")}
                  icon={<Home size={18} />}
                >
                  Dashboard
                </NavLink>
                <NavLink to="/transactions" active={isActive("/transactions")}>
                  Transactions
                </NavLink>
                <NavLink to="/budgets" active={isActive("/budgets")}>
                  Budgets
                </NavLink>
                <NavLink to="/credit-cards" active={isActive("/credit-cards")}>
                  Cards
                </NavLink>
              </>
            )}
          </div>

          {/* Right Side: User Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 md:gap-4">
                {/* User Name (hidden on mobile) */}
                <span className="hidden sm:inline text-sm md:text-base font-medium text-gray-700 truncate max-w-xs">
                  {user?.name}
                </span>

                {/* Settings Link (Desktop) */}
                <Link
                  to="/settings"
                  className="hidden sm:flex items-center justify-center p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  aria-label="Settings"
                  title="Settings"
                >
                  <Settings size={20} />
                </Link>

                {/* Logout Button (Desktop) */}
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm md:text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2 md:gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm md:text-base font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm md:text-base px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-gray-200 bg-white animate-in fade-in slide-in-from-top-2"
            role="menu"
          >
            <div className="container-responsive py-4 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto">
              {isAuthenticated ? (
                <>
                  {/* Mobile User Info */}
                  <div className="px-4 py-2 border-b border-gray-200 mb-2">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>

                  {/* Mobile Navigation Links */}
                  <MobileNavLink
                    to="/dashboard"
                    active={isActive("/dashboard")}
                  >
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink
                    to="/transactions"
                    active={isActive("/transactions")}
                  >
                    Transactions
                  </MobileNavLink>
                  <MobileNavLink to="/budgets" active={isActive("/budgets")}>
                    Budgets
                  </MobileNavLink>
                  <MobileNavLink
                    to="/credit-cards"
                    active={isActive("/credit-cards")}
                  >
                    Credit Cards
                  </MobileNavLink>
                  <MobileNavLink to="/settings" active={isActive("/settings")}>
                    Settings
                  </MobileNavLink>

                  {/* Mobile Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full text-left px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    role="menuitem"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary w-full text-center"
                    role="menuitem"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/**
 * Desktop Navigation Link Component
 */
function NavLink({ to, active, children, icon }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
        active
          ? "text-blue-600 bg-blue-50"
          : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
      }`}
      role="menuitem"
      aria-current={active ? "page" : undefined}
    >
      {icon}
      {children}
    </Link>
  );
}

/**
 * Mobile Navigation Link Component
 */
function MobileNavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`block px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
        active
          ? "text-blue-600 bg-blue-50"
          : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
      }`}
      role="menuitem"
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export default Navbar;
