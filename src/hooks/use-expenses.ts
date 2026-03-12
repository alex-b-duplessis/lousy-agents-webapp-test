"use client";

import { useCallback, useEffect, useState } from "react";
import type { Expense } from "@/entities/expense";
import { calculateTotal } from "@/entities/expense";
import type {
    AddExpenseInput,
    AddExpenseUseCase,
} from "@/use-cases/add-expense";
import type {
    GetExpensesInput,
    GetExpensesUseCase,
} from "@/use-cases/get-expenses";

export interface UseExpensesDeps {
    addExpenseUseCase: AddExpenseUseCase;
    getExpensesUseCase: GetExpensesUseCase;
}

export interface UseExpensesResult {
    expenses: Expense[];
    total: number;
    loading: boolean;
    error: string | null;
    success: boolean;
    filter: GetExpensesInput;
    addExpense: (input: AddExpenseInput) => Promise<void>;
    setFilter: (filter: GetExpensesInput) => void;
}

export function createUseExpensesHook({
    addExpenseUseCase,
    getExpensesUseCase,
}: UseExpensesDeps) {
    return function useExpenses(): UseExpensesResult {
        const [expenses, setExpenses] = useState<Expense[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [success, setSuccess] = useState(false);
        const [filter, setFilter] = useState<GetExpensesInput>({});

        const loadExpenses = useCallback(
            async (currentFilter: GetExpensesInput) => {
                setLoading(true);
                setError(null);
                try {
                    const { expenses: loaded } =
                        await getExpensesUseCase.execute(currentFilter);
                    setExpenses(loaded);
                } catch (err) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load expenses",
                    );
                } finally {
                    setLoading(false);
                }
            },
            [],
        );

        useEffect(() => {
            loadExpenses(filter);
        }, [filter, loadExpenses]);

        const addExpense = useCallback(async (input: AddExpenseInput) => {
            setError(null);
            setSuccess(false);
            try {
                await addExpenseUseCase.execute(input);
                setSuccess(true);
                setFilter((prev) => ({ ...prev }));
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to add expense",
                );
            }
        }, []);

        const total = calculateTotal(expenses);

        return {
            expenses,
            total,
            loading,
            error,
            success,
            filter,
            addExpense,
            setFilter,
        };
    };
}
