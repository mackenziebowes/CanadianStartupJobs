import { type Job as ApiJob } from "@/data/api/jobs";
import { type Job } from "@/contexts/jobs/types";

export function mapApiJobToFrontend(apiJob: ApiJob): Job {
  return {
    id: apiJob.id.toString(),
    title: apiJob.title,
    company: apiJob.company,
    description: apiJob.description,
    salary: `${apiJob.salaryMin} - ${apiJob.salaryMax}`,
    city: apiJob.city,
    province: apiJob.province,
    location: `${apiJob.city}, ${apiJob.province}`,
    applyUrl: apiJob.postingUrl,
    jobType: undefined,
    experience: undefined,
    industry: undefined,
    role: undefined,
  };
}

export function mapApiJobsToFrontend(apiJobs: ApiJob[]): Record<string, Job> {
  const jobsMap: Record<string, Job> = {};
  apiJobs.forEach((job) => {
    const mappedJob = mapApiJobToFrontend(job);
    jobsMap[mappedJob.id] = mappedJob;
  });
  return jobsMap;
}
