# LLM Call Worker

The `llmCallWorker.ts` is a polling worker that processes queued LLM agent tasks from the `llm-queues` table, executes the registered agents, and persists results to `llm-calls`.

## Overview

The worker implements the following flow:

1. **Polling**: Continuously polls the `llm-queues` table for items with status `queued`
2. **Rate Limiting**: Respects a configurable calls-per-second limit
3. **Agent Resolution**: Looks up the agent by name from the agent registry (`dictionary.ts`)
4. **Validation**: Validates the queued payload against the agent's schema
5. **Execution**: Calls the agent with `QueuedItem` and `AgentHelpers`
6. **Persistence**: Updates the corresponding `llm-calls` row with usage/logs/result/errors
7. **Status Updates**: Marks the queue item as `done` or `failed`
8. **Child Enqueuing**: If the agent returns `childQueueItems`, enqueues them for later processing

## Usage

### Starting the Worker

```typescript
import { startLlMCallWorker, stopLlMCallWorker, isWorkerRunning } from "@/workers/llmCallWorker";

// Start with default options (2s poll interval, 5 calls/sec rate limit)
startLlMCallWorker();

// Start with custom options
startLlMCallWorker({
  pollIntervalMs: 5000,    // Poll every 5 seconds
  rateLimitPerSec: 10,     // Allow 10 agent executions per second
});

// Check if worker is running
if (isWorkerRunning()) {
  console.log("Worker is active");
}

// Stop the worker gracefully
await stopLlMCallWorker();
```

### Worker Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pollIntervalMs` | `number` | `2000` | How often to poll the queue when no items are available (ms) |
| `rateLimitPerSec` | `number` | `5` | Maximum agent executions per second |

## Registering New Agents

All agents are registered in `@/lib/ai/agents/dictionary.ts`. To add a new agent:

1. Implement the agent function (see "Agent Function Signature" below)
2. Add the agent name to the `agentNamesSchema` enum
3. Add a case in `getAgent()` that returns the agent and its schema

### Example: Adding a New Agent

```typescript
// dictionary.ts
import { sourceAgent, sourceAgentPayloadSchema } from "./major/sourceAgent";
import { myNewAgent, myNewAgentSchema } from "./major/myNewAgent";
import z from "zod";

export const agentNamesSchema = z.enum([
  "sourceAgent",
  "myNewAgent",  // Add your agent name here
]);

export const getAgent = (agentName: AgentNames): AgentEntry => {
  switch (agentName) {
    case "sourceAgent":
      return { function: sourceAgent, schema: sourceAgentPayloadSchema };
    case "myNewAgent":  // Add case for your agent
      return { function: myNewAgent, schema: myNewAgentSchema };
    default:
      throw new Error(`Unknown agent: ${agentName}`);
  }
};
```

## Agent Function Signature

Agents must conform to the `AgentEntry` interface:

```typescript
interface AgentEntry {
  function: (queuedItem: QueuedItem, helpers: AgentHelpers) => Promise<AgentResult>;
  schema: z.ZodSchema;
}
```

### QueuedItem

The `QueuedItem` type comes from `@/db/functions/queues` and includes:

```typescript
interface QueuedItem {
  id: number;
  payload: unknown;              // The validated payload based on your agent's schema
  agent: string;                 // The agent name that was registered
  status: "queued" | "in_progress" | "failed" | "cancelled" | "done";
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### AgentHelpers

The `AgentHelpers` interface provides database functions and context to your agent:

```typescript
interface AgentHelpers {
  addToQueue: (args: { payload: unknown; agent: string }) => Promise<QueuedItem>;
  updateStatus: (args: { id: number; status: QueueStatus }) => Promise<void>;
  createCall: (args: CreateCallArgs) => Promise<Call>;
  updateCall: (args: { id: number; usage; result; logs; errors }) => Promise<Call>;
  parentCallId?: number;  // The call ID of the parent queue item (for nested work)
}
```

**Important**: The worker creates the initial `llm-calls` row for you. Your agent should use `helpers.updateCall()` to incrementally update usage/logs/results during execution, and return the final values in the `AgentResult`.

### AgentResult

Agents must return an `AgentResult`:

```typescript
interface AgentResult {
  usage?: unknown;          // Usage metrics (e.g., token counts, API calls)
  logs?: unknown;            // Execution logs (array of strings or structured data)
  result?: unknown;          // The primary result of the agent's work
  errors?: unknown;          // Any errors encountered (array; empty if none)
  childQueueItems?: Array<{  // Items to enqueue for later processing
    payload: unknown;
    agent: string;
    maxRetries?: number;
  }>;
}
```

## Example Agent Implementation

```typescript
// myNewAgent.ts
import { AppError, ERROR_CODES } from "@/lib/errors";
import { z } from "zod";
import type { AgentHelpers, AgentResult } from "../helpers/types";
import type { QueuedItem } from "@/lib/db/functions/queues";

