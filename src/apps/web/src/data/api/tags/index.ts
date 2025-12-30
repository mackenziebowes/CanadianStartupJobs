import { config } from '@/utils/config';

const API_URL = `${config.apiBaseUrl}/tags`;

export type ExperienceLevels = {
  id: number,
  name: string,
}[];

const getExperienceLevels = async (): Promise<ExperienceLevels> => {
  const url = new URL(API_URL + "/experience-levels");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch experience levels: ${response.statusText}`);
  }
  return response.json();
}

export type Provinces = {
  id: number;
  name: string;
  code: string;
}[];

const getProvinces = async (): Promise<Provinces> => {
  const url = new URL(API_URL + "/provinces");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch provinces: ${response.statusText}`);
  }
  return response.json();
}

export type JobTypes = {
  id: number;
  name: string;
}[];

const getJobType = async (): Promise<JobTypes> => {
  const url = new URL(API_URL + "/job-types");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch job types: ${response.statusText}`);
  }
  return response.json();
}

export type Industries = {
  id: number;
  name: string;
}[];

const getIndustries = async (): Promise<Industries> => {
  const url = new URL(API_URL + "/industries");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch industries: ${response.statusText}`);
  }
  return response.json();
}

export type Roles = {
  id: number;
  name: string;
}[];

const getRoles = async (): Promise<Roles> => {
  const url = new URL(API_URL + "/roles");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch roles: ${response.statusText}`);
  }
  return response.json();
}

const tagsAPI = {
  list: {
    experienceLevels: getExperienceLevels,
    provinces: getProvinces,
    jobType: getJobType,
    industries: getIndustries,
    roles: getRoles
  }
};

export { tagsAPI };
