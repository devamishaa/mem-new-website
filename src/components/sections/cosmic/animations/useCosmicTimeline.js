"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

function shouldSkipAnimation(container) {
  if (!container || typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return true;
  if (window.innerWidth <= 600) return true; // Skip animations on mobile screens
  return false;
}

function findElements(container) {
  if (!container) return {};
  return {
    container,
    circle: container.querySelector("[data-cosmic-circle]"),
  };
}

export function useCosmicTimeline(containerRef, model) {
  const timelineRef = useRef();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (shouldSkipAnimation(container)) return;

    const elements = findElements(container);
    if (!elements.circle) {
      return;
    }

    // const ctx = gsap.context(() => {
    //   gsap.set(elements.circle, { yPercent: 100, opacity: 0, force3D: true });

    //   const tl = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: container,
    //       start: "top top",
    //       end: "+=200%", // very long scroll
    //       scrub: true,
    //       pin: true,
    //       anticipatePin: 1,
    //     },
    //   });

    //   tl.to(elements.circle, {
    //     yPercent: 0,
    //     opacity: 1,
    //     ease: "none", // avoid easing jitter
    //     duration: 3,
    //   });

    //   timelineRef.current = tl;
    // }, container);

    // return () => ctx.revert();
  }, [containerRef, model]);

  return timelineRef;
}
