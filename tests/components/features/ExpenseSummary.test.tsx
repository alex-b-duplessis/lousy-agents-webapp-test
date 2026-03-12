import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExpenseSummary } from "@/components/features/ExpenseSummary";

describe("ExpenseSummary", () => {
    describe("given a total of zero", () => {
        it("should display $0.00", () => {
            render(<ExpenseSummary total={0} />);
            expect(screen.getByLabelText("expense total")).toHaveTextContent(
                "$0.00",
            );
        });
    });

    describe("given a positive total", () => {
        it("should display the formatted total", () => {
            render(<ExpenseSummary total={123.45} />);
            expect(screen.getByLabelText("expense total")).toHaveTextContent(
                "$123.45",
            );
        });
    });

    describe("given a large total", () => {
        it("should format with thousands separator", () => {
            render(<ExpenseSummary total={1234.5} />);
            expect(screen.getByLabelText("expense total")).toHaveTextContent(
                "$1,234.50",
            );
        });
    });
});
