"use client";
import { useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "@/utils/gsap";

function shouldSkipAnimation(container) {
  if (!container || typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return true;
  return false;
}

function cleanupAnimations(animationsRef) {
  animationsRef.current.forEach((anim) => anim?.kill());
  animationsRef.current = [];
}

function setupParallaxAnimations(container, animationsRef) {
  const parallaxElements = container.querySelectorAll("[data-parallax]");

  parallaxElements.forEach((el) => {
    const speed = Number(el.getAttribute("data-parallax")) || 0.25;
    const animation = gsap.fromTo(
      el,
      { yPercent: -speed * 20 },
      {
        yPercent: speed * 20,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
    animationsRef.current.push(animation);
  });
}

export function usePillParallax(containerRef) {
  const animationsRef = useRef([]);

  const cleanup = useCallback(() => {
    cleanupAnimations(animationsRef);
  }, []);

  const setupAnimations = useCallback((container) => {
    if (shouldSkipAnimation(container)) return;
    cleanupAnimations(animationsRef);
    setupParallaxAnimations(container, animationsRef);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    setupAnimations(container);
    return cleanup;
  }, [containerRef, setupAnimations, cleanup]);

  return useMemo(() => ({
    animations: animationsRef.current,
  }), []);
}
