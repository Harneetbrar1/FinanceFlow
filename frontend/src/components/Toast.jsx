import React from "react";
import PropTypes from "prop-types";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const toastStyles = {
  success: {
    wrapper: "border-emerald-200 bg-emerald-50 text-emerald-900",
    icon: "text-emerald-600",
  },
  error: {
    wrapper: "border-red-200 bg-red-50 text-red-900",
    icon: "text-red-600",
  },
  info: {
    wrapper: "border-blue-200 bg-blue-50 text-blue-900",
    icon: "text-blue-600",
  },
};

/**
 * Toast Component
 *
 * @param {string} message - Toast message
 * @param {string} type - "success", "error", or "info"
 * @param {function} onClose - Close handler
 */
export function Toast({ message, type, onClose }) {
  const styles = toastStyles[type] || toastStyles.info;
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-sm ${styles.wrapper}`}
      role="status"
      aria-live="polite"
    >
      <Icon size={20} className={`${styles.icon} shrink-0 mt-0.5`} />
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        type="button"
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info"]),
  onClose: PropTypes.func.isRequired,
};

Toast.defaultProps = {
  type: "info",
};

export default Toast;
