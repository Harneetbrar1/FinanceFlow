import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Page imports
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Budgets } from "./pages/Budgets";
import { CreditCards } from "./pages/CreditCards";
import { Calculators } from "./pages/Calculators";
import { EmergencyFund } from "./pages/EmergencyFund";
import { Settings } from "./pages/Settings";

import "./App.css";

/**
 * FinanceFlow - Main App Component
 *
 * Features:
 * - Sets up routing for all pages
 * - Manages authentication context
 * - Protects authenticated routes
 * - Responsive layout with navigation
 *
 * Route Structure:
 * - Public routes: Home, Login, Register
 * - Protected routes: Dashboard, Transactions, Budgets, Credit Cards, Calculators, Emergency Fund, Settings
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* ===== PUBLIC ROUTES ===== */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ===== PROTECTED ROUTES ===== */}
              {/* Dashboard - Main overview page */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Transactions - Track income and expenses */}
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />

              {/* Budgets - Manage budget by category */}
              <Route
                path="/budgets"
                element={
                  <ProtectedRoute>
                    <Budgets />
                  </ProtectedRoute>
                }
              />

              {/* Credit Cards - Manage credit card debt */}
              <Route
                path="/credit-cards"
                element={
                  <ProtectedRoute>
                    <CreditCards />
                  </ProtectedRoute>
                }
              />

              {/* Calculators - Financial calculation tools */}
              <Route
                path="/calculators"
                element={
                  <ProtectedRoute>
                    <Calculators />
                  </ProtectedRoute>
                }
              />

              {/* Emergency Fund - Build financial safety net */}
              <Route
                path="/emergency-fund"
                element={
                  <ProtectedRoute>
                    <EmergencyFund />
                  </ProtectedRoute>
                }
              />

              {/* Settings - User preferences and account */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* ===== FALLBACK ROUTE ===== */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
