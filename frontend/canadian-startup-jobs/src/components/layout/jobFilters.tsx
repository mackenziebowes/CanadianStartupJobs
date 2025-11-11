"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

export type DropdownFilters = {
  province: string;
  jobType: string;
  experience: string;
  industry: string;
  role: string;
};

const PROVINCES = ["Any Province", "AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK"];
const JOB_TYPES = ["Any Job Type", "Full-time", "Part-time", "Contract", "Internship"];
const EXPERIENCE = ["Any Experience", "Entry", "Intermediate", "Senior", "Leadership"];
const INDUSTRIES = ["Any Industry", "Fintech", "Healthtech", "Cleantech", "AI & Data", "Consumer", "Enterprise SaaS"];
const ROLES = ["Any Role", "Software Engineering", "Product Management", "Design", "Marketing", "Sales", "Operations"];

const FIELDS: { key: keyof DropdownFilters; label: string; options: string[] }[] = [
  { key: "province", label: "Province", options: PROVINCES },
  { key: "jobType", label: "Job Type", options: JOB_TYPES },
  { key: "experience", label: "Experience", options: EXPERIENCE },
  { key: "industry", label: "Industry", options: INDUSTRIES },
  { key: "role", label: "Role", options: ROLES },
];

const INITIAL_STATE: DropdownFilters = {
  province: PROVINCES[0],
  jobType: JOB_TYPES[0],
  experience: EXPERIENCE[0],
  industry: INDUSTRIES[0],
  role: ROLES[0],
};

type JobFiltersProps = {
  onChange?: (filters: DropdownFilters) => void;
};

export default function JobFilters({ onChange }: JobFiltersProps) {
  const [filters, setFilters] = useState<DropdownFilters>(INITIAL_STATE);
  const [openKey, setOpenKey] = useState<keyof DropdownFilters | null>(null);

  useEffect(() => {
    onChange?.(filters);
  }, [filters, onChange]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenKey(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const activeCount = useMemo(
    () =>
      Number(filters.province !== PROVINCES[0]) +
      Number(filters.jobType !== JOB_TYPES[0]) +
      Number(filters.experience !== EXPERIENCE[0]) +
      Number(filters.industry !== INDUSTRIES[0]) +
      Number(filters.role !== ROLES[0]),
    [filters]
  );

  const handleSelect = (key: keyof DropdownFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOpenKey(null);
  };

  const handleReset = () => {
    setFilters(INITIAL_STATE);
    setOpenKey(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange?.(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">Filters</h2>
        <span className="text-xs text-neutral-500">{activeCount} active</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {FIELDS.map(({ key, label, options }) => (
          <DropdownField
            key={key}
            label={label}
            value={filters[key]}
            options={options}
            isOpen={openKey === key}
            onToggle={() => setOpenKey((prev) => (prev === key ? null : key))}
            onSelect={(value) => handleSelect(key, value)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="flex-1 rounded-full bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black/90"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

type DropdownFieldProps = {
  label: string;
  value: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
};

function DropdownField({ label, value, options, isOpen, onToggle, onSelect }: DropdownFieldProps) {
  return (
    <div className="relative">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 text-sm shadow-sm hover:border-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="text-left">
          <span className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
          <span className="block text-sm text-neutral-800">{value}</span>
        </span>
        <span className="ml-3 text-neutral-500">{isOpen ? "▴" : "▾"}</span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full max-h-56 overflow-y-auto rounded-lg border border-black/10 bg-white p-2 text-sm shadow-lg"
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={`w-full rounded-md px-3 py-2 text-left hover:bg-neutral-100 ${
                  option === value ? "font-medium text-black" : "text-neutral-700"
                }`}
                onClick={() => onSelect(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
