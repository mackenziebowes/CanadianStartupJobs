import { config } from '@/utils/config';

export type Job = {
  id: number;
  title: string;
  city: string;
  province: string;
  remote_ok: boolean;
  salary_min?: number;
  salary_max?: number;
  description: string;
  company: string;
  job_board_url?: string;
  posting_url?: string;
  is_at_a_startup?: boolean;
  last_scraped_markdown?: string;
  created_at: Date;
  updated_at: Date;
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

export const jobsApi = {
  list: async (): Promise<Job[]> => {
    const response = await fetch(API_URL);
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
