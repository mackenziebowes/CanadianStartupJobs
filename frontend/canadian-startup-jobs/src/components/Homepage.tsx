// components/Homepage.tsx
"use client";

import React from "react";
import Header from "@/components/layout/header";
import HeroSection from "@/components/layout/heroSection";
import { COLOURS } from "@/utils/constants";

const Homepage: React.FC = () => { 
  return (
    <div className="flex min-h-0 flex-col overflow-visible">
      <div className="shrink-0">
        <Header />
      </div>
      <div className="flex min-h-0 flex-col overflow-visible">
        <div
          className="flex-1 min-h-0 overflow-y-auto overflow-x-visible px-4 pb-6 sm:px-6 lg:px-8"
          style={{ backgroundColor: COLOURS.background }}
        >
          <HeroSection />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
