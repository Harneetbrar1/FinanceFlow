import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Eye, EyeOff, Loader, Check } from "lucide-react";

/**
 * Register Page
 * Features:
 * - Form validation with real-time feedback
 * - Password strength indicator
 * - Password visibility toggle
 * - Accessible form design
 * - Error handling
 */
export function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    hourlyWage: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { register } = useAuth();

  // Check password strength
  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        setError("Please enter your name");
        setLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        setError("Please enter your email");
        setLoading(false);
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (
        !formData.hourlyWage ||
        isNaN(formData.hourlyWage) ||
        parseFloat(formData.hourlyWage) <= 0
      ) {
        setError("Please enter a valid hourly wage");
        setLoading(false);
        return;
      }

      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        hourlyWage: parseFloat(formData.hourlyWage),
      });

      if (result.success) {
        navigate("/dashboard");
      } else {
        const errorMsg =
          result.error ||
          result.message ||
          "Registration failed. Please try again.";
        console.error("Registration failed:", errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Registration exception:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    return labels[passwordStrength];
  };

  const getPasswordStrengthColor = () => {
    const colors = [
      "",
      "text-danger-600",
      "text-warning-600",
      "text-success-600",
      "text-success-700",
    ];
    return colors[passwordStrength];
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
            Join FinanceFlow
          </h1>
          <p className="text-gray-600">
            Create your account in less than a minute
          </p>
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
            <p className="font-medium text-danger-900">{error}</p>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          {/* Name Field */}
          <div className="input-group">
            <label htmlFor="name" className="font-medium text-gray-700">
              Full Name
              <span aria-label="required" className="text-danger-600 ml-1">
                *
              </span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition"
              disabled={loading}
            />
          </div>

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
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition"
              disabled={loading}
            />
          </div>

          {/* Hourly Wage Field */}
          <div className="input-group">
            <label htmlFor="hourlyWage" className="font-medium text-gray-700">
              Hourly Wage ($)
              <span aria-label="required" className="text-danger-600 ml-1">
                *
              </span>
            </label>
            <input
              id="hourlyWage"
              type="number"
              name="hourlyWage"
              value={formData.hourlyWage}
              onChange={handleChange}
              placeholder="25.00"
              step="0.01"
              min="0"
              required
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for emergency fund calculations
            </p>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
                aria-required="true"
                aria-describedby="password-strength"
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2" id="password-strength">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        level <= passwordStrength
                          ? "bg-primary-600"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-sm font-medium ${getPasswordStrengthColor()}`}
                >
                  {getPasswordStrengthLabel()}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="input-group">
            <label
              htmlFor="confirmPassword"
              className="font-medium text-gray-700"
            >
              Confirm Password
              <span aria-label="required" className="text-danger-600 ml-1">
                *
              </span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                aria-required="true"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                tabIndex={loading ? -1 : 0}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formData.confirmPassword && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  {formData.password === formData.confirmPassword ? (
                    <Check
                      size={20}
                      className="text-success-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <AlertCircle
                      size={20}
                      className="text-danger-600"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            aria-busy={loading}
          >
            {loading && (
              <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />
            )}
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          By creating an account, you agree to our{" "}
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

export default Register;
