"use client";
import { useLayoutEffect, useEffect, useMemo } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { useGSAP } from "@gsap/react";
import { useCardsAnimation } from "./cards";
import { useTextReveal } from "./text";
import { usePhoneZoom } from "./phone";
import { useFloatingElements } from "./floating";

// Helper function to validate if animations should run
function shouldSkipAnimations(containerRef) {
  if (typeof window === "undefined") return true;
  const root = containerRef.current;
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

// Helper function to setup immediate animations
function setupImmediateAnimations(containerRef) {
  // Early validation
  if (shouldSkipAnimations(containerRef)) return;

  // Floating animations are already handled in useFloatingElements
  // Phone zoom is already handled in usePhoneZoom (it has its own ScrollTrigger)

  // Debounced ScrollTrigger refresh for floating animations
  refreshScrollTrigger();
}

// Helper function to start reveal animations in sequence
function startRevealAnimations(cardsAnimation, textAnimation) {
  // Start reveal animations in sequence
  if (cardsAnimation?.timeline) {
    cardsAnimation.playCards();
  }

  // Text reveals start after cards with a slight delay
  if (textAnimation?.timeline) {
    gsap.delayedCall(0.5, () => {
      textAnimation.playText();
    });
  }

  // Refresh ScrollTrigger after animations start
  refreshScrollTrigger();
}

// Helper function to setup delayed reveal animations
function setupDelayedAnimations(containerRef, cardsAnimation, textAnimation) {
  // Early validation
  if (shouldSkipAnimations(containerRef)) return null;

  // Add a small delay to ensure smooth transitions
  const delayedCall = gsap.delayedCall(0.2, () => {
    startRevealAnimations(cardsAnimation, textAnimation);
  });

  return delayedCall;
}

// Helper function to create utility methods
function createUtilityMethods(cardsAnimation, textAnimation) {
  return {
    restartHero: () => {
      cardsAnimation?.restartCards();
      textAnimation?.restartText();
    },
    playHero: () => {
      cardsAnimation?.playCards();
      textAnimation?.playText();
    },
  };
}

export function useHeroTimeline(containerRef) {
  // Initialize floating elements immediately (they don't need to wait for loading)
  const floatingAnimation = useFloatingElements(containerRef);

  // Initialize other animations but don't start them yet
  const cardsAnimation = useCardsAnimation(containerRef);
  const textAnimation = useTextReveal(containerRef);
  const phoneAnimation = usePhoneZoom(containerRef);

  // Setup immediate animations (parallax, float) - runs on mount
  useGSAP(
    () => {
      setupImmediateAnimations(containerRef);
    },
    { scope: containerRef }
  );

  // Setup reveal animations immediately after component mounts
  useGSAP(
    () => {
      const delayedCall = setupDelayedAnimations(
        containerRef,
        cardsAnimation,
        textAnimation
      );

      return () => {
        delayedCall?.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [cardsAnimation, textAnimation],
    }
  );

  // Memoize utility methods to prevent recreation
  const utilityMethods = useMemo(
    () => createUtilityMethods(cardsAnimation, textAnimation),
    [cardsAnimation, textAnimation]
  );

  // Memoize return object to prevent recreation
  return useMemo(
    () => ({
      // Expose animation controls for external use if needed
      cardsAnimation,
      textAnimation,
      phoneAnimation,
      floatingAnimation,
      // Utility methods
      ...utilityMethods,
    }),
    [
      cardsAnimation,
      textAnimation,
      phoneAnimation,
      floatingAnimation,
      utilityMethods,
    ]
  );
}
