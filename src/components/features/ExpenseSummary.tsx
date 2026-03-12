"use client";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { formatAmount } from "@/entities/expense";

interface ExpenseSummaryProps {
    total: number;
}

export function ExpenseSummary({ total }: ExpenseSummaryProps) {
    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
                Total
            </Typography>
            <Typography
                variant="h5"
                fontWeight="bold"
                aria-label="expense total"
            >
                {formatAmount(total)}
            </Typography>
        </Paper>
    );
}
