export const EXPENSE_CATEGORIES = [
    "Food",
    "Transport",
    "Housing",
    "Entertainment",
    "Healthcare",
    "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
    readonly id: string;
    readonly amount: number;
    readonly category: string;
    readonly date: string;
    readonly note?: string;
}

export function validateExpenseAmount(amount: number): string | null {
    if (!Number.isFinite(amount) || amount <= 0) {
        return "Amount must be a positive number greater than zero";
    }
    return null;
}

export function validateExpenseCategory(category: string): string | null {
    if (!category || category.trim() === "") {
        return "Category is required";
    }
    return null;
}

export function calculateTotal(expenses: Expense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function formatAmount(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}
