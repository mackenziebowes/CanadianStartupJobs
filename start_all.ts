#!/usr/bin/env bun
import { spawn } from "bun";

async function runCommand(command: string[], cwd?: string) {
  console.log(`Executing: ${command.join(" ")} ${cwd ? `(in ${cwd})` : ""}`);
  const proc = spawn(command, {
    cwd,
    stdout: "inherit",
    stderr: "inherit",
    detached: true, // Detach the process from the parent
  });

  // Since we are detaching, we don't await the process completion here.
  // The process will continue to run in the background.
  // We can log its PID for reference.
  console.log(`Process started with PID: ${proc.pid}`);
  return proc;
}

async function main() {
  console.log("Starting PostgreSQL database...");
  await runCommand(["docker-compose", "up", "-d", "postgres"]);

  console.log("Starting backend server...");
  runCommand(["bun", "run", "--hot", "src/index.ts"], "backend/server");

  console.log("Starting frontend application...");
  runCommand(["bun", "run", "dev"], "frontend/canadian-startup-jobs");

  console.log(
    "All services are starting in the background. Check logs for status.",
  );
  console.log(
    "To stop them, you might need to find their PIDs and kill them, or use 'docker-compose down' for the database.",
  );
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
