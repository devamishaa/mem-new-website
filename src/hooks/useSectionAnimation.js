"use client";
import { useLayoutEffect, useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { batchScaleReveal } from "@/components/animations/effects/scaleReveal";
import { createTextReveal } from "@/components/animations/effects/textReveal";
import { createParallax } from "@/components/animations/effects/parallax";
import { createFloat } from "@/components/animations/effects/float";
import { createCloudFloat } from "@/components/animations/effects/cloudFloat";

// Helper function to validate if animations should run
function shouldSkipSectionAnimations(root) {
  if (typeof window === "undefined") return true;
  if (!root) return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return true;
  return false;
}

// Helper function to safely refresh ScrollTrigger
function refreshScrollTrigger() {
  if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh) {
    ScrollTrigger.refresh();
  }
}

// Helper function to setup parallax animations
function setupParallaxAnimations(root) {
  root.querySelectorAll("[data-parallax]").forEach(createParallax);
}

// Helper function to setup float animations
function setupFloatAnimations(root) {
  // Regular float animations (6,7,8 png)
  root
    .querySelectorAll("[data-float]:not([data-cloud])")
    .forEach((el, index) => createFloat(el, { delay: index * 0.5 }));
  // Cloud float animations (2,4,5 png)
  root
    .querySelectorAll("[data-float][data-cloud]")
    .forEach((el, index) => createCloudFloat(el, { delay: index * 1.2 }));
}

// Helper function to setup immediate animations
function setupImmediateAnimations(root) {
  setupParallaxAnimations(root);
  setupFloatAnimations(root);
  refreshScrollTrigger();
}

// Helper function to setup scale reveal animations
function setupScaleRevealAnimations(root) {
  const scaleElements = root.querySelectorAll('[data-reveal="scale"]');

  // Early return if no elements
  if (scaleElements.length === 0) return;

  batchScaleReveal(scaleElements, { immediate: true });
}

// Helper function to setup text reveal animations
function setupTextRevealAnimations(root) {
  root
    .querySelectorAll("[data-text-reveal]")
    .forEach((el, index) =>
      createTextReveal(el, { immediate: true, delay: index * 0.1 })
    );
}

// Helper function to setup reveal animations
function setupRevealAnimations(root) {
  gsap.delayedCall(0.2, () => {
    setupScaleRevealAnimations(root);
    setupTextRevealAnimations(root);
    refreshScrollTrigger();
  });
}

export function useSectionAnimations() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;

    // Early validation
    if (shouldSkipSectionAnimations(root)) return;

    // Only setup parallax and float animations immediately (they don't need to wait)
    const ctx = gsap.context(() => {
      try {
        setupImmediateAnimations(root);
      } catch (error) {
        console.warn("Animation setup failed:", error);
      }
    }, root);

    return () => ctx.revert();
  }, [ref]);

  // Setup reveal animations immediately after component mounts
  useEffect(() => {
    const root = ref.current;

    // Early validation
    if (shouldSkipSectionAnimations(root)) return;

    const ctx = gsap.context(() => {
      try {
        setupRevealAnimations(root);
      } catch (error) {
        console.warn("Reveal animation setup failed:", error);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return ref;
}
