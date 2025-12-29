CREATE TABLE "llm-calls" (
	"id" serial PRIMARY KEY NOT NULL,
	"payload" jsonb NOT NULL,
	"queue_id" integer NOT NULL,
	"agent" text NOT NULL,
	"usage" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"result" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"logs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "llm-queues" (
	"id" serial PRIMARY KEY NOT NULL,
	"payload" jsonb NOT NULL,
	"agent" text NOT NULL,
	"status" text NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "llm-calls" ADD CONSTRAINT "llm-calls_queue_id_llm-queues_id_fk" FOREIGN KEY ("queue_id") REFERENCES "public"."llm-queues"("id") ON DELETE no action ON UPDATE no action;