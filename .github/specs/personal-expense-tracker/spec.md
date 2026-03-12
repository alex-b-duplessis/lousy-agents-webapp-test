# Feature: Personal Expense Tracker

## Problem Statement

Individuals who track personal finances lack a simple, structured tool to log, categorise, and summarise daily expenses. Without such a tool, they accumulate unreviewed receipts and lose visibility into their spending patterns. This feature provides a focused web interface for capturing and reviewing personal expenses with real-time totals.

## Personas

| Persona | Impact | Notes |
|---------|--------|-------|
| Budget-Conscious Individual | Positive | Primary user; logs and reviews personal expenses regularly |
| Casual User | Positive | Occasionally logs expenses; benefits from simple, forgiving UX |

## Value Assessment

- **Primary value**: Efficiency — reduces manual effort to track personal spending
- **Secondary value**: Customer — increases user satisfaction through immediate feedback and clear validation

## User Stories

### Story 1: Log an Expense

As a **Budget-Conscious Individual**,
I want **to submit an expense with amount, category, date, and an optional note**,
so that I can **keep an accurate record of where my money goes**.

#### Acceptance Criteria

- When a user submits the expense form, the system shall validate that the amount is a positive number greater than zero.
- When a user submits a valid expense, the system shall add it to the expense list and display a success confirmation message.
- If the API returns an error, then the system shall display an error message without clearing the form.
- The system shall require a category to be selected before submission.

---

### Story 2: View and Filter Expenses

As a **Budget-Conscious Individual**,
I want **to view all my expenses and filter them by category or date range**,
so that I can **understand my spending patterns for specific periods or categories**.

#### Acceptance Criteria

- The system shall display the total sum of all currently visible expenses.
- When a category filter is applied, the system shall display only expenses matching that category.
- When a date range filter is applied, the system shall display only expenses within that date range.
- While no filters are active, the system shall display all recorded expenses.

---

## Design

> Refer to `.github/copilot-instructions.md` for technical standards.

### Architecture

The application follows Clean Architecture principles with four layers:

1. **Entities** — `Expense` type, business rules (amount validation, category validation, total calculation)
2. **Use Cases** — `AddExpenseUseCase`, `GetExpensesUseCase` with port interfaces
3. **Gateways/Adapters** — `ExpenseApiGateway` calling the BFF API route; React hooks; UI components
4. **Infrastructure** — Next.js App Router pages and API routes

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                        │
│                                                                 │
│  ┌──────────────┐   ┌───────────────┐   ┌───────────────────┐   │
│  │ ExpenseForm  │   │  ExpenseList  │   │  ExpenseSummary   │   │
│  │  Component   │   │  Component    │   │    Component      │   │
│  └──────┬───────┘   └───────┬───────┘   └────────┬──────────┘   │
│         │                   │                    │              │
│         └───────────────────┴────────────────────┘              │
│                             │                                   │
│                    ┌────────▼────────┐                          │
│                    │  useExpenses()  │  (React Hook)            │
│                    └────────┬────────┘                          │
│                             │                                   │
│              ┌──────────────┴───────────┐                       │
│              │                          │                       │
│   ┌──────────▼──────────┐  ┌────────────▼────────────┐          │
│   │ AddExpenseUseCase   │  │  GetExpensesUseCase     │          │
│   │  (validates input)  │  │  (filters expenses)     │          │
│   └──────────┬──────────┘  └────────────┬────────────┘          │
│              │                          │                       │
│              └──────────────┬───────────┘                       │
│                             │                                   │
│                  ┌──────────▼───────────┐                       │
│                  │  ExpenseApiGateway   │                       │
│                  │  (fetch calls BFF)   │                       │
│                  └──────────┬───────────┘                       │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTP (fetch)
┌─────────────────────────────▼───────────────────────────────────┐
│                        Next.js Server (BFF)                     │
│                                                                 │
│              ┌──────────────────────────────┐                   │
│              │  /api/expenses  (route.ts)   │                   │
│              │  GET  → list expenses        │                   │
│              │  POST → create expense       │                   │
│              └──────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
```

### Sequence Diagram: Adding an Expense

```
User          ExpenseForm   useExpenses   AddExpenseUseCase  ExpenseApiGateway  API Route
 │                │               │               │                  │               │
 │──submit form──►│               │               │                  │               │
 │                │─addExpense()─►│               │                  │               │
 │                │               │──execute(in)─►│                  │               │
 │                │               │               │──validateAmount()│               │
 │                │               │               │  ✓ valid         │               │
 │                │               │               │──validateCategory│               │
 │                │               │               │  ✓ valid         │               │
 │                │               │               │──save(expense)──►│               │
 │                │               │               │                  │──POST /api/──►│
 │                │               │               │                  │◄─201 expense──│
 │                │               │◄──{ expense }────────────────────│               │
 │                │◄─success──────│               │                  │               │
 │◄─show confirm──│               │               │                  │               │

