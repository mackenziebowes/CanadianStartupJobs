# @canadian-startup-jobs/db

Database package for the Canadian Startup Jobs monorepo. This package provides a shared Drizzle ORM connection to PostgreSQL and schema definitions used across services.

## Installation

From other packages in the monorepo:

```typescript
import { db, schema } from "@canadian-startup-jobs/db";
```

## Setup

1. Install dependencies:
```bash
bun i
```

2. Configure environment variables (copy `.env.example` to `.env`):
```bash
cp .env.example .env
```

3. Build the package:
```bash
bun run build
```

## Usage

### Basic Query Example

```typescript
import { db } from "@canadian-startup-jobs/db";
import { organizations, jobs } from "@canadian-startup-jobs/db/schema";
import { eq } from "drizzle-orm";

// Query example
const allOrgs = await db.select().from(organizations);

// With conditions
// const activeJobs = await db.select().from(jobs).where(eq(jobs.status, 'active'));
```

### Using in Other Services

Add as a dependency in your service's `package.json`:

```json
{
  "dependencies": {
    "@canadian-startup-jobs/db": "workspace:*"
  }
}
```

## Database Migrations

- Generate migrations: `npm run db:generate`
- Push schema changes (dev): `npm run db:push`
- Run migrations: `npm run db:migrate`
- Open Drizzle Studio: `npm run db:studio`

## Environment Variables

See `.env.example` for required variables. The default configuration uses the following:

- `POSTGRES_HOST` (default: `localhost`)
- `POSTGRES_PORT` (default: `5432`)
- `POSTGRES_USER` (default: `postgres`)
- `POSTGRES_PASSWORD` (default: `postgres`)
- `POSTGRES_DB` (default: `canadian_startup_jobs`)

Alternatively, you can use a `DATABASE_URL` connection string.

## Schema Structure

The schema is organized into domains:

- **Organizations**: Companies and their metadata (`organizations`, `orgsSizes`, `orgsStages`, etc.)
- **Jobs**: Job listings and related data (`jobs`, `jobsRoles`, `jobsJobTypes`, etc.)
- **Sources**: Data sources and caches (`sources`, `portfolioCaches`)
- **Tags**: Shared taxonomy (`provinces`, `industries`, `roles`, etc.)

Schema definitions are located in `src/schema/`.
