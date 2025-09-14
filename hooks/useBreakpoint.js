import { useState, useEffect } from "react";

const breakpoints = {
  MOBILE_S: 320,
  MOBILE_M: 375,
  MOBILE_L: 425,
  TABLET: 768,
  LAPTOP: 1024,
  LAPTOP_L: 1440,
  DESKTOP: 2560,
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState("DESKTOP");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width <= breakpoints.MOBILE_S) {
        setBreakpoint("MOBILE_S");
      } else if (width <= breakpoints.MOBILE_M) {
        setBreakpoint("MOBILE_M");
      } else if (width <= breakpoints.MOBILE_L) {
        setBreakpoint("MOBILE_L");
      } else if (width <= breakpoints.TABLET) {
        setBreakpoint("TABLET");
      } else if (width <= breakpoints.LAPTOP) {
        setBreakpoint("LAPTOP");
      } else if (width <= breakpoints.LAPTOP_L) {
        setBreakpoint("LAPTOP_L");
      } else {
        setBreakpoint("DESKTOP");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
};
