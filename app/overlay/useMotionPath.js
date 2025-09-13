"use client";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

function safeRect(el) {
  if (!el || !el.getBoundingClientRect) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }
  const r = el.getBoundingClientRect();
  return {
    left: r.left || 0,
    top: r.top || 0,
    width: r.width || 0,
    height: r.height || 0,
  };
}

function rectCenterInDoc(r) {
  const cx = r.left + r.width / 2 + (window.scrollX || 0);
  const cy = r.top + r.height / 2 + (window.scrollY || 0);
  return { x: cx, y: cy };
}

function getStartDocPoint(findStart) {
  const el = findStart();
  return rectCenterInDoc(safeRect(el));
}

function buildDefaultPathFrom({ docX, docY, width, height }) {
  const p1 = { x: docX, y: docY };
  const p2 = { x: docX + width * 0.15, y: docY + height * 0.2 };
  const p3 = { x: docX - width * 0.12, y: docY + height * 0.45 };
  const p4 = { x: docX + width * 0.08, y: docY + height * 0.75 };
  const p5 = { x: docX, y: docY + height * 0.95 };
  return `M${p1.x},${p1.y} Q${p2.x},${p2.y} ${p3.x},${p3.y} Q${p4.x},${p4.y} ${p5.x},${p5.y}`;
}

function computeDefaultPath(findStart, getDocSize) {
  const { x: docX, y: docY } = getStartDocPoint(findStart);
  const { width, height } = getDocSize();
  return buildDefaultPathFrom({ docX, docY, width, height });
}

function endSpan(yStartDoc, yEndDoc) {
  const rawSpan = Math.max(1900, Math.abs(yEndDoc - yStartDoc));
  const factor =
    (typeof window !== "undefined" && window.MEMORAE_SCROLL_END_FACTOR) || 0.85;
  return Math.max(300, rawSpan * factor);
}

// Module-level helpers to keep the hook small
function findStartEl() {
  return (
    document.querySelector(
      'img[alt="Memorae AI assistant character"][src="/homepage/Memorae_Character 1.svg"]'
    ) ||
    document.querySelector("[data-hero]") ||
    document.body
  );
}

function getDocSize() {
  const el = document.documentElement;
  const body = document.body;
  return {
    width: Math.max(
      el.scrollWidth,
      body.scrollWidth,
      el.clientWidth,
      body.clientWidth || 0
    ),
    height: Math.max(
      el.scrollHeight,
      body.scrollHeight,
      el.clientHeight,
      body.clientHeight || 0
    ),
  };
}

function setupGhost(ghost) {
  Object.assign(ghost.style, {
    position: "absolute",
    left: "0px",
    top: "0px",
    transformOrigin: "50% 50%",
  });

  // Hide ghost on screens smaller than 1200px
  const shouldShowGhost = () => {
    const width =
      window.innerWidth || document.documentElement.clientWidth || 0;
    return width >= 1200;
  };

  if (shouldShowGhost()) {
    gsap.set(ghost, { opacity: 1, visibility: "visible" });
  } else {
    gsap.set(ghost, { opacity: 0, visibility: "hidden" });
  }

  return {
    setX: gsap.quickSetter(ghost, "x", "px"),
    setY: gsap.quickSetter(ghost, "y", "px"),
    shouldShowGhost,
  };
}

// Breakpoint-specific motion paths
const MOTION_PATHS = {
  // Desktop: 1024px - 1439px - Fixed to ensure smooth curves
  DESKTOP:
    "M512,147 Q380,350 709,708 Q950,800 684,1059 Q300,1150 203,1275 Q150,1550 823,1680 Q1100,1720 841,1841 Q600,1950 303,2276 Q180,2450 515,2956",

  // Large Desktop: 1440px+ - Already smooth
  LARGE_DESKTOP:
    "M734,165 Q625,622 882,827 Q1236,1090 802,1200 Q4,1302 696,1563 Q1047,1705 1214,1933 Q1387,2328 257,2508 Q12,2599 731,2965",
};

// Get appropriate path based on current viewport width
function getResponsivePath() {
  if (typeof window === "undefined") return MOTION_PATHS.DESKTOP;

  const width =
    window.innerWidth || document.documentElement.clientWidth || 1024;

  // Large Desktop: 1440px+
  if (width >= 1440) {
    return MOTION_PATHS.LARGE_DESKTOP;
  }

  // Desktop: 1024px - 1439px (default)
  return MOTION_PATHS.DESKTOP;
}

