"use client";

import { useEffect, useMemo, useState } from "react";
import { buildSvgPath } from "@/utils/pen/utils";

function publishToWindow(points, svgPath) {
  if (typeof window === "undefined") return;
  window.MEMORAE_SVG_POINTS = points;
  window.MEMORAE_SVG_PATH = svgPath;
  try {
    window.dispatchEvent(
      new CustomEvent("memorae:path-change", { detail: { d: svgPath, points } })
    );
  } catch (_) {}
}

function loadPointsFromStorage() {
  try {
    const raw = localStorage.getItem("memorae:svg-points");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function persistPoints(points, svgPath) {
  try {
    localStorage.setItem("memorae:svg-points", JSON.stringify(points));
    if (points && points.length) {
      localStorage.setItem("memorae:svg-path", svgPath || "");
    }
  } catch (_) {}
}

export function usePersistedPathState() {
  const [points, setPoints] = useState(loadPointsFromStorage);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const svgPath = useMemo(() => buildSvgPath(points), [points]);

  useEffect(() => {
    persistPoints(points, svgPath);
    publishToWindow(points, svgPath);
  }, [points, svgPath]);

  return { points, setPoints, selectedIndex, setSelectedIndex, svgPath };
}
