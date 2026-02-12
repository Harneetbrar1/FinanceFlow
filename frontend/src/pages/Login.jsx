import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Eye, EyeOff, Loader } from "lucide-react";

/**
 * Login Page
 * Features:
 * - Form validation
 * - Password visibility toggle
 * - Loading state
 * - Error handling
 * - Accessibility features
 */
export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate inputs
      if (!email.trim() || !password.trim()) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const result = await login(email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      if (process.env.NODE_ENV !== "production") {
        console.error("Login error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12 px-4"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl text-white font-bold mb-4">
            FF
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your FinanceFlow account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg flex gap-3 items-start"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle
              className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-danger-900">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Email Field */}
          <div className="input-group">
            <label htmlFor="email" className="font-medium text-gray-700">
              Email Address
              <span aria-label="required" className="text-danger-600 ml-1">
                *
              </span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password" className="font-medium text-gray-700">
              Password
              <span aria-label="required" className="text-danger-600 ml-1">
                *
              </span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                aria-required="true"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={loading ? -1 : 0}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={loading}
          >
            {loading && (
              <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />
            )}
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                New to FinanceFlow?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to="/register"
            className="w-full btn-secondary py-2.5 font-medium text-center"
          >
            Create an Account
          </Link>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="text-primary-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </main>
  );
}

export default Login;
