import { createOrgPivots } from "@/lib/db/functions/generators/createOrgPivots";

async function generateJobPivotFunctions() {
  console.log("Starting org Pivot Generation...");
  const content = createOrgPivots();
  await Bun.write("./src/db/functions/pivots/orgs.ts", content);
  console.log("Done!");
}

generateJobPivotFunctions();
