import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExpenseForm } from "@/components/features/ExpenseForm";

function renderForm(props?: Partial<React.ComponentProps<typeof ExpenseForm>>) {
    const defaults = {
        onSubmit: vi.fn().mockResolvedValue(undefined),
        error: null,
        success: false,
    };
    return render(<ExpenseForm {...defaults} {...props} />);
}

describe("ExpenseForm", () => {
    describe("when rendered with no state", () => {
        it("should display the form fields", () => {
            renderForm();
            expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
        });
    });

    describe("when the user submits with an amount of zero", () => {
        it("should display a validation error without calling onSubmit", async () => {
            // Arrange
            const onSubmit = vi.fn();
            renderForm({ onSubmit });

            // Act
            fireEvent.change(screen.getByLabelText(/amount/i), {
                target: { value: "0" },
            });
            fireEvent.submit(
                screen.getByRole("form", { name: /add expense form/i }),
            );

            // Assert
            await waitFor(() => {
                expect(
                    screen.getByText(
                        /must be a positive number greater than zero/i,
                    ),
                ).toBeInTheDocument();
            });
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    describe("when the user submits with a negative amount", () => {
        it("should display a validation error without calling onSubmit", async () => {
            // Arrange
            const onSubmit = vi.fn();
            renderForm({ onSubmit });

            // Act
            fireEvent.change(screen.getByLabelText(/amount/i), {
                target: { value: "-5" },
            });
            fireEvent.submit(
                screen.getByRole("form", { name: /add expense form/i }),
            );

            // Assert
            await waitFor(() => {
                expect(
                    screen.getByText(
                        /must be a positive number greater than zero/i,
                    ),
                ).toBeInTheDocument();
            });
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    describe("when success is true", () => {
        it("should display a success confirmation message", () => {
            renderForm({ success: true });
            expect(
                screen.getByText(/expense added successfully/i),
            ).toBeInTheDocument();
        });
    });

    describe("when an API error is provided", () => {
        it("should display the error message", () => {
            renderForm({ error: "Server error occurred" });
            expect(
                screen.getByText("Server error occurred"),
            ).toBeInTheDocument();
        });
    });
});
