import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExpenseList } from "@/components/features/ExpenseList";
import type { Expense } from "@/entities/expense";

const SAMPLE_EXPENSES: Expense[] = [
    {
        id: "1",
        amount: 10.5,
        category: "Food",
        date: "2024-01-10",
        note: "Lunch",
    },
    { id: "2", amount: 25.0, category: "Transport", date: "2024-01-11" },
];

describe("ExpenseList", () => {
    describe("when loading", () => {
        it("should display a loading message", () => {
            render(<ExpenseList expenses={[]} loading={true} />);
            expect(screen.getByText(/loading expenses/i)).toBeInTheDocument();
        });
    });

    describe("when there are no expenses", () => {
        it("should display an empty state message", () => {
            render(<ExpenseList expenses={[]} loading={false} />);
            expect(
                screen.getByText(/no expenses recorded/i),
            ).toBeInTheDocument();
        });
    });

    describe("when expenses are provided", () => {
        it("should display each expense amount and category", () => {
            render(<ExpenseList expenses={SAMPLE_EXPENSES} loading={false} />);
            expect(screen.getByText("$10.50")).toBeInTheDocument();
            expect(screen.getByText("Food")).toBeInTheDocument();
            expect(screen.getByText("$25.00")).toBeInTheDocument();
            expect(screen.getByText("Transport")).toBeInTheDocument();
        });

        it("should display the optional note when present", () => {
            render(<ExpenseList expenses={SAMPLE_EXPENSES} loading={false} />);
            expect(screen.getByText("Lunch")).toBeInTheDocument();
        });

        it("should display the expense date", () => {
            render(<ExpenseList expenses={SAMPLE_EXPENSES} loading={false} />);
            expect(screen.getByText("2024-01-10")).toBeInTheDocument();
        });
    });
});
