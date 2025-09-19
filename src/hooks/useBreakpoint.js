import { useState, useEffect, useCallback } from "react";
import { BREAKPOINTS } from "@/utils/breakpoints";

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState("LAPTOP_L");

  const getBreakpoint = useCallback(() => {
    const width = window.innerWidth;
    if (width <= BREAKPOINTS.MOBILE_S) return "MOBILE_S";
    if (width <= BREAKPOINTS.MOBILE_M) return "MOBILE_M";
    if (width <= BREAKPOINTS.MOBILE_L) return "MOBILE_L";
    if (width <= BREAKPOINTS.TABLET) return "TABLET";
    if (width <= BREAKPOINTS.LAPTOP) return "LAPTOP";
    return "LAPTOP_L";
  }, []);

  useEffect(() => {
    // Set initial breakpoint
    setBreakpoint(getBreakpoint());

    const handleResize = () => setBreakpoint(getBreakpoint());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getBreakpoint]);

  return breakpoint;
};
