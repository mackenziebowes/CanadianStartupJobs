CREATE TABLE "orgs_job_board_caches" (
	"org_id" integer NOT NULL,
	"job_board_cache_id" integer NOT NULL
);
ALTER TABLE "orgs_job_board_caches" ADD CONSTRAINT "orgs_job_board_caches_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "orgs_job_board_caches" ADD CONSTRAINT "orgs_job_board_caches_job_board_cache_id_job_board_caches_id_fk" FOREIGN KEY ("job_board_cache_id") REFERENCES "public"."job_board_caches"("id") ON DELETE no action ON UPDATE no action;
