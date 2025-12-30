# JobList Component

A modular job listing system with state-driven rendering, pagination, and flexible layout handling.

## Overview

`JobList` displays paginated job cards with loading states, empty states, and navigation controls. It follows a state-based rendering pattern where the Controller determines which child component to render based on current context state.

## Architecture

The component is organized into focused, state-driven sub-components:

```
JobList/
├── index.tsx          # Layout wrapper - section heading + Controller
├── Controller.tsx     # State router - determines which view to show
├── List.tsx           # Job cards scrollable area + pagination
├── ListPagination.tsx # Pagination controls with page numbers
├── Loading.tsx        # Loading spinner state
└── Empty.tsx          # Empty state with action buttons
```

### Key Principles

1. **State-based rendering**: Controller routes to appropriate component based on context state
2. **Separation of concerns**: Each component handles a single state or UI region
3. **Client-side pagination**: Page navigation handled via context, data fetched server-side
4. **Flexible layout**: Uses grid/flex with min-h-0 for proper scroll behavior
5. **Accessibility**: Semantic HTML with ARIA labels and roles

## Component Hierarchy

```
JobList (index.tsx) - Layout container
└── Controller (state router)
    ├── Loading (when isLoading)
    ├── Empty (when !isLoading && no jobs)
    └── List (when !isLoading && has jobs)
        ├── ScrollArea (job cards)
        └── ListPagination (page controls)
            └── JobCard × N (via jobsById)
```

## Sub-Components

### `index.tsx` (Layout Wrapper)

**Responsibility**: Provides the outer layout with heading.

**Props**: None (uses JobsContext internally)

**Behavior**:
- Renders a `<section>` with proper ARIA labels
- Shows "Latest Jobs" heading
- Delegates to Controller for actual job rendering

**HTML Structure**:
```tsx
<section aria-label="Job Listings" role="region">
  <h2>Latest Jobs</h2>
  <Controller />
</section>
```

**Styling**: `flex h-full min-h-0 flex-col space-y-3` for full-height flex container.

### `Controller.tsx` (State Router)

**Responsibility**: Routes to appropriate view based on loading and data state.

**Props**: None (consumes JobsContext)

**Behavior**:
- Reads `isLoading` and `jobsById` from context
- Renders `Loading` if `isLoading` is true
- Renders `Empty` if not loading and no jobs exist
- Renders `List` if not loading and jobs exist

**State Logic**:
```tsx
const isEmpty = Object.keys(jobsById).length === 0;

if (isLoading) return <Loading />;
if (isEmpty) return <Empty />;
return <List />;
```

**Styling**: `flex-1 min-h-0 h-full` for flex child with scroll constraints.

### `List.tsx` (Job Cards Container)

**Responsibility**: Displays scrollable job cards and pagination controls.

**Props**: None (consumes JobsContext)

**Behavior**:
- Reads `jobsById` from context (already paginated by context)
- Renders job cards in vertical stack
- Displays pagination controls at bottom
- Uses ScrollArea component for cross-platform scrolling

**Layout**: CSS Grid with 2 rows:
- Row 1 (4fr): Scrollable job cards area
- Row 2 (1fr): Pagination controls

**JobCard Integration**:
```tsx
{Object.keys(jobsById).map((key) => {
  const job = jobsById[key];
  return <JobCard key={`${job.title}-${key}`} job={job} />
})}
```

**Note**: `jobsById` contains only the current page's jobs (fetched via context with `skip/take`).

**Styling**:
- `grid grid-cols-1 grid-rows-[4fr, 1fr]` for 4:1 split
- `min-h-0 h-(--jl-h)` for scroll constraints
- `bg-linen-200/50` background color
- `gap-4` between job cards

### `ListPagination.tsx` (Pagination Controls)

**Responsibility**: Renders page navigation with number buttons and prev/next.

**Props**: None (consumes JobsContext)

**Consumed from Context**:
- `currentPage: number` - Current active page
- `totalPages: number` - Total pages available
- `goToPage: (page: number) => void` - Navigate to specific page
- `prevPage: () => void` - Navigate to previous page
- `nextPage: () => void` - Navigate to next page

**Behavior**:
- Generates button for each page (1 to totalPages)
- Highlights current page with "outline" variant
- Disables prev button on first page
- Disables next button on last page
- Each page button triggers `goToPage(pageNum)`

**Button States**:
```tsx
const hasNextPage = currentPage < totalPages;
const hasPreviousPage = currentPage > 1;

<Button onClick={prevPage} disabled={!hasPreviousPage}>
  <PaginationPrevious />
</Button>
```

**Page Numbers**:
```tsx
{Array.from({ length: totalPages }).map((_, index) => {
  const pageNum = index + 1;
  const isActive = pageNum === currentPage;
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      onClick={() => goToPage(pageNum)}
    >
      {pageNum}
    </Button>
  );
})}
```

**Styling**: `flex-1 px-8 h-16` for full-width pagination bar.

### `Loading.tsx` (Loading State)

