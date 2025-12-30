"use client";
import { useJobsContext } from "@/contexts/jobs";
import JobCard from "@/components/jobs/JobCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import ListPagination from "./ListPagination";

export default function List() {
  const { jobsById } = useJobsContext();

  return (
  <div className="grid grid-cols-1 grid-rows-[4fr, 1fr] gap-8 p-4 min-h-0 h-(--jl-h)">
    <ScrollArea className="flex-1 p-8 w-full bg-linen-200/50">
      <div className="flex flex-col gap-4 ">
        {Object.keys(jobsById).map((key) => {
          const job = jobsById[key];
          if (!job) return <></>;
          return <JobCard key={`${job.title}-${key}`} job={job} />
        })}
      </div>
    </ScrollArea>
    <div className="h-full w-full bg-linen-200/50">
      <ListPagination />
    </div>
  </div>)
}
