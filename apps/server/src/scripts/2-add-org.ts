import { organizations } from "@/lib/ai";
import { AppError, ERROR_CODES } from "@/lib/errors";

const testOrg = "https://trayt.health/";

async function main() {
  const newOrganization = await organizations.createNewOrganizationFromURL(testOrg);
  if (!newOrganization.careersPage) throw new AppError(ERROR_CODES.SCHEMA_PARSE_FAILED, "organization.careersPage missing during flow that requires it");
  const newJobBoardCache = await organizations.createNewJobBoardCache(newOrganization.careersPage);
  await organizations.connectOrganizationToJobBoardCache(newOrganization.id, newJobBoardCache.id);
  console.log("Done :)");
}

main();
