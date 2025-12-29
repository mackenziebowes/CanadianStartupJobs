import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { queues } from "./queues";

const calls = pgTable("llm-calls", {
  id: serial("id").primaryKey(),
  payload: jsonb().notNull(),
  queueId: integer("queue_id").references(() => queues.id).notNull(),
  agent: text().notNull(),
  usage: jsonb().notNull().default([]),
  result: jsonb().notNull().default([]),
  logs: jsonb().notNull().default([]),
  errors: jsonb().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export { calls };
