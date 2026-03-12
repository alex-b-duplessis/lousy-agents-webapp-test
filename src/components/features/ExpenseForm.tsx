"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { EXPENSE_CATEGORIES } from "@/entities/expense";
import type { AddExpenseInput } from "@/use-cases/add-expense";

interface ExpenseFormProps {
    onSubmit: (input: AddExpenseInput) => Promise<void>;
    error: string | null;
    success: boolean;
}

export function ExpenseForm({ onSubmit, error, success }: ExpenseFormProps) {
    const today = new Date().toISOString().slice(0, 10);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(today);
    const [note, setNote] = useState("");
    const [amountError, setAmountError] = useState<string | null>(null);

    function validateAmount(value: string): string | null {
        const parsed = Number(value);
        if (value.trim() === "" || !Number.isFinite(parsed) || parsed <= 0) {
            return "Amount must be a positive number greater than zero";
        }
        return null;
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const validationError = validateAmount(amount);
        if (validationError) {
            setAmountError(validationError);
            return;
        }
        setAmountError(null);
        await onSubmit({
            amount: Number(amount),
            category,
            date,
            note: note.trim() || undefined,
        });
        if (!error) {
            setAmount("");
            setCategory("");
            setDate(today);
            setNote("");
        }
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Add expense form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <Typography variant="h6">Add Expense</Typography>

            {success && (
                <Alert severity="success" role="status">
                    Expense added successfully!
                </Alert>
            )}

            {error && (
                <Alert severity="error" role="alert">
                    {error}
                </Alert>
            )}

            <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => {
                    setAmount(e.target.value);
                    setAmountError(null);
                }}
                error={!!amountError}
                helperText={amountError ?? undefined}
                required
                inputProps={{ min: 0, step: "any" }}
            />

            <FormControl required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {EXPENSE_CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                multiline
                rows={2}
            />

            <Button type="submit" variant="contained" disabled={!category}>
                Add Expense
            </Button>
        </Box>
    );
}
