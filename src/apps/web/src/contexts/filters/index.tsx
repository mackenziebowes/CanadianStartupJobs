"use client";

import { createContext, useContext, useState, useCallback } from "react";

type FilterValue = number; // 0 = "Not Set", otherwise tag ID

export type FilterState = {
  province: FilterValue;
  jobType: FilterValue;
  experience: FilterValue;
  industry: FilterValue;
  role: FilterValue;
};

const DEFAULT_FILTER_STATE: FilterState = {
  province: 0,
  jobType: 0,
  experience: 0,
  industry: 0,
  role: 0,
};

type FiltersContextValue = {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: FilterValue) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
};

const FiltersContext = createContext<FiltersContextValue | undefined>(undefined);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const setFilter = useCallback((key: keyof FilterState, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER_STATE);
  }, []);

  const hasActiveFilters = Object.values(filters).some((value) => value !== 0);

  const value = {
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
  };

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFiltersContext() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFiltersContext must be used within FiltersProvider");
  }
  return context;
}
