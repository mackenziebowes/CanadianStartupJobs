# Portfolio Links Agent

## Overview

The `portfolioLinksAgent` filters portfolio links from a source and pre-fetches data for qualifying Canadian companies. It evaluates each link for Canadian headquarters and active status, then queues `organizationAgent` jobs only for companies that pass the filter.

## Workflow

1. **Filter Links**: Use `generateObject()` with Gemini 2.5 Flash to evaluate all portfolio links
2. **Categorize**: Split links into qualifying vs. filtered out based on:
   - Canadian headquartered status
   - Company active status (not acquired, not shut down)
3. **Pre-Fetch Data**: Scrape qualifying companies' home pages to get markdown and links
4. **Queue Child Jobs**: Queue `organizationAgent` for each qualifying company with pre-fetched data
5. **Return Results**: Report filtering statistics and pre-fetch status

## Input Schema

```typescript
{
  sourceId: number;    // ID of the source from sourceAgent
  links: string[];     // Array of URLs from the portfolio page
}
```

## Output Structure

The agent returns an `AgentResult` with:

- **usage**: Array of AI SDK token usage objects
- **logs**: Array of log messages describing each step
- **result**: Object containing:
  - `sourceId`: The source ID
  - `totalLinks`: Total number of links processed
  - `qualifyingCount`: Number of links that passed the filter
  - `filteredOutCount`: Number of links that were filtered
  - `qualifyingLinks`: Array of `{ url, reason }` for qualifying companies
  - `filteredOut`: Array of `{ url, reason }` for non-qualifying links
  - `preFetchedData`: Array of `{ url, pulledAt, freshTil, hasError }` status
- **errors**: Array of error objects (empty on success)
- **childQueueItems**: Array of `organizationAgent` job payloads to enqueue

## Filtering Criteria

A link is considered qualifying and queued for `organizationAgent` if:
- **Headquartered in Canada**: Company appears to have Canadian headquarters
- **Active**: Company appears to be operational (not acquired, not shut down)

Filtering rules:
- URLs with non-Canadian TLDs (`.uk`, `.fr`, `.de`, etc.) assumed non-Canadian
- News articles, product pages, and non-company sites filtered out
- Conservative approach: when unsure, mark as non-qualifying

## Pre-Fetched Data Structure

Each pre-fetched company payload includes:

```typescript
{
  url: string;           // Company website URL
  preFetchedData: {
    url: string;         // URL that was fetched
    markdown: string;    // Scraped markdown content
    links: string[];     // Links found on the page
    pulledAt: number;    // Timestamp when data was fetched (ms)
    freshTil: number;    // Timestamp when data expires (ms, 24h TTL)
  }
}
```

## Data Freshness

Pre-fetched data has a **24-hour TTL** (`FRESHNESS_TTL_MS`). The `organizationAgent` will:
- Use pre-fetched data if `pulledAt <= now <= freshTil`
- Re-scrape the page if data is stale or expired

This balances efficiency (avoid duplicate scrapes) with freshness (ensuring data isn't too old).

## Dependencies

- **AI SDK**: `generateObject()` for link filtering
- **Firecrawl**: `utils.getMdAndLinks()` for scraping company pages
- **Zod**: Schema validation for payloads and pre-fetched data

## Error Handling

All errors are caught and handled:

- **AI Failures**: `ERROR_CODES.AI_OBJECT_CREATION_FAILED`
- **Fetch Failures**: Errors during Firecrawl scraping are logged as `preFetchError` but don't fail the entire job
- **Schema Failures**: Payload validation errors

On error:
1. Logs the error message
2. Updates the parent call with errors
3. Returns `AgentResult` with `result: null` and `errors` populated

**Note**: Pre-fetch failures for individual links don't fail the entire job - they're logged and skipped.

## Enqueuing Example

```typescript
import { addToQueue } from "@/lib/db/functions/queues";

await addToQueue({
  payload: {
    sourceId: 123,
    links: [
      "https://company1.com",
      "https://company2.ca",
      "https://company3.io",
    ],
  },
  agent: "portfolioLinksAgent",
  maxRetries: 3,
});
```

## Registration

The agent is registered in `apps/server/src/lib/ai/agents/dictionary.ts`:

```typescript
case "portfolioLinksAgent":
  return {
    function: portfolioLinksAgent,
    schema: portfolioLinksAgentPayloadSchema,
  };
```

## Example Execution Log

```
portfolioLinksAgent: started
queueItemId: 124
parentCallId: 456
sourceId: 123
linksCount: 50
Evaluating portfolio links...
Evaluated 50 links
Found 12 qualifying Canadian companies
Filtered out 38 non-qualifying links
Pre-fetching data for qualifying links...
Pre-fetched data for 12 companies
Queued organizationAgent for https://company1.com
Queued organizationAgent for https://company2.ca
...
```

## Worker Integration

The worker in `apps/server/src/workers/llmCallWorker.ts` automatically handles `childQueueItems`:

```typescript
if (result?.childQueueItems && Array.isArray(result.childQueueItems)) {
  for (const child of result.childQueueItems) {
    await addToQueue({
      payload: child.payload,
      agent: child.agent,
    });
  }
}
```

## Related Files

- **Implementation**: `apps/server/src/lib/ai/agents/major/portfolioLinksAgent.ts`
- **Agent Dictionary**: `apps/server/src/lib/ai/agents/dictionary.ts`
- **Organization Agent**: `apps/server/src/lib/ai/agents/major/organizationAgent.ts`
- **Source Agent**: `apps/server/src/lib/ai/agents/major/sourceAgent.ts`
- **Worker**: `apps/server/src/workers/llmCallWorker.ts`

## Workflow Summary

```
sourceAgent
  └─> portfolioLinksAgent (filters portfolio links)
       ├─> Filter out: non-Canadian, inactive companies
       └─> Queue: organizationAgent × N (for qualifying companies)
            └─> Uses pre-fetched data if fresh, re-scrapes if stale
```
