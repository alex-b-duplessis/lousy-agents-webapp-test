"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ExpenseFilter } from "@/components/features/ExpenseFilter";
import { ExpenseForm } from "@/components/features/ExpenseForm";
import { ExpenseList } from "@/components/features/ExpenseList";
import { ExpenseSummary } from "@/components/features/ExpenseSummary";
import { useExpenses } from "@/hooks";

export default function HomePage() {
    const {
        expenses,
        total,
        loading,
        error,
        success,
        filter,
        addExpense,
        setFilter,
    } = useExpenses();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Personal Expense Tracker
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        <ExpenseForm
                            onSubmit={addExpense}
                            error={error}
                            success={success}
                        />
                        <Divider />
                        <ExpenseFilter
                            filter={filter}
                            onFilterChange={setFilter}
                        />
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <ExpenseSummary total={total} />
                        <Typography variant="h6">Expenses</Typography>
                        <ExpenseList expenses={expenses} loading={loading} />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
