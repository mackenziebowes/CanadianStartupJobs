# JobsProvider

A React Context provider that manages job data, filtering, search, and selection state for the job board application.

## Overview

`JobsProvider` wraps the application to provide centralized job management functionality through the `useJobsContext` hook. It handles fetching jobs from the API, applying filters, searching, and managing the currently selected job.

## Types

### `Job`

Represents a frontend job object with the following structure:

```typescript
type Job = {
  id: string;              // Unique job identifier
  title: string;           // Job title
  company: string;         // Company name
  description?: string;    // Job description
  applyUrl?: string;       // URL to apply for the job
  location?: string;       // Full location (city, province)
  province?: string;       // Province/state
  jobType?: string;        // Type of job (currently undefined)
  experience?: string;     // Experience level (currently undefined)
  industry?: string;       // Industry category (currently undefined)
  role?: string;           // Job role (currently undefined)
  [key: string]: unknown;  // Additional properties
}
```

### `JobsContextValue`

The context value interface providing all job-related state and actions:

```typescript
type JobsContextValue = {
  jobsById: Record<string, Job>;      // Jobs indexed by ID
  jobIds: string[];                   // All job IDs in order
  filteredJobIds: string[];           // Job IDs matching current filters/search
  filteredJobs: Job[];                // Jobs matching current filters/search
  searchTerm: string;                 // Current search term
  setSearchTerm: (term: string) => void;  // Update search term
  filters: FilterState;               // Current filter selections
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;  // Update filters
  selectedJobId: string | null;       // Currently selected job ID
  selectedJob: Job | null;            // Currently selected job object
  selectJob: (id: string) => void;    // Select a job by ID
  isLoading: boolean;                 // Loading state
}
```

## Architecture

The jobs context follows a separation of concerns pattern:

- **Context Provider** (`index.tsx`): Manages React state and orchestration
- **Helpers** (`helpers/`): Pure functions for data transformations and business logic

### Helper Modules

#### `helpers/mapping.ts`

Pure functions for converting API data to frontend format:

- `mapApiJobToFrontend(apiJob: ApiJob): Job` - Maps a single API job
- `mapApiJobsToFrontend(apiJobs: ApiJob[]): Record<string, Job>` - Maps array to keyed object

#### `helpers/filtering.ts`

Pure functions for filtering and transforming job collections:

- `filterJobsByTermAndFilters(jobsById, jobIds, filters, searchTerm): string[]` - Returns filtered job IDs
- `getJobsFromIds(jobsById, jobIds): Job[]` - Converts IDs back to Job objects

#### `helpers/selection.ts`

Pure functions for job selection logic:

- `getActiveJobId(filteredJobIds, selectedJobId): string | null` - Determines active job ID
- `getActiveJob(jobsById, activeJobId): Job | null` - Retrieves active job object

**Benefits of this architecture:**
- Pure functions are easily testable in isolation
- No React hooks in helpers - pure TypeScript logic
- Business logic is separated from state management
- Context component stays focused on React-specific concerns

## Components

### `JobsProvider`

**Parameters:**
- `children`: React.ReactNode - Child components to wrap

**Behavior:**
- Fetches jobs from the API on mount via `jobsApi.list()`
- Maps API job objects to frontend Job format
- Stores jobs in an object keyed by ID for O(1) lookups
- Applies filters and search terms to derive filtered job lists
- Manages the currently selected job, defaulting to the first filtered job

**State Management:**
- `jobsById`: Object storing all fetched jobs
- `searchTerm`: Current search input
- `filters`: Current filter selections (from `DEFAULT_FILTERS`)
- `selectedJobId`: Manually selected job ID
- `isLoading`: Loading state during fetch

**Key Logic:**

1. **Job Fetching** (index.tsx, lines 67-85):
   - Runs once on component mount
   - Fetches jobs from `jobsApi.list()`
   - Maps API jobs to frontend format using `mapApiJobsToFrontend()`
   - Stores result in `jobsById` state

2. **Filtering** (index.tsx + helpers/filtering.ts):
   - Uses `filterJobsByTermAndFilters()` helper
   - Filters jobs by checking against `FILTER_DROPDOWN_CONFIG`
   - Each filter key is checked; passes if:
     - Filter is at default value, OR
     - Job has a matching value for that key
   - If filters pass, checks search term against title and company

3. **Active Job Selection** (index.tsx + helpers/selection.ts):
   - Uses `getActiveJobId()` helper
   - Returns `null` if no filtered jobs
   - Returns selected job ID if it exists in filtered results
   - Defaults to first filtered job ID otherwise

### `useJobsContext()`

Custom hook to access the jobs context.

**Usage:**
```typescript
const {
  jobsById,
  filteredJobs,
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  selectedJob,
  selectJob,
  isLoading
} = useJobsContext();
```

**Error Handling:**
- Throws an error if called outside of `JobsProvider`

## Usage Example

```tsx
import { JobsProvider, useJobsContext } from "@/contexts/jobs";

function JobBoard() {
  const { filteredJobs, selectedJob, isLoading, selectJob } = useJobsContext();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <JobList jobs={filteredJobs} onSelect={selectJob} />
      <JobDetail job={selectedJob} />
    </div>
  );
}

function App() {
  return (
    <JobsProvider>
      <JobBoard />
    </JobsProvider>
  );
}
```

## Dependencies

- `@/data/api/jobs`: API client for fetching jobs
- `@/components/legacy/jobs/filterConfig`: Filter configuration and default state
- `@/contexts/jobs/helpers`: Pure helper functions for mapping, filtering, and selection

## Performance Optimizations

- Uses `useMemo` for derived state (filtered IDs, filtered jobs, active job)
- Uses `useCallback` for event handlers (`setSearchTerm`, `selectJob`)
- Stores jobs in object by ID for constant-time lookups
- Filter logic is extracted to pure functions - no React dependencies in helpers
- Filters using array methods with early returns for efficiency

## Testing

The helper functions in `helpers/` are pure functions and easily testable:

```typescript
// Example test for filterJobsByTermAndFilters
import { filterJobsByTermAndFilters } from "@/contexts/jobs/helpers/filtering";

const mockJobsById = {
  "1": { id: "1", title: "Software Engineer", company: "TechCorp", province: "ON" },
  "2": { id: "2", title: "Product Manager", company: "StartupInc", province: "BC" },
};

const result = filterJobsByTermAndFilters(
  mockJobsById,
  ["1", "2"],
  { province: "Any Province", ... },
  "software"
);
// result === ["1"]
```

This makes unit testing straightforward without needing to render React components.

## Notes

- Several Job fields are currently undefined (jobType, experience, industry, role) - likely awaiting schema updates or additional API data
- Filter configuration is externalized in `filterConfig.ts`
- Search is case-insensitive and matches against title and company only
