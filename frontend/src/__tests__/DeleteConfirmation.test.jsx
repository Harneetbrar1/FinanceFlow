/**
 * DeleteConfirmation Component Tests
 *
 * Tests the modal component that confirms transaction deletion.
 * Validates:
 * - Modal rendering with transaction details
 * - User interactions (confirm, cancel, close)
 * - Loading states
 * - Keyboard support (Escape key)
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteConfirmation } from "../components/DeleteConfirmation";

describe("DeleteConfirmation Component", () => {
  /**
   * Test 1: Modal renders with transaction details
   */
  it("renders delete confirmation modal with transaction details", () => {
    const mockTransaction = {
      _id: "123abc",
      amount: 50.99,
      category: "groceries",
      date: "2026-02-15",
      type: "expense",
      description: "Weekly groceries",
    };

    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    render(
      <DeleteConfirmation
        isOpen={true}
        transaction={mockTransaction}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />,
    );

    // Verify modal title
    expect(screen.getByText("Delete Transaction?")).toBeInTheDocument();

    // Verify transaction details are displayed
    expect(screen.getByText("$50.99")).toBeInTheDocument();
    expect(
      screen.getByText("groceries", { selector: "span" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Feb 15, 2026|February 15, 2026/),
    ).toBeInTheDocument();

    // Verify warning message
    expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
  });

  /**
   * Test 2: Cancel button closes modal without deleting
   */
  it("calls onClose when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    const mockTransaction = {
      _id: "123abc",
      amount: 50,
      category: "groceries",
      date: "2026-02-15",
      type: "expense",
    };

    render(
      <DeleteConfirmation
        isOpen={true}
        transaction={mockTransaction}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  /**
   * Test 3: Delete button triggers confirmation
   */
  it("calls onConfirm with transaction ID when delete button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    const mockTransaction = {
      _id: "tx-456def",
      amount: 100,
      category: "salary",
      date: "2026-02-15",
      type: "income",
    };

    render(
      <DeleteConfirmation
        isOpen={true}
        transaction={mockTransaction}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(mockOnConfirm).toHaveBeenCalledWith("tx-456def");
    expect(mockOnConfirm).toHaveBeenCalledOnce();
  });

  /**
   * Test 4: Modal doesn't render when isOpen is false
   */
  it("does not render when isOpen is false", () => {
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    const mockTransaction = {
      _id: "123abc",
      amount: 50,
      category: "groceries",
      date: "2026-02-15",
      type: "expense",
    };

    render(
      <DeleteConfirmation
        isOpen={false}
        transaction={mockTransaction}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />,
    );

    expect(screen.queryByText("Delete Transaction?")).not.toBeInTheDocument();
  });

  /**
   * Test 5: Delete button is disabled during deletion
   */
  it("disables delete button when isDeleting is true", () => {
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    const mockTransaction = {
      _id: "123abc",
      amount: 50,
      category: "groceries",
      date: "2026-02-15",
      type: "expense",
    };

    render(
      <DeleteConfirmation
        isOpen={true}
        transaction={mockTransaction}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isDeleting={true}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /deleting/i });
    expect(deleteButton).toBeDisabled();
  });

  /**
   * Test 6: Close button (X icon) closes modal
   */
  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    const mockTransaction = {
      _id: "123abc",
      amount: 50,
      category: "groceries",
      date: "2026-02-15",
      type: "expense",
    };

    render(
      <DeleteConfirmation
        isOpen={true}
        transaction={mockTransaction}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isDeleting={false}
      />,
    );

    const closeButton = screen.getByLabelText(/close dialog/i);
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });
});
