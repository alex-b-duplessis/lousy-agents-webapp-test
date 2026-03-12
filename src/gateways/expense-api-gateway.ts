import { z } from "zod";
import type { Expense } from "@/entities/expense";
import type { ExpenseRepository } from "@/use-cases/add-expense";
import type { ExpenseQueryRepository } from "@/use-cases/get-expenses";

const ExpenseSchema = z.object({
    id: z.string(),
    amount: z.number(),
    category: z.string(),
    date: z.string(),
    note: z.string().optional(),
});

const ExpenseListSchema = z.array(ExpenseSchema);

export interface ExpenseApiGateway
    extends ExpenseRepository,
        ExpenseQueryRepository {}

export function createExpenseApiGateway(baseUrl = ""): ExpenseApiGateway {
    return {
        async save(expense: Omit<Expense, "id">): Promise<Expense> {
            const response = await fetch(`${baseUrl}/api/expenses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(expense),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                const message =
                    typeof body === "object" &&
                    body !== null &&
                    "error" in body &&
                    typeof (body as Record<string, unknown>).error === "string"
                        ? (body as Record<string, string>).error
                        : `Failed to save expense: ${response.status}`;
                throw new Error(message);
            }

            const data: unknown = await response.json();
            return ExpenseSchema.parse(data);
        },

        async findAll(): Promise<Expense[]> {
            const response = await fetch(`${baseUrl}/api/expenses`);

            if (!response.ok) {
                throw new Error(`Failed to fetch expenses: ${response.status}`);
            }

            const data: unknown = await response.json();
            return ExpenseListSchema.parse(data);
        },
    };
}
