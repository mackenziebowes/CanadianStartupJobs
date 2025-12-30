import { FILTER_DROPDOWN_CONFIG, type FilterState } from "@/components/legacy/jobs/filterConfig";
import type { Job } from "@/contexts/jobs/types";

export function filterJobsByTermAndFilters(
  jobsById: Record<string, Job>,
  jobIds: string[],
  filters: FilterState,
  searchTerm: string
): string[] {
  const term = searchTerm.trim().toLowerCase();
  return jobIds.filter((id) => {
    const job = jobsById[id];
    if (!job) return false;

    const passesFilters = FILTER_DROPDOWN_CONFIG.every(({ key, defaultValue }) => {
      const filterValue = filters[key];
      if (filterValue === defaultValue) return true;
      const jobValue = (job[key] ?? "").toString();
      return jobValue.length > 0 && jobValue === filterValue;
    });

    if (!passesFilters) return false;
    if (!term) return true;

    return (
      job.title?.toLowerCase().includes(term) ||
      job.company?.toLowerCase().includes(term)
    );
  });
}

export function getJobsFromIds(jobsById: Record<string, Job>, jobIds: string[]): Job[] {
  return jobIds.map((id) => jobsById[id]).filter(Boolean) as Job[];
}
