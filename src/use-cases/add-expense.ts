import type { Expense } from "../entities/expense";
import {
	validateExpenseAmount,
	validateExpenseCategory,
} from "../entities/expense";

export interface AddExpenseInput {
	amount: number;
	category: string;
	date: string;
	note?: string;
}

export interface AddExpenseOutput {
	expense: Expense;
}

export interface ExpenseRepository {
	save(expense: Omit<Expense, "id">): Promise<Expense>;
}

export class AddExpenseUseCase {
	constructor(private readonly repository: ExpenseRepository) {}

	async execute(input: AddExpenseInput): Promise<AddExpenseOutput> {
		const amountError = validateExpenseAmount(input.amount);
		if (amountError) {
			throw new Error(amountError);
		}

		const categoryError = validateExpenseCategory(input.category);
		if (categoryError) {
			throw new Error(categoryError);
		}

		const expense = await this.repository.save({
			amount: input.amount,
			category: input.category,
			date: input.date,
			note: input.note,
		});

		return { expense };
	}
}
