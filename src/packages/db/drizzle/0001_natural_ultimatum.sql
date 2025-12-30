CREATE TABLE "job_boards" (
	"url" text PRIMARY KEY NOT NULL,
	"fresh_til" timestamp,
	"last_hash" text,
	"last_scraped_markdown" text,
	"last_scraped_at" timestamp DEFAULT now() NOT NULL,
	"last_checked_at" timestamp DEFAULT now() NOT NULL
);
