import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins once globally with error handling
if (typeof window !== "undefined" && !gsap.core.globals()["ScrollTrigger"]) {
  try {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // Global GSAP configuration
    gsap.config({
      force3D: true,
      nullTargetWarn: false,
    });

    // Set default ease
    gsap.defaults({
      ease: "power2.out",
      duration: 1,
    });

    // Mobile-specific optimizations
    if (window.innerWidth <= 768) {
      // Throttle ScrollTrigger updates on mobile for better performance
      ScrollTrigger.config({
        limitCallbacks: true,
        ignoreMobileResize: true,
      });
    }
  } catch (error) {
    console.warn("GSAP initialization failed:", error);
    // Fallback: basic GSAP without plugins
    try {
      gsap.config({
        force3D: false,
        nullTargetWarn: false,
      });
    } catch (fallbackError) {
      console.error("GSAP fallback initialization failed:", fallbackError);
    }
  }
}

export { gsap, ScrollTrigger };
