# Context Architecture

This directory contains React Context providers that manage shared state across the application.

## Philosophy

Our context system follows a **state-logic separation** pattern:

1. **React Context** manages state and orchestration only
2. **Pure helper functions** handle business logic and data transformations

This separation provides:
- **Testability**: Pure functions can be unit tested without React
- **Reusability**: Helpers can be imported and used outside of context
- **Clarity**: React components focus on React concerns (state, hooks, effects)
- **Maintainability**: Business logic is isolated and easier to reason about

## Architecture Pattern

Each context follows this structure:

```
contexts/
└── [domain]/
    ├── index.tsx          # Context provider + React state
    ├── types.ts           # TypeScript types for domain
    ├── helpers/           # Pure business logic functions
    └── [domain].md        # Detailed domain documentation
```

### Key Principles

1. **No React hooks in helpers**: Helper functions are pure TypeScript - no `useState`, `useEffect`, etc.

2. **Single responsibility**: Each helper file has one clear purpose (mapping, filtering, etc.)

3. **Derived state in Context**: Use `useMemo` for computed values, put the computation logic in helpers

4. **Typed everything**: Export types from `types.ts` and re-export from `index.tsx`

## When to Use Context

Context is appropriate for:

- **Global state** needed across many components (theme, user, job listings)
- **Derived state** that multiple components depend on
- **Complex state interactions** (filtering + searching + pagination)
- **Caching expensive computations** across component tree

Context is NOT appropriate for:

- Simple component-local state (use `useState` instead)
- Form state (use a form library or local state)
- One-time data fetches (use React Server Components)
- Performance-critical re-renders (consider state management libraries)

## Creating a New Context

Follow this template:

```typescript
// contexts/[domain]/types.ts
export type [Domain]State = { ... };
export type [Domain]ContextValue = { ... };
```

```typescript
// contexts/[domain]/helpers/[feature].ts
// Pure functions - no React imports
export function doSomething(input: Input): Output {
  // Pure business logic
}
```

```typescript
// contexts/[domain]/index.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type [Domain]ContextValue } from "./types";
import { doSomething } from "./helpers/[feature]";

const [Domain]Context = createContext<[Domain]ContextValue | undefined>(undefined);

export function [Domain]Provider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState);

  // React state management only
  const action = useCallback(() => {
    setState(prev => {
      // Use helper functions for logic
      return doSomething(prev);
    });
  }, []);

  // Derived state using helpers
  const derived = useMemo(() => {
    return doSomethingElse(state);
  }, [state]);

  const value = useMemo<[Domain]ContextValue>(
    () => ({ state, derived, action }),
    [state, derived, action]
  );

  return <[Domain]Context.Provider value={value}>{children}</[Domain]Context.Provider>;
}

export function use[Domain]Context() {
  const context = useContext([Domain]Context);
  if (!context) {
    throw new Error("use[Domain]Context must be used within [Domain]Provider");
  }
  return context;
}
```

## Best Practices

### 1. Keep Context Provider Minimal

The context provider should only:
- Manage React state
- Orchestrate side effects (useEffect)
- Call helper functions
- Memoize and export values

Avoid:
- Complex business logic directly in the provider
- Large object literals in useMemo - extract to helpers
- Nested useMemo/useCallback chains - simplify structure

### 2. Use TypeScript Strictly

- Export all types from `types.ts`
- Use exact types (no `any` or loose `Record<string, unknown>`)
- Define context value interface explicitly

### 3. Optimize Re-renders

```typescript
// ❌ Bad - causes unnecessary re-renders
const value = { state, dispatch };

// ✅ Good - memoized
const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
```

### 4. Handle Errors Gracefully

```typescript
export function use[Domain]Context() {
  const context = useContext([Domain]Context);
  if (!context) {
    throw new Error("use[Domain]Context must be used within [Domain]Provider");
  }
  return context;
}
```

### 5. Document Your Context

Create a `[domain].md` file documenting:
- What the context manages
- Available state and actions
- Usage examples
- Architecture decisions
- Dependencies

## Current Contexts

### Jobs Context (`contexts/jobs`)

Manages job listings, filtering, searching, and pagination.

**State:**
- `jobsById`: All fetched jobs (indexed for O(1) lookup)
- `searchTerm`: Current search input
- `filters`: Current filter selections
- `isLoading`: Loading state
- `currentPage`: Current page for pagination
- `totalJobs`: Total count of jobs in database

**Derived State:**
- `jobIds`: All job IDs
- `filteredJobIds`: IDs matching filters/search
- `filteredJobs`: Job objects matching filters/search
- `totalPages`: Total pages calculated from count

**Actions:**
- `setSearchTerm`: Update search term
- `setFilters`: Update filter selections
- `goToPage`, `nextPage`, `prevPage`: Pagination navigation

**Key Design Decisions:**
- Simple jobs vs Rich jobs: Lists fetch lightweight jobs, detail pages fetch rich data with organization/tags
- Server-side pagination: API supports `skip/take` for efficient data loading
- Client-side filtering: Applied to fetched page for immediate feedback

**See**: `contexts/jobs/jobsProvider.md` for complete documentation.

## Related Patterns

### React Server Components

For data that doesn't need client-side interactivity:
- Use Server Components to fetch data before rendering
- Bypass context entirely - no loading states, no client JavaScript
- Example: `app/jobs/[id]/page.tsx` fetches rich job data server-side

### SWR / React Query

For remote data with caching and automatic revalidation:
- Consider for data that changes frequently
- Provides built-in loading/error states, deduplication, refetching
- Can be combined with Context for derived state

## Resources

- [React Context Documentation](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [When to Use Context](https://react.dev/learn/passing-data-deeply-with-context)
- [useMemo and useCallback](https://react.dev/reference/react/useMemo)
