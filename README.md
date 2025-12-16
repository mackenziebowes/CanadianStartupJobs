# Canadian Startup Jobs

This repository contains the code for the Canadian Startup Jobs board, a platform for discovering and applying to jobs at Canadian startups.

## Project Overview

The `CanadianStartupJobs` repository is a monorepo containing four main components:

*   **`db`**: Database schema, ORM (Drizzle), and migrations.
*   **`backend/scraper-cron`**: Job discovery and scraping service (BullMQ, Redis, Firecrawl).
*   **`backend/server`**: REST API service (Hono) for accessing data.
*   **`frontend/canadian-startup-jobs`**: Next.js application for the job board.

## Technologies

*   **Language**: TypeScript
*   **Runtime**: Node.js, Bun
*   **Backend API**: Hono, Zod
*   **Scraper**: BullMQ, Redis, Firecrawl
*   **Frontend**: Next.js, React, Tailwind CSS, SWR
*   **Database**: PostgreSQL, Drizzle ORM
*   **Containerization**: Docker, Docker Compose

## Getting Started

### Prerequisites

*   [Docker](https://www.docker.com/products/docker-desktop/)
*   [Bun](https://bun.sh/)
*   [Node.js](https://nodejs.org/en/)

### Installation

1.  **Start the database and Redis:**

    ```bash
    docker-compose up -d
    ```

2.  **Install dependencies for each service:**

    Navigate to each of the sub-project directories (`db`, `backend/scraper-cron`, `backend/server`, `frontend/canadian-startup-jobs`) and run the appropriate command to install dependencies.

    For `backend/scraper-cron`:

    ```bash
    pnpm install
    ```

    For `backend/server`:

    ```bash
    bun install
    ```

    For `db` and `frontend/canadian-startup-jobs`:

    ```bash
    npm install
    # or
    bun install
    ```

### Running the Application

Each service runs independently. You will need to open a separate terminal for each service you want to run.

*   **Database Migrations:**
    *   `cd db`
    *   `npm run db:generate` (to create new migrations)
    *   `npm run db:migrate` (to apply migrations)

*   **API Server:**
    *   `cd backend/server`
    *   `bun run dev`

*   **Scraper:**
    *   `cd backend/scraper-cron`
    *   `npm run dev` (to run the main scraper entrypoint)
    *   `npm run worker` (to start the job processing worker)

*   **Frontend:**
    *   `cd frontend/canadian-startup-jobs`
    *   `npm run dev`

## Development

See `AGENTS.md` for more detailed information on development workflows, such as database changes and scraper logic.
