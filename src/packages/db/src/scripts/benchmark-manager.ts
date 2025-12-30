import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { resolve } from "path";

dotenv.config();

const postgresUser = `${process.env.POSTGRES_USER || "postgres"}`;
const postgresPassword = `${process.env.POSTGRES_PASSWORD || "postgres"}`;
const postgresHost = `${process.env.POSTGRES_HOST || "localhost"}`;
const postgresPort = `${process.env.POSTGRES_PORT || "5433"}`;
const postgresDB = `${process.env.POSTGRES_DB || "canadian_startup_db"}`;

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDB}`;

async function createBenchmarkSchema(name: string) {
  const schemaName = `benchmark_${name}`;

  // 1. Create the schema
  const adminClient = postgres(connectionString, { max: 1 });
  const adminDb = drizzle(adminClient);

  try {
    console.log(`Creating schema '${schemaName}'...`);
    await adminDb.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`));
  } catch (e) {
    console.error("Failed to create schema:", e);
    await adminClient.end();
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  // 2. Run migrations on the new schema
  const migrationUrl = `${connectionString}${connectionString.includes("?") ? "&" : "?"}options=-c%20search_path%3D${schemaName}`;
  
  const migrationClient = postgres(migrationUrl, {
    max: 1,
    onnotice: () => {},
  });
  const migrationDb = drizzle(migrationClient);

  try {
    console.log(`Running migrations for '${schemaName}'...`);
    // Path to drizzle folder relative to this script execution context
    // Assuming running from packages/db root or using bun run src/scripts/...
    const migrationsFolder = resolve(process.cwd(), "drizzle");

    await migrate(migrationDb, { migrationsFolder });
    console.log(`✅ Schema '${schemaName}' ready!`);
    console.log(`\nTo run apps against this schema, use:`);
    console.log(`export DB_SCHEMA=${schemaName}`);
  } catch (e) {
    console.error("Migration failed:", e);
  } finally {
    await migrationClient.end();
  }
}

async function listBenchmarkSchemas() {
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  try {
    const result = await db.execute(sql`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name LIKE 'benchmark_%'
      ORDER BY schema_name DESC
    `);

    if (result.length === 0) {
      console.log("No benchmark schemas found.");
    } else {
      console.log("Found benchmark schemas:");
      result.forEach(row => console.log(`- ${row.schema_name}`));
    }
  } finally {
    await client.end();
  }
}

async function dropBenchmarkSchema(name: string) {
  const schemaName = name.startsWith("benchmark_") ? name : `benchmark_${name}`;
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  try {
    console.log(`Dropping schema '${schemaName}'...`);
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`));
    console.log(`✅ Dropped '${schemaName}'`);
  } catch (e) {
    console.error("Failed to drop schema:", e);
  } finally {
    await client.end();
  }
}

const command = process.argv[2];
const arg = process.argv[3];

async function main() {
  if (command === "create") {
    if (!arg) {
      console.error("Please provide a name for the benchmark run (e.g. 'run1')");
      process.exit(1);
    }
    await createBenchmarkSchema(arg);
  } else if (command === "list") {
    await listBenchmarkSchemas();
  } else if (command === "drop") {
    if (!arg) {
      console.error("Please provide the schema name/suffix to drop");
      process.exit(1);
    }
    await dropBenchmarkSchema(arg);
  } else {
    console.log("Usage:");
    console.log("  bun run src/scripts/benchmark-manager.ts create <name>");
    console.log("  bun run src/scripts/benchmark-manager.ts list");
    console.log("  bun run src/scripts/benchmark-manager.ts drop <name>");
  }
  process.exit(0);
}

main();
