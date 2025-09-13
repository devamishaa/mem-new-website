"use client";
import { useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "@/utils/gsap";

// Helper function to validate if floating animations should run
function shouldSkipFloatingAnimation(container) {
  if (!container || typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return true;
  return false;
}

// Helper function to clean up previous animations
function cleanupAnimations(animationsRef) {
  animationsRef.current.forEach((anim) => anim?.kill());
  animationsRef.current = [];
}

// Helper function to setup parallax animations
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

// Helper function to setup regular float animations
function setupRegularFloatAnimations(container, animationsRef) {
  const floatElements = container.querySelectorAll(
    "[data-float]:not([data-cloud])"
  );

  floatElements.forEach((el, index) => {
    const animation = gsap.to(el, {
      y: 20,
      duration: 3,
      ease: "sine.inOut",
      delay: index * 0.5,
      yoyo: true,
      repeat: -1,
    });
    animationsRef.current.push(animation);
  });
}

// Helper function to setup cloud float animations
function setupCloudFloatAnimations(container, animationsRef) {
  const cloudElements = container.querySelectorAll("[data-float][data-cloud]");

  cloudElements.forEach((el, index) => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, {
      x: 15,
      y: 20,
      rotation: 3,
      duration: 8,
      ease: "sine.inOut",
      delay: index * 1.2,
    });
    animationsRef.current.push(tl);
  });
}

export function useFloatingElements(containerRef) {
  const timelineRef = useRef();
  const animationsRef = useRef([]);

  // Memoize cleanup function to prevent recreation
  const cleanup = useCallback(() => {
    cleanupAnimations(animationsRef);
    timelineRef.current?.kill();
  }, []);

  // Memoize setup functions for better performance
  const setupAnimations = useCallback((container) => {
    if (shouldSkipFloatingAnimation(container)) return;

    // Clean up previous animations
    cleanupAnimations(animationsRef);

    // Setup different types of animations
    setupParallaxAnimations(container, animationsRef);
    setupRegularFloatAnimations(container, animationsRef);
    setupCloudFloatAnimations(container, animationsRef);

    // Store timeline reference (empty for floating elements since they're independent)
    timelineRef.current = gsap.timeline({ paused: true });
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    setupAnimations(container);
    return cleanup;
  }, [containerRef, setupAnimations, cleanup]);

  // Memoize return object to prevent recreation
  return useMemo(
    () => ({
      timeline: timelineRef.current,
      animations: animationsRef.current,
    }),
    []
  );
}
