"use client";
import { useLayoutEffect, useEffect, useMemo } from "react";
import { gsap } from "@/utils/gsap";
import { ScrollTrigger } from "@/utils/gsap";
import { useAnimationContext } from "@/contexts/AnimationContext";
import { useCardsAnimation } from "./useCardsAnimation";
import { useTextReveal } from "./useTextReveal";
import { usePhoneZoom } from "./usePhoneZoom";
import { useFloatingElements } from "./useFloatingElements";

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
function setupDelayedAnimations(
  isLoadingComplete,
  containerRef,
  cardsAnimation,
  textAnimation
) {
  if (!isLoadingComplete) return null;

  // Early validation
  if (shouldSkipAnimations(containerRef)) return null;

  // Add a small delay to ensure loading screen has fully transitioned
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
  const { isLoadingComplete } = useAnimationContext();

  // Debug logging

  // Initialize floating elements immediately (they don't need to wait for loading)
  const floatingAnimation = useFloatingElements(containerRef);

  // Initialize other animations but don't start them yet
  const cardsAnimation = useCardsAnimation(containerRef);
  const textAnimation = useTextReveal(containerRef);
  const phoneAnimation = usePhoneZoom(containerRef);

  // Setup immediate animations (parallax, float) - runs on mount
  useLayoutEffect(() => {
    setupImmediateAnimations(containerRef);

    return () => {
      // Cleanup handled by individual hooks
    };
  }, [containerRef]);

  // Setup reveal animations only after loading is complete
  useEffect(() => {
    const delayedCall = setupDelayedAnimations(
      isLoadingComplete,
      containerRef,
      cardsAnimation,
      textAnimation
    );

    return () => {
      delayedCall?.kill();
    };
  }, [isLoadingComplete, cardsAnimation, textAnimation, containerRef]);

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
