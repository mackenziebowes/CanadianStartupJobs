import { firecrawl, jobSchema } from "@/lib/firecrawl";

export const scrapeJobsFromJobBoards = async (jobBoard: string) => {
  try {
    const result = await firecrawl.scrape(jobBoard, {
      formats: [
        {
          type: "json",
          schema: jobSchema,
          prompt:
            "If this is actually a job board with jobs on it for a startup company, return the jobs in the json format, otherwise return an empty array.",
        },
        "markdown",
      ],
    });

    let jobs: any[] = [];

    // Firecrawl returns result with json property containing the parsed schema
    if (
      result.json &&
      typeof result.json === "object" &&
      "jobs" in result.json
    ) {
      const extracted = (result.json as { jobs: any[] }).jobs;
      // Return the jobs array directly, ensuring it's an array
      jobs = Array.isArray(extracted) ? extracted : [];
    }

    return {
      jobs,
      markdown: result.markdown || "",
    };
  } catch (error) {
    // If scraping fails, return empty array
    return { jobs: [], markdown: "" };
  }
};
