import Controller from "./Controller";

export default function JobList() {
  return (
    <section
      aria-label="Job Listings"
      role="region"
      className="flex h-full min-h-0 flex-col space-y-3"
    >
      <h2 className="text-lg font-semibold text-neutral-800">Latest Jobs</h2>
      <Controller />
    </section>
  );
}
