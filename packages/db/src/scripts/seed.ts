import { db } from "../index";
import { provinces } from "../schema/index";

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

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Provinces
  console.log("📍 Seeding provinces...");
  await db.insert(provinces).values(PROVINCES).onConflictDoNothing();

  console.log("✅ Seed complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed!");
  console.error(err);
  process.exit(1);
});
