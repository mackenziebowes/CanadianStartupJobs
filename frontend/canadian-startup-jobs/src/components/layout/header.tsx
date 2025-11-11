"use client";

import { useMemo, useState } from "react";
import JobFilters, { DropdownFilters } from "@/components/layout/jobFilters";
import SearchBar, { SearchResult } from "@/components/layout/searchbar";

const SAMPLE_RESULTS: SearchResult[] = [
  { id: "1", title: "Frontend Developer", company: "Maple Labs", location: "Toronto, ON" },
  { id: "2", title: "Marketing Manager", company: "Prairie Growth", location: "Calgary, AB" },
  { id: "3", title: "Product Designer", company: "Northern Lights", location: "Vancouver, BC" },
  { id: "4", title: "Data Scientist", company: "Halifax Analytics", location: "Halifax, NS" },
  { id: "5", title: "Growth Marketer", company: "Montreal Momentum", location: "Montreal, QC" },
];

export default function Header() {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<DropdownFilters | null>(null);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const term = query.toLowerCase();
    return SAMPLE_RESULTS.filter(
      ({ title, company, location }) =>
        title.toLowerCase().includes(term) ||
        company.toLowerCase().includes(term) ||
        location.toLowerCase().includes(term)
    );
  }, [query]);

  return (
    <header className="border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <SearchBar value={query} onChange={setQuery} results={filteredResults.slice(0, 6)} />
        <JobFilters onChange={setActiveFilters} />
        {activeFilters && (
          <p className="text-xs text-neutral-500">
            Active filters:{" "}
            {Object.entries(activeFilters)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" · ")}
          </p>
        )}
      </div>
    </header>
  );
}
