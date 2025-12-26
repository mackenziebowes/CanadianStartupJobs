import { addToQueue } from "@/db/functions/queues";
import { startLlMCallWorker, stopLlMCallWorker, isWorkerRunning } from "@/workers/llmCallWorker";

interface SourceConfig {
  name: string;
  home: string;
  portfolio: string;
}

// Example VC sources to process
const SOURCES: SourceConfig[] = [
  {
    name: "Garage Capital",
    home: "https://www.garage.vc",
    portfolio: "https://www.garage.vc/#portfolio",
  },
  {
    name: "Inovia Capital",
    home: "https://www.inovia.vc",
    portfolio: "https://www.inovia.vc/portfolio",
  },
  {
    name: "Real Ventures",
    home: "https://www.realventures.com",
    portfolio: "https://www.realventures.com/companies",
  },
];

// Helper function to validate URLs
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Queue a source for processing
const queueSource = async (source: SourceConfig) => {
  if (!isValidUrl(source.home)) {
    throw new Error(`Invalid home URL: ${source.home}`);
  }
  if (!isValidUrl(source.portfolio)) {
    throw new Error(`Invalid portfolio URL: ${source.portfolio}`);
  }

  console.log(`\n📋 Queueing source: ${source.name}`);
  console.log(`   Home: ${source.home}`);
  console.log(`   Portfolio: ${source.portfolio}`);

  const queuedItem = await addToQueue({
    payload: {
      home: source.home,
      portfolio: source.portfolio,
    },
    agent: "sourceAgent",
  });

  console.log(`   ✅ Queued as job #${queuedItem.id}`);
  return queuedItem.id;
};

// Process sources: queue them and start the worker
const processSources = async (sources: SourceConfig[]) => {
  console.log("🚀 Starting Canadian Startup Jobs Pipeline");
  console.log("=" .repeat(50));

  // Queue all sources
  const jobIds: number[] = [];
  for (const source of sources) {
    try {
      const jobId = await queueSource(source);
      jobIds.push(jobId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`   ❌ Failed to queue ${source.name}: ${errorMessage}`);
    }
  }

  console.log("\n" + "=" .repeat(50));
  console.log(`📊 Summary: ${jobIds.length} sources queued for processing`);
  console.log("   Job IDs:", jobIds.join(", "));
  console.log("\n🔄 Starting LLM call worker...");
  console.log("   The worker will process the queue and discover:");
  console.log("   1. Sources (VC firms)");
  console.log("   2. Organizations (portfolio companies)");
  console.log("   3. Jobs (open positions)");
  console.log("\n   Press Ctrl+C to stop the worker\n");

  // Start the worker
  startLlMCallWorker({
    pollIntervalMs: 2000,
    rateLimitPerSec: 2, // Conservative rate limit to avoid overwhelming APIs
  });

  // Keep the process running until interrupted
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n\n⚠️  Received ${signal}, stopping worker...`);
    await stopLlMCallWorker();
    console.log("✅ Worker stopped. Goodbye!");
    process.exit(0);
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

  // Prevent the script from exiting
  await new Promise(() => {});
};

// Main function
const main = async () => {
  if (isWorkerRunning()) {
    console.log("⚠️  Worker is already running. Please stop it first.");
    console.log("   Or modify this script to queue sources without starting the worker.");
    process.exit(1);
  }

  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // No arguments: process all predefined sources
    await processSources(SOURCES);
  } else if (args.length === 2) {
    // Two arguments: custom home and portfolio URLs
    const [home, portfolio] = args;
    await processSources([{ name: "Custom Source", home, portfolio }]);
  } else if (args[0] === "--help" || args[0] === "-h") {
    console.log(`
Usage:
  bun run queue-source                          # Queue all predefined VC sources
  bun run queue-source <home> <portfolio>       # Queue a custom source

Examples:
  bun run queue-source
  bun run queue-source https://example.com https://example.com/portfolio

Predefined sources:
${SOURCES.map(s => `  - ${s.name}`).join("\n")}
    `);
    process.exit(0);
  } else {
    console.error("❌ Invalid arguments. Use --help for usage information.");
    process.exit(1);
  }
};

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
