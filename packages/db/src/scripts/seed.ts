import { db } from "../index";
import { experienceLevels, jobTypes, provinces } from "../schema/index";

const PROVINCES = [
  { name: "Alberta", code: "AB" },
  { name: "British Columbia", code: "BC" },
  { name: "Manitoba", code: "MB" },
  { name: "New Brunswick", code: "NB" },
  { name: "Newfoundland and Labrador", code: "NL" },
  { name: "Nova Scotia", code: "NS" },
  { name: "Northwest Territories", code: "NT" },
  { name: "Nunavut", code: "NU" },
  { name: "Ontario", code: "ON" },
  { name: "Prince Edward Island", code: "PE" },
  { name: "Quebec", code: "QC" },
  { name: "Saskatchewan", code: "SK" },
  { name: "Yukon", code: "YT" },
];

const JOB_TYPES = [
  { name: "Full Time" },
  { name: "Part Time" },
  { name: "Internship" },
  { name: "Contract" }
];

const EXPERIENCE_LEVELS = [
  { name: "Entry" },
  { name: "Mid" },
  { name: "Senior" },
  { name: "Staff" },
  { name: "Principal" },
  { name: "Director" },
  { name: "Executive" },
  { name: "C-Suite" },
  { name: "Associate" },
  { name: "Junior Partner" },
  { name: "Partner" },
  { name: "Lead" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Provinces
  console.log("📍 Seeding provinces...");
  await db.insert(provinces).values(PROVINCES).onConflictDoNothing();
  console.log("📍 Seeding employment types...");
  await db.insert(jobTypes).values(JOB_TYPES).onConflictDoNothing();
  console.log("📍 Seeding experience levels...");
  await db.insert(experienceLevels).values(EXPERIENCE_LEVELS).onConflictDoNothing();

  console.log("✅ Seed complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed!");
  console.error(err);
  process.exit(1);
});