// Read persisted path d from window/localStorage (if available)
function readPersistedPath() {
  let d = null;
  if (typeof window !== "undefined") {
    d = window.MEMORAE_SVG_PATH || null;
    if (!d) {
      try {
        d = localStorage.getItem("memorae:svg-path") || null;
      } catch (_) {}
    }
  }
  return d;
}

// Apply a path `d` to the SVG path node and measure metrics
function applyPathAndMeasure(svgPathNode) {
  try {
    const totalLen = svgPathNode.getTotalLength();
    const startPt = svgPathNode.getPointAtLength(0);
    const endPt = svgPathNode.getPointAtLength(totalLen);
    return { totalLen, yStartDoc: startPt?.y || 0, yEndDoc: endPt?.y || 0 };
  } catch (_) {
    return { totalLen: 0, yStartDoc: 0, yEndDoc: 0 };
  }
}

function ghostWidthFromViewport(vw) {
  if (vw >= 1440) return 112;
  if (vw >= 1024) return 92;
  if (vw >= 768) return 64;
  return 51;
}

function createScrollTrigger({ place, refreshAll, getYStart, getYEnd }) {
  return ScrollTrigger.create({
    markers: typeof window !== "undefined" && !!window.MEMORAE_GSAP_MARKERS,
    trigger: document.body,
    start: "top top",
    end: () => "+=" + endSpan(getYStart(), getYEnd()),
    scrub: 1,
    onUpdate: (self) => place(self.progress),
    onRefresh: () => {
      refreshAll();
      place(0);
    },
    invalidateOnRefresh: true,
  });
}

// Create a hidden SVG layer with a path element to measure positions along the path
function makeSvgLayer() {
  const svgRoot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgRoot.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  Object.assign(svgRoot.style, {
    position: "absolute",
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    overflow: "visible",
    pointerEvents: "none",
    opacity: 0,
    zIndex: -1,
  });
  const svgPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  svgPath.setAttribute("fill", "none");
  svgPath.setAttribute("stroke", "transparent");
  svgRoot.appendChild(svgPath);

  // Use a more reliable method to append to body
  if (document.body) {
    document.body.appendChild(svgRoot);
  }
  return { svgRoot, svgPath };
}

// Compute viewport placement for the ghost at a given progress
function pointAtProgress(svgPathNode, totalLen, progress) {
  if (!svgPathNode || !totalLen) return null;
  const L = Math.max(0, Math.min(1, progress)) * totalLen;
  let pt;
  try {
    pt = svgPathNode.getPointAtLength(L);
  } catch (_) {
    return null;
  }
  return { x: pt.x - window.scrollX, y: pt.y - window.scrollY };
}

function placeGhostAt(setX, setY, ghost, viewportPt) {
  if (!viewportPt) return;
  const rect = ghost.getBoundingClientRect();
  const gw = rect.width || 0;
  const gh = rect.height || 0;
  setX(viewportPt.x - gw / 2);
  setY(viewportPt.y - gh / 2);
}

export function useMotionPath(overlayRef, ghostRef) {
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const ghost = ghostRef.current;
    if (!overlay || !ghost) return;
    return mountMotionPath(overlay, ghost);
  }, [overlayRef, ghostRef]);
}

