import { describe, expect, it, vi } from "vitest";
import type { Expense } from "@/entities/expense";
import type { ExpenseQueryRepository } from "@/use-cases/get-expenses";
import { GetExpensesUseCase } from "@/use-cases/get-expenses";

const EXPENSES: Expense[] = [
    { id: "1", amount: 10, category: "Food", date: "2024-01-10" },
    { id: "2", amount: 20, category: "Transport", date: "2024-01-15" },
    { id: "3", amount: 30, category: "Food", date: "2024-02-05" },
    { id: "4", amount: 40, category: "Housing", date: "2024-02-20" },
];

function buildRepository(
    expenses: Expense[] = EXPENSES,
): ExpenseQueryRepository {
    return {
        findAll: vi.fn().mockResolvedValue(expenses),
    };
}

describe("GetExpensesUseCase", () => {
    describe("given no filters", () => {
        it("should return all expenses", async () => {
            // Arrange
            const repository = buildRepository();
            const useCase = new GetExpensesUseCase(repository);

            // Act
            const result = await useCase.execute({});

            // Assert
            expect(result.expenses).toHaveLength(4);
        });
    });

    describe("given a category filter", () => {
        it("should return only expenses matching the category", async () => {
            // Arrange
            const repository = buildRepository();
            const useCase = new GetExpensesUseCase(repository);

            // Act
            const result = await useCase.execute({ category: "Food" });

            // Assert
            expect(result.expenses).toHaveLength(2);
            expect(result.expenses.every((e) => e.category === "Food")).toBe(
                true,
            );
        });
    });

    describe("given a fromDate filter", () => {
        it("should return only expenses on or after the from date", async () => {
            // Arrange
            const repository = buildRepository();
            const useCase = new GetExpensesUseCase(repository);

            // Act
            const result = await useCase.execute({ fromDate: "2024-02-01" });

            // Assert
            expect(result.expenses).toHaveLength(2);
            expect(result.expenses.every((e) => e.date >= "2024-02-01")).toBe(
                true,
            );
        });
    });

    describe("given a toDate filter", () => {
        it("should return only expenses on or before the to date", async () => {
            // Arrange
            const repository = buildRepository();
            const useCase = new GetExpensesUseCase(repository);

            // Act
            const result = await useCase.execute({ toDate: "2024-01-31" });

            // Assert
            expect(result.expenses).toHaveLength(2);
            expect(result.expenses.every((e) => e.date <= "2024-01-31")).toBe(
                true,
            );
        });
    });

    describe("given both category and date range filters", () => {
        it("should return expenses matching all filters", async () => {
            // Arrange
            const repository = buildRepository();
            const useCase = new GetExpensesUseCase(repository);

            // Act
            const result = await useCase.execute({
                category: "Food",
                fromDate: "2024-02-01",
                toDate: "2024-02-28",
            });

            // Assert
            expect(result.expenses).toHaveLength(1);
            expect(result.expenses[0].id).toBe("3");
        });
    });

    describe("given a filter that matches no expenses", () => {
        it("should return an empty list", async () => {
            // Arrange
            const repository = buildRepository();
            const useCase = new GetExpensesUseCase(repository);

            // Act
            const result = await useCase.execute({ category: "Entertainment" });

            // Assert
            expect(result.expenses).toHaveLength(0);
        });
    });
});
