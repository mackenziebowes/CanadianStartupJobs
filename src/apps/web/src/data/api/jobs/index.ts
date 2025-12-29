import { config } from '@/utils/config';

export type Job = {
  id: number;
  title: string;
  city: string;
  province: string;
  remoteOk: boolean;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  company: string;
  jobBoardUrl?: string;
  postingUrl?: string;
  isAtAStartup?: boolean;
  lastScrapedMarkdown?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ListResponse = {
  count: number,
  jobs: Job[]
};

export type JobWithRichData = Job & {
  organization: {
    id: number;
    name: string;
    city: string;
    province: string;
    description: string;
    website?: string;
    careers_page?: string;
    industry?: string;
    created_at: Date;
    updated_at: Date;
  } | null;
  tags: {
    provinces: { id: number; name: string; code: string }[];
    experienceLevels: { id: number; name: string }[];
    industries: { id: number; name: string }[];
    jobTypes: { id: number; name: string }[];
    roles: { id: number; name: string }[];
  };
};

const API_URL = `${config.apiBaseUrl}/jobs`;

type FilterParams = {
  provinceId?: number;
  jobTypeId?: number;
  experienceLevelId?: number;
  industryId?: number;
  roleId?: number;
};

export const jobsApi = {
  list: async (skip: number = 0, take: number = 10, filters?: FilterParams): Promise<ListResponse> => {
    const url = new URL(API_URL);
    url.searchParams.set("skip", skip.toString());
    url.searchParams.set("take", take.toString());

    if (filters?.provinceId) url.searchParams.set("provinceId", filters.provinceId.toString());
    if (filters?.jobTypeId) url.searchParams.set("jobTypeId", filters.jobTypeId.toString());
    if (filters?.experienceLevelId) url.searchParams.set("experienceLevelId", filters.experienceLevelId.toString());
    if (filters?.industryId) url.searchParams.set("industryId", filters.industryId.toString());
    if (filters?.roleId) url.searchParams.set("roleId", filters.roleId.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }
    return response.json();
  },

  getById: async (id: number): Promise<Job> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch job ${id}: ${response.statusText}`);
    }
    return response.json();
  },

  getRichById: async (id: number): Promise<JobWithRichData> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch job ${id}: ${response.statusText}`);
    }
    return response.json();
  },
};
