"use client";

import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import React from "react";
import type { Expense } from "@/entities/expense";
import { formatAmount } from "@/entities/expense";

interface ExpenseListProps {
    expenses: Expense[];
    loading: boolean;
}

export function ExpenseList({ expenses, loading }: ExpenseListProps) {
    if (loading) {
        return (
            <Typography color="text.secondary">Loading expenses…</Typography>
        );
    }

    if (expenses.length === 0) {
        return (
            <Typography color="text.secondary">
                No expenses recorded yet.
            </Typography>
        );
    }

    return (
        <List disablePadding>
            {expenses.map((expense, index) => (
                <React.Fragment key={expense.id}>
                    <ListItem alignItems="flex-start" disableGutters>
                        <ListItemText
                            primary={
                                <>
                                    <Typography
                                        component="span"
                                        fontWeight="medium"
                                    >
                                        {formatAmount(expense.amount)}
                                    </Typography>
                                    —
                                    <Chip
                                        label={expense.category}
                                        size="small"
                                    />
                                </>
                            }
                            secondary={
                                <>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {expense.date}
                                    </Typography>
                                    {expense.note && (
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            sx={{ ml: 1 }}
                                        >
                                            {expense.note}
                                        </Typography>
                                    )}
                                </>
                            }
                        />
                    </ListItem>
                    {index < expenses.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </List>
    );
}
