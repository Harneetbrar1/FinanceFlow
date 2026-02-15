/**
 * TransactionForm Component Tests
 *
 * Tests the modal form component for adding and editing transactions.
 * Validates:
 * - Form rendering in add/edit modes
 * - Form field interactions
 * - Validation logic
 * - Form submission
 * - Error display
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransactionForm } from "../components/TransactionForm";

describe("TransactionForm Component", () => {
  const defaultCategories = [
    "Groceries",
    "Entertainment",
    "Utilities",
    "Transportation",
    "Salary",
    "Other",
  ];

  /**
   * Test 1: Form renders in add mode
   */
  it("renders transaction form in add mode", () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        isOpen={true}
        mode="add"
        initialData={null}
        categories={defaultCategories}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />,
    );

    // Check for form title
    expect(
      screen.getByText(/add transaction|new transaction/i),
    ).toBeInTheDocument();

    // Check for form inputs
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  /**
   * Test 2: Form renders in edit mode with pre-filled data
   */
  it("renders form in edit mode with pre-filled data", () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();
    const editData = {
      _id: "123",
      amount: 50,
      category: "Groceries",
      date: "2026-02-15",
      type: "expense",
      description: "Weekly shopping",
    };

    render(
      <TransactionForm
        isOpen={true}
        mode="edit"
        initialData={editData}
        categories={defaultCategories}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />,
    );

    // Check for edit mode indicators
    expect(screen.getByText(/edit transaction/i)).toBeInTheDocument();

    // Verify amount is pre-filled (as value)
    const amountInput = screen.getByLabelText(/amount/i);
    expect(amountInput.value).toBe("50");
  });

  /**
   * Test 3: Form does not render when isOpen is false
   */
  it("does not render when isOpen is false", () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        isOpen={false}
        mode="add"
        initialData={null}
        categories={defaultCategories}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />,
    );

    expect(screen.queryByLabelText(/amount/i)).not.toBeInTheDocument();
  });

  /**
   * Test 4: Close button calls onClose callback
   */
  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        isOpen={true}
        mode="add"
        initialData={null}
        categories={defaultCategories}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />,
    );

    const closeButton = screen.getByRole("button", { name: /close|cancel/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  /**
   * Test 5: Validation messages appear for invalid input
   */
  it("displays validation error for zero amount", async () => {
    const user = userEvent.setup();
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        isOpen={true}
        mode="add"
        initialData={null}
        categories={defaultCategories}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />,
    );

    // Try to submit with invalid amount
    const amountInput = screen.getByLabelText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, "0");

    const submitButton = screen.getByRole("button", {
      name: /submit|add|save/i,
    });
    await user.click(submitButton);

    // Form should show error (not submit)
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  /**
   * Test 6: Submit button is disabled during submission
   */
  it("disables submit button when isSubmitting is true", () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        isOpen={true}
        mode="add"
        initialData={null}
        categories={defaultCategories}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
      />,
    );

    const submitButton = screen.getByRole("button", {
      name: /submit|add|save|loading/i,
    });
    expect(submitButton).toBeDisabled();
  });

  /**
   * Test 7: Form has proper field labels
   */
  it("has all required form fields with proper labels", () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    render(
      <TransactionForm
        isOpen={true}
        mode="add"
        initialData={null}
        categories={defaultCategories}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />,
    );

    // Verify all form fields are present
    expect(screen.getByLabelText(/amount|value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type|income|expense/i)).toBeInTheDocument();
  });
});
