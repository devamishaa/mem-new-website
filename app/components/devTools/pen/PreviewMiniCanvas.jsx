"use client";

import { useCallback, useMemo, useRef, useEffect } from "react";
import { getPointsBounds, hasFiniteXY, toStr } from "@/utils/pen/utils";

export default function PreviewMiniCanvas({
  points,
  setPoints,
  selectedIndex,
  setSelectedIndex,
  width = 320,
  height = 200,
  margin = 12,
}) {
  const panelRef = useRef(null);

  // Compute bounds and transform
  const bounds = useMemo(() => getPointsBounds(points), [points]);
  const docW = bounds.maxX - bounds.minX;
  const docH = bounds.maxY - bounds.minY;
  const scale = useMemo(
    () => Math.min((width - margin * 2) / docW, (height - margin * 2) / docH),
    [width, height, margin, docW, docH]
  );
  const tx = useMemo(() => margin - bounds.minX * scale, [margin, bounds.minX, scale]);
  const ty = useMemo(() => margin - bounds.minY * scale, [margin, bounds.minY, scale]);

  const toPreview = useCallback((x, y) => ({ x: x * scale + tx, y: y * scale + ty }), [scale, tx, ty]);
  const toDoc = useCallback((px, py) => ({ x: (px - tx) / scale, y: (py - ty) / scale }), [scale, tx, ty]);

  // Drag within preview
  const startDragRef = useRef(null);

  const onMouseMove = useCallback((e) => {
    const info = startDragRef.current;
    if (!info) return;
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const { x, y } = toDoc(px, py);
    setPoints((prev) => {
      const next = prev.map((p) => ({ ...p }));
      if (info.type === "anchor") {
        next[info.index].x = x;
        next[info.index].y = y;
      } else if (info.type === "control") {
        const idx = info.index;
        const base = next[idx];
        base.control = { x, y };
      } else if (info.type === "mid") {
        const idx = info.index;
        next[idx] = next[idx] || {};
        next[idx].control = { x, y };
      }
      return next;
    });
  }, [setPoints, toDoc]);

  const onMouseUp = useCallback(() => {
    if (!startDragRef.current) return;
    startDragRef.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }, [onMouseMove]);

  const startDrag = useCallback((e, info) => {
    e.stopPropagation();
    e.preventDefault();
    startDragRef.current = info;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [onMouseMove, onMouseUp]);

  useEffect(() => () => onMouseUp(), [onMouseUp]);

  return (
    <svg
      ref={panelRef}
      width={width}
      height={height}
      style={{ background: "#f8f9fa", borderRadius: 8, display: "block", border: "1px solid #e9ecef" }}
    >
      {/* Outline */}
      <g transform={`translate(${tx}, ${ty}) scale(${scale})`}>
        <path d={svgPathOrFrom(points)} fill="none" stroke="#ff377a" strokeWidth={2 / scale} strokeDasharray="6,4" />
      </g>
      {/* Handles */}
      {points.map((p, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        const hasCtrl = !!p.control;
        const mid = { x: (prev.x + p.x) / 2, y: (prev.y + p.y) / 2 };
        const ctrl = hasCtrl ? p.control : mid;
        const prevP = toPreview(prev.x, prev.y);
        const pP = toPreview(p.x, p.y);
        const ctrlP = toPreview(ctrl.x || 0, ctrl.y || 0);
        const isMid = !hasCtrl;
        return (
          <g key={`pv-h-${i}`}>
            {hasCtrl && (
              <>
                <line x1={prevP.x} y1={prevP.y} x2={ctrlP.x} y2={ctrlP.y} stroke="#aaa" strokeDasharray="2,2" />
                <line x1={pP.x} y1={pP.y} x2={ctrlP.x} y2={ctrlP.y} stroke="#aaa" strokeDasharray="2,2" />
              </>
            )}
            <rect
              x={ctrlP.x - 6}
              y={ctrlP.y - 6}
              width={12}
              height={12}
              rx={2}
              fill={isMid ? "#ffc107" : "#0dcaf0"}
              stroke="#01214f"
              strokeWidth={1}
              data-handle
              style={{ cursor: "grab" }}
              onMouseDown={(e) => startDrag(e, { type: isMid ? "mid" : "control", index: i })}
            />
          </g>
        );
      })}
      {/* Anchors */}
      {points.map((p, i) => {
        const pP = toPreview(p.x, p.y);
        return (
          <g key={`pv-a-${i}`}>
            {selectedIndex === i && (
              <circle cx={pP.x} cy={pP.y} r={10} fill="none" stroke="#ff377a" strokeWidth={2} />
            )}
            <circle
              cx={pP.x}
              cy={pP.y}
              r={6}
              fill={i === 0 ? "#23cf67" : "#557bf4"}
              stroke="#01214f"
              strokeWidth={1}
              data-handle
              style={{ cursor: "grab" }}
              onMouseDown={(e) => startDrag(e, { type: "anchor", index: i })}
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// Build a path from points inline to avoid extra dependencies
function svgPathOrFrom(points) {
  if (!points || points.length === 0) return "";
  let d = `M${toStr(points[0].x)},${toStr(points[0].y)}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const ctrl = p?.control;
    if (hasFiniteXY(ctrl)) {
      d += ` Q${toStr(ctrl.x)},${toStr(ctrl.y)} ${toStr(p.x)},${toStr(p.y)}`;
    } else {
      d += ` L${toStr(p.x)},${toStr(p.y)}`;
    }
  }
  return d;
}

