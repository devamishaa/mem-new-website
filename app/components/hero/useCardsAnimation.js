"use client";
import { useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "@/utils/gsap";

// Helper function to validate if animations should run
function shouldSkipAnimation(container) {
  if (!container || typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return true;
  return false;
}

// Helper function to process and sort card elements
function processCardElements(container) {
  const cardElements = container.querySelectorAll('[data-reveal="scale"]');

  if (cardElements.length === 0) {
    return { cardElements: [], cardsWithDelay: [] };
  }

  const cardsWithDelay = Array.from(cardElements)
    .map((el) => ({
      element: el,
      delay: Number(el.getAttribute("data-reveal-delay") || 0),
    }))
    .sort((a, b) => a.delay - b.delay);

  return { cardElements, cardsWithDelay };
}

// Helper function to set initial card states
function setInitialCardStates(cardElements) {
  gsap.set(cardElements, {
    opacity: 0,
    scale: 0.6,
    y: 0,
  });
}

// Helper function to create card animations
function createCardAnimations(timeline, cardsWithDelay) {
  const animationConfig = {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 2.0,
    ease: "cubic-bezier(.19, 1, .22, 1)",
  };

  cardsWithDelay.forEach(({ element, delay }) => {
    timeline.to(element, animationConfig, delay);
  });
}

export function useCardsAnimation(containerRef) {
  const timelineRef = useRef();

  // Memoize animation config to prevent recreation
  const animationConfig = useMemo(
    () => ({
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 2.0,
      ease: "cubic-bezier(.19, 1, .22, 1)",
    }),
    []
  );

  // Memoize control functions to prevent recreation on every render
  const controls = useMemo(
    () => ({
      playCards: () => timelineRef.current?.play(),
      reverseCards: () => timelineRef.current?.reverse(),
      restartCards: () => timelineRef.current?.restart(),
    }),
    []
  );

  useLayoutEffect(() => {
    const container = containerRef.current;

    // Early return for invalid states
    if (shouldSkipAnimation(container)) return;

    // Process card elements
    const { cardElements, cardsWithDelay } = processCardElements(container);

    // Create timeline (always create one, even if no cards)
    timelineRef.current = gsap.timeline({ paused: true });

    // If no cards found, return early
    if (cardElements.length === 0) return;

    // Setup animations
    setInitialCardStates(cardElements);

    // Use memoized config for better performance
    cardsWithDelay.forEach(({ element, delay }) => {
      timelineRef.current.to(element, animationConfig, delay);
    });

    return () => {
      timelineRef.current?.kill();
    };
  }, [containerRef, animationConfig]);

  return {
    timeline: timelineRef.current,
    ...controls,
  };
}
