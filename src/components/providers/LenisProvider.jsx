// "use client";

// import { useEffect, useRef, createContext, useContext } from "react";
// import Lenis from "lenis";
// import { gsap, ScrollTrigger } from "@/utils/gsap";

// const LenisContext = createContext(null);

// /** Access the ref to the Lenis instance. Use `const lenis = useLenis()?.current` */
// export const useLenis = () => useContext(LenisContext);
// /** Convenience: returns the instance directly (null until mounted) */
// export const useLenisInstance = () => {
//   const ref = useLenis();
//   return ref?.current ?? null;
// };

// export const LenisProvider = ({ children, options = {} }) => {
//   const lenisRef = useRef(null);
//   const rafRef = useRef(0);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const lenis = new Lenis({
//       duration: 0.8,
//       easing: (t) => 1 - Math.pow(1 - t, 3),
//       smoothWheel: true,
//       smoothTouch: false, // Keep disabled for mobile to prevent jitter
//       gestureOrientation: "vertical",
//       wheelMultiplier: 1,
//       touchMultiplier: 1, // Add smooth touch multiplier for better mobile performance
//       infinite: false,
//       ...options,
//     });

//     lenisRef.current = lenis;

//     // Sync ScrollTrigger with Lenis
//     lenis.on("scroll", ScrollTrigger.update);

//     // Use GSAP ticker to drive Lenis's raf loop for better sync
//     const ticker = (time) => {
//         lenis.raf(time * 1000);
//     }
//     gsap.ticker.add(ticker);
//     gsap.ticker.lagSmoothing(0);

//     // Correctly configure scrollerProxy
//     ScrollTrigger.scrollerProxy(document.documentElement, {
//       scrollTop(value) {
//         if (arguments.length) {
//           lenis.scrollTo(value, { immediate: true });
//         }
//         return lenis.scroll; // Use lenis.scroll instead of window.scrollY
//       },
//       getBoundingClientRect() {
//         return {
//           top: 0,
//           left: 0,
//           width: window.innerWidth,
//           height: window.innerHeight,
//         };
//       },
//       pinType: "transform" // More reliable for smooth scrolling
//     });

//     ScrollTrigger.defaults({ scroller: document.documentElement });
//     ScrollTrigger.refresh();

//     return () => {
//       lenis.destroy();
//       lenisRef.current = null;
//       gsap.ticker.remove(ticker);
//       ScrollTrigger.scrollerProxy(document.documentElement, null);
//     };
//   }, [options]);

//   // Expose the ref (never null; .current is null until mounted)
//   return (
//     <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
//   );
// };

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
