import type { RichJob } from "@/contexts/jobs/types";
import { jobsApi } from "@/data/api/jobs";

export function getActiveJobId(
  filteredJobIds: string[],
  selectedJobId: string | null
): string | null {
  if (filteredJobIds.length === 0) return null;
  if (selectedJobId && filteredJobIds.includes(selectedJobId)) return selectedJobId;
  return filteredJobIds[0];
}

export async function getActiveJob(
  activeJobId: string | null
): Promise<RichJob> {
  try {
    if (!activeJobId) throw new Error("Attempting to Get Active Job without passing active Job Id");
    const dbId = parseInt(activeJobId);
    if (!dbId) throw new Error("Active Job Id is not a stringified number");
    return await jobsApi.getRichById(dbId);
  } catch (error) {
    throw error;
  }
}
