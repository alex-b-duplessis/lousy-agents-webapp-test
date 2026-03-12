import type { Expense } from "../entities/expense";

export interface GetExpensesInput {
    category?: string;
    fromDate?: string;
    toDate?: string;
}

export interface GetExpensesOutput {
    expenses: Expense[];
}

export interface ExpenseQueryRepository {
    findAll(): Promise<Expense[]>;
}

export class GetExpensesUseCase {
    constructor(private readonly repository: ExpenseQueryRepository) {}

    async execute(input: GetExpensesInput = {}): Promise<GetExpensesOutput> {
        const allExpenses = await this.repository.findAll();

        let expenses = allExpenses;

        if (input.category) {
            expenses = expenses.filter((e) => e.category === input.category);
        }

        if (input.fromDate) {
            const from = input.fromDate;
            expenses = expenses.filter((e) => e.date >= from);
        }

        if (input.toDate) {
            const to = input.toDate;
            expenses = expenses.filter((e) => e.date <= to);
        }

        return { expenses };
    }
}
