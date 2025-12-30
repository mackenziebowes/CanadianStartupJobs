CREATE TABLE "job_caches" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"fresh_til" timestamp,
	"last_hash" text,
	"last_scraped_at" timestamp DEFAULT now() NOT NULL,
	"last_checked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs_job_caches" (
	"job_id" integer NOT NULL,
	"job_cache_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"province" text NOT NULL,
	"description" text NOT NULL,
	"website" text,
	"industry" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs_industries" (
	"org_id" integer NOT NULL,
	"industry_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs_jobs" (
	"org_id" integer NOT NULL,
	"job_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs_provinces" (
	"org_id" integer NOT NULL,
	"province_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs_sizes" (
	"org_id" integer NOT NULL,
	"team_size_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgs_stages" (
	"org_id" integer NOT NULL,
	"raising_stage_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_caches" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"fresh_til" timestamp,
	"last_hash" text,
	"last_scraped_at" timestamp DEFAULT now() NOT NULL,
	"last_checked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raising_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "raising_stages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"website" text,
	"portfolio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources_portfolio_caches" (
	"source_id" integer NOT NULL,
	"portfolio_cache_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_sizes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "team_sizes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "job_boards" RENAME TO "job_board_caches";--> statement-breakpoint
ALTER TABLE "jobs_experience_levels" DROP CONSTRAINT "jobs_experience_levels_job_id_experience_level_id_pk";--> statement-breakpoint
ALTER TABLE "jobs_industries" DROP CONSTRAINT "jobs_industries_job_id_industry_id_pk";--> statement-breakpoint
ALTER TABLE "jobs_job_types" DROP CONSTRAINT "jobs_job_types_job_id_job_type_id_pk";--> statement-breakpoint
ALTER TABLE "jobs_provinces" DROP CONSTRAINT "jobs_provinces_job_id_province_id_pk";--> statement-breakpoint
ALTER TABLE "jobs_roles" DROP CONSTRAINT "jobs_roles_job_id_role_id_pk";--> statement-breakpoint
ALTER TABLE "job_board_caches" DROP CONSTRAINT "job_boards_pkey";--> statement-breakpoint
ALTER TABLE "job_board_caches" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "province" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "last_scraped_markdown" text;--> statement-breakpoint
ALTER TABLE "jobs_job_caches" ADD CONSTRAINT "jobs_job_caches_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_job_caches" ADD CONSTRAINT "jobs_job_caches_job_cache_id_job_caches_id_fk" FOREIGN KEY ("job_cache_id") REFERENCES "public"."job_caches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_industries" ADD CONSTRAINT "orgs_industries_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_industries" ADD CONSTRAINT "orgs_industries_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_jobs" ADD CONSTRAINT "orgs_jobs_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_jobs" ADD CONSTRAINT "orgs_jobs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_provinces" ADD CONSTRAINT "orgs_provinces_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_provinces" ADD CONSTRAINT "orgs_provinces_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_sizes" ADD CONSTRAINT "orgs_sizes_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_sizes" ADD CONSTRAINT "orgs_sizes_team_size_id_team_sizes_id_fk" FOREIGN KEY ("team_size_id") REFERENCES "public"."team_sizes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_stages" ADD CONSTRAINT "orgs_stages_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgs_stages" ADD CONSTRAINT "orgs_stages_raising_stage_id_raising_stages_id_fk" FOREIGN KEY ("raising_stage_id") REFERENCES "public"."raising_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources_portfolio_caches" ADD CONSTRAINT "sources_portfolio_caches_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources_portfolio_caches" ADD CONSTRAINT "sources_portfolio_caches_portfolio_cache_id_portfolio_caches_id_fk" FOREIGN KEY ("portfolio_cache_id") REFERENCES "public"."portfolio_caches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_board_caches" DROP COLUMN "last_scraped_markdown";--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "location";