# Migration Issues - Dec 17 2025

## Context
We encountered a `relation "experience_levels" already exists` error when running `db:migrate`. This suggests a desync between the `__drizzle_migrations` table and the actual database schema (likely due to mixing `db:push` and `db:migrate` in the past).

## Attempted Fix
We switched to using `db:push` to force the schema state to match the code, bypassing the migration history check for now.

## Errors Observed
During the migration attempt, we saw NOTICE level truncation errors (likely standard Postgres identifier truncation, e.g., index names > 63 chars), but the blocking error was the pre-existence of tables that Drizzle thought it needed to create.

## Resolution
Used `db:push` to sync schema state. Need to be careful with future migrations—we might need to "fake" the migration history or wipe/reset if we want a clean migration path later.
