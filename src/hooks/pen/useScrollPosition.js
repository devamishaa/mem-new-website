"use client";

import { useEffect, useState } from "react";

export function useScrollPosition() {
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrollPos({ x: window.scrollX, y: window.scrollY });
    const onResize = () => setScrollPos({ x: window.scrollX, y: window.scrollY });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return scrollPos;
}

