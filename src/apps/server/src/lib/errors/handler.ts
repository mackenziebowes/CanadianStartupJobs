import { AppError } from "./AppError";

const printBorder = () => console.error("\n________________________________________________________________________________\n");

function printErrorHeader(err: Error | AppError) {
  printBorder();
  if (err instanceof AppError) {
    console.error(`[${err.code}] ${err.message}`);
    if (err.meta) console.error("Meta:", JSON.stringify(err.meta, null, 2));
  } else {
    console.error(`[UNHANDLED] ${err.message}`);
  }
}

async function getFileLocationFromLine(line: string) {
  // Filter out noisy lines
  if (line.includes("node_modules")) return null;
  if (!line.includes("/")) return null;

  // Regex to match path and line: ( /path/to/file.ts:123:45 ) or at /path...
  const match = line.match(/\(([^:]+):(\d+):\d+\)/) || line.match(/at\s+([^:]+):(\d+):\d+/);
  if (!match) return null;

  const path = match[1];
  
  // Verify file exists
  if (!(await Bun.file(path).exists())) return null;

  return { path, line: parseInt(match[2], 10) };
}

export async function logErrorWithContext(err: Error | AppError) {
  printErrorHeader(err);

  if (!err.stack) {
    printBorder();
    return;
  }

  console.error("\nStack Trace:");
  const lines = err.stack.split("\n");
  
  let firstLocation: { path: string; line: number } | null = null;

  for (const line of lines) {
    console.error(line); // Always print the stack trace line

    // Only look for the first valid user-land file
    if (!firstLocation) {
      firstLocation = await getFileLocationFromLine(line);
    }
  }

  if (firstLocation) {
    await printSourceContext(firstLocation.path, firstLocation.line);
  }

  printBorder();
}

async function printSourceContext(filePath: string, errorLine: number, contextLines = 3) {
  try {
    const content = await Bun.file(filePath).text();
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
