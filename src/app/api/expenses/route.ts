import { NextResponse } from "next/server";
import type { Expense } from "@/entities/expense";
import {
    validateExpenseAmount,
    validateExpenseCategory,
} from "@/entities/expense";

const expenses: Expense[] = [];
let nextId = 1;

export async function GET() {
    return NextResponse.json(expenses);
}

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 },
        );
    }

    if (
        typeof body !== "object" ||
        body === null ||
        !("amount" in body) ||
        !("category" in body) ||
        !("date" in body)
    ) {
        return NextResponse.json(
            { error: "Missing required fields: amount, category, date" },
            { status: 400 },
        );
    }

    const { amount, category, date, note } = body as Record<string, unknown>;

    if (typeof amount !== "number") {
        return NextResponse.json(
            { error: "amount must be a number" },
            { status: 400 },
        );
    }

    const amountError = validateExpenseAmount(amount);
    if (amountError) {
        return NextResponse.json({ error: amountError }, { status: 400 });
    }

    if (typeof category !== "string") {
        return NextResponse.json(
            { error: "category must be a string" },
            { status: 400 },
        );
    }

    const categoryError = validateExpenseCategory(category);
    if (categoryError) {
        return NextResponse.json({ error: categoryError }, { status: 400 });
    }

    if (typeof date !== "string") {
        return NextResponse.json(
            { error: "date must be a string" },
            { status: 400 },
        );
    }

    const expense: Expense = {
        id: String(nextId++),
        amount,
        category,
        date,
        note: typeof note === "string" ? note : undefined,
    };

    expenses.push(expense);

    return NextResponse.json(expense, { status: 201 });
}
