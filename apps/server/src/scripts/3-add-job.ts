import { jobs } from "@/lib/ai";
import { AppError, ERROR_CODES } from "@/lib/errors";

const testJob = "https://jobs.lever.co/blanc-labs/45c009a2-6718-4b89-8507-bbf309a83f07";

async function main() {
  const newJob = await jobs.createNewJobFromURL(testJob);
  console.log("Done :)");
}

main();
