import { addToQueue, updateStatus } from "@/lib/db/functions/queues";
import { createCall, updateCall } from "@/lib/db/functions/calls";

export interface AgentHelpers {
  addToQueue: typeof addToQueue;
  updateStatus: typeof updateStatus;
  createCall: typeof createCall;
  updateCall: typeof updateCall;
  parentCallId?: number;
}

export interface AgentResult {
  usage?: unknown;
  logs?: unknown;
  result?: unknown;
  errors?: unknown;
  childQueueItems?: Array<{
    payload: unknown;
    agent: string;
    maxRetries?: number;
  }>;
}
