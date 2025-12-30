
import { tagsAPI } from "@/data/api/tags";
import ExperienceLevelsComboBox from "./control";

export default async function RolesFilter() {
  const roles = await tagsAPI.list.roles();
  const options = [
    { value: 0, label: "Not Set" },
    ...roles.map((item) => {
      return {
        value: item.id,
        label: item.name
      }
    })
  ];
  return (
    <div className="flex flex-col gap-2">
      <h3>Roles</h3>
      <ExperienceLevelsComboBox options={options} />
    </div>
  )
}
