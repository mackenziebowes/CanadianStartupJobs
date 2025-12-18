import {
  create_teamSize,
  delete_teamSize,
  get_teamSize,
  update_teamSize,
} from "./teamSize";

const teamSize = {
  create: create_teamSize,
  read: get_teamSize,
  update: update_teamSize,
  delete: delete_teamSize,
}

export {
  teamSize
};
