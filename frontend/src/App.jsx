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
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

/**
 * FinanceFlow - Main App Component
 * Sets up routing and authentication context
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* TODO: Add more routes */}
              {/* <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} /> */}
              {/* <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} /> */}
              {/* <Route path="/credit-cards" element={<ProtectedRoute><CreditCards /></ProtectedRoute>} /> */}
              {/* <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} /> */}

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
