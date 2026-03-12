import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Personal Expense Tracker",
    description: "Track your personal expenses",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <CssBaseline />
                    {children}
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
