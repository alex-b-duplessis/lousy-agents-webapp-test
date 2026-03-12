import { createExpenseApiGateway } from "@/gateways/expense-api-gateway";
import { AddExpenseUseCase } from "@/use-cases/add-expense";
import { GetExpensesUseCase } from "@/use-cases/get-expenses";
import { createUseExpensesHook } from "./use-expenses";

const expenseApiGateway = createExpenseApiGateway("");
const addExpenseUseCase = new AddExpenseUseCase(expenseApiGateway);
const getExpensesUseCase = new GetExpensesUseCase(expenseApiGateway);

export const useExpenses = createUseExpensesHook({
    addExpenseUseCase,
    getExpensesUseCase,
});
