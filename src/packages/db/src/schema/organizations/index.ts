import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import {
  orgsSizes,
  orgsStages,
  orgsProvinces,
  orgsIndustries,
  orgsJobs,
  orgsJobBoardCaches,
} from "./pivots";

const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  description: text("description").notNull(),
  website: text("website"),
  careersPage: text("careers_page"),
  industry: text("industry"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const jobBoardCaches = pgTable("job_board_caches", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  freshTil: timestamp("fresh_til"),
  lastHash: text("last_hash"),
  lastScrapedAt: timestamp("last_scraped_at").defaultNow().notNull(),
  lastCheckedAt: timestamp("last_checked_at").defaultNow().notNull(),
});


export {
  organizations,
  jobBoardCaches,
  orgsSizes,
  orgsStages,
  orgsProvinces,
  orgsIndustries,
  orgsJobs,
  orgsJobBoardCaches,
};
