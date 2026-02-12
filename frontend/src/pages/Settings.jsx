import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, Save, LogOut } from "lucide-react";

/**
 * Settings Page
 *
 * Features:
 * - Update user profile information
 * - Change hourly wage
 * - Account preferences
 * - Logout functionality
 * - Responsive design
 *
 * TODO: Password change functionality
 * TODO: Two-factor authentication
 * TODO: Data export
 * TODO: Account deletion
 */
export function Settings() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    hourlyWage: user?.hourlyWage || 0,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hourlyWage" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Connect to backend API
      // await updateUserProfile(formData);
      setMessage({
        type: "success",
        text: "Settings updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main id="main-content" className="flex-1 overflow-auto">
        <div className="container-responsive py-8 md:py-12">
          {/* Page Header */}
          <section className="mb-8 md:mb-12">
            <div className="flex items-center gap-3">
              <SettingsIcon size={32} className="text-primary-600" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Settings
                </h1>
                <p className="text-gray-600">Manage your account preferences</p>
              </div>
            </div>
          </section>

          {/* Settings Form */}
          <section className="max-w-2xl">
            <div className="card p-6 md:p-8">
              {message.text && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-success-50 text-success-800 border border-success-200"
                      : "bg-danger-50 text-danger-800 border border-danger-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Profile Information
                  </h2>

                  {/* Name Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                {/* Financial Settings Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Financial Settings
                  </h2>

                  {/* Hourly Wage Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="hourlyWage"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Hourly Wage ($)
                    </label>
                    <input
                      id="hourlyWage"
                      type="number"
                      name="hourlyWage"
                      value={formData.hourlyWage}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="Enter your hourly wage"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used for the hours-to-money calculator
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="max-w-2xl mt-8">
            <div className="card p-6 md:p-8 border-2 border-danger-200 bg-danger-50">
              <h2 className="text-xl font-bold text-danger-900 mb-4">
                Danger Zone
              </h2>
              <p className="text-danger-800 mb-6">
                Be careful with these actions as they cannot be undone.
              </p>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition"
              >
                <LogOut size={20} />
                Log Out
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Settings;
