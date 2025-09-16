"use client";
import { useLayoutEffect, useRef, useMemo, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

// Memoized responsive settings function with SSR guard
const getResponsiveSettings = () => {
  // SSR guard - return default desktop settings if window is not available
  if (typeof window === "undefined") {
    return {
      scale: 8,
      start: "30% 50%",
      end: "200% 50%",
      scrub: true,
      textScale: 1.5,
      textStartScale: 0.5,
    };
  }

  const width = window.innerWidth;

  // Extra small mobile (320px - 375px)
  if (width <= 375) {
    return {
      scale: 2.5,
      start: "60% 65%",
      end: "220% 65%",
      scrub: 1.2,
      textScale: 1,
      textStartScale: 0.4,
    };
  }
  // Small mobile (376px - 425px)
  else if (width <= 425) {
    return {
      scale: 3,
      start: "55% 60%",
      end: "200% 60%",
      scrub: 1,
      textScale: 1,
      textStartScale: 0.45,
    };
  }
  // Medium mobile (426px - 600px)
  else if (width <= 600) {
    return {
      scale: 1.5,
      start: "50% 58%",
      end: "190% 58%",
      scrub: 1,
      textScale: 1,
      textStartScale: 0.5,
    };
  }
  // Large mobile (601px - 768px)
  else if (width <= 768) {
    return {
      scale: 4,
      start: "45% 55%",
      end: "180% 55%",
      scrub: 1,
      textScale: 1,
      textStartScale: 0.5,
    };
  }
  // Small tablet (769px - 1024px)
  else if (width <= 1024) {
    return {
      scale: 5.5,
      start: "40% 52%",
      end: "170% 52%",
      scrub: 0.8,
      textScale: 1,
      textStartScale: 0.5,
    };
  }
  // Large tablet (1025px - 1200px)
  else if (width <= 1200) {
    return {
      scale: 6.5,
      start: "35% 50%",
      end: "160% 50%",
      scrub: 0.8,
      textScale: 1.1,
      textStartScale: 0.5,
    };
  }
  // Small desktop (1201px - 1440px)
  else if (width <= 1440) {
    return {
      scale: 7.5,
      start: "32% 50%",
      end: "180% 50%",
      scrub: true,
      textScale: 1,
      textStartScale: 0.5,
    };
  }
  // Large desktop (1441px+)
  else {
    return {
      scale: 8,
      start: "30% 50%",
      end: "200% 50%",
      scrub: true,
      textScale: 1,
      textStartScale: 0.5,
    };
  }
};

// Helper function to handle ScrollTrigger conflict resolution
function handleScrollTriggerConflicts(
  phoneContainer,
  ownIds = new Set(["phoneZoom", "phoneScreenFade"]) // ids owned by this module
) {
  return () => {
    ScrollTrigger.getAll().forEach((st) => {
      if (!st || !st.trigger) return;
      const id = st.vars?.id || "";
      const isInside = phoneContainer.contains(st.trigger);
      const isOwn =
        id && Array.from(ownIds).some((prefix) => id.startsWith(prefix));
      const isPinned = !!(st.pin || st.vars?.pin);

      // Only kill conflicting pinned triggers inside the phone container that we don't own
      if (isInside && isPinned && !isOwn) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            "Killing conflicting pinned ScrollTrigger:",
            id || "<no-id>"
          );
        }
        st.kill();
      }
    });
  };
}

// Helper function to get all text nodes from an element
function getTextNodes(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent.trim()) {
      textNodes.push(node);
    }
  }

  return textNodes;
}

// Helper function to create a word span element
function createWordSpan(word) {
  const span = document.createElement("span");
  span.textContent = word;
  span.style.opacity = "0";
  span.style.display = "inline";
  return span;
}

// Helper function to process a single text node into word spans
function processTextNode(textNode, wordSpans) {
  const words = textNode.textContent.split(" ").filter((w) => w.trim());
  if (words.length === 0) return;

  const fragment = document.createDocumentFragment();

  words.forEach((word, index) => {
    const span = createWordSpan(word);
    wordSpans.push(span);
    fragment.appendChild(span);

    if (index < words.length - 1) {
      fragment.appendChild(document.createTextNode(" "));
    }
  });

  // Use a more reliable method to replace the text node
  if (textNode.parentNode) {
    textNode.parentNode.replaceChild(fragment, textNode);
  }
}

// Helper function to create word spans for text animation
function createWordSpans(element) {
  if (!element) return [];

  const textNodes = getTextNodes(element);
  const wordSpans = [];

  textNodes.forEach((textNode) => {
    processTextNode(textNode, wordSpans);
  });

  return wordSpans;
}

