import React from "react";
import { COLOURS } from "@/utils/constants";
import { useJobsContext } from "@/components/jobs/jobsProvider";

const HeroSection: React.FC = () => {
  const { selectedJob } = useJobsContext();

  if (!selectedJob) {
    return (
      <section
        className="flex h-full items-center justify-center rounded-2xl border p-10 text-center shadow-sm"
        style={{ backgroundColor: COLOURS.background, borderColor: COLOURS.border }}
      >
        <p className="text-sm text-neutral-600">No jobs match your search. Adjust the filters to explore more roles.</p>
      </section>
    );
  }

  const paragraphs =
    typeof selectedJob.description === "string"
      ? selectedJob.description.split(/\n+/).map((segment) => segment.trim()).filter(Boolean)
      : [];

  return (
    <section
      className="flex h-full flex-col gap-6 overflow-y-auto rounded-2xl border p-8 shadow-sm"
      style={{ backgroundColor: COLOURS.background, borderColor: COLOURS.border }}
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-600">{selectedJob.company}</p>
        <h2 className="text-3xl font-semibold text-neutral-900">{selectedJob.title}</h2>
        {selectedJob.location && <p className="text-sm text-neutral-600">{selectedJob.location}</p>}
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-medium text-neutral-700">
        {selectedJob.jobType && (
          <span className="rounded-full bg-neutral-200 px-3 py-1 uppercase tracking-wide">{selectedJob.jobType}</span>
        )}
        {selectedJob.experience && (
          <span className="rounded-full bg-neutral-200 px-3 py-1 uppercase tracking-wide">{selectedJob.experience}</span>
        )}
        {selectedJob.industry && (
          <span className="rounded-full bg-neutral-200 px-3 py-1 uppercase tracking-wide">{selectedJob.industry}</span>
        )}
        {selectedJob.role && (
          <span className="rounded-full bg-neutral-200 px-3 py-1 uppercase tracking-wide">{selectedJob.role}</span>
        )}
      </div>

      {paragraphs.length > 0 ? (
        <div className="space-y-3 text-sm leading-relaxed text-neutral-700">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-600">Detailed description coming soon.</p>
      )}

      {selectedJob.applyUrl && (
        <div>
          <a
            href={selectedJob.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{ backgroundColor: COLOURS.primary }}
          >
            Apply Now
          </a>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
