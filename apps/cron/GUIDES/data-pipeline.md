# Data Pipeline Architecture

## Current State

The current pipeline is designed to discover Canadian startup job boards and scrape jobs from them.

### 1. Ingestion & Discovery
- **Entry Point**: `src/index.ts` seeds the system with initial company directory URLs (from `src/data/sources.ts`).
- **Queue**: `map-company-directories`
- **Worker**: `src/workers/mapCompanyDirWorker.ts`
    - Scrapes the initial URLs to find:
        - **Company Directories**: Other lists of startups.
        - **Job Boards**: Direct links to career pages (e.g., Greenhouse, Levit, etc.).
    - Discovered items are pushed to their respective queues.

### 2. Recursive Discovery
- **Queue**: `company-directories`
- **Worker**: `src/workers/companyDirWorker.ts`
    - Scrapes discovered company directories to find *more* job boards and directories.
    - Has depth control (recursion limit) to prevent infinite crawling.

### 3. Job Extraction & Storage (Combined)
- **Queue**: `job-boards`
- **Worker**: `src/workers/jobBoardWorker.ts`
    - **Scrape**: Uses `scrapeJobsFromJobBoards` (via Firecrawl) to extract structured job data from career pages.
    - **Save**: Immediately transforms and upserts this data into the database (`@canadian-startup-jobs/db`).
    - **Current Schema**:
        - Title, Location, RemoteOk, Salary Range
        - Description, Company Name
        - URLs (Job Board & Individual Posting)
        - Startup verification flag

---

## Proposed Pipeline (With Data Annotation)

To integrate an AI annotation step, we need to decouple the **Extraction** phase from the **Storage** phase.

### 1. Discovery (Unchanged)
- `mapCompanyDirWorker` and `companyDirWorker` continue to populate the `job-boards` queue.

### 2. Job Extraction (Modified)
- **Queue**: `job-boards`
- **Worker**: `src/workers/jobBoardWorker.ts`
    - **Action**: Scrapes the job board as before.
    - **Change**: Instead of writing to the DB, it pushes the raw `ScrapedJob[]` data to a new queue: `annotate-jobs`.

### 3. Data Annotation (New Step)
- **Queue**: `annotate-jobs` (New)
- **Worker**: `src/workers/annotateJobWorker.ts` (New)
    - **Input**: Raw `ScrapedJob` objects.
    - **Action**:
        - Uses `src/ai/providers.ts` to process the job description/metadata.
        - **Tasks**:
            - Standardize location/salary.
            - Tag technologies/skills.
            - Verify "startup" status with higher confidence.
            - Generate a short summary.
    - **Output**: Enhanced `AnnotatedJob` objects pushed to `save-jobs` queue.

### 4. Storage (New Step)
- **Queue**: `save-jobs` (New)
- **Worker**: `src/workers/saveJobWorker.ts` (New)
    - **Input**: `AnnotatedJob` objects.
    - **Action**: Performs the database upsert logic (checking for existing URLs, updating vs inserting) that previously lived in `jobBoardWorker`.

## Implementation Plan

1.  **Define Queues**: Add `annotate-jobs` and `save-jobs` to `src/lib/queues.ts`.
2.  **Create Workers**:
    - Create `src/workers/annotateJobWorker.ts`.
    - Create `src/workers/saveJobWorker.ts`.
3.  **Refactor**:
    - Modify `src/workers/jobBoardWorker.ts` to forward data instead of saving.
    - Register new workers in `src/workers/workers.ts`.
