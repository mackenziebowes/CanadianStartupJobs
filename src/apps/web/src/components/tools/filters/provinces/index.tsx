
import { tagsAPI } from "@/data/api/tags";
import ProvincesComboBox from "./control";

export default async function ProvincesFilter() {
  const provinces = await tagsAPI.list.provinces();
  const options = [
    { value: 0, label: "Not Set" },
    ...provinces.map((item) => {
      return {
        value: item.id,
        label: item.name
      }
    })
  ];
  return (
    <div className="flex flex-col gap-2">
      <h3>Provinces</h3>
      <ProvincesComboBox options={options} />
    </div>
  )
}
