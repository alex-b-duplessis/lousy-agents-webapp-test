import { describe, expect, it } from "vitest";
import type { Expense } from "@/entities/expense";
import {
    calculateTotal,
    EXPENSE_CATEGORIES,
    formatAmount,
    validateExpenseAmount,
    validateExpenseCategory,
} from "@/entities/expense";

describe("Expense amount validation", () => {
    describe("given an amount of zero", () => {
        it("should return a validation error", () => {
            expect(validateExpenseAmount(0)).toBe(
                "Amount must be a positive number greater than zero",
            );
        });
    });

    describe("given a negative amount", () => {
        it("should return a validation error", () => {
            expect(validateExpenseAmount(-10)).toBe(
                "Amount must be a positive number greater than zero",
            );
        });
    });

    describe("given NaN", () => {
        it("should return a validation error", () => {
            expect(validateExpenseAmount(Number.NaN)).toBe(
                "Amount must be a positive number greater than zero",
            );
        });
    });

    describe("given Infinity", () => {
        it("should return a validation error", () => {
            expect(validateExpenseAmount(Number.POSITIVE_INFINITY)).toBe(
                "Amount must be a positive number greater than zero",
            );
        });
    });

    describe("given a positive amount", () => {
        it("should return null", () => {
            expect(validateExpenseAmount(10.5)).toBeNull();
        });
    });

    describe("given the minimum valid amount", () => {
        it("should return null for the smallest positive number", () => {
            expect(validateExpenseAmount(0.01)).toBeNull();
        });
    });
});

describe("Expense category validation", () => {
    describe("given an empty string", () => {
        it("should return a validation error", () => {
            expect(validateExpenseCategory("")).toBe("Category is required");
        });
    });

    describe("given a whitespace-only string", () => {
        it("should return a validation error", () => {
            expect(validateExpenseCategory("   ")).toBe("Category is required");
        });
    });

    describe("given a valid category", () => {
        it("should return null", () => {
            expect(validateExpenseCategory("Food")).toBeNull();
        });
    });
});

describe("Expense total calculation", () => {
    describe("given an empty list", () => {
        it("should return zero", () => {
            expect(calculateTotal([])).toBe(0);
        });
    });

    describe("given a list of expenses", () => {
        it("should return the sum of all amounts", () => {
            const expenses: Expense[] = [
                { id: "1", amount: 10.5, category: "Food", date: "2024-01-01" },
                {
                    id: "2",
                    amount: 20.0,
                    category: "Transport",
                    date: "2024-01-02",
                },
                { id: "3", amount: 5.75, category: "Food", date: "2024-01-03" },
            ];
            expect(calculateTotal(expenses)).toBeCloseTo(36.25);
        });
    });
});

describe("Amount formatting", () => {
    describe("given an integer amount", () => {
        it("should format as USD currency", () => {
            expect(formatAmount(10)).toBe("$10.00");
        });
    });

    describe("given a decimal amount", () => {
        it("should format with two decimal places", () => {
            expect(formatAmount(10.5)).toBe("$10.50");
        });
    });
});

describe("EXPENSE_CATEGORIES", () => {
    it("should include expected categories", () => {
        expect(EXPENSE_CATEGORIES).toContain("Food");
        expect(EXPENSE_CATEGORIES).toContain("Transport");
        expect(EXPENSE_CATEGORIES).toContain("Other");
    });
});
