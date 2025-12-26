import { runWorker, resetStuckJobs } from "@/workers/runWorker";

(async () => {
  await resetStuckJobs();
  runWorker({
    pollIntervalMs: 2000,
    rateLimitPerSec: 2,
});
})();