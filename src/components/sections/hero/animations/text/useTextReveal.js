"use client";
import { useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "@/utils/gsap";
import { useGSAP } from "@gsap/react";

// Helper function to create a word span element
function createWordSpan(word, index, totalWords) {
  const outerSpan = document.createElement("span");
  outerSpan.style.cssText = "display: inline-block; overflow: hidden;";

  const innerSpan = document.createElement("span");
  innerSpan.style.cssText =
    "display: inline-block; transform: translateY(100%);";
  innerSpan.textContent = word;

  outerSpan.appendChild(innerSpan);

  return { outerSpan, innerSpan };
}

// Split text into words and wrap each in a span with optimized DOM manipulation
function splitTextIntoWords(element) {
  const text = element.textContent;
  const words = text.split(" ");

  const fragment = document.createDocumentFragment();
  const wordSpans = [];

  words.forEach((word, index) => {
    const { outerSpan, innerSpan } = createWordSpan(word, index, words.length);

    fragment.appendChild(outerSpan);
    wordSpans.push(innerSpan);

    if (index < words.length - 1) {
      fragment.appendChild(document.createTextNode(" "));
    }
  });

  element.innerHTML = "";
  element.appendChild(fragment);

  return wordSpans;
}

// Helper function to validate if text reveal should run
function shouldSkipTextReveal(container) {
  if (!container || typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return true;
  return false;
}

// Helper function to find and process text elements
function findAndProcessTextElements(container, processedElements) {
  const textElements = container.querySelectorAll("[data-text-reveal]");

  if (textElements.length === 0) {
    return { textElements: [], processedWordSpans: [] };
  }

  const processedWordSpans = [];

  textElements.forEach((element, elementIndex) => {
    // Skip if already processed
    if (processedElements.current.has(element)) return;

    const wordSpans = splitTextIntoWords(element);
    processedElements.current.add(element);

    processedWordSpans.push({
      wordSpans,
      elementIndex,
    });
  });

  return { textElements, processedWordSpans };
}

// Helper function to create text reveal timeline
function createTextRevealTimeline(processedWordSpans) {
  const timeline = gsap.timeline({ paused: true });

  processedWordSpans.forEach(({ wordSpans, elementIndex }) => {
    timeline.to(
      wordSpans,
      {
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
      },
      elementIndex * 0.1
    ); // Delay between different text elements
  });

  return timeline;
}

export function useTextReveal(containerRef) {
  const timelineRef = useRef();
  const processedElements = useRef(new Set());

  // Memoize text animation config
  const textAnimationConfig = useMemo(() => ({
    y: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.08,
  }), []);

  // Memoize control functions
  const controls = useMemo(() => ({
    playText: () => timelineRef.current?.play(),
    reverseText: () => timelineRef.current?.reverse(),
    restartText: () => timelineRef.current?.restart(),
  }), []);

  useGSAP(() => {
    const container = containerRef.current;

    // Early validation
    if (shouldSkipTextReveal(container)) return;

    // Find and process text elements
    const { textElements, processedWordSpans } = findAndProcessTextElements(
      container,
      processedElements
    );

    // Create timeline (always create one, even if no elements)
    if (textElements.length === 0) {
      timelineRef.current = gsap.timeline({ paused: true });
      return;
    }

    // Create timeline with optimized animations using GSAP context
    const timeline = gsap.timeline({ paused: true });
    
    processedWordSpans.forEach(({ wordSpans, elementIndex }) => {
      timeline.to(
        wordSpans,
        textAnimationConfig,
        elementIndex * 0.1
      ); // Delay between different text elements
    });

    timelineRef.current = timeline;

    // Don't clear processedElements on cleanup to avoid re-processing
  }, { scope: containerRef, dependencies: [textAnimationConfig] });

  return {
    timeline: timelineRef.current,
    ...controls,
  };
}
