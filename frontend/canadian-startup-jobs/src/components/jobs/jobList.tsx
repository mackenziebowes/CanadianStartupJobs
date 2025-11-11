"use client";

import { JobCard } from "@/components/jobs/jobCard";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
type JobListProps = {
  maxHeight?: number;
};

/**
 * JobList (loading placeholder)
 * Roadmap:
 * - Add filter bar (keyword, province, remote, type) per codex.prompt.md
 * - Replace skeleton cards with <JobCard /> rendering real data from /src/data/jobs.json via lib/api
 * - Implement pagination or infinite scroll (configurable)
 * - Add source badge (local / scraper) + Verified 🇨🇦 indicator
 */
export default function JobList(props: JobListProps = {}) {
  const { maxHeight } = props;
  const computedMaxHeight =
    typeof maxHeight === "number" ? Math.max(160, maxHeight) : undefined;
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 1020px)").matches
  );
  const firstCardRef = useRef<HTMLDivElement | null>(null);
  const [cardHeight, setCardHeight] = useState<number>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 1020px)");
    const updateMatch = () => setIsMobile(mediaQuery.matches);

    updateMatch();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMatch);
      return () => mediaQuery.removeEventListener("change", updateMatch);
    }

    mediaQuery.addListener(updateMatch);
    return () => mediaQuery.removeListener(updateMatch);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setCardHeight(undefined);
      return;
    }

    const measure = () => {
      if (firstCardRef.current) {
        setCardHeight(firstCardRef.current.offsetHeight);
      }
    };

    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);

  const listStyle: CSSProperties = computedMaxHeight
    ? { maxHeight: `calc(${computedMaxHeight}px - 128px)` }
    : {};

  if (isMobile && cardHeight) {
    listStyle.maxHeight = `${cardHeight}px`;
    listStyle.height = `${cardHeight}px`;
  }

  const jobCount = 25;

  return (
    <section
      aria-label="Job listings"
      role="region"
      className="flex h-full min-h-0 flex-col space-y-3"
    >
      <h2 className="text-lg font-semibold text-neutral-800">Latest Jobs</h2>
      <div
        className={`flex-1 min-h-0 overflow-y-auto pr-2 snap-y snap-mandatory md:snap-none ${isMobile ? "space-y-0" : "space-y-2"}`}
        style={listStyle}
        role="list"
        aria-busy="true"
        aria-live="polite"
      >
        {Array.from({ length: jobCount }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? firstCardRef : undefined}
            className={`snap-start ${isMobile ? "sticky top-0 z-10 bg-white" : ""}`}
          >
            <JobCard />
          </div>
        ))}
      </div>
      {/* pagination placeholder can remain if desired */}
    </section>
  );
}