**Responsibility**: Displays loading spinner during data fetch.

**Props**: None

**Behavior**: Renders a centered spinner from UI components.

**Component**: `Spinner` from `@/components/ui/spinner`

**When Shown**: When `isLoading` is true in JobsContext.

### `Empty.tsx` (Empty State)

**Responsibility**: Displays friendly empty state with action buttons.

**Props**: None

**Behavior**:
- Uses shadcn/ui `Empty` compound component
- Shows "No Jobs Found" title
- Shows "No jobs are currently viewable" description
- Provides "Clear Filters" and "Refresh" buttons

**Buttons**:
- **Clear Filters**: Primary button (intended to reset filters)
- **Refresh**: Secondary button (intended to refetch data)

**Note**: Buttons are currently not wired to context actions - future enhancement.

**When Shown**: When `!isLoading` and `jobsById` is empty.

## Data Flow

### Pagination Flow

```
User clicks page 3
  → ListPagination calls goToPage(3)
  → Context updates currentPage to 3
  → Context useEffect triggers jobsApi.list(skip=20, take=10)
  → API returns jobs for page 3 + total count
  → Context updates jobsById with new jobs
  → List re-renders with new job cards
```

### State Transitions

```
Initial State → Loading State → List State
                         ↓
                    Empty State (if no jobs)

List State (page change) → Loading State → List State (new page)
```

### Context Consumption

Each component consumes different parts of `JobsContext`:

| Component | Context Fields |
|-----------|----------------|
| Controller | `isLoading`, `jobsById` |
| List | `jobsById` |
| ListPagination | `currentPage`, `totalPages`, `goToPage`, `prevPage`, `nextPage` |

## Layout Architecture

### Flexbox + Grid Pattern

The component uses a hybrid layout approach:

1. **Outer (index.tsx)**: Flex column, full height
   ```tsx
   flex h-full min-h-0 flex-col
   ```

2. **Controller**: Flex child, expands to fill remaining space
   ```tsx
   flex-1 min-h-0 h-full
   ```

3. **List**: Grid with 2 rows (cards 75%, pagination 25%)
   ```tsx
   grid grid-cols-1 grid-rows-[4fr, 1fr] gap-8
   ```

4. **ScrollArea**: Handles scrolling within job cards area

### Why `min-h-0`?

The `min-h-0` class is critical for scroll behavior in nested flex containers:

- Flex children default to `min-height: auto` (no shrinking)
- This prevents them from shrinking below their content size
- `min-h-0` removes this constraint, allowing proper scroll behavior
- Without it, the ScrollArea won't know its max height

**Visual Example**:
```
Parent (h-full)
├── Heading (auto)
└── Controller (flex-1 min-h-0) ← Allows shrinking
    └── List (grid)
        ├── ScrollArea (4fr, min-h-0) ← Knows to shrink
        └── Pagination (1fr)
```

## Usage

### Basic Usage

```tsx
import JobList from "@/components/jobs/JobList";

// In a component wrapped by JobsProvider
function Sidebar() {
  return <JobList />;
}
```

### With JobsProvider

```tsx
import { JobsProvider } from "@/contexts/jobs";
import JobList from "@/components/jobs/JobList";

function App() {
  return (
    <JobsProvider>
      <JobList />
    </JobsProvider>
  );
}
```

### In a Layout Component

```tsx
// app/layout.tsx
import { JobsProvider } from "@/contexts/jobs";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <JobsProvider>
          <Sidebar />
          <MainContent>
            {children}
          </MainContent>
        </JobsProvider>
      </body>
    </html>
  );
}
```

## Pagination Configuration

### Page Size

The pagination uses a fixed page size of **10 jobs per page**:

```tsx
// In JobsContext
const pageSize = 10;
const skip = (currentPage - 1) * pageSize;
```

### API Integration

Pagination is fully integrated with the backend:

```tsx
// API call includes skip/take query params
const response = await jobsApi.list(skip, pageSize);
// GET /jobs?skip=0&take=10
```

### Total Pages Calculation

```tsx
const totalPages = Math.ceil(totalJobs / pageSize);
// If totalJobs = 25, pageSize = 10 → totalPages = 3
```

## Styling Guide

### Color Palette

- **Background**: `bg-linen-200/50` (light neutral beige)
- **JobCard**: `bg-copper-50/50` (light warm brown)
- **Text**: `text-charcoal-900/800/600` (grayscale)
- **Borders**: `border-black/50` (semi-transparent black)
- **Pagination**: Uses shadcn/ui Button variants (`ghost`, `outline`)

### Typography

- **Heading**: `text-lg font-semibold text-neutral-800`
- **Job title**: `text-lg font-semibold text-charcoal-900`
- **Company name**: `text-md text-charcoal-600`
- **Location**: `text-sm text-maritime-800`
- **Description**: `text-md text-charcoal-800`

### Spacing

- Section gap: `space-y-3` (12px)
- List grid gap: `gap-8` (32px)
- Card gap: `gap-4` (16px)
- Card padding: `px-4 py-4`