// Mount routine extracted to reduce complexity of the hook
function mountMotionPath(overlay, ghost) {
  let st = null;
  let ro = null;
  let svgRoot = null;
  let svgPath = null;
  let totalLen = 0;
  let yStartDoc = 0;
  let yEndDoc = 0;
  let zLow = 2;
  // Once we hit the target, remember the progress to keep z-index high until the end
  let zHighLockAtProgress = null;
  // Track previous progress to detect reverse scrolling
  let prevProgress = 0;

  const ensureSvg = () => {
    if (svgRoot && svgPath) return;
    const layer = makeSvgLayer();
    svgRoot = layer.svgRoot;
    svgPath = layer.svgPath;
  };

  const setPathData = () => {
    ensureSvg();
    const persisted = readPersistedPath();
    // Use responsive path based on current viewport width
    const d = persisted || getResponsivePath();

    svgPath.setAttribute("d", d);
    const metrics = applyPathAndMeasure(svgPath);
    totalLen = metrics.totalLen;
    yStartDoc = metrics.yStartDoc;
    yEndDoc = metrics.yEndDoc;
  };

  let baseGhostWidth = 0;
  let baseGhostHeight = 0;
  const computeBounds = () => {
    const vw = window.innerWidth || document.documentElement.clientWidth || 0;
    baseGhostWidth = ghostWidthFromViewport(vw);
    ghost.style.width = `${baseGhostWidth}px`;
    ghost.style.height = "auto";
    // Measure natural height after setting width
    const rect = ghost.getBoundingClientRect();
    baseGhostHeight = rect.height || 0;
    if (baseGhostHeight > 0) {
      ghost.style.height = `${baseGhostHeight}px`;
    }
  };

  // Determine the base (low) z-index from computed style
  const readBaseZ = () => {
    try {
      const cs = getComputedStyle(overlay);
      const zi = parseInt(cs.zIndex || "2", 10);
      if (!Number.isNaN(zi)) zLow = zi;
    } catch (_) {
      zLow = 2;
    }
  };

  // Responsive z-index target positions based on screen size
  const getTargetZSpec = () => {
    const width =
      window.innerWidth || document.documentElement.clientWidth || 1024;

    // Default targets for each breakpoint - based on actual ghost positions
    const targets = {
      // Desktop: 1024px - 1439px (ghost at 675.32px, 377.758px when z-index should change)
      DESKTOP: { x: 675.32, y: 377.758, tol: 25, z: 99999 },
      // Large Desktop: 1440px+ (ghost at 399.739px, 489.18px when z-index should change)
      LARGE_DESKTOP: { x: 399.739, y: 489.18, tol: 30, z: 99999 },
    };

    // Select target based on screen width
    const defaultTarget =
      width >= 1440 ? targets.LARGE_DESKTOP : targets.DESKTOP;

    // Allow runtime override via window.MEMORAE_MOTIONPATH_ZTARGET
    try {
      const cfg = window?.MEMORAE_MOTIONPATH_ZTARGET;
      if (!cfg) return defaultTarget;

      return {
        x: Number(cfg.x ?? defaultTarget.x),
        y: Number(cfg.y ?? defaultTarget.y),
        tol: Number(cfg.tol ?? defaultTarget.tol),
        z: Number(cfg.z ?? defaultTarget.z),
      };
    } catch (_) {
      return defaultTarget;
    }
  };

  // Progress (0..1) at which z-index should drop back to base near the end
  function getDropAtProgress() {
    const v = Number(window?.MEMORAE_MOTIONPATH_DROP_AT);
    if (Number.isFinite(v)) return Math.min(Math.max(v, 0), 1);
    return 0.985; // default: last 1.5% of the path
  }

  const { setX, setY, shouldShowGhost } = setupGhost(ghost);

  const place = (progress) => {
    // Hide ghost on screens smaller than 1200px
    if (!shouldShowGhost()) {
      gsap.set(ghost, { opacity: 0, visibility: "hidden" });
      return;
    }

    // Ultra-precise scaling for seamless transition
    const rampStart = 0.92; // begin final scale a bit later
    const transitionStart = 0.988; // even tighter crossfade window - last 1.2%
    const reversing = progress < prevProgress;

    // Get emotion image for precise targeting (only after hydration)
    const emotionImg = document.querySelector(
      "[data-emotion-image][data-hydrated]"
    );
    let targetW = 220; // fallback
    let targetH = 230; // fallback
    let emotionRect = null;

    if (emotionImg) {
      emotionRect = emotionImg.getBoundingClientRect();
      targetW = emotionRect.width || targetW;
      targetH = emotionRect.height || targetH;
    }

    // Initialize size variables for use throughout the function
    let curW = baseGhostWidth;
    let curH =
      baseGhostHeight || ghost.getBoundingClientRect().height || targetH;

    // Progressive scaling with ultra-smooth interpolation
    if (progress >= rampStart) {
      let t = (progress - rampStart) / (1 - rampStart);
      t = Math.max(0, Math.min(1, t));

      // Ultra-smooth easing for imperceptible scaling
      const te = t * t * t * (t * (t * 6 - 15) + 10); // smootherstep for ultra-smooth scaling

      // Calculate precise target dimensions
      curW = baseGhostWidth + (targetW - baseGhostWidth) * te;
      const baseH =
        baseGhostHeight || ghost.getBoundingClientRect().height || targetH;
      curH = baseH + (targetH - baseH) * te;

      // Apply scaling with sub-pixel precision
      if (curW > 0) ghost.style.width = `${curW.toFixed(2)}px`;
      if (curH > 0) ghost.style.height = `${curH.toFixed(2)}px`;

      // Micro-position adjustments during scaling for perfect alignment
      if (false && emotionImg && emotionRect && progress >= 0.93) {
        // Disabled complex positioning
        const ghostRect = ghost.getBoundingClientRect();
        const emotionContainer = emotionImg.parentElement;

        if (emotionContainer) {
          const containerRect = emotionContainer.getBoundingClientRect();

          // Calculate exact center-to-center offset
          const ghostCenterX = ghostRect.left + ghostRect.width / 2;
          const ghostCenterY = ghostRect.top + ghostRect.height / 2;
          const containerCenterX = containerRect.left + containerRect.width / 2;
          const containerCenterY = containerRect.top + containerRect.height / 2;

          // Apply micro-adjustments for perfect final positioning
          const adjustProgress = (progress - 0.93) / (1 - 0.93);
          const offsetX =
            (containerCenterX - ghostCenterX) * adjustProgress * 0.1;
          const offsetY =
            (containerCenterY - ghostCenterY) * adjustProgress * 0.1;

          ghost.style.transform = `translate(${offsetX.toFixed(
            2
          )}px, ${offsetY.toFixed(2)}px)`;
        }
      }
    }

    // Ultra-smooth seamless crossfade transition
    if (progress >= transitionStart) {
      const span = 1 - transitionStart;
      const transitionProgress = (progress - transitionStart) / (span || 1);

      // Ultra-fast exponential ease for instant handoff
      const fadeProgress = Math.min(1, Math.max(0, transitionProgress));
      const ultraFast = 1 - Math.pow(1 - fadeProgress, 5); // even faster exponential curve

      // Perfect crossfade with minimal overlap - almost instant switch
      const ghostOpacity = Math.max(0, 1 - ultraFast * 1.2);
      const emotionOpacity = Math.min(1, ultraFast * 1.2);

      ghost.style.opacity = ghostOpacity.toString();

      if (emotionImg) {
        emotionImg.style.opacity = emotionOpacity.toString();
        // Ultra-fast transition for instant crossfade - no visible fade
        emotionImg.style.transition = "opacity 0.05s linear";
        // Temporarily disable bounce animation during crossfade
        emotionImg.style.animation = "none";

        // Ensure perfect positioning alignment during crossfade
        if (ghostOpacity > 0.05 && emotionOpacity > 0.05) {
          // Keep emotion in natural position for seamless transition
          emotionImg.style.visibility = "visible";
        } else {
          emotionImg.style.transform = "none";
          if (emotionOpacity <= 0) emotionImg.style.visibility = "hidden";
        }
      }
    } else {
      // Normal state - ghost visible, emotion image visibility depends on progress
      ghost.style.opacity = "1";
      if (emotionImg) {
        // Show emotion image when in early stages (emotions section) or when scrolling back
        if (progress < 0.1 || reversing) {
          emotionImg.style.opacity = "1";
          emotionImg.style.visibility = "visible";
          emotionImg.style.transition = "opacity 0.05s linear";
        } else if (progress < 0.95) {
          emotionImg.style.opacity = "0";
          // keep transitions ultra-fast to avoid visible reverse-fade
          emotionImg.style.transition = "opacity 0.05s linear";
          // do not touch animation/transform here; Superpower manages those
        }
      }

      // Reverse scroll: snap states to avoid visible fading while scrubbing back
      if (reversing && progress < transitionStart) {
        ghost.style.opacity = "1";
        if (emotionImg) {
          emotionImg.style.transition = "none";
          // Keep emotion image visible when scrolling back to emotions section
          if (progress < 0.1) {
            emotionImg.style.opacity = "1";
            emotionImg.style.visibility = "visible";
          } else {
            emotionImg.style.opacity = "0";
          }
        }
      }
    }
    // Restore bounce animation after crossfade completes (tighter window)
    if (emotionImg && progress > transitionStart + 0.01) {
      if (emotionImg.style.opacity === "1") {
        emotionImg.style.animation = "";
      }
    }

    const vp = pointAtProgress(svgPath, totalLen, progress);

    // Coordinate-based z-index trigger: elevate when ghost is near target top-left
    if (vp) {
      const spec = getTargetZSpec();
      const gw = curW || ghost.getBoundingClientRect().width || 0;
      const gh = curH || ghost.getBoundingClientRect().height || 0;
      // Current top-left equals centered point minus half size
      const left = vp.x - gw / 2;
      const top = vp.y - gh / 2;

      // If the spec was taken when the ghost was smaller (e.g., 112px),
      // account for the width/height growth so the match stays valid.
      const baseW = baseGhostWidth || gw;
      const baseH = baseGhostHeight || gh;
      const adjustedSpecX = spec.x - (gw - baseW) / 2;
      const adjustedSpecY = spec.y - (gh - baseH) / 2;

      const within =
        Math.abs(left - adjustedSpecX) <= spec.tol &&
        Math.abs(top - adjustedSpecY) <= spec.tol;

      // Lock the high z-index once we enter the target window
      if (
        within &&
        (zHighLockAtProgress === null || progress < zHighLockAtProgress)
      ) {
        zHighLockAtProgress = progress;
      }

      // Keep high z-index from the first hit until near the end
      const locked =
        zHighLockAtProgress !== null && progress >= zHighLockAtProgress - 0.002;
      let desiredZ = locked ? spec.z : zLow;
      const dropAt = getDropAtProgress();

      // Handle z-index consistently for both forward and backward scrolling
      if (progress >= transitionStart) {
        // During transition phase - same logic for both directions
        const span = 1 - transitionStart;
        const transitionProgress = (progress - transitionStart) / (span || 1);
        // Much tighter z-index switch to match ultra-fast crossfade
        if (transitionProgress < 0.2) {
          desiredZ = spec.z;
        } else {
          desiredZ = 1;
        }
      } else if (progress >= dropAt) {
        // After drop point - same logic for both directions
        desiredZ = zLow;
      } else {
        // Before transition - use normal locked z-index logic regardless of scroll direction
        desiredZ = locked ? spec.z : zLow;
      }

      if (String(overlay.style.zIndex) !== String(desiredZ)) {
        overlay.style.zIndex = String(desiredZ);
      }
    }

    placeGhostAt(setX, setY, ghost, vp);
    // update for next frame
    prevProgress = progress;
  };

  const refreshAll = () => {
    computeBounds();
    setPathData();
  };

  const getYStart = () => yStartDoc;
  const getYEnd = () => yEndDoc;
  st = createScrollTrigger({ place, refreshAll, getYStart, getYEnd });

  readBaseZ();
  refreshAll();
  place(0);

  const onPathChange = () => {
    setPathData();
    place(0);
    if (st) st.refresh();
  };
  window.addEventListener("memorae:path-change", onPathChange);

  // Track current path type to detect breakpoint changes
  let currentPathType = window.innerWidth >= 1440 ? "LARGE_DESKTOP" : "DESKTOP";

  const onResize = () => {
    const newPathType = window.innerWidth >= 1440 ? "LARGE_DESKTOP" : "DESKTOP";
    const shouldShow = shouldShowGhost();

    // Handle visibility changes based on screen size
    if (shouldShow) {
      gsap.set(ghost, { opacity: 1, visibility: "visible" });
    } else {
      gsap.set(ghost, { opacity: 0, visibility: "hidden" });
    }

    // If breakpoint changed, update path and reset z-index lock
    if (newPathType !== currentPathType) {
      currentPathType = newPathType;
      // Reset z-index lock since target position changes with breakpoint
      zHighLockAtProgress = null;
      setPathData();
      place(0);
      if (st) st.refresh();

      if (typeof window !== "undefined" && window.MEMORAE_GSAP_MARKERS) {
        const newTarget = getTargetZSpec();
        console.log("🎯 Z-Index Target Updated:", {
          breakpoint: newPathType,
          target: `${newTarget.x}, ${newTarget.y}`,
          tolerance: newTarget.tol,
        });
      }
    } else {
      // Just refresh scroll trigger for other resize changes
      ScrollTrigger.refresh();
    }
  };

  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);
  } else {
    window.addEventListener("resize", onResize);
  }

  return () => {
    if (st) st.kill();
    if (ro) ro.disconnect();
    window.removeEventListener("memorae:path-change", onPathChange);
    window.removeEventListener("resize", onResize);
    if (svgRoot && svgRoot.parentNode) svgRoot.parentNode.removeChild(svgRoot);
  };
}