If validation fails:
 │──submit form──►│               │               │                  │               │
 │                │─addExpense()─►│               │                  │               │
 │                │               │──execute(in)─►│                  │               │
 │                │               │               │──validateAmount()│               │
 │                │               │               │  ✗ invalid       │               │
 │                │               │◄─throw Error──│                  │               │
 │                │◄─error msg────│               │                  │               │
 │◄─show error────│               │               │                  │               │
 │  (form kept)   │               │               │                  │               │
```

### Sequence Diagram: Viewing Filtered Expenses

```
User          ExpenseFilter  useExpenses  GetExpensesUseCase  ExpenseApiGateway  API Route
 │                │               │               │                  │               │
 │─apply filter──►│               │               │                  │               │
 │                │──setFilter()─►│               │                  │               │
 │                │               │──execute(in)─►│                  │               │
 │                │               │               │──findAll()──────►│               │
 │                │               │               │                  │──GET /api/───►│
 │                │               │               │                  │◄─200 list─────│
 │                │               │               │◄─expenses────────│               │
 │                │               │               │──filter locally──│               │
 │                │               │◄─{ expenses }─│                  │               │
 │                │               │──recalc total─│                  │               │
 │◄─updated list──│               │               │                  │               │
```

### Components Affected

- `src/entities/expense.ts` — Expense type, validation functions, total calculation
- `src/use-cases/add-expense.ts` — Add expense use case with port interface
- `src/use-cases/get-expenses.ts` — Get/filter expenses use case with port interface
- `src/gateways/expense-api-gateway.ts` — HTTP gateway implementing both ports
- `src/app/api/expenses/route.ts` — BFF API route (GET list, POST create)
- `src/hooks/use-expenses.ts` — React hook wiring use cases to components
- `src/hooks/index.ts` — Composition root for hooks
- `src/components/features/ExpenseForm.tsx` — MUI form for adding expenses
- `src/components/features/ExpenseList.tsx` — MUI list displaying expenses
- `src/components/features/ExpenseFilter.tsx` — Category and date range filter controls
- `src/components/features/ExpenseSummary.tsx` — Running total display
- `src/app/layout.tsx` — Root layout with MUI theme provider
- `src/app/page.tsx` — Main page composing all components

### Dependencies

- `zod` — Runtime validation of API responses (to be installed)
- `@mui/material` — Already installed; used for all UI components
- `@emotion/server` — Already installed; used for MUI SSR

### Data Model

```typescript
interface Expense {
  readonly id: string;
  readonly amount: number;       // positive, > 0
  readonly category: string;     // required, from EXPENSE_CATEGORIES
  readonly date: string;         // ISO date string YYYY-MM-DD
  readonly note?: string;        // optional free text
}

