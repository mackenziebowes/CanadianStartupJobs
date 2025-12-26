# Job Agent

## Overview

The `jobAgent` extracts structured job data from an individual job posting URL and creates a job record in the database with proper tagging.

## Workflow

1. **Fetch Job Page**: Retrieve markdown and links from the job posting URL (supports pre-fetched data with 7-day TTL)
2. **Discover Job Data**: Use `generateText()` with AI tools (`readPage`, `searchSite`) to explore the job posting
3. **Extract Job Object**: Use `generateObject()` to extract structured job data matching the jobs schema
4. **Create Job Record**: Insert the job into the `jobs` table
5. **Connect to Organization**: Link job to its organization via `orgsJobs` pivot table
6. **Create Job Cache**: Hash and cache the job posting markdown (7-day freshness)
7. **Connect Job to Cache**: Link job to cache via `jobsJobsCaches` pivot table
8. **Tag Job**: Use `jobTaggingAgent` to apply appropriate tags (experience levels, industries, job types, roles, provinces)

## Input Schema

```typescript
{
  organizationId: number;
  url: string;  // Job posting URL
  companyName: string;
  preFetchedData?: {
    url: string;
    markdown: string;
    links: string[];
    pulledAt: number;
    freshTil: number;
  };
}
```

## Output Structure

```typescript
{
  usage: unknown[];  // AI SDK usage objects
  logs: string[];   // Detailed execution logs
  result: {
    job: { id: number; title: string; company: string };
    jobUrl: string;
    jobBoardUrl: string | null;
    postingUrl: string | null;
    city: string;
    province: string;
    remoteOk: boolean;
    salaryMin: number | null;
    salaryMax: number | null;
    home: { markdown: string; links: string[] };
    primaryData: string;
    tagging: { steps: number; text: string };
  } | null;
  errors: Array<{ message: string; stack?: string }>;
}
```

## Dependencies

- **Firecrawl**: Scrapes job posting pages (markdown + links)
- **AI SDK**: `generateText()` for exploration, `generateObject()` for structured extraction
- **Gemini 2.5 Pro**: Primary LLM for job data extraction
- **Drizzle ORM**: Database inserts and joins
- **Bun SHA256**: Hashing for job cache
- **Zod**: Payload schema validation
- **jobTaggingAgent**: Tagging jobs with appropriate categories

## Usage Tracking

The agent tracks AI SDK token usage in the `usage` array:
- `generateText()` exploration calls (primary data discovery)
- `generateObject()` extraction calls
- `jobTaggingAgent.generate()` calls

## Error Handling

All errors are caught and wrapped in `AppError` with appropriate codes:
- `FC_MARKDOWN_FAILED`: Firecrawl markdown retrieval failed
- `FC_LINKS_FAILED`: Firecrawl links retrieval failed
- `AI_OBJECT_CREATION_FAILED`: LLM failed to extract job object
- `SCHEMA_PARSE_FAILED`: Extracted data doesn't match schema
- `DB_INSERT_FAILED`: Database insert failed

Errors are logged and returned in the `errors` array.

## Enqueuing Example

```typescript
import { addToQueue } from '@/db/functions/queues';

await addToQueue({
  payload: {
    organizationId: 123,
    url: 'https://example.com/careers/senior-engineer',
    companyName: 'Example Corp',
  },
  agent: 'jobAgent',
  maxRetries: 3,
});
```

## Pre-Fetched Data

The jobAgent supports optional pre-fetched data for efficiency:

```typescript
await addToQueue({
  payload: {
    organizationId: 123,
    url: 'https://example.com/careers/senior-engineer',
    companyName: 'Example Corp',
    preFetchedData: {
      url: 'https://example.com/careers/senior-engineer',
      markdown: '# Senior Engineer\n...',
      links: ['/careers', '/about'],
      pulledAt: Date.now(),
      freshTil: Date.now() + (7 * 24 * 60 * 60 * 1000),  // 7 days
    },
  },
  agent: 'jobAgent',
});
```

The agent checks freshness and uses pre-fetched data if available and not expired. Otherwise, it fetches live data.

## Registration

The agent is registered in `src/lib/ai/agents/dictionary.ts`:

```typescript
case "jobAgent":
  return {
    function: jobAgent,
    schema: jobAgentPayloadSchema,
  };
```

## Example Execution Log

```
jobAgent: started
queueItemId: 42
parentCallId: 100
organizationId: 123
url: https://example.com/careers/senior-engineer
companyName: Example Corp
Fetching job page...
Fetched job page: 5432 chars, 12 links (source: live, age: 0ms)
Discovering job primary data...
Primary data discovered: 3210 chars
Extracting job object from primary data...
Extracted job: Senior Engineer
Inserting job to database...
Created job: 456 - Senior Engineer
Connecting job to organization...
Connected job 456 to organization 123
Creating job cache...
Created job cache: 789
Connecting job to cache...
Connected job 456 to cache 789
Starting job tagging...
Job tagging completed: 3 steps
```

## Related Files

- `src/lib/ai/agents/major/jobAgent.ts` - Agent implementation
- `src/lib/ai/agents/jobTaggingAgent.ts` - Job tagging agent
- `src/lib/ai/prompts/discoverNewJob.ts` - Discovery prompt
- `src/lib/ai/prompts/getJobTags.ts` - Tagging prompt
- `src/lib/ai/tools/db/jobs.ts` - Job-related AI tools
- `src/lib/ai/agents/dictionary.ts` - Agent registry
- `db/src/schema/jobs.ts` - Jobs table schema
