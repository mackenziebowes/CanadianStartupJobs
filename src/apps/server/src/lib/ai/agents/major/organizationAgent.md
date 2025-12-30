# Organization Agent

## Overview

The `organizationAgent` is responsible for discovering and creating organization records from a single company website URL. It scrapes the homepage (or uses pre-fetched data), uses AI tools to explore additional pages if needed, extracts structured organization data, and stores it in the database.

## Workflow

1. **Fetch Homepage**: Scrape the provided URL to get markdown and links, OR use pre-fetched data if available and fresh
2. **Discover Organization Data**: Use `generateText` with tools (`readPage`, `searchSite`) to explore the site and gather comprehensive information about the organization
3. **Extract Organization Object**: Use `generateObject` to convert the discovered text into a structured organization record matching the database schema
4. **Store in Database**: Insert the new organization into the `organizations` table
5. **Return Results**: Return the organization data, careers page URL, and scraped content with token usage tracking

## Input Schema

```typescript
{
  url: string;  // The company's website URL
  preFetchedData?: {
    url: string;
    markdown: string;
    links: string[];
    pulledAt: number;   // Timestamp when data was fetched (ms)
    freshTil: number;   // Timestamp when data expires (ms, 24h TTL)
  };  // Optional pre-fetched data from portfolioLinksAgent
}
```

## Output Structure

The agent returns an `AgentResult` with:

- **usage**: Array of AI SDK token usage objects
- **logs**: Array of log messages describing each step
- **result**: Object containing:
  - `organization`: { id, name, website }
  - `careersPage`: URL of the careers page
  - `home`: { markdown, links } from the homepage
  - `primaryData`: Discovered text about the organization
- **errors**: Array of error objects (empty on success)

## Pre-Fetched Data

The agent can accept optional pre-fetched data from `portfolioLinksAgent`:

```typescript
{
  url: string;
  markdown: string;
  links: string[];
  pulledAt: number;   // Timestamp when data was fetched (ms)
  freshTil: number;   // Timestamp when data expires (ms, 24h TTL)
}
```

**Freshness Logic**:
- Pre-fetched data is used if `pulledAt <= now <= freshTil`
- Data is re-scraped if it's stale or expired
- Logs indicate the data source: `source: prefetched` or `source: live`
- Age of pre-fetched data is logged in milliseconds

This balances efficiency (avoid duplicate scrapes) with data freshness.

## Dependencies

- **Firecrawl**: `utils.getMdAndLinks()` for scraping
- **AI SDK**: `generateText()` for discovery, `generateObject()` for extraction
- **Drizzle**: Database operations via `@canadian-startup-jobs/db`
- **Prompts**: `prompts.discoverNewOrganization()`, `prompts.getNewOrganization()`
- **Tools**: `readPage`, `searchSite` for AI exploration

## Usage Tracking

The agent tracks LLM token usage in two places:

1. **Primary Data Discovery**: `generateText()` with tools
2. **Object Extraction**: `generateObject()` for structured data

All usage objects are pushed to the `usage` array using:
```typescript
if (result.usage) usage.push(result.usage);
```

This usage data is stored in the `llm-calls` table's `usage` column (JSONB array).

## Error Handling

All errors are caught and handled:

- **Firecrawl Failures**: `ERROR_CODES.FC_MARKDOWN_FAILED`, `ERROR_CODES.FC_LINKS_FAILED`
- **AI Failures**: `ERROR_CODES.AI_OBJECT_CREATION_FAILED`
- **Schema Failures**: `ERROR_CODES.SCHEMA_PARSE_FAILED`
- **DB Failures**: `ERROR_CODES.DB_INSERT_FAILED`

On error, the agent:
1. Logs the error message
2. Updates the parent call with errors
3. Returns `AgentResult` with `result: null` and `errors` populated

## Database Schema

Creates entries in the `organizations` table:

```typescript
{
  id: number;          // Auto-incremented
  name: string;        // Company name
  city: string;        // Company location city
  province: string;    // Company location province
  description: string; // Company description
  website: string;     // Company website URL
  careersPage: string; // Careers page URL (extracted)
  industry: string;    // Industry (optional)
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

## Enqueuing Example

```typescript
import { addToQueue } from "@/lib/db/functions/queues";
import { agentNamesSchema } from "@/lib/ai/agents/dictionary";

await addToQueue({
  payload: {
    url: "https://company.com",
  },
  agent: "organizationAgent",
  maxRetries: 3,
});
```

## Registration

The agent is registered in `apps/server/src/lib/ai/agents/dictionary.ts`:

```typescript
case "organizationAgent":
  return {
    function: organizationAgent,
    schema: organizationAgentPayloadSchema,
  };
```

## Example Execution Log

**Without pre-fetched data:**
```
organizationAgent: started
queueItemId: 123
parentCallId: 456
url: https://company.com
Fetching home page...
Fetched home page: 15234 chars, 87 links (source: live, age: 0ms)
Discovering organization primary data...
Primary data discovered: 8456 chars
Extracting organization object from primary data...
Extracted organization: Acme Corp
Inserting organization to database...
Created organization: 789 - Acme Corp
```

**With pre-fetched data:**
```
organizationAgent: started
queueItemId: 124
parentCallId: 457
url: https://company2.ca
Fetching home page...
Fetched home page: 12456 chars, 72 links (source: prefetched, age: 1800000ms)
Discovering organization primary data...
Primary data discovered: 7234 chars
Extracting organization object from primary data...
Extracted organization: Startup XYZ
Inserting organization to database...
Created organization: 790 - Startup XYZ
```

## Related Files

- **Implementation**: `apps/server/src/lib/ai/agents/major/organizationAgent.ts`
- **Agent Dictionary**: `apps/server/src/lib/ai/agents/dictionary.ts`
- **Helper Types**: `apps/server/src/lib/ai/agents/helpers/types.ts`
- **Queue Functions**: `apps/server/src/db/functions/queues/index.ts`
- **Call Functions**: `apps/server/src/db/functions/calls/index.ts`
- **Prompts**: `apps/server/src/lib/ai/prompts/getNewOrganization.ts`
- **AI Tools**: `apps/server/src/lib/ai/tools/`
- **Firecrawl Utils**: `apps/server/src/lib/firecrawl/functions/utils/scrape.ts`
- **Worker**: `apps/server/src/workers/llmCallWorker.ts`

## Workflow Integration

The `organizationAgent` is typically queued by `portfolioLinksAgent` as part of the discovery pipeline:

```
sourceAgent
  └─> portfolioLinksAgent (filters portfolio links)
       └─> organizationAgent × N (for qualifying Canadian companies)
```

Each `organizationAgent` receives pre-fetched data from the filtering step to avoid redundant scraping.
