import { pgTable, serial, text } from "drizzle-orm/pg-core";

const provinces = pgTable("provinces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
});

const jobTypes = pgTable("job_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

const experienceLevels = pgTable("experience_levels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

const industries = pgTable("industries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

const teamSize = pgTable("team_sizes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

const raisingStage = pgTable("raising_stages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export {
  provinces,
  jobTypes,
  experienceLevels,
  industries,
  roles,
  teamSize,
  raisingStage,
};