const myNewAgentSchema = z.object({
  url: z.url(),
  depth: z.number().default(1),
});

type MyNewAgentArgs = z.infer<typeof myNewAgentSchema>;

const myNewAgent = async (
  queuedItem: QueuedItem,
  helpers: AgentHelpers,
): Promise<AgentResult> => {
  const payload = queuedItem.payload as MyNewAgentArgs;

  const logs = [
    `myNewAgent: started for ${payload.url}`,
    `depth: ${payload.depth}`,
  ];

  const usage = {
    apiCalls: 0,
    pagesFetched: 0,
  };

  try {
    // Do your work here...
    const result = await doSomeWork(payload.url);

    usage.apiCalls++;
    logs.push(`Successfully processed ${payload.url}`);

    // Update the call with incremental progress
    if (helpers.parentCallId) {
      await helpers.updateCall({
        id: helpers.parentCallId,
        usage,
        logs,
        result,
        errors: [],
      });
    }

    // Optionally enqueue more work
    const childQueueItems = [
      { payload: { url: result.nextUrl }, agent: "myNewAgent" },
    ];

    return {
      usage,
      logs,
      result,
      errors: [],
      childQueueItems,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logs.push(`Error: ${errorMessage}`);

    return {
      usage,
      logs,
      result: null,
      errors: [{ message: errorMessage, stack: err instanceof Error ? err.stack : undefined }],
    };
  }
};

export { myNewAgent, myNewAgentSchema };
```

## Error Handling & Retry Logic

The worker implements automatic retry logic for transient failures:

### Retry Triggers

1. **Schema Validation Failure**: The queued payload doesn't match the agent's schema
2. **Agent Returns Errors**: The agent returns a non-empty `errors` array
3. **Agent Throws**: The agent throws an exception

### Retry Behavior

- The worker increments the `retryCount` and re-queues the item with status `queued`
- When `retryCount >= maxRetries`, the item is marked as `failed`
- Retries are tracked in the `llm-queues` table

### Permanent Failures

- **Agent Not Found**: The agent name isn't in the registry (immediate `failed`)
- **Max Retries Exceeded**: Item is marked `failed` after `maxRetries` attempts

## Queue Item Status Lifecycle

```
queued → in_progress → done
  ↓            ↓
  └─→ failed (when max retries exceeded)
  └─→ queued (when retryable error, increments retryCount)
```

## Testing

The worker includes comprehensive tests in `tests/llmCallWorker.test.ts`. Test cases cover:

- Worker start/stop lifecycle
- Normal processing flow
- Agent not found handling
- Schema validation failures and retries
- Agent execution errors
- Empty queue handling
- Child queue item enqueuing
- Rate limiting behavior

Run tests (after configuring a test framework):

```bash
bun test tests/llmCallWorker.test.ts
```

## Rate Limiting

The worker enforces a rate limit on agent executions to prevent overwhelming downstream APIs:

- Configurable via `rateLimitPerSec` option (default: 5)
- Implemented as a minimum time gap between executions
- Applies to all agents uniformly

## Database Schema

The worker interacts with two tables:

### `llm-queues`

Stores work items to be processed:

| Column | Type | Description |
|--------|-------|-------------|
| `id` | `serial` | Primary key |
| `payload` | `jsonb` | Agent input (validated against agent schema) |
| `agent` | `text` | Registered agent name |
| `status` | `text` | `queued` / `in_progress` / `failed` / `cancelled` / `done` |
| `retryCount` | `integer` | Number of retry attempts |
| `maxRetries` | `integer` | Maximum retry attempts (default: 3) |
| `createdAt` | `timestamp` | Queue creation time |
| `updatedAt` | `timestamp` | Last update time |

### `llm-calls`

Stores execution records for each queue item:

| Column | Type | Description |
|--------|-------|-------------|
| `id` | `serial` | Primary key |
| `queueId` | `integer` | Reference to `llm-queues.id` |
| `payload` | `jsonb` | Validated input payload |
| `agent` | `text` | Agent name |
| `usage` | `jsonb` | Usage metrics |
| `result` | `jsonb` | Agent output |
| `logs` | `jsonb` | Execution logs |
| `errors` | `jsonb` | Error details |
| `createdAt` | `timestamp` | Record creation time |
| `updatedAt` | `timestamp` | Last update time |

## See Also

- `@/lib/ai/agents/dictionary.ts` - Agent registry
- `@/lib/ai/agents/helpers/types.ts` - Shared type definitions
- `@/db/functions/queues/index.ts` - Queue database functions
- `@/db/functions/calls/index.ts` - Call database functions
