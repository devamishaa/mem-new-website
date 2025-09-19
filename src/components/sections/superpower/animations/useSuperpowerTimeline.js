"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

// Transparent 1x1 pixel to represent "no image"
const TRANSPARENT_1PX =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function shouldSkipAnimation(container) {
  if (!container || typeof window === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return true;
  return false;
}

function getResponsiveConfig() {
  // SSR guard - default to desktop during SSR
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;
  const START_SCALE = 0.86;
  const INV_START = 1 / START_SCALE;

  return {
    START_SCALE,
    INV_START,
    TEXT_TRANSITION_DUR: 4,
    TAKEOVER_DUR: 1,
    HSCROLL_DUR: 2.2,
    PILL_PAD_X: 12,
    isMobile,
  };
}

function setupEmotionContent(model, config) {
  const { textRef } = findEmotionElements();
  if (!textRef) return null;

  const allSlides = model?.emotions?.slides || [];
  // Mobile should start from slide 1 (skip the blank 0th slide)
  const processedSlides = config?.isMobile ? allSlides.slice(1) : allSlides;
  if (processedSlides.length === 0) return null;

  const initialSlide = processedSlides[0];
  // Always set initial text, even if empty, to override any SSR/React fallback
  if (textRef) {
    textRef.textContent = (initialSlide && initialSlide.text) || "";
  }

  return { textRef, processedSlides };
}

function findEmotionElements() {
  return {
    textRef: document.querySelector("[data-emotion-text]"),
  };
}

function findPanelElements(container) {
  if (!container) return {};

  return {
    stage: container,
    panel1: container.querySelector("[data-panel-1]"),
    panel2: container.querySelector("[data-panel-2]"),
    content2: container.querySelector("[data-content-2]"),
    hViewport: container.querySelector("[data-horizontal-viewport]"),
    hTrack: container.querySelector("[data-horizontal-track]"),
    railRef: container.querySelector("[data-pagination-rail]"),
    pillRef: container.querySelector("[data-pill-ref]"),
    pillTextRef: container.querySelector("[data-pill-text]"),
    pillMeasureRef: container.querySelector("[data-pill-measure]"),
  };
}

function findSlideElements(container) {
  if (!container) return { slideRefs: [], dotRefs: [] };

  return {
    slideRefs: Array.from(container.querySelectorAll("[data-slide-ref]")),
    dotRefs: Array.from(container.querySelectorAll("[data-dot-ref]")),
  };
}

function updateEmotionContent(
  globalProgress,
  emotionData,
  config,
  setCurrentEmotionImage,
  setCurrentEmotionText
) {
  if (!emotionData) return;

  const { textRef, processedSlides } = emotionData;
  const { TEXT_TRANSITION_DUR, TAKEOVER_DUR } = config;

  const textTransitionRatio =
    TEXT_TRANSITION_DUR /
    (TEXT_TRANSITION_DUR + TAKEOVER_DUR + config.HSCROLL_DUR);
  const takeoverRatio =
    TAKEOVER_DUR / (TEXT_TRANSITION_DUR + TAKEOVER_DUR + config.HSCROLL_DUR);

  if (globalProgress <= textTransitionRatio && processedSlides.length > 0) {
    const textProgress = globalProgress / textTransitionRatio;
    const currentIndex = Math.min(
      Math.floor(textProgress * processedSlides.length),
      processedSlides.length - 1
    );

    const currentSlide = processedSlides[currentIndex];

    if (textRef) {
      // Always reflect current slide text, even if empty
      textRef.textContent = (currentSlide && currentSlide.text) || "";
    }

    if (setCurrentEmotionImage) {
      if (currentSlide.image) {
        const newSrc = currentSlide.image.src || currentSlide.image;
        setCurrentEmotionImage(newSrc);
      } else {
        // Clear to transparent when slide has no image (e.g., desktop slide 0)
        setCurrentEmotionImage(TRANSPARENT_1PX);
      }
    }

    if (setCurrentEmotionText) {
      setCurrentEmotionText((currentSlide && currentSlide.text) || "");
    }
    return;
  }

  if (
    globalProgress <= textTransitionRatio + takeoverRatio &&
    processedSlides.length > 0
  ) {
    const lastSlide = processedSlides[processedSlides.length - 1];
    if (textRef) {
      textRef.textContent = (lastSlide && lastSlide.text) || "";
    }
    if (lastSlide.image && setCurrentEmotionImage) {
      const lastSrc = lastSlide.image.src || lastSlide.image;
      setCurrentEmotionImage(lastSrc);
    }
    if (setCurrentEmotionText) {
      setCurrentEmotionText((lastSlide && lastSlide.text) || "");
    }
  }
}

function setupPillAnimation(config, container) {
  if (!container) return null;

  const { railRef, pillRef, pillTextRef, pillMeasureRef } =
    findPanelElements(container);
  const { dotRefs } = findSlideElements(container);

  if (!pillRef || !pillTextRef || !pillMeasureRef || !railRef) return null;

  let dotCenters = [];

  const measureDots = () => {
    const railBox = railRef.getBoundingClientRect();
    if (!railBox) return;

    dotCenters = dotRefs.map((dot) => {
      const b = dot?.getBoundingClientRect();
      if (!b) return 0;
      return (b.left + b.right) / 2 - railBox.left;
    });
  };

  const animatePillToIndex = (idx) => {
    if (!pillRef || !pillTextRef || !pillMeasureRef || !dotCenters.length)
      return;

    const { slideRefs } = findSlideElements(container);
    const slideEl = slideRefs[idx];
    const nextLabel =
      slideEl?.dataset.label || slideEl?.dataset.title || `#${idx + 1}`;

    pillMeasureRef.textContent = nextLabel;
    const measureWidth = pillMeasureRef.getBoundingClientRect().width;
    const targetW = Math.ceil(measureWidth + config.PILL_PAD_X * 2);

    const cx = dotCenters[idx];
    const targetX = Math.round(cx - targetW / 2);

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(pillRef, { width: targetW, duration: 0.28 }, 0)
      .to(pillRef, { x: targetX, duration: 0.32 }, 0)
      .to(pillTextRef, { autoAlpha: 0, duration: 0.12 }, 0)
      .add(() => {
        pillTextRef.textContent = nextLabel;
      })
      .to(pillTextRef, { autoAlpha: 1, duration: 0.12 }, ">-0.02");
  };

  return { measureDots, animatePillToIndex, dotCenters };
}

// Function to handle manual dot clicks
function setupDotClickHandlers(container, handleDotClick) {
  if (!container) return;

  const { dotRefs } = findSlideElements(container);
  if (!dotRefs.length) return;

  dotRefs.forEach((dot, index) => {
    if (dot) {
      // To prevent multiple listeners
      if (dot._clickHandler) {
        dot.removeEventListener("click", dot._clickHandler);
      }

      dot._clickHandler = () => handleDotClick(index);
      dot.addEventListener("click", dot._clickHandler);
      dot.style.cursor = "pointer";
    }
  });
}

export function useSuperpowerTimeline(
  containerRef,
  model,
  setCurrentEmotionImage,
  setCurrentEmotionText
) {
  const timelineRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (shouldSkipAnimation(container)) return;

    const timer = setTimeout(() => {
      const config = getResponsiveConfig();
      const emotionData = setupEmotionContent(model, config);
      const pillAnimation = setupPillAnimation(config, container);

      const elements = findPanelElements(container);
      const { slideRefs } = findSlideElements(container);

      if (!elements.stage || !elements.panel1 || !elements.panel2) return;

      let scrollDistance = 0;
      let centers = [];
      let totalRange = 0;
      let prevIdx = -1;

      const measureSlides = () => {
        const { hViewport, hTrack } = elements;
        if (!hViewport || !hTrack) return;

        scrollDistance = Math.max(
          0,
          hTrack.scrollWidth - hViewport.clientWidth
        );

        centers = slideRefs.map((el) => {
          if (!el) return 0;
          const left = el.offsetLeft;
          const centerX = left + el.offsetWidth / 2;
          return centerX - hViewport.clientWidth / 2;
        });

        totalRange = centers.length
          ? Math.max(scrollDistance, centers[centers.length - 1])
          : scrollDistance;

        if (config.isMobile) {
          totalRange = Math.min(totalRange, scrollDistance * 1.5);
        }
      };

      const handleDotClick = (index) => {
        if (!timelineRef.current || !centers.length || totalRange === 0) return;

        const x = centers[index];
        const hProg = Math.max(0, Math.min(1, x / totalRange));

        const textTransitionRatio =
          config.TEXT_TRANSITION_DUR /
          (config.TEXT_TRANSITION_DUR +
            config.TAKEOVER_DUR +
            config.HSCROLL_DUR);
        const takeoverRatio =
          config.TAKEOVER_DUR /
          (config.TEXT_TRANSITION_DUR +
            config.TAKEOVER_DUR +
            config.HSCROLL_DUR);
        const hScrollRatio = 1 - textTransitionRatio - takeoverRatio;

        const globalProgress =
          textTransitionRatio + takeoverRatio + hProg * hScrollRatio;

        gsap.to(timelineRef.current, {
          progress: globalProgress,
          duration: 1,
          ease: "power2.inOut",
        });
      };

      setupDotClickHandlers(container, handleDotClick);

      const setActive = (idx) => {
        if (idx === prevIdx) return;
        prevIdx = idx;
        setCurrentIndex(idx);
        pillAnimation?.animatePillToIndex(idx);
      };

      const updateContent = (globalProgress) => {
        updateEmotionContent(
          globalProgress,
          emotionData,
          config,
          setCurrentEmotionImage,
          setCurrentEmotionText
        );

        const textTransitionRatio =
          config.TEXT_TRANSITION_DUR /
          (config.TEXT_TRANSITION_DUR +
            config.TAKEOVER_DUR +
            config.HSCROLL_DUR);
        const takeoverRatio =
          config.TAKEOVER_DUR /
          (config.TEXT_TRANSITION_DUR +
            config.TAKEOVER_DUR +
            config.HSCROLL_DUR);

        if (globalProgress <= textTransitionRatio + takeoverRatio) {
          return setActive(0);
        }

        const hProg =
          (globalProgress - textTransitionRatio - takeoverRatio) /
          (1 - textTransitionRatio - takeoverRatio);
        const x = Math.max(0, Math.min(1, hProg)) * totalRange;

        let bestIdx = 0;
        let bestDelta = Infinity;
        for (let i = 0; i < centers.length; i++) {
          const d = Math.abs(centers[i] - x);
          if (d < bestDelta) {
            bestDelta = d;
            bestIdx = i;
          }
        }
        setActive(bestIdx);
      };

      const ctx = gsap.context(() => {
        if (elements.panel2) {
          gsap.set(elements.panel2, {
            yPercent: 110,
            scale: config.START_SCALE,
            borderRadius: 82,
            transformOrigin: "center bottom",
            force3D: true,
          });
        }
        if (elements.content2) {
          gsap.set(elements.content2, {
            scale: config.INV_START,
            transformOrigin: "center",
            force3D: true,
          });
        }
        if (elements.panel1) {
          gsap.set(elements.panel1, { yPercent: 0 });
        }
        if (elements.hTrack) {
          gsap.set(elements.hTrack, { x: 0 });
        }

        measureSlides();
        ScrollTrigger.addEventListener("refreshInit", measureSlides);

        if (pillAnimation?.measureDots) {
          pillAnimation.measureDots();
          ScrollTrigger.addEventListener("refresh", pillAnimation.measureDots);
        }

        const slideCount = model?.superpower?.slides?.length || 1;
        const baseEnd = config.isMobile ? 150 : 300;
        const dynamicEnd = `+=${baseEnd + slideCount * 50}%`;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: elements.stage,
            start: "center center",
            end: dynamicEnd,
            scrub: config.isMobile ? 0.5 : 1,
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            refreshPriority: 0,
            id: "superpowerScrollTrigger",
            onUpdate: (self) => updateContent(self.progress),
          },
        });

        tl.to({}, { duration: config.TEXT_TRANSITION_DUR }, 0);

        tl.to(
          elements.panel2,
          {
            yPercent: 0,
            scale: 1,
            borderRadius: 0,
            duration: config.TAKEOVER_DUR,
          },
          config.TEXT_TRANSITION_DUR
        )
          .to(
            elements.content2,
            { scale: 1, duration: config.TAKEOVER_DUR },
            config.TEXT_TRANSITION_DUR
          )
          .to(
            elements.panel1,
            { yPercent: -8, duration: config.TAKEOVER_DUR },
            config.TEXT_TRANSITION_DUR
          );

        tl.to(
          elements.hTrack,
          {
            x: () => -(totalRange || 0),
            duration: config.HSCROLL_DUR,
            ease: "none",
          },
          config.TEXT_TRANSITION_DUR + config.TAKEOVER_DUR
        );

        timelineRef.current = tl;
        // Ensure content reflects initial state immediately (progress 0)
        updateContent(0);
      }, elements.stage);

      setTimeout(() => setActive(0), 0);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", measureSlides);
        if (pillAnimation?.measureDots) {
          ScrollTrigger.removeEventListener(
            "refresh",
            pillAnimation.measureDots
          );
        }
        ctx.revert();
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [model, containerRef]);

  return {
    timeline: timelineRef.current,
    currentIndex,
  };
}
