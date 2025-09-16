// SmoothScrollProvider.jsx
"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Optional: expose globally
    window.lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
