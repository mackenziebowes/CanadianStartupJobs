CREATE TABLE "experience_levels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "experience_levels_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "industries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "industries_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "job_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "job_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"location" text NOT NULL,
	"remote_ok" boolean NOT NULL,
	"salary_min" integer,
	"salary_max" integer,
	"description" text NOT NULL,
	"company" text NOT NULL,
	"job_board_url" text,
	"posting_url" text,
	"is_at_a_startup" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs_experience_levels" (
	"job_id" integer NOT NULL,
	"experience_level_id" integer NOT NULL,
	CONSTRAINT "jobs_experience_levels_job_id_experience_level_id_pk" PRIMARY KEY("job_id","experience_level_id")
);
--> statement-breakpoint
CREATE TABLE "jobs_industries" (
	"job_id" integer NOT NULL,
	"industry_id" integer NOT NULL,
	CONSTRAINT "jobs_industries_job_id_industry_id_pk" PRIMARY KEY("job_id","industry_id")
);
--> statement-breakpoint
CREATE TABLE "jobs_job_types" (
	"job_id" integer NOT NULL,
	"job_type_id" integer NOT NULL,
	CONSTRAINT "jobs_job_types_job_id_job_type_id_pk" PRIMARY KEY("job_id","job_type_id")
);
--> statement-breakpoint
CREATE TABLE "jobs_provinces" (
	"job_id" integer NOT NULL,
	"province_id" integer NOT NULL,
	CONSTRAINT "jobs_provinces_job_id_province_id_pk" PRIMARY KEY("job_id","province_id")
);
--> statement-breakpoint
CREATE TABLE "jobs_roles" (
	"job_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "jobs_roles_job_id_role_id_pk" PRIMARY KEY("job_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "provinces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	CONSTRAINT "provinces_name_unique" UNIQUE("name"),
	CONSTRAINT "provinces_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "jobs_experience_levels" ADD CONSTRAINT "jobs_experience_levels_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_experience_levels" ADD CONSTRAINT "jobs_experience_levels_experience_level_id_experience_levels_id_fk" FOREIGN KEY ("experience_level_id") REFERENCES "public"."experience_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_industries" ADD CONSTRAINT "jobs_industries_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_industries" ADD CONSTRAINT "jobs_industries_industry_id_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."industries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_job_types" ADD CONSTRAINT "jobs_job_types_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_job_types" ADD CONSTRAINT "jobs_job_types_job_type_id_job_types_id_fk" FOREIGN KEY ("job_type_id") REFERENCES "public"."job_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_provinces" ADD CONSTRAINT "jobs_provinces_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_provinces" ADD CONSTRAINT "jobs_provinces_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_roles" ADD CONSTRAINT "jobs_roles_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs_roles" ADD CONSTRAINT "jobs_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;