import { describe, expect, it, vi } from "vitest";
import type { Expense } from "@/entities/expense";
import type { ExpenseRepository } from "@/use-cases/add-expense";
import { AddExpenseUseCase } from "@/use-cases/add-expense";

function buildExpense(overrides: Partial<Expense> = {}): Expense {
    return {
        id: "1",
        amount: 15.0,
        category: "Food",
        date: "2024-06-01",
        ...overrides,
    };
}

function buildMockRepository(savedExpense: Expense): ExpenseRepository {
    return {
        save: vi.fn().mockResolvedValue(savedExpense),
    };
}

describe("AddExpenseUseCase", () => {
    describe("given a valid expense input", () => {
        it("should save the expense and return it", async () => {
            // Arrange
            const savedExpense = buildExpense();
            const repository = buildMockRepository(savedExpense);
            const useCase = new AddExpenseUseCase(repository);

            // Act
            const result = await useCase.execute({
                amount: 15.0,
                category: "Food",
                date: "2024-06-01",
            });

            // Assert
            expect(result.expense).toEqual(savedExpense);
            expect(repository.save).toHaveBeenCalledOnce();
        });

        it("should pass the optional note to the repository", async () => {
            // Arrange
            const savedExpense = buildExpense({ note: "Lunch" });
            const repository = buildMockRepository(savedExpense);
            const useCase = new AddExpenseUseCase(repository);

            // Act
            await useCase.execute({
                amount: 15.0,
                category: "Food",
                date: "2024-06-01",
                note: "Lunch",
            });

            // Assert
            expect(repository.save).toHaveBeenCalledWith({
                amount: 15.0,
                category: "Food",
                date: "2024-06-01",
                note: "Lunch",
            });
        });
    });

    describe("given an amount of zero", () => {
        it("should reject with a validation error", async () => {
            // Arrange
            const repository = buildMockRepository(buildExpense());
            const useCase = new AddExpenseUseCase(repository);

            // Act & Assert
            await expect(
                useCase.execute({
                    amount: 0,
                    category: "Food",
                    date: "2024-06-01",
                }),
            ).rejects.toThrow(
                "Amount must be a positive number greater than zero",
            );
            expect(repository.save).not.toHaveBeenCalled();
        });
    });

    describe("given a negative amount", () => {
        it("should reject with a validation error", async () => {
            // Arrange
            const repository = buildMockRepository(buildExpense());
            const useCase = new AddExpenseUseCase(repository);

            // Act & Assert
            await expect(
                useCase.execute({
                    amount: -5,
                    category: "Food",
                    date: "2024-06-01",
                }),
            ).rejects.toThrow(
                "Amount must be a positive number greater than zero",
            );
        });
    });

    describe("given an empty category", () => {
        it("should reject with a validation error", async () => {
            // Arrange
            const repository = buildMockRepository(buildExpense());
            const useCase = new AddExpenseUseCase(repository);

            // Act & Assert
            await expect(
                useCase.execute({
                    amount: 10,
                    category: "",
                    date: "2024-06-01",
                }),
            ).rejects.toThrow("Category is required");
            expect(repository.save).not.toHaveBeenCalled();
        });
    });
});
