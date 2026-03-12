"use client";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { EXPENSE_CATEGORIES } from "@/entities/expense";
import type { GetExpensesInput } from "@/use-cases/get-expenses";

interface ExpenseFilterProps {
    filter: GetExpensesInput;
    onFilterChange: (filter: GetExpensesInput) => void;
}

export function ExpenseFilter({ filter, onFilterChange }: ExpenseFilterProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Filter Expenses</Typography>

            <FormControl fullWidth>
                <InputLabel id="filter-category-label">Category</InputLabel>
                <Select
                    labelId="filter-category-label"
                    value={filter.category ?? ""}
                    label="Category"
                    onChange={(e) =>
                        onFilterChange({
                            ...filter,
                            category: e.target.value || undefined,
                        })
                    }
                >
                    <MenuItem value="">All categories</MenuItem>
                    {EXPENSE_CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label="From date"
                type="date"
                value={filter.fromDate ?? ""}
                onChange={(e) =>
                    onFilterChange({
                        ...filter,
                        fromDate: e.target.value || undefined,
                    })
                }
                InputLabelProps={{ shrink: true }}
            />

            <TextField
                label="To date"
                type="date"
                value={filter.toDate ?? ""}
                onChange={(e) =>
                    onFilterChange({
                        ...filter,
                        toDate: e.target.value || undefined,
                    })
                }
                InputLabelProps={{ shrink: true }}
            />
        </Box>
    );
}
