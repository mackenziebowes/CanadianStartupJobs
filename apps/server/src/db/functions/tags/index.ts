import {
  create_industries,
  delete_industries,
  get_industries,
  update_industries,
} from "./industries";
import {
  create_provinces,
  delete_provinces,
  get_provinces,
  update_provinces,
} from "./provinces";
import {
  create_raisingStage,
  delete_raisingStage,
  get_raisingStage,
  update_raisingStage,
} from "./raisingStage";
import {
  create_teamSize,
  delete_teamSize,
  get_teamSize,
  update_teamSize,
} from "./teamSize";
import {
  create_experienceLevels,
  update_experienceLevels,
  delete_experienceLevels,
  get_experienceLevels,
} from "./experienceLevels";
import {
  create_jobTypes,
  delete_jobTypes,
  get_jobTypes,
  update_jobTypes,
} from "./jobTypes";
import {
  create_roles,
  delete_roles,
  get_roles,
  update_roles,
} from "./roles";

const industries = {
  create: create_industries,
  read: get_industries,
  update: update_industries,
  delete: delete_industries,
};

const provinces = {
  create: create_provinces,
  read: get_provinces,
  update: update_provinces,
  delete: delete_provinces,
};

const raisingStage = {
  create: create_raisingStage,
  read: get_raisingStage,
  update: update_raisingStage,
  delete: delete_raisingStage,
};

const teamSize = {
  create: create_teamSize,
  read: get_teamSize,
  update: update_teamSize,
  delete: delete_teamSize,
};

const experienceLevels = {
  create: create_experienceLevels,
  read: get_experienceLevels,
  update: update_experienceLevels,
  delete: delete_experienceLevels,
};

const jobTypes = {
  create: create_jobTypes,
  read: get_jobTypes,
  update: update_jobTypes,
  delete: delete_jobTypes,
};

const roles = {
  create: create_roles,
  read: get_roles,
  update: update_roles,
  delete: delete_roles,
};

export { industries, provinces, raisingStage, teamSize, experienceLevels, jobTypes, roles };
