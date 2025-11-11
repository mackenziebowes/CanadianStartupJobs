"use client";

import { ChangeEvent } from "react";

export type SearchResult = {
  id: string;
  title: string;
  company: string;
  location: string;
};

type SearchBarProps = {
  value: string;
  onChange: (next: string) => void;
  results: SearchResult[];
};

export default function SearchBar({ value, onChange, results }: SearchBarProps) {
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="sr-only">Search jobs</span>
        <input
          type="search"
          value={value}
          onChange={handleInput}
          placeholder="Search roles, companies, or keywords"
          className="w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      </label>

      {value.trim().length > 0 && (
        <div className="space-y-2 rounded-lg border border-black/5 bg-white p-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {results.length} result{results.length === 1 ? "" : "s"} found
          </p>
          <ul className="space-y-2">
            {results.length === 0 && (
              <li className="text-sm text-neutral-500">No matching jobs yet.</li>
            )}
            {results.map((result) => (
              <li key={result.id} className="text-sm">
                <p className="font-medium text-black">{result.title}</p>
                <p className="text-neutral-600">
                  {result.company} · {result.location}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
