import type { Job } from "@/contexts/jobs/types";
import Link from "next/link";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="w-full font-sans rounded-xs border border-black/50 bg-copper-50/50 px-4 py-4 text-left shadow-sm transition hover:border-black/40 hover:bg-linen-50">
      <Link
        href={`/jobs/${job.id}`}
        className="flex flex-col gap-2"
      >
        <div className="inline-flex items-center align-baseline justify-between flex-1">
        <p className="text-lg font-semibold text-charcoal-900">{job.title}</p>
        </div>
        <p className="text-md text-charcoal-600">{job.company}</p>
        {job.location && (
          <p className="mt-1 text-sm text-maritime-800">{job.location}</p>
        )}
        {job.description && (
          <p className="text-md text-charcoal-800 line-clamp-2 max-w-xl">{job.description}</p>
        )}
      </Link>
    </div>
  );
}
