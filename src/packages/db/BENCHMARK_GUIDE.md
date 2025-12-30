# Benchmark Manager Guide

The benchmark manager allows you to create isolated database schemas for testing and benchmarking without affecting the main public schema.

## Commands

Run these from `packages/db` (or via `npm run db:benchmark` if using npm/pnpm).

### Create a Benchmark Schema
Creates a new schema (e.g., `benchmark_run1`) and applies all current migrations to it.

```bash
bun run db:benchmark create <name>
# Example:
bun run db:benchmark create run1
```

### List Benchmark Schemas
Lists all existing benchmark schemas.

```bash
bun run db:benchmark list
```

### Drop a Benchmark Schema
Removes the schema and all its tables.

```bash
bun run db:benchmark drop <name>
# Example:
bun run db:benchmark drop run1
```

## Usage in Apps

To run an application (server, cron, scripts) against a specific benchmark schema, set the `DB_SCHEMA` environment variable.

```bash
export DB_SCHEMA=benchmark_run1
# Then run your app
bun run dev
```

## How it works
1. **Schema Isolation**: Creates a Postgres SCHEMA (namespace) for each run.
2. **Migration Sync**: Automatically runs Drizzle migrations on the new schema.
3. **Connection Handling**: The DB client (`packages/db/src/index.ts`) detects `DB_SCHEMA` and sets the `search_path` connection parameter, ensuring all queries target that schema.
