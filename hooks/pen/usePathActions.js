"use client";

import { useCallback, useEffect } from "react";
import { buildSvgPath } from "@/utils/pen/utils";
import { getKeyAction } from "@/utils/pen/domUtils";

function useCopyPath(svgPath, points) {
  return useCallback(async () => {
    const d = svgPath || buildSvgPath(points);
    try {
      await navigator.clipboard.writeText(d);
    } catch (_) {
      try {
        prompt("Copy SVG path:", d);
      } catch (_) {}
    }
  }, [points, svgPath]);
}

function useClearAll(setPoints, setSelectedIndex) {
  return useCallback(() => {
    setPoints([]);
    setSelectedIndex(null);
  }, [setPoints, setSelectedIndex]);
}

function useUndo(setPoints, setSelectedIndex) {
  return useCallback(() => {
    setPoints((prev) => {
      if (!prev || prev.length === 0) return prev;
      const next = prev.slice(0, -1);
      setSelectedIndex(next.length ? next.length - 1 : null);
      return next;
    });
  }, [setPoints, setSelectedIndex]);
}

function useDeleteSelected(selectedIndex, setPoints, setSelectedIndex) {
  return useCallback(() => {
    if (selectedIndex == null) return;
    setPoints((prev) => {
      const valid =
        Array.isArray(prev) &&
        selectedIndex >= 0 &&
        selectedIndex < prev.length;
      if (!valid) return prev;
      const next = prev
        .slice(0, selectedIndex)
        .concat(prev.slice(selectedIndex + 1));
      setSelectedIndex(
        next.length ? Math.min(selectedIndex, next.length - 1) : null
      );
      return next;
    });
  }, [selectedIndex, setPoints, setSelectedIndex]);
}

function useKeyboardShortcuts({ selectedIndex, onDelete, onUndo }) {
  useEffect(() => {
    const onKey = (e) => {
      const action = getKeyAction(e, selectedIndex);
      if (action === "delete") {
        e.preventDefault();
        onDelete();
        return;
      }
      if (action === "undo") {
        e.preventDefault();
        onUndo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDelete, onUndo, selectedIndex]);
}

export function usePathActions({
  points,
  setPoints,
  selectedIndex,
  setSelectedIndex,
  svgPath,
}) {
  const copyPath = useCopyPath(svgPath, points);
  const clearAll = useClearAll(setPoints, setSelectedIndex);
  const undo = useUndo(setPoints, setSelectedIndex);
  const deleteSelected = useDeleteSelected(
    selectedIndex,
    setPoints,
    setSelectedIndex
  );
  useKeyboardShortcuts({
    selectedIndex,
    onDelete: deleteSelected,
    onUndo: undo,
  });
  return { copyPath, clearAll, undo, deleteSelected };
}
