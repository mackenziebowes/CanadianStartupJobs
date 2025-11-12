// components/Homepage.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/layout/header";
import HeroSection from "@/components/layout/heroSection";
import { COLOURS } from "@/utils/constants";

const Homepage: React.FC = () => { 
  const heroViewportRef = useRef<HTMLDivElement | null>(null);
  const [heroMaxHeight, setHeroMaxHeight] = useState<number>();

  useEffect(() => {
    const update = () => {
      const node = heroViewportRef.current;
      if (!node) return;

      const { top } = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const gutter = 40;
      setHeroMaxHeight(Math.max(200, viewportHeight - top - gutter));
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(update);
      if (heroViewportRef.current) {
        observer.observe(heroViewportRef.current);
      }
    }

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      observer?.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-0 flex-col overflow-visible">
      <div className="shrink-0">
        <Header />
      </div>
      <div className="flex min-h-0 flex-col overflow-visible">
        <div
          ref={heroViewportRef}
          className="flex-1 min-h-0 overflow-hidden px-4 pb-6 sm:px-6 lg:px-8"
          style={{ backgroundColor: COLOURS.background }}
        >
          <HeroSection maxHeight={heroMaxHeight} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
