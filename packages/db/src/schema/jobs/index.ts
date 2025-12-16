import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import {
  jobsRoles,
  jobsJobTypes,
  jobsProvinces,
  jobsIndustries,
  jobsExperienceLevels,
  jobsJobsCaches,
} from "./pivots";

const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  remoteOk: boolean("remote_ok").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  description: text("description").notNull(),
  company: text("company").notNull(),
  jobBoardUrl: text("job_board_url"),
  postingUrl: text("posting_url"),
  isAtAStartup: boolean("is_at_a_startup"),
  lastScrapedMarkdown: text("last_scraped_markdown"), // For vector search
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const jobCaches = pgTable("job_caches", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  freshTil: timestamp("fresh_til"),
  lastHash: text("last_hash"),
  lastScrapedAt: timestamp("last_scraped_at").defaultNow().notNull(),
  lastCheckedAt: timestamp("last_checked_at").defaultNow().notNull(),
});

export {
  jobs,
  jobCaches,
  jobsRoles,
  jobsJobTypes,
  jobsProvinces,
  jobsIndustries,
  jobsExperienceLevels,
  jobsJobsCaches,
};
