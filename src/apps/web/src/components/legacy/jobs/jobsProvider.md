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

1. **Job Fetching** (lines 68-86):
   - Runs once on component mount
   - Fetches jobs from `jobsApi.list()`
   - Maps API jobs to frontend format using `mapApiJobToFrontend()`
   - Converts array to object keyed by ID

2. **Filtering** (lines 88-109):
   - Filters jobs by checking against `FILTER_DROPDOWN_CONFIG`
   - Each filter key is checked; passes if:
     - Filter is at default value, OR
     - Job has a matching value for that key
   - If filters pass, checks search term against title and company

3. **Active Job Selection** (lines 116-120):
   - Returns `null` if no filtered jobs
   - Returns selected job ID if it exists in filtered results
   - Defaults to first filtered job ID otherwise

### `mapApiJobToFrontend()`

Maps an API job object to the frontend Job type:

```typescript
const mapApiJobToFrontend = (apiJob: ApiJob): Job => ({
  id: apiJob.id.toString(),
  title: apiJob.title,
  company: apiJob.company,
  description: apiJob.description,
  location: `${apiJob.city}, ${apiJob.province}`,
  province: apiJob.province,
  applyUrl: apiJob.posting_url || apiJob.job_board_url,
  jobType: undefined,
  experience: undefined,
  industry: undefined,
  role: undefined,
})
```

**Key Notes:**
- Converts numeric ID to string
- Combines city and province for location
- Prefers `posting_url` but falls back to `job_board_url`
- Several fields are currently undefined (jobType, experience, industry, role)

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
import { JobsProvider, useJobsContext } from "@/components/jobs/jobsProvider";

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
- `@/components/jobs/filterConfig`: Filter configuration and default state

## Performance Optimizations

- Uses `useMemo` for derived state (filtered IDs, filtered jobs, active job)
- Uses `useCallback` for event handlers (`setSearchTerm`, `selectJob`)
- Stores jobs in object by ID for constant-time lookups
- Filters using array methods with early returns for efficiency

## Notes

- Several Job fields are currently undefined (jobType, experience, industry, role) - likely awaiting schema updates or additional API data
- Filter configuration is externalized in `filterConfig.ts`
- Search is case-insensitive and matches against title and company only
