import { useEffect } from "react";

export const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isLocked) {
      // Store the current scroll position
      const scrollY = window.scrollY;

      // Lock the scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Get the current scroll position from the body style
      const scrollY = document.body.style.top;

      // Unlock the scroll
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // Restore the scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // Cleanup function
    return () => {
      if (isLocked) {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";

        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      }
    };
  }, [isLocked]);
};
