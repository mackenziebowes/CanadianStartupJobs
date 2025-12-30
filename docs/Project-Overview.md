# Canadian Startup Jobs

This repository contains the code for the Canadian Startup Jobs board, a platform for discovering and applying to jobs at Canadian startups.

## Project Overview

The `CanadianStartupJobs` repository contains a monorepo (`/src`) containing two main components:

*   **`apps`**: Specific services that can be hosted independently
*   **`packages`**: Data that is shared across multiple apps

### Apps

There are two main apps that are "MVP Ready", with two apps that need further development:

#### Ready

*   **`web`**: The client side front end. Currently connects to `server` for REST requests to display `jobs`. This is the `main` client side app for distribution, it should go on the branded domain and be the visible project.
*   **`server`**: The main server. Currently handles both `agentic queue/calls` for long lived scraping, plus fetch/filter for client side requests.

#### Development

*   **`scraper`**: The scraper works end-to-end, but does not correctly apply metadata to scraped jobs or add them to the database. Running this as a separate service is possible, but data is fragile.
*   **`admin`**: There is nothing developed here yet, and the concept is _somewhat_ of an antipattern for MVP use. The idea is to rely on key sharing between BuildCanada builders to activate a local app for performing admin activities rather than adding RBAC/Auth to the `web` MVP.

### Packages

Currently, there is only one package, but this may change over time. This folder is for any ideas that need to be used across multiple `apps`.

*   **`db`**: This is the folder where the DB schema is declared via Drizzle and ORM tools are exported from. They are meant to be used across `apps/server` and `apps/scraper` - short lived tasks could even be used inside secure API routes on `apps/web` in the future.

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

#### On Docker

Docker is used to stabilize the creation and persistence of the development data stores, Redis (used by `apps/scraper`) and PostgreSQL (used by `apps/scraper` and `packages/db`, downstreaming to `apps/server`).

#### On Bun

Bun is a fast, all-in-one Javascript Runtime that provides myriad superior developmer ergonomics, saving contributors massive amounts of development time by handing sensible defaults.

#### On Node

Seriously?

### Contributing & Resource Access

This project makes use of two kinds of paid resources.

Currently, those resources are:
1) [Firecrawl](https://www.firecrawl.dev/), a tool that's super handy for getting clean markdown, sitemaps, and other data from arbitrary web resources. Pricing is approximately $0.012 USD per request.
2) Some LLM system - currently, the code that I personally contributed is using [Google AI Studio](https://aistudio.google.com/) as of December 29th, 2025, but I have plans to update these calls to use the superior [Open Router](https://openrouter.ai/) service soon.

[Hop on Discord](https://discord.gg/buildcanada) to chat about project status, env defaults, and ways to contribute.

### Installation

1.  **Start the database and Redis:**

  ```bash
  docker-compose up -d
  ```

2.  **Install dependencies for each service:**

  This is a workspace project, so running `bun i` (an alias for installing based on the package.json / bun.lock if present) in the `src` folder should install all dependencies across all apps and packages as needed.

### Local Development

As a workspace project, we can make use of `filter` to run scripts in specific subfolders.

The main scripts are:

1. `dev`

  This sets all apps and packages to run in `dev` mode, if such a script is present in that app or package.
  It's an easy way to get `apps/server` and `apps/web` to run on your machine at once.

2. `db:*`

  `db:build` builds the `packages/db` package - after doing this, you need to reinstall the package into dependents such as `apps/server`.
  `db:generate` creates a drizzle migration file for reviewing changes to the database before sending them.
  `db:migrate` applies the migrations created by `db:generate` after review.
  `db:push` skips the review step and simply pushes updates to the database based on the current drizzle schema. This is an escape hatch for local development, some automatic Drizzle migrations fail.

3. `server:run-worker`

  The server uses a queue-call model to handle agentic pipelines. The `worker` this command starts loops through fetching **queued** requests from the db, and **calls** them, generating metadata and further queued requests, and storing them for the next iteration of the loop.
  This is the `do stuff` command.

### Deploying

This is a workspace, so care needs to be taken when deploying.

Currently, only `apps/web` and `apps/server` are ok to deploy.

To deploy `apps/web` to a service like render, vercel, etc, add the entire monorepo and edit the build/start commands to be run from the `web` folder.

To deploy `apps/server` to a service like render, add the entire mono repo and edit the build/start commands to be run from the `server` folder.

You'll need to, obviously, populate the ENV values with appropriate data, importantly the location and security for a database - that database also needs to be manually migrated to the current iteration of the schema defined in `packages/db`.
