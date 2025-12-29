interface ApplyProps {
  jobBoardUrl?: string;
  postingUrl?: string;
}

export default function Apply({ jobBoardUrl, postingUrl }: ApplyProps) {
  if (!jobBoardUrl && !postingUrl) {
    return null;
  }

  return (
    <section className="border-t border-neutral-200 pt-6">
      <h2 className="text-xl font-semibold text-neutral-900 mb-3">Apply</h2>
      <div className="flex flex-wrap gap-3">
        {postingUrl && (
          <a
            href={postingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-[#8b2332] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#721c28] transition-colors"
          >
            Apply Now
          </a>
        )}
        {jobBoardUrl && (
          <a
            href={jobBoardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-[#8b2332] px-6 py-2.5 text-sm font-medium text-[#8b2332] hover:bg-[#8b2332]/5 transition-colors"
          >
            View Job Board
          </a>
        )}
      </div>
    </section>
  );
}