// Helper function to setup initial element states
function setupInitialStates(phoneElements, textElement, phoneScreenImage) {
  gsap.set(phoneElements, {
    transformOrigin: "center center",
    force3D: true,
    willChange: "transform",
  });

  if (textElement) {
    gsap.set(textElement, {
      force3D: true,
      willChange: "transform",
    });
  }

  if (phoneScreenImage) {
    gsap.set(phoneScreenImage, { opacity: 0 });
  }
}

// Helper function to setup phone screen image animation
function setupPhoneScreenAnimation(phoneScreenImage, phoneContainer) {
  if (!phoneScreenImage) return;

  gsap.to(phoneScreenImage, {
    opacity: 1,
    duration: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: phoneContainer,
      start: "top 90%",
      end: "top 85%",
      scrub: false,
      toggleActions: "play none reverse none",
      id: "phoneScreenFade",
    },
  });
}

// Helper function to create master timeline with ScrollTrigger
function createMasterTimeline(phoneContainer, config) {
  return gsap.timeline({
    scrollTrigger: {
      trigger: phoneContainer,
      start: config.start,
      end: config.end,
      scrub: config.scrub,
      pin: true,
      pinSpacing: true,
      pinReparent: false,
      anticipatePin: 1,
      refreshPriority: 10,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      id: "phoneZoom",
      onRefresh: handleScrollTriggerConflicts(phoneContainer),
    },
  });
}

// Helper function to setup popup timeline
function setupPopupTimeline(iphonePopupArea) {
  const timeline = gsap.timeline();

  if (iphonePopupArea) {
    timeline.to(iphonePopupArea, {
      transform: "translateX(-50%) translateY(0%)",
      duration: 1,
      ease: "power1.inOut",
    });
  }

  return timeline;
}

// Helper function to setup text reveal timeline
function setupTextRevealTimeline(textElement, config) {
  const timeline = gsap.timeline();

  if (!textElement) return timeline;

  const headingElement = textElement.querySelector("h2");
  const descriptionElement = textElement.querySelector("p");

  if (!headingElement) return timeline;

  // Responsive timing based on screen size
  const isMobile = window.innerWidth <= 768;
  const wordDuration = isMobile ? 0.2 : 0.24;
  const wordDelay = isMobile ? 0.12 : 0.16;
  const descDuration = isMobile ? 0.12 : 0.16;
  const descDelay = isMobile ? 0.08 : 0.1;

  // Initial state setup
  gsap.set(headingElement, {
    opacity: 0,
    y: 20,
    scale: 0.8,
  });

  if (descriptionElement) {
    gsap.set(descriptionElement, {
      opacity: 0,
      y: 30,
      scale: 0.8,
    });
  }

  // Set containers visible and positioned
  gsap.set([headingElement, descriptionElement], { opacity: 1, y: 0 });

  // Create word spans and animate
  const headingWordSpans = createWordSpans(headingElement);

  // Animate heading words
  headingWordSpans.forEach((span, index) => {
    timeline.to(
      span,
      {
        opacity: 1,
        duration: wordDuration,
        ease: "power2.out",
      },
      index * wordDelay
    );
  });

  // Handle description
  if (descriptionElement) {
    const headingDuration =
      headingWordSpans.length * wordDelay + wordDuration + 0.2;
    const descriptionWordSpans = createWordSpans(descriptionElement);

    descriptionWordSpans.forEach((span, index) => {
      timeline.to(
        span,
        {
          opacity: 1,
          duration: descDuration,
          ease: "power2.out",
        },
        headingDuration + index * descDelay
      );
    });
  }

  return timeline;
}

// Helper function to setup zoom timeline
function setupZoomTimeline(phoneElements, config) {
  const timeline = gsap.timeline();
  const elementsToZoom = [...phoneElements];

  timeline.to(elementsToZoom, {
    scale: config.scale,
    duration: 1,
    ease: "power1.inOut",
  });

  return timeline;
}

// Helper function to setup text scaling timeline
function setupTextScalingTimeline(textElement, config) {
  const timeline = gsap.timeline();

  if (!textElement) return timeline;

  const headingElement = textElement.querySelector("h2");

  if (headingElement) {
    gsap.set(headingElement, {
      scale: config.textStartScale, // Responsive start scale
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "center center",
      // Anti-aliasing and crisp rendering properties
      willChange: "transform",
      backfaceVisibility: "hidden",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    });

    timeline.to(headingElement, {
      scale: config.textScale, // Responsive end scale
      duration: 1,
      ease: "power2.out",
      force3D: true,
      // Ensure crisp rendering during animation
      willChange: "transform",
      backfaceVisibility: "hidden",
    });
  }

  return timeline;
}

