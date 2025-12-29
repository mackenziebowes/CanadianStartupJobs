import ExperienceLevelsFilter from "./experienceLevels";
import RolesFilter from "./roles";
import JobTypesFilter from "./jobTypes";
import IndustriesFilter from "./industries";

export default function Filters() {
  return (
    <div className="flex flex-col gap-2 items-start">
      <IndustriesFilter />
      <RolesFilter />
      <ExperienceLevelsFilter />
      <JobTypesFilter />
    </div>
  );
}
