
import { tagsAPI } from "@/data/api/tags";
import JobTypesComboBox from "./control";

export default async function JobTypesFilter() {
  const jobTypes = await tagsAPI.list.jobType();
  const options = [
    { value: 0, label: "Not Set" },
    ...jobTypes.map((item) => {
      return {
        value: item.id,
        label: item.name
      }
    })
  ];
  return (
    <div className="flex flex-col gap-2">
      <h3>Job Types</h3>
      <JobTypesComboBox options={options} />
    </div>
  )
}
