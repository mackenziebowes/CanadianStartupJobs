"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { jobsApi, type Job as ApiJob } from "@/data/api/jobs";
import {
  DEFAULT_FILTERS,
  FilterState,
  FILTER_DROPDOWN_CONFIG,
} from "@/components/legacy/jobs/filterConfig";

type Job = {
  id: string;
  title: string;
  company: string;
  description?: string;
  applyUrl?: string;
  location?: string;
  province?: string;
  jobType?: string;
  experience?: string;
  industry?: string;
  role?: string;
  [key: string]: unknown;
};

// Map API job to frontend Job type
const mapApiJobToFrontend = (apiJob: ApiJob): Job => ({
  id: apiJob.id.toString(),
  title: apiJob.title,
  company: apiJob.company,
  description: apiJob.description,
  location: `${apiJob.city}, ${apiJob.province}`,
  province: apiJob.province,
  applyUrl: apiJob.posting_url,
  jobType: undefined,
  experience: undefined,
  industry: undefined,
  role: undefined,
});

type JobsContextValue = {
  jobsById: Record<string, Job>;
  jobIds: string[];
  filteredJobIds: string[];
  filteredJobs: Job[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedJobId: string | null;
  selectedJob: Job | null;
  selectJob: (id: string) => void;
  isLoading: boolean;
};

const JobsContext = createContext<JobsContextValue | undefined>(undefined);

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobsById, setJobsById] = useState<Record<string, Job>>({});
  const [searchTerm, setSearchTermState] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const jobIds = Object.keys(jobsById);

  // Fetch jobs from API on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const apiJobs = await jobsApi.list();
        const mappedJobs = apiJobs.map(mapApiJobToFrontend);
        const jobsMap: Record<string, Job> = {};
        mappedJobs.forEach((job) => {
          jobsMap[job.id] = job;
        });
        setJobsById(jobsMap);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobIds = useMemo(() => {
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
  }, [filters, searchTerm]);

  const filteredJobs = useMemo(
    () => filteredJobIds.map((id) => jobsById[id]).filter(Boolean),
    [filteredJobIds]
  );

  const activeJobId = useMemo(() => {
    if (filteredJobIds.length === 0) return null;
    if (selectedJobId && filteredJobIds.includes(selectedJobId)) return selectedJobId;
    return filteredJobIds[0];
  }, [filteredJobIds, selectedJobId]);

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const selectJob = useCallback((id: string) => {
    if (jobsById[id]) {
      setSelectedJobId(id);
    }
  }, [jobsById]);

  const value = useMemo<JobsContextValue>(
    () => ({
      jobsById,
      jobIds,
      filteredJobIds,
      filteredJobs,
      searchTerm,
      setSearchTerm,
      filters,
      setFilters,
      selectedJobId: activeJobId,
      selectedJob: activeJobId ? jobsById[activeJobId] ?? null : null,
      selectJob,
      isLoading,
    }),
    [filteredJobIds, filteredJobs, searchTerm, setSearchTerm, filters, setFilters, activeJobId, selectJob, isLoading]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobsContext() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobsContext must be used within JobsProvider");
  }
  return context;
}
