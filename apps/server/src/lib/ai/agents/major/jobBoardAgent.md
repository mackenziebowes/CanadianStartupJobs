# Job Board Agent

## Overview

The `jobBoardAgent` discovers job postings on an organization's careers page and queues job extraction tasks.

## Workflow

1. **Fetch Careers Page**: Retrieve markdown and links from the careers URL (supports pre-fetched data with 7-day TTL)
2. **Find Job Links**: Use `generateObject()` with Gemini 2.5 Flash to identify individual job posting URLs
3. **Filter Job Links**: Evaluate which links are actual job postings vs. generic pages
4. **Pre-fetch Job Data**: Fetch markdown and links for all qualifying job postings in parallel
5. **Queue Job Extraction**: Create `jobAgent` tasks with pre-fetched data for each job posting
6. **Handle Failures**: Log pre-fetch failures without stopping the entire pipeline

## Input Schema

```typescript
{
  organizationId: number;
  careersUrl: string;  // URL of the careers page
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
    organizationId: number;
    companyName: string;
    careersUrl: string;
    totalLinksFound: number;
    qualifyingCount: number;
    filteredOutCount: number;
    qualifyingLinks: Array<{ url: string; jobTitle?: string; reason: string }>;
    filteredOut: Array<{ url: string; reason: string }>;
    preFetchedData: Array<{ url: string; pulledAt: number; freshTil: number; hasError: boolean }>;
  } | null;
  errors: Array<{ message: string; stack?: string }>;
}
```

## Dependencies

- **Firecrawl**: Scrapes careers pages (markdown + links)
- **AI SDK**: `generateObject()` for job link identification
- **Gemini 2.5 Flash**: Fast, efficient LLM for batch job link extraction
- **Zod**: Payload and evaluation schema validation

## Job Link Identification

The agent uses AI to identify job posting links with these rules:

- Look for patterns like `/jobs/`, `/careers/`, `/positions/`, `/openings/` followed by identifiers
- Extract job titles from URL slugs or link text when available
- Identify individual job listings on embedded boards (Lever, Greenhouse, Workday, etc.)
- Ignore generic pages (About Us, Benefits, Culture, Blog, News)
- Avoid duplicates (same job listed multiple times)
- Conservative approach: unsure links are filtered out

## Usage Tracking

The agent tracks AI SDK token usage in the `usage` array:
- `generateObject()` call for job link identification

## Error Handling

All errors are caught and wrapped in `AppError` with appropriate codes:
- `FC_MARKDOWN_FAILED`: Firecrawl markdown retrieval failed
- `FC_LINKS_FAILED`: Firecrawl links retrieval failed
- `AI_OBJECT_CREATION_FAILED`: LLM failed to find job links

Individual pre-fetch failures are logged but don't stop processing of other jobs.

## Enqueuing Example

```typescript
import { addToQueue } from '@/db/functions/queues';

await addToQueue({
  payload: {
    organizationId: 123,
    careersUrl: 'https://example.com/careers',
    companyName: 'Example Corp',
  },
  agent: 'jobBoardAgent',
  maxRetries: 3,
});
```

## Pre-Fetched Data

The jobBoardAgent supports optional pre-fetched data for efficiency:

```typescript
await addToQueue({
  payload: {
    organizationId: 123,
    careersUrl: 'https://example.com/careers',
    companyName: 'Example Corp',
    preFetchedData: {
      url: 'https://example.com/careers',
      markdown: '# Open Positions\n...',
      links: ['/careers/senior-engineer', '/careers/product-manager'],
      pulledAt: Date.now(),
      freshTil: Date.now() + (7 * 24 * 60 * 60 * 1000),  // 7 days
    },
  },
  agent: 'jobBoardAgent',
});
```

The agent checks freshness and uses pre-fetched data if available and not expired. Otherwise, it fetches live data.

## Child Tasks

The agent creates child tasks via `childQueueItems` array:

```typescript
childQueueItems.push({
  payload: {
    organizationId: 123,
    url: 'https://example.com/careers/senior-engineer',
    companyName: 'Example Corp',
    preFetchedData: {
      // pre-fetched job posting data
    },
  },
  agent: "jobAgent",
  maxRetries: 3,
});
```

The worker processes these child tasks after the jobBoardAgent completes.

## Job Filtering (TODO)

A comment is provided for future job filtering logic:

```typescript
// TODO: Filter jobs by location if needed (Canadian jobs only, remote-only, etc.)
```

This is where you could add logic to filter jobs by:
- Geographic location (Canadian provinces only)
- Remote status (remote-only or hybrid)
- Job type (full-time, contract, etc.)
- Experience level

## Registration

The agent is registered in `src/lib/ai/agents/dictionary.ts`:

```typescript
case "jobBoardAgent":
  return {
    function: jobBoardAgent,
    schema: jobBoardAgentPayloadSchema,
  };
```

## Example Execution Log

```
jobBoardAgent: started
queueItemId: 42
parentCallId: 100
organizationId: 123
careersUrl: https://example.com/careers
companyName: Example Corp
Fetching careers page...
Fetched careers page: 12543 chars, 87 links (source: live, age: 0ms)
Finding job posting links...
Found 15 job posting links
Qualifying jobs to process: 12
Filtered out non-job links: 3
Pre-fetching job posting data...
Pre-fetched data for 12 job postings
Queued jobAgent for https://example.com/careers/senior-engineer (Senior Engineer)
Queued jobAgent for https://example.com/careers/product-manager (Product Manager)
...
```

## Workflow Integration

The jobBoardAgent is the bridge between `organizationAgent` and `jobAgent`:

```
organizationAgent (creates organization)
  └─> jobBoardAgent (finds jobs on careers page)
       └─> jobAgent × N (extracts job data for each posting)
```

This pattern mirrors the `portfolioLinksAgent` bridge between `sourceAgent` and `organizationAgent`.

## Related Files

- `src/lib/ai/agents/major/jobBoardAgent.ts` - Agent implementation
- `src/lib/ai/agents/major/jobAgent.ts` - Job extraction agent
- `src/lib/ai/agents/major/organizationAgent.md` - Organization agent docs
- `src/lib/ai/agents/dictionary.ts` - Agent registry
- `src/lib/firecrawl/utils.ts` - Firecrawl scraping utilities
