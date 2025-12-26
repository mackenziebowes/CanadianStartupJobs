import { createJobs } from "@/db/functions/generators/createJobPivots";

async function generateJobPivotFunctions() {
  console.log("Starting Job Pivot Generation...");
  const content = createJobs();
  await Bun.write("./src/db/functions/pivots/jobs.ts", content);
  console.log("Done!");
}

generateJobPivotFunctions();
