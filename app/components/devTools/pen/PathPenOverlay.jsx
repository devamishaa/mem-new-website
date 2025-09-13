"use client";

import { useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import DraggablePathCard from "@/app/components/devTools/pen/DraggablePathCard";
import PathCanvas from "@/app/components/devTools/pen/PathCanvas";
import { usePersistedPathState } from "@/hooks/pen/usePersistedPaths";
import { usePathActions } from "@/hooks/pen/usePathActions";
import { withinToggleArea } from "@/utils/pen/domUtils";
import { useScrollPosition } from "@/hooks/pen/useScrollPosition";
import { useDragPoints } from "@/hooks/pen/useDragPoints";

export default function PathPenOverlay() {
  const containerRef = useRef(null);
  const scrollPos = useScrollPosition();
  const { points, setPoints, selectedIndex, setSelectedIndex, svgPath } =
    usePersistedPathState();
  const { copyPath, clearAll, undo, deleteSelected } = usePathActions({
    points,
    setPoints,
    selectedIndex,
    setSelectedIndex,
    svgPath,
  });
  const getDocPoint = useCallback(
    (clientX, clientY) => ({
      x: clientX + window.scrollX,
      y: clientY + window.scrollY,
    }),
    []
  );
  const { isDraggingRef, onStartDrag } = useDragPoints({
    getDocPoint,
    setPoints,
  });

  const handleBackgroundClick = useCallback(
    (e) => {
      if (
        e.target.closest("[data-pen-ui]") ||
        e.target.getAttribute("data-handle")
      )
        return;
      const { x, y } = getDocPoint(e.clientX, e.clientY);
      setPoints((prev) => {
        const next = [...prev, { x, y }];
        setSelectedIndex(next.length - 1);
        return next;
      });
    },
    [getDocPoint, setPoints, setSelectedIndex]
  );

  // Drag and scroll listeners are handled in hooks above.

  // Keyboard shortcuts handled inside usePathActions

  const overlayUI = (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 199999,
        pointerEvents: "none",
      }}
    >
      {/* Draggable Path Card */}
      <DraggablePathCard
        points={points}
        setPoints={(updater) => {
          const next =
            typeof updater === "function" ? updater(points) : updater;
          setPoints(next);
        }}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        svgPath={svgPath}
        onCopy={copyPath}
        onUndo={undo}
        onClear={clearAll}
      />

      {/* Hint */}
      <div
        data-pen-ui
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          padding: "8px 10px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          borderRadius: 8,
          fontSize: 12,
          lineHeight: 1.4,
          maxWidth: 420,
          zIndex: 10001,
          pointerEvents: "auto",
        }}
      >
        - Click to add anchor points. Drag anchors to move them.
        <br />- Drag diamond midpoint to bend into a curve. Double-click handle
        to reset.
      </div>

      {/* Invisible hit layer to capture clicks without affecting layout */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "auto",
          zIndex: 9999,
        }}
        onClick={(e) => {
          if (isDraggingRef.current) return;
          if (withinToggleArea(e, 8)) return;
          handleBackgroundClick(e);
        }}
      />

      {/* SVG Layer */}
      <PathCanvas
        points={points}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        scrollPos={scrollPos}
        svgPath={svgPath}
        onStartDrag={(type, index, e) => onStartDrag(type, index, e)}
      />
    </div>
  );

  return createPortal(overlayUI, document.body);
}
