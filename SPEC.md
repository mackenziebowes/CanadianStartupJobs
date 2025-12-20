# Specification Document

This document outlines the requirements and implementation details for the upcoming tasks.

## 1. Job Function Implementation

### High-Level Goal
The objective is to implement a robust system for discovering, extracting, and ingesting job postings from a source URL. This system will mirror the architectural patterns established in the existing `organizations` flow.

### Core Strategy: Duplicate and Adapt
We will replicate the "Two-Pass Agentic Workflow" (Discovery -> Extraction) used for creating new organizations. This ensures consistency and leverages our existing, battle-tested logic.

### Key Components to be Created:
1.  **AI Orchestrator Function:** `apps/server/src/lib/ai/functions/createNewJobFromURL.ts`
2.  **AI Prompts:** New prompts in `apps/server/src/lib/ai/prompts/` for discovering job details from a generic careers page and extracting them into a structured format.
3.  **Test Script:** A new script, likely `apps/server/src/scripts/3-add-job.ts`, to test the end-to-end flow.

### Reusable Components:
-   **AI Tools:** The existing `readPage` and `searchSite` tools will be reused.
-   **Database Schema:** The `jobs` schema from the `@canadian-startup-jobs/db` package will be the target for data insertion.
-   **Observability:** The `observePrepareSteps` function will be used for debugging and monitoring the new agentic flows.

## 2. Tasks / Conditions for Success
1.  Create the file `apps/server/src/lib/ai/functions/createNewJobFromURL.ts`.
2.  Copy the contents of `createNewOrganizationFromURL.ts` into `createNewJobFromURL.ts`.
3.  Create the prompt file `apps/server/src/lib/ai/prompts/discoverNewJob.ts`.
4.  Create the prompt file `apps/server/src/lib/ai/prompts/getNewJob.ts`.

5.  Create the Zod schema `orgTagNameSchema` in `apps/server/src/lib/ai/tools/db.ts`.
6.  Populate `orgTagNameSchema` with the org tag categories ("Team Size", "Raising Stage", "Province", "Industry").
7.  Update the existing org-tagging tool inputs in `apps/server/src/lib/ai/tools/db.ts` to use `orgTagNameSchema`.

8.  Create the Zod schema `jobTagNameSchema` in `apps/server/src/lib/ai/tools/db.ts`.
9.  Populate `jobTagNameSchema` with the job tag categories ("Experience Level", "Role", "Job Type", "Province", "Industry").
10. Create the Zod schema `connectJobTagSchema` in `apps/server/src/lib/ai/tools/db.ts`.
11. Add the pivot module import `jobPivots` from `apps/server/src/functions/pivots/jobs.ts` to `apps/server/src/lib/ai/tools/db.ts`.
12. Implement `connectJobToTag` in `apps/server/src/lib/ai/tools/db.ts`.
13. Map each value of `jobTagNameSchema` to the correct `jobPivots` add function.
14. Export `connectJobToTag` from `apps/server/src/lib/ai/tools/index.ts`.

15. Create the test script `apps/server/src/scripts/3-add-job.ts`.
16. Select a stable test job URL to use in `apps/server/src/scripts/3-add-job.ts`.

17. Rename organization-specific identifiers in `createNewJobFromURL.ts` to job-specific identifiers.
18. Replace the organization schema with the jobs schema in `createNewJobFromURL.ts`.
19. Replace the organization insert logic with a jobs insert in `createNewJobFromURL.ts`.

20. Integrate `observePrepareSteps` into the discovery phase (`generateText` call) within `createNewJobFromURL.ts`.
21. Integrate `observePrepareSteps` into the extraction phase (`generateObject` call) within `createNewJobFromURL.ts`.

22. Populate `discoverNewJob.ts`.
23. Populate `getNewJob.ts`.

24. Update the test script `3-add-job.ts` to execute the `createNewJobFromURL` function.
25. Confirm the `generateObject` call within `createNewJobFromURL.ts` is configured with the correct Zod schema for a new job.
26. Confirm the function correctly inserts the final job object into the database.
27. Confirm the flow connects the job to at least one tag pivot via `connectJobToTag`.
28. Confirm the job tag pivots are written to the correct tables (`jobsExperienceLevels`, `jobsRoles`, `jobsJobTypes`, `jobsIndustries`, `jobsProvinces`).
29. Verify the final implementation reuses the existing `readPage` tool.
30. Verify the final implementation reuses the existing `searchSite` tool.

## 3. Review Notes (Potential “Stripe Engineer” Nitpicks)
- Tooling separation: ensure org-tagging tools and job-tagging tools are distinct so agents cannot call invalid pivots.
- End-to-end definition of “done”: confirm success includes pivot table inserts (e.g., `jobsExperienceLevels`, `jobsRoles`, `jobsJobTypes`, `jobsIndustries`, `jobsProvinces`).
- Test determinism: pick a stable test URL and capture expected outputs (at least at the schema-validation layer).
- Observability coverage: confirm logging is attached before first test run, and consider logging both discovery and extraction phases.
- Atomic tasks: avoid combining multiple code changes in a single checklist item (keep tasks mechanically verifiable).