### Borders & Shadows

- **Card border**: `rounded-xs border border-black/50`
- **Card shadow**: `shadow-sm`
- **Hover**: `hover:border-black/40 hover:bg-linen-50`
- **Transitions**: `transition` on cards

## Design Patterns

### State Pattern

Controller implements the State Pattern by routing to different components based on state:

```tsx
{isLoading && <Loading />}
{!isLoading && isEmpty && <Empty />}
{!isLoading && !isEmpty && <List />}
```

**Benefits**:
- Clear separation of state handling
- Each state component is independent
- Easy to add new states

### Container/Presentational Pattern

- **Controller**: Container (logic, context consumption)
- **List, Empty, Loading**: Presentational (pure UI)
- **JobList (index)**: Layout container (structural)

**Benefits**:
- Logic isolated in Controller
- UI components are reusable
- Clear hierarchy

### Context Consumer Pattern

All child components consume from JobsContext via `useJobsContext()`:

```tsx
const { currentPage, goToPage, jobsById, isLoading } = useJobsContext();
```

**Benefits**:
- No prop drilling
- Single source of truth
- Shared state across components

## Advantages of This Architecture

1. **Testability**: Each component is small and focused
2. **Maintainability**: Clear separation of state, logic, and UI
3. **Reusability**: Components can be used independently (e.g., Empty state elsewhere)
4. **Performance**: Only re-renders context consumers when relevant state changes
5. **Accessibility**: Proper ARIA labels and semantic HTML
6. **Scalability**: Easy to add new states or modify pagination

## Testing

### Unit Testing Example

```tsx
// __tests__/JobList/Controller.test.tsx
import { render, screen } from "@testing-library/react";
import { JobsProvider, useJobsContext } from "@/contexts/jobs";
import Controller from "@/components/jobs/JobList/Controller";

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <JobsProvider>{children}</JobsProvider>;
}

describe("Controller", () => {
  it("renders Loading when isLoading is true", () => {
    render(<Controller />, { wrapper: TestWrapper });
    // JobsContext default is loading initially
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
```

### Integration Testing

```tsx
// __tests__/JobList/index.test.tsx
import { render, screen } from "@testing-library/react";
import JobList from "@/components/jobs/JobList";

describe("JobList", () => {
  it("renders section with proper ARIA labels", () => {
    render(<JobList />);
    expect(screen.getByRole("region", { name: "Job Listings" })).toBeInTheDocument();
    expect(screen.getByText("Latest Jobs")).toBeInTheDocument();
  });
});
```

### Pagination Testing

```tsx
// __tests__/JobList/ListPagination.test.tsx
import { render, screen } from "@testing-library/react";
import ListPagination from "@/components/jobs/JobList/ListPagination";
import { JobsProvider } from "@/contexts/jobs";

describe("ListPagination", () => {
  it("renders correct number of page buttons", () => {
    render(
      <JobsProvider>
        <ListPagination />
      </JobsProvider>
    );
    // Test based on mock data or mocked context
  });
});
```

## Current Limitations & Future Enhancements

### Known Limitations

1. **Empty state buttons not wired**: "Clear Filters" and "Refresh" buttons don't have click handlers
2. **Fixed page size**: Page size is hardcoded to 10 (could be configurable)
3. **No page limit**: Pagination shows all pages (could use ellipsis for many pages)
4. **Grid layout hack**: Uses CSS variables (`h-(--jl-h)`) for height

### Future Enhancements

1. **Wired empty state actions**:
   ```tsx
   const { clearFilters, refetch } = useJobsContext();
   <Button onClick={clearFilters}>Clear Filters</Button>
   <Button variant="secondary" onClick={refetch}>Refresh</Button>
   ```

2. **Configurable page size**:
   ```tsx
   interface JobListProps {
     pageSize?: number;  // Default 10
   }
   ```

3. **Ellipsis pagination** for large page counts:
   ```tsx
   // 1 2 3 ... 10 11 12 ... 98 99 100
   ```

4. **Smooth transitions** between pages with loading states

5. **Keyboard navigation** for pagination (arrow keys, page up/down)

6. **Mobile optimization**:
   - Collapsible job cards
   - Bottom sheet pagination on mobile

7. **Job filtering integration**: Show filtered count in pagination

8. **Infinite scroll option** as alternative to pagination

## Related Files

- **Context**: `apps/web/src/contexts/jobs/index.tsx` - Provides jobs state and pagination
- **JobCard**: `apps/web/src/components/jobs/JobCard.tsx` - Individual job display
- **API**: `apps/web/src/data/api/jobs/index.ts` - Backend client with pagination
- **Server**: `apps/server/src/routes/jobs/jobs.ts` - Backend pagination endpoint

## Dependencies

- **Context**: `@/contexts/jobs` - JobsContext with pagination state
- **UI Components**: `@/components/ui/*` (Spinner, Empty, Button, Pagination, ScrollArea)
- **JobCard**: `@/components/jobs/JobCard` - Reusable job card component
