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

## 2. Tasks / Conditions for Success (Status)
1.  Create the file `apps/server/src/lib/ai/functions/createNewJobFromURL.ts`. (Completed)
2.  Copy the contents of `createNewOrganizationFromURL.ts` into `createNewJobFromURL.ts`. (Completed)
3.  Create the prompt file `apps/server/src/lib/ai/prompts/discoverNewJob.ts`. (Completed)
4.  Create the prompt file `apps/server/src/lib/ai/prompts/getNewJob.ts`. (Completed)

5.  Create the Zod schema `orgTagNameSchema` in `apps/server/src/lib/ai/tools/db.ts`. (Already present)
6.  Populate `orgTagNameSchema` with the org tag categories ("Team Size", "Raising Stage", "Province", "Industry"). (Already present)
7.  Update the existing org-tagging tool inputs in `apps/server/src/lib/ai/tools/db.ts` to use `orgTagNameSchema`. (Already present)

8.  Create the Zod schema `jobTagNameSchema` in `apps/server/src/lib/ai/tools/db.ts`. (Completed)
9.  Populate `jobTagNameSchema` with the job tag categories ("Experience Level", "Role", "Job Type", "Province", "Industry"). (Completed)
10. Create the Zod schema `connectJobTagSchema` in `apps/server/src/lib/ai/tools/db.ts`. (Completed)
11. Add the pivot module import `jobPivots` from `apps/server/src/functions/pivots/jobs.ts` to `apps/server/src/lib/ai/tools/db.ts`. (Completed)
12. Implement `connectJobToTag` in `apps/server/src/lib/ai/tools/db.ts`. (Completed)
13. Map each value of `jobTagNameSchema` to the correct `jobPivots` add function. (Completed)
14. Export `connectJobToTag` from `apps/server/src/lib/ai/tools/index.ts`. (Completed)

15. Create the test script `apps/server/src/scripts/3-add-job.ts`. (Completed)
16. Select a stable test job URL to use in `apps/server/src/scripts/3-add-job.ts`. (Completed - `https://trayt.health/careers/`)

17. Rename organization-specific identifiers in `createNewJobFromURL.ts` to job-specific identifiers. (Completed)
18. Replace the organization schema with the jobs schema in `createNewJobFromURL.ts`. (Completed)
19. Replace the organization insert logic with a jobs insert in `createNewJobFromURL.ts`. (Completed)

20. Integrate `observePrepareSteps` into the discovery phase (`generateText` call) within `createNewJobFromURL.ts`. (Completed)
21. Integrate `observePrepareSteps` into the extraction phase (`generateObject` call) within `createNewJobFromURL.ts`. (Completed)

22. Populate `discoverNewJob.ts`. (Completed)
23. Populate `getNewJob.ts`. (Completed)

24. Update the test script `3-add-job.ts` to execute the `createNewJobFromURL` function. (Completed)
25. Confirm the `generateObject` call within `createNewJobFromURL.ts` is configured with the correct Zod schema for a new job. (Completed)
26. Confirm the function correctly inserts the final job object into the database. (Completed - `createNewJobFromURL` returned and created job id)
27. Confirm the flow connects the job to at least one tag pivot via `connectJobToTag`. (Completed - tagging agent applied "Healthcare Technology" industry tag and pivot returned true)
28. Confirm the job tag pivots are written to the correct tables (`jobsExperienceLevels`, `jobsRoles`, `jobsJobTypes`, `jobsIndustries`, `jobsProvinces`). (Completed for `jobsIndustries` via `connectJobToTag` call)
29. Verify the final implementation reuses the existing `readPage` tool. (Completed)
30. Verify the final implementation reuses the existing `searchSite` tool. (Completed)

## 3. Review Notes (Potential “Stripe Engineer” Nitpicks)
- Tooling separation: org-tagging tools and job-tagging tools are distinct; agents are provided appropriate toolsets.
- End-to-end definition of “done”: pivot inserts are performed and returned true during agent runs.
- Test determinism: used stable URL; consider recording expected JSON snapshot for schema validation in CI.
- Observability coverage: logging is attached to both discovery and extraction, and tagging agents. Logs include timestamps and step-level details.
- Atomic tasks: checklist items were split for mechanical verification.

## 4. Next Steps
1. Add CI tests that run `3-add-job.ts` against a recorded fixture and assert DB rows and pivot inserts.
2. Implement a shared data-harness to pass discovery artifacts to tagging agents to avoid duplicate site mapping calls.
3. Clean up and run lint/typecheck across changed files.
