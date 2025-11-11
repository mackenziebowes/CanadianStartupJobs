// components/Homepage.tsx
"use client";

import React from "react";
import Header from "@/components/layout/header";
import HeroSection from "@/components/layout/heroSection";

const Homepage: React.FC = () => { 
  return (
    <div className="flex min-h-0 flex-col overflow-hidden">
      <Header />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <HeroSection />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
