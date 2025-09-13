// hooks/useIsMobile.js
import { useEffect, useState } from "react";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    updateMobile(); // Set initially
    window.addEventListener("resize", updateMobile);

    return () => window.removeEventListener("resize", updateMobile);
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
