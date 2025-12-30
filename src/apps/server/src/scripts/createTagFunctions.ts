import { createTagFunctions } from "@/lib/db/functions/generators/createTagFunctions";
import { createTagRoutes } from "@/lib/db/functions/generators/createTagRoutes";
import { join } from "node:path";

const tagsToCreate = [
  "industries",
  "provinces",
  "raisingStage",
  "roles",
  "teamSize",
  "jobTypes",
];

async function generateTagFunctions() {
  console.log("Starting Tag Generation...");
  await Promise.all(
    tagsToCreate.map(async (tag, index) => {
      const functionFile = join("./src/db/functions/tags", `${tag}.ts`);
      const routeFile = join("./src/routes/tags", `${tag}.ts`);
      console.log(`${index}: Writing crud functions to ${functionFile}...`);
      const functions = createTagFunctions(tag);
      await Bun.write(functionFile, functions);
      console.log(`${index}: Writing crud routes to ${routeFile}...`);
      const routes = createTagRoutes(tag);
      await Bun.write(routeFile, routes);
      console.log(`${index}: Finished ${tag}`);
    }),
  );
  console.log("Done!");
}

generateTagFunctions();