const EXPENSE_CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Other'
] as const;
```

### Open Questions

- [x] Should the app persist data across page refreshes? → No, in-memory storage in BFF is sufficient for v1.
- [x] Should filters be applied client-side or server-side? → Client-side filtering for simplicity; use case handles it.

---

## Tasks

> Each task should be completable in a single coding agent session.
> Tasks are sequenced by dependency. Complete in order unless noted.

### Task 1: Create Expense Entities and Business Rules

**Objective**: Define the `Expense` type and pure business rule functions for validation and calculation.

**Context**: Entities form the innermost layer with zero external dependencies. Establishing them first ensures all other layers have a stable foundation.

**Affected files**:
- `src/entities/expense.ts`
- `tests/entities/expense.test.ts`

**Requirements**:
- When a user submits the expense form, the system shall validate that the amount is a positive number greater than zero.
- The system shall require a category to be selected before submission.
- The system shall display the total sum of all currently visible expenses.

**Verification**:
- [x] `npm test tests/entities/expense.test.ts` passes
- [x] `npx biome check src/entities/expense.ts` passes
- [x] Amount validation rejects 0, negative numbers, and non-numbers
- [x] Category validation rejects empty string
- [x] `calculateTotal` returns correct sum

**Done when**:
- [x] All verification steps pass
- [x] No new errors in affected files
- [x] Acceptance criteria for amount validation and category validation satisfied
- [x] Code follows patterns in `.github/copilot-instructions.md`

---

### Task 2: Create Use Cases

**Depends on**: Task 1

**Objective**: Implement `AddExpenseUseCase` and `GetExpensesUseCase` with repository port interfaces.

**Context**: Use cases contain application business logic and define ports (interfaces) for external dependencies. They must not import from gateways, components, or infrastructure.

**Affected files**:
- `src/use-cases/add-expense.ts`
- `src/use-cases/get-expenses.ts`
- `tests/use-cases/add-expense.test.ts`
- `tests/use-cases/get-expenses.test.ts`

**Requirements**:
- When a user submits the expense form, the system shall validate that the amount is a positive number greater than zero.
- When a user submits a valid expense, the system shall add it to the expense list.
- When a category or date range filter is applied, the system shall display only matching expenses.
- The system shall display the total sum of all currently visible expenses.

**Verification**:
- [x] `npm test tests/use-cases/` passes
- [x] `npx biome check src/use-cases/` passes
- [x] `AddExpenseUseCase.execute()` throws on invalid amount
- [x] `AddExpenseUseCase.execute()` throws on missing category
- [x] `GetExpensesUseCase.execute()` correctly filters by category and date range

**Done when**:
- [x] All verification steps pass
- [x] No new errors in affected files
- [x] Acceptance criteria for validation and filtering satisfied
- [x] Code follows patterns in `.github/copilot-instructions.md`

---

### Task 3: Create Expense API Gateway and BFF Route

**Depends on**: Task 2

**Objective**: Implement the HTTP gateway that calls the BFF API route, and the BFF route itself.

**Context**: The gateway adapts the HTTP interface to the port interfaces defined in the use cases. The BFF route acts as a proxy with in-memory storage for this v1 implementation.

**Affected files**:
- `src/gateways/expense-api-gateway.ts`
- `src/app/api/expenses/route.ts`

**Requirements**:
- If the API returns an error, then the system shall display an error message without clearing the form.
- When a user submits a valid expense, the system shall add it to the expense list.

**Verification**:
- [x] `npx biome check src/gateways/` passes
- [x] `npx biome check src/app/api/` passes
- [x] GET /api/expenses returns list of expenses
- [x] POST /api/expenses with valid body returns 201 with created expense
- [x] POST /api/expenses with invalid body returns 400

**Done when**:
- [x] All verification steps pass
- [x] No new errors in affected files
- [x] API error handling correctly propagates to use cases
- [x] Code follows patterns in `.github/copilot-instructions.md`

---

### Task 4: Create React Hook

**Depends on**: Task 3

**Objective**: Implement `useExpenses` React hook that wires the use cases to component state.

**Context**: The hook manages loading/error states and provides the public API for components. The composition root in `src/hooks/index.ts` wires together the gateway and use cases.

**Affected files**:
- `src/hooks/use-expenses.ts`
- `src/hooks/index.ts`
- `tests/hooks/use-expenses.test.ts`

**Requirements**:
- When a user submits a valid expense, the system shall add it to the list and display a success confirmation.
- If the API returns an error, then the system shall display an error message without clearing the form.
- The system shall display the total sum of all currently visible expenses.

**Verification**:
- [x] `npm test tests/hooks/` passes
- [x] `npx biome check src/hooks/` passes
- [x] Hook exposes `expenses`, `total`, `loading`, `error`, `addExpense`, `setFilter`
- [x] `addExpense` sets `success` state on success, `error` state on failure

**Done when**:
- [x] All verification steps pass
- [x] No new errors in affected files
- [x] Success confirmation and error message behavior satisfied
- [x] Code follows patterns in `.github/copilot-instructions.md`

---

### Task 5: Create UI Components

**Depends on**: Task 4

**Objective**: Implement all MUI React components for the expense tracker UI.

**Context**: Components are pure presentation adapters. They receive data as props and delegate all logic to hooks/use cases.

**Affected files**:
- `src/components/features/ExpenseForm.tsx`
- `src/components/features/ExpenseList.tsx`
- `src/components/features/ExpenseFilter.tsx`
- `src/components/features/ExpenseSummary.tsx`
- `tests/components/features/ExpenseForm.test.tsx`
- `tests/components/features/ExpenseList.test.tsx`
- `tests/components/features/ExpenseSummary.test.tsx`

**Requirements**:
- When a user submits the expense form, the system shall validate that the amount is a positive number greater than zero.
- When a user submits a valid expense, the system shall display a success confirmation message.
- If the API returns an error, then the system shall display an error message without clearing the form.
- The system shall display the total sum of all currently visible expenses.

**Verification**:
- [x] `npm test tests/components/` passes
- [x] `npx biome check src/components/` passes
- [x] Form shows validation error for invalid amount
- [x] Form shows success alert after successful submission
- [x] Form shows error alert on API failure (form not cleared)
- [x] Summary shows correct total

**Done when**:
- [x] All verification steps pass
- [x] No new errors in affected files
- [x] All acceptance criteria satisfied
- [x] Code follows patterns in `.github/copilot-instructions.md`

---

### Task 6: Create App Layout and Main Page

**Depends on**: Task 5

**Objective**: Wire up the layout with MUI theme provider and compose the main expense tracker page.

**Context**: The page is the composition root that assembles all components. The layout provides the global MUI theme and baseline CSS.

**Affected files**:
- `src/app/layout.tsx`
- `src/app/page.tsx`

**Requirements**:
- The system shall display the expense form, expense list, filter controls, and running total on the main page.

**Verification**:
- [x] `npm run build` passes
- [x] `npx biome check src/app/` passes
- [x] Page renders without errors in development mode

**Done when**:
- [x] All verification steps pass
- [x] No new errors in affected files
- [x] Full application renders and is usable
- [x] Code follows patterns in `.github/copilot-instructions.md`

---

## Out of Scope

- Data persistence beyond server restart (database integration)
- User authentication or multi-user support
- Editing or deleting existing expenses
- Export functionality (CSV, PDF)
- Currency selection
- Budget goals or alerts

## Future Considerations

- Add persistent storage (e.g., SQLite or Postgres via Prisma)
- Add user authentication for personal data isolation
- Add charts and spending analytics
- Add recurring expense templates
- Add budget limits per category with notifications
