import { jobsApi, type JobWithRichData } from "@/data/api/jobs";
import JobDetail from "@/components/jobs/JobDetail";
import Link from "next/link";

interface JobPageProps {
  params: {
    id: string;
  };
}

export default async function JobPage({ params }: JobPageProps) {
  /* Params is a promise at build time, idk why NextJS does this but it do. Don't try to fix this for now. */
  const { id } = await params;
  const jobId = parseInt(id);

  let richJob: JobWithRichData | null = null;

  try {
    richJob = await jobsApi.getRichById(jobId);
    console.dir({ richJob });
  } catch (error) {
    console.error("Failed to fetch job:", error);
  }

  if (!richJob) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="text-sm text-neutral-600">We couldn&apos;t find that job. It may have been removed.</p>
        <Link
          href="/"
          className="mt-4 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Back to listings
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Back to listings
        </Link>
      </div>
      <div className="mx-auto max-w-3xl">
        <JobDetail job={richJob} />
      </div>
    </main>
  );
}
