import { tagsAPI } from "@/data/api/tags";
import ExperienceLevelsComboBox from "./control";

export default async function ExperienceLevelsFilter() {
  const experienceLevels = await tagsAPI.list.experienceLevels();
  const options = [
    { value: 0, label: "Not Set" },
    ...experienceLevels.map((item) => {
      return {
        value: item.id,
        label: item.name
      }
    })
  ];
  return (
    <div className="flex flex-col gap-2">
      <h3>Experience Levels</h3>
      <ExperienceLevelsComboBox options={options} />
    </div>
  )
}
