import type React from "react";
import SWRProvider from "@/components/legacy/SWRProvider";
import { JobsProvider } from "@/contexts/jobs";
import { FiltersProvider } from "@/contexts/filters";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRProvider>
      <FiltersProvider>
        <JobsProvider>
          {children}
        </JobsProvider>
      </FiltersProvider>
    </SWRProvider>
  );
}
