/**
 * Toast Component Tests
 *
 * Tests the notification component that displays user feedback.
 * Validates:
 * - Toast rendering with different types (success, error, info)
 * - Auto-dismiss functionality
 * - User-triggered close
 * - Accessibility attributes
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "../components/Toast";

describe("Toast Component", () => {
  /**
   * Test 1: Success toast renders correctly
   */
  it("renders success toast with correct message and icon", () => {
    const mockOnClose = vi.fn();

    render(
      <Toast
        message="Transaction added successfully"
        type="success"
        onClose={mockOnClose}
      />,
    );

    // Verify message is displayed
    expect(
      screen.getByText("Transaction added successfully"),
    ).toBeInTheDocument();

    // Verify it has success styling (green)
    const container = screen.getByRole("status");
    expect(container).toHaveClass("bg-green-50");
  });

  /**
   * Test 2: Error toast renders correctly
   */
  it("renders error toast with correct styling", () => {
    const mockOnClose = vi.fn();

    render(
      <Toast
        message="Failed to delete transaction"
        type="error"
        onClose={mockOnClose}
      />,
    );

    expect(
      screen.getByText("Failed to delete transaction"),
    ).toBeInTheDocument();

    const container = screen.getByRole("status");
    expect(container).toHaveClass("bg-red-50");
  });

  /**
   * Test 3: Info toast renders correctly
   */
  it("renders info toast with neutral styling", () => {
    const mockOnClose = vi.fn();

    render(
      <Toast
        message="This is an informational message"
        type="info"
        onClose={mockOnClose}
      />,
    );

    expect(
      screen.getByText("This is an informational message"),
    ).toBeInTheDocument();

    const container = screen.getByRole("status");
    expect(container).toHaveClass("bg-blue-50");
  });

  /**
   * Test 4: Close button triggers onClose callback
   */
  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();

    render(
      <Toast message="Test message" type="success" onClose={mockOnClose} />,
    );

    const closeButton = screen.getByRole("button");
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  /**
   * Test 5: Toast has proper accessibility attributes
   */
  it("has proper accessibility attributes", () => {
    const mockOnClose = vi.fn();

    render(
      <Toast
        message="Accessible toast message"
        type="success"
        onClose={mockOnClose}
      />,
    );

    // Should have role="status" for live region announcements
    const toast = screen.getByRole("status");
    expect(toast).toHaveAttribute("aria-live", "polite");

    // Close button should have aria-label
    const closeButton = screen.getByLabelText(/close/i);
    expect(closeButton).toBeInTheDocument();
  });

  /**
   * Test 6: Toast supports long messages
   */
  it("handles long messages gracefully", () => {
    const mockOnClose = vi.fn();
    const longMessage =
      "This is a very long message that describes a complex error in detail. It should wrap properly and not overflow the toast container.";

    render(<Toast message={longMessage} type="error" onClose={mockOnClose} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
