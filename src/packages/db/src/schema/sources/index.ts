import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { sourcesPortfolioCaches } from "./pivots";

const sources = pgTable("sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  website: text("website"),
  portfolio: text("portfolio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const portfolioCaches = pgTable("portfolio_caches", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  freshTil: timestamp("fresh_til"),
  lastHash: text("last_hash"),
  lastScrapedAt: timestamp("last_scraped_at").defaultNow().notNull(),
  lastCheckedAt: timestamp("last_checked_at").defaultNow().notNull(),
});

export { sources, portfolioCaches, sourcesPortfolioCaches };
