import { AppError } from "./AppError";
import {readFileSync, existsSync} from "node:fs";

export function logErrorWithContext(err: Error | AppError) {
  console.error("________________________________________________________________________________");
  if (err instanceof AppError) {
    console.error(`[${err.code}] ${err.message}`);
    if (err.meta) console.error("Meta:", JSON.stringify(err.meta, null, 2));
  } else {
    console.error(`[UNHANDLED] ${err.message}`);
  }

  if (err.stack) {
    // Basic stack parsing to find the first file in the project
    // Stack lines usually look like: "    at Function.createNewPortfolioCache (/path/to/file.ts:10:15)"
    const lines = err.stack.split("\n");
    console.error("\nStack Trace:");

    let fileLocation: { path: string; line: number } | null = null;

    for (const line of lines) {
      console.error(line); // Print the stack line

      // Try to find the first user-land code (exclude node_modules)
      if (!fileLocation && line.includes("/") && !line.includes("node_modules")) {
        // Regex to match path and line: ( /path/to/file.ts:123:45 )
        const match = line.match(/\(([^:]+):(\d+):\d+\)/) || line.match(/at\s+([^:]+):(\d+):\d+/);
        if (match) {
            const path = match[1];
            // Check if file exists locally (simple check)
            if (existsSync(path)) {
                fileLocation = { path: match[1], line: parseInt(match[2], 10) };
            }
        }
      }
    }

    if (fileLocation) {
      printSourceContext(fileLocation.path, fileLocation.line);
    }
  }
  console.error("________________________________________________________________________________");
}

function printSourceContext(filePath: string, errorLine: number, contextLines = 3) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const start = Math.max(0, errorLine - contextLines - 1);
    const end = Math.min(lines.length, errorLine + contextLines);

    console.error("\nSource Context:");
    console.error(`File: ${filePath}:${errorLine}`);
    console.error("---");

    for (let i = start; i < end; i++) {
      const lineNum = i + 1;
      const marker = lineNum === errorLine ? ">> " : "   ";
      console.error(`${marker}${lineNum.toString().padEnd(4)} | ${lines[i]}`);
    }
    console.error("---");
  } catch (e) {
    console.error(`Failed to read source context for ${filePath}:`, e);
  }
}
