import { useLayoutEffect } from "react";

/**
 * Custom hook to lock/unlock body scroll while allowing modal scroll
 * @param {boolean} isLocked - Whether scroll should be locked
 */
export const useScrollLock = (isLocked) => {
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isLocked) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
};
