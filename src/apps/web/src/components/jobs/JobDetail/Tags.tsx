interface TagsProps {
  provinces: Array<{ id: number; name: string }>;
  experienceLevels: Array<{ id: number; name: string }>;
  industries: Array<{ id: number; name: string }>;
  jobTypes: Array<{ id: number; name: string }>;
  roles: Array<{ id: number; name: string }>;
}

export default function Tags({
  provinces,
  experienceLevels,
  industries,
  jobTypes,
  roles,
}: TagsProps) {
  const hasTags =
    provinces.length > 0 ||
    experienceLevels.length > 0 ||
    industries.length > 0 ||
    jobTypes.length > 0 ||
    roles.length > 0;

  if (!hasTags) {
    return null;
  }

  return (
    <section className="border-t border-neutral-200 pt-6">
      <h2 className="text-xl font-semibold text-neutral-900 mb-3">Tags</h2>
      <div className="flex flex-wrap gap-2 text-sm">
        {provinces.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
          >
            {tag.name}
          </span>
        ))}
        {experienceLevels.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700"
          >
            {tag.name}
          </span>
        ))}
        {industries.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700"
          >
            {tag.name}
          </span>
        ))}
        {jobTypes.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700"
          >
            {tag.name}
          </span>
        ))}
        {roles.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </section>
  );
}
