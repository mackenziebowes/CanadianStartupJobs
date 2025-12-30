import { tagsAPI } from "@/data/api/tags";
import IndustriesComboBox from "./control";

export default async function IndustriesFilter() {
  const industries = await tagsAPI.list.industries();
  const options = [
    { value: 0, label: "Not Set" },
    ...industries.map((item) => {
      return {
        value: item.id,
        label: item.name
      }
    })
  ];
  return (
    <div className="flex flex-col gap-2">
      <h3>Industries</h3>
      <IndustriesComboBox options={options} />
    </div>
  )
}
