import { useState, useEffect, useCallback } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

type ResponsiveState = {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number | null;
};

type UseResponsiveOptions = {
  breakpointThresholds?: Record<Breakpoint, number>;
};

const DEFAULT_BREAKPOINTS: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

type UseResponsiveReturn = ResponsiveState & {
  matches: (breakpoint: Breakpoint) => boolean;
  isAtLeast: (breakpoint: Breakpoint) => boolean;
  isAtMost: (breakpoint: Breakpoint) => boolean;
};

/**
 * Business hook for responsive behavior.
 *
 * Encapsulates breakpoint logic and viewport detection.
 * Components can declaratively check viewport state without
 * duplicating window.matchMedia logic everywhere.
 *
 * @example
 * const { isMobile, isDesktop, isAtLeast } = useResponsive();
 *
 * if (isMobile) return <MobileView />;
 * if (isDesktop) return <DesktopView />;
 *
 * // Custom breakpoint checks
 * if (isAtLeast('lg')) return <LargeScreenLayout />;
 */
export function useResponsive(options: UseResponsiveOptions = {}): UseResponsiveReturn {
  const { breakpointThresholds = DEFAULT_BREAKPOINTS } = options;

  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === "undefined") {
      return {
        breakpoint: "lg",
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: null,
      };
    }

    const width = window.innerWidth;
    return computeResponsiveState(width, breakpointThresholds);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateState = () => {
      const width = window.innerWidth;
      setState(computeResponsiveState(width, breakpointThresholds));
    };

    const mediaQuery = window.matchMedia(`(max-width: ${breakpointThresholds.lg - 1}px)`);

    // Use modern API if available
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateState);
      return () => mediaQuery.removeEventListener("change", updateState);
    }

    // Fallback for older browsers
    window.addEventListener("resize", updateState);
    return () => window.removeEventListener("resize", updateState);
  }, [breakpointThresholds]);

  const matches = useCallback(
    (breakpoint: Breakpoint) => {
      return state.breakpoint === breakpoint;
    },
    [state.breakpoint]
  );

  const isAtLeast = useCallback(
    (breakpoint: Breakpoint) => {
      const breakpointWidth = breakpointThresholds[breakpoint];
      if (!state.width) return breakpoint === "lg";
      return state.width >= breakpointWidth;
    },
    [state.width, breakpointThresholds]
  );

  const isAtMost = useCallback(
    (breakpoint: Breakpoint) => {
      const breakpointWidth = breakpointThresholds[breakpoint];
      if (!state.width) return breakpoint === "xs";
      return state.width <= breakpointWidth;
    },
    [state.width, breakpointThresholds]
  );

  return {
    ...state,
    matches,
    isAtLeast,
    isAtMost,
  };
}

function computeResponsiveState(
  width: number,
  thresholds: Record<Breakpoint, number>
): ResponsiveState {
  let breakpoint: Breakpoint = "xs";

  if (width >= thresholds.xl) breakpoint = "xl";
  else if (width >= thresholds.lg) breakpoint = "lg";
  else if (width >= thresholds.md) breakpoint = "md";
  else if (width >= thresholds.sm) breakpoint = "sm";

  return {
    breakpoint,
    isMobile: width < thresholds.md,
    isTablet: width >= thresholds.md && width < thresholds.lg,
    isDesktop: width >= thresholds.lg,
    width,
  };
}