// Helper function to validate if phone zoom should run
function shouldSkipPhoneZoom(container) {
  if (!container || typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return true;
  return false;
}

// Helper function to find all required DOM elements
function findPhoneElements(container) {
  const phoneContainer = container.querySelector("[data-phone-zoom]");
  const phoneElements = container.querySelectorAll("[data-phone-element]");

  if (!phoneContainer || phoneElements.length === 0) {
    console.warn("Phone elements not found for zoom animation");
    return null;
  }

  return {
    phoneContainer,
    phoneElements,
    phoneScreen: phoneContainer.querySelector("[data-phone-screen]"),
    iphonePopupArea: phoneContainer.querySelector("[data-phone-iphone-area]"),
    phoneScreenImage: phoneContainer.querySelector("[data-phone-screen-image]"),
    textElement: container.querySelector("[data-phone-text]"),
    gradientEllipse5: phoneContainer.querySelector("[data-gradient-ellipse5]"),
    gradientEllipse3: phoneContainer.querySelector("[data-gradient-ellipse3]"),
  };
}

export function usePhoneZoom(containerRef) {
  const timelineRef = useRef();
  const scrollTriggerRef = useRef();
  const resizeTimeoutRef = useRef();

  // Memoize the setup function to prevent recreation
  const setupPhoneZoom = useCallback((container) => {
    // Early validation
    if (shouldSkipPhoneZoom(container)) return null;

    // Find all required DOM elements
    const elements = findPhoneElements(container);
    if (!elements) {
      return gsap.timeline({ paused: true });
    }

    return elements;
  }, []);

  // Handle window resize for responsive updates
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.refresh();
      }
    }, 150); // Debounce resize events
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const elements = setupPhoneZoom(container);

    if (!elements) {
      timelineRef.current = gsap.timeline({ paused: true });
      return;
    }

    const {
      phoneContainer,
      phoneElements,
      phoneScreen,
      iphonePopupArea,
      phoneScreenImage,
      textElement,
      gradientEllipse5,
      gradientEllipse3,
    } = elements;

    // Get responsive config inside useLayoutEffect (client-side only)
    const config = getResponsiveSettings();

    // Create master timeline with ScrollTrigger
    const masterTimeline = createMasterTimeline(phoneContainer, config);

    // Store references to master timeline
    timelineRef.current = masterTimeline;
    scrollTriggerRef.current = masterTimeline.scrollTrigger;

    // Setup initial states for all elements
    setupInitialStates(phoneElements, textElement, phoneScreenImage);

    // Setup phone screen image animation
    setupPhoneScreenAnimation(phoneScreenImage, phoneContainer);

    // Create individual timelines
    const popupTimeline = setupPopupTimeline(iphonePopupArea);
    const textRevealTimeline = setupTextRevealTimeline(textElement, config);
    const zoomTimeline = setupZoomTimeline(phoneElements, config);
    const textScalingTimeline = setupTextScalingTimeline(textElement, config);

    // ===========================================
    // ORCHESTRATE TIMELINES WITH MASTER TIMELINE
    // ===========================================

    // Add screen content opacity to master timeline
    if (phoneScreen) {
      masterTimeline.to(
        phoneScreen,
        {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        0.1
      );
    }

    // Add all sub-timelines to master timeline with 10x slower scaling
    // Each sub-timeline is normalized (duration: 1), master timeline controls overall timing
    masterTimeline.add(popupTimeline.duration(320.0), 20.0); // Popup takes 320s (10x slower), starts at 20s
    masterTimeline.add(zoomTimeline.duration(410.0), 180.0); // Zoom takes 410s (10x slower), starts at 180s
    masterTimeline.add(textScalingTimeline.duration(410.0), 200.0); // Text scaling takes 410s (10x slower), starts at 200s (20s after zoom)
    masterTimeline.add(textRevealTimeline.duration(400.0), 190.0); // Text reveal takes 300s, starts at 190s

    // Add gradient ellipses directly to master timeline (10x slower)
    if (gradientEllipse5 && gradientEllipse3) {
      masterTimeline.to(
        [gradientEllipse5, gradientEllipse3],
        {
          opacity: 0.4,
          duration: 50.0, // 10x slower duration
          stagger: 10.0, // 10x slower stagger
          ease: "power2.out",
        },
        300.0
      ); // Gradients appear mid-zoom animation (10x slower timing)
    }

    // Add resize listener for responsive updates
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      scrollTriggerRef.current?.kill();
      timelineRef.current?.kill();
    };
  }, [containerRef, setupPhoneZoom, handleResize]);

  return {
    timeline: timelineRef.current,
    scrollTrigger: scrollTriggerRef.current,
  };
}
