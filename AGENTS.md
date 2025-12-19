# AGENT Guidelines for CanadianStartupJobs Repository

This document outlines essential information for agents working within the `CanadianStartupJobs` monorepo. It covers project structure, key technologies, development commands, code conventions, and important considerations.

## 1. Project Overview

The `CanadianStartupJobs` repository is a monorepo containing four main components:

*   **`db`**: Database schema, ORM (Drizzle), and migrations.
*   **`apps/cron`**: Job discovery and scraping service (BullMQ, Redis, Firecrawl).
*   **`apps/server`**: REST API service (Hono) for accessing data.
*   **`apps/web`**: Next.js application for the job board.

## 2. Key Technologies

*   **Language**: TypeScript (everywhere)
*   **Runtime**: Node.js, Bun (used for API and scripts)
*   **Backend API**: Hono, Zod
*   **Scraper**: BullMQ (queuing), Redis (caching/job management), Firecrawl (scraping), `tsx`
*   **Frontend**: Next.js 16, React 19, Tailwind CSS v4, SWR
*   **Database**: PostgreSQL, Drizzle ORM
*   **Containerization**: Docker, Docker Compose

## 3. Essential Commands

**Important**: Always run commands from the specific sub-project directory.

### 3.1. `db` (Database Service)
Path: `/db/`

*   `npm run db:generate`: Generate migrations from schema changes.
*   `npm run db:migrate`: Apply migrations to the database.
*   `npm run db:studio`: Open Drizzle Studio to view data.
*   `npm run docs`: Generate `SCHEMA.md` documentation and copy it to other projects.
*   `npm run build`: Compile TypeScript.

### 3.2. `apps/cron` (Scraper)
Path: `/apps/cron/`
*Manager: pnpm (pinned)*

*   `npm run dev`: Run the scraper entry point.
*   `npm run worker`: Start BullMQ workers.
*   `npm run board`: Start BullMQ dashboard.
*   `npm run clear-queues`: Purge all queues.
*   `npm run test`: Run unit/integration tests.

### 3.3. `apps/server` (API)
Path: `/apps/server/`
*Runtime: Bun*

*   `bun run dev`: Start Hono server with hot reload.
*   `bun run gen:tags`: Generate tag helper functions.
*   `bun run gen:piv:jobs`: Generate job pivot helper functions.

### 3.4. `apps/web` (Frontend)
Path: `/apps/web/`

*   `npm run dev`: Start Next.js dev server.
*   `npm run build`: Production build.
*   `npm run lint`: Run ESLint.

### 3.5. Root / Docker
Path: `/`

*   `docker-compose up -d`: Start PostgreSQL and Redis.
*   `docker-compose down`: Stop containers.

## 4. Code Organization

*   **Monorepo**: Separate packages for `db`, `apps/*`.
*   **Shared Schema**: The `db` package exports the schema and connection logic.
*   **Documentation (`SCHEMA.md`)**: The `db` project generates a `SCHEMA.md` file that is automatically copied to `apps/cron` and `apps/server`. **Read this file** to understand the current database structure.
*   **Scraper Architecture**:
    *   **Discovery**: `mapCompanyDirWorker` finds sources.
    *   **Extraction**: `jobBoardWorker` scrapes jobs using Firecrawl.
    *   See `apps/cron/GUIDES/data-pipeline.md` for detailed data flow.

## 5. Development Patterns

### Database Changes
1.  Modify `db/src/schema/*.ts`.
2.  Run `npm run db:generate` in `/db`.
3.  Run `npm run db:migrate`.
4.  Run `npm run docs` to update `SCHEMA.md` across the repo.

### Scraper Logic
*   **Workers**: Located in `apps/cron/src/workers/`.
*   **Queues**: Defined in `apps/cron/src/lib/queues.ts`.
*   **Direct Execution**: Use `tsx` for running scripts/workers directly.

### API Development
*   **Hono**: Used for the API server. Fast, lightweight web standard.
*   **Generators**: The server uses scripts (`src/scripts/`) to generate repetitive code for tags and pivots. Run these after schema changes if related tables change.

## 6. Important Gotchas

*   **Database Ports**: Host connects via port **5433** (mapped to container 5432).
*   **Environment Variables**: Check `.env.example` in each directory. Config is decentralized.
*   **Package Managers**:
    *   `apps/server` uses `bun`.
    *   `apps/cron` specifies `pnpm`.
    *   `db` and `apps/web` use `npm`/`bun` interchangeably (lockfiles exist for Bun).
    *   *Advice*: Use `npm run` for script compatibility, or `bun run` if specifically in the server directory.
    *   **Schema Sync**: If you change the DB schema, you **must** run `npm run docs` in `/db` to propagate the documentation to other services, or agents might hallucinate old schema fields.

## 7. Testing
*   **Backend**: `tsx test.ts` in scraper service.
*   **Frontend**: `npm run lint`. No explicit test suite visible in `package.json`.
