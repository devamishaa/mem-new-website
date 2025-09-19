"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PreviewMiniCanvas from "@/components/devTools/pen/PreviewMiniCanvas";
import { parseSvgPathToPoints } from "@/utils/pen/utils";

const Button = ({ style = {}, ...props }) => (
  <button
    {...props}
    style={{
      padding: "10px 14px",
      border: "none",
      borderRadius: 8,
      fontWeight: 600,
      fontSize: 14,
      cursor: "pointer",
      background: "#0d6efd",
      color: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,.15)",
      ...style,
    }}
  />
);

export default function DraggablePathCard({
  points,
  setPoints,
  selectedIndex,
  setSelectedIndex,
  svgPath,
  onCopy,
  onUndo,
  onClear,
}) {
  const cardRef = useRef(null);
  const dragRef = useRef(null);
  const computeInitialPos = () => {
    try {
      const toggle = document.querySelector("[data-pen-toggle]");
      const rect = toggle?.getBoundingClientRect();
      const cardWidth = 360;
      if (rect) {
        const top = rect.bottom + 8;
        const left = Math.max(
          8,
          Math.min(
            (window.innerWidth || 0) - cardWidth - 8,
            rect.right - cardWidth
          )
        );
        return { top, left };
      }
      return { top: 80, left: (window.innerWidth || 0) - cardWidth - 20 };
    } catch (_) {
      return { top: 80, left: 20 };
    }
  };
  const [pos, setPos] = useState(() => computeInitialPos());
  const [dragging, setDragging] = useState(false);
  const cardWidth = 360;
  const previewWidth = 333;
  const previewHeight = 200;

  useEffect(() => {
    const onResize = () => {
      setPos((prev) => {
        const w = window.innerWidth || 0;
        const h = window.innerHeight || 0;
        const clampedLeft = Math.max(8, Math.min(w - 360 - 8, prev.left));
        const clampedTop = Math.max(8, Math.min(h - 60, prev.top));
        return { top: clampedTop, left: clampedLeft };
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onDragStart = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(true);
      const startX = e.clientX;
      const startY = e.clientY;
      const startTop = pos.top;
      const startLeft = pos.left;
      const move = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        setPos({ top: startTop + dy, left: startLeft + dx });
      };
      const up = () => {
        setDragging(false);
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [pos.top, pos.left]
  );

  const width = previewWidth;
  const height = previewHeight;
  const [importValue, setImportValue] = useState("");
  const [importError, setImportError] = useState("");

  const handleImport = useCallback(() => {
    const d = String(importValue || "").trim();
    if (!d) {
      setImportError("Please paste an SVG path (d) value.");
      return;
    }
    const parsed = parseSvgPathToPoints(d);
    if (!parsed || parsed.length === 0) {
      setImportError("Could not parse path. Supported commands: M, L, Q (absolute/relative).");
      return;
    }
    setImportError("");
    setPoints(parsed);
    setSelectedIndex(parsed.length - 1);
  }, [importValue, setPoints, setSelectedIndex]);

  return (
    <div
      data-pen-ui
      ref={cardRef}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: cardWidth,
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,.08)",
        borderRadius: 12,
        boxShadow: "0 16px 40px rgba(1, 33, 79, 0.18)",
        padding: 12,
        zIndex: 10002,
        pointerEvents: "auto",
        userSelect: dragging ? "none" : "auto",
      }}
    >
      <div
        ref={dragRef}
        onMouseDown={onDragStart}
        style={{
          height: 28,
          borderRadius: 8,
          background: "linear-gradient(180deg, #f8fafc, #eef2f7)",
          border: "1px solid rgba(1,33,79,0.08)",
          marginBottom: 10,
          cursor: dragging ? "grabbing" : "grab",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 10px",
          fontWeight: 600,
          color: "#01214f",
          fontSize: 13,
        }}
      >
        Motion Path tool By Shubham
      </div>

      <PreviewMiniCanvas
        points={points}
        setPoints={setPoints}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        width={width}
        height={height}
      />
      <div style={{ marginTop: 10 }}>
        <label data-pen-ui style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#01214f", marginBottom: 6 }}>
          Current path (read-only)
        </label>
        <textarea
          data-pen-ui
          readOnly
          value={svgPath || ""}
          style={{
            width: "100%",
            minHeight: 60,
            height: 80,
            resize: "vertical",
            fontFamily: "monospace",
            fontSize: 12,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #dee2e6",
            background: "#fbfcfe",
          }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label data-pen-ui style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#01214f", marginBottom: 6 }}>
          Paste SVG path to import (d)
        </label>
        <textarea
          data-pen-ui
          placeholder="e.g. M100,100 Q150,50 200,100 L300,150"
          value={importValue}
          onChange={(e) => setImportValue(e.target.value)}
          style={{
            width: "100%",
            minHeight: 60,
            height: 80,
            resize: "vertical",
            fontFamily: "monospace",
            fontSize: 12,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #dee2e6",
            background: "#fff",
          }}
        />
        {importError ? (
          <div data-pen-ui style={{ color: "#dc3545", fontSize: 12, marginTop: 6 }}>{importError}</div>
        ) : null}
      </div>
      <div
        style={{
          marginTop: 10,
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        <Button onClick={onCopy} style={{ background: "#0d6efd" }}>
          Copy Path
        </Button>
        <Button onClick={handleImport} style={{ background: "#198754" }}>
          Load Path
        </Button>
        <Button
          onClick={onUndo}
          style={{ background: "#6c757d" }}
          disabled={!points || points.length === 0}
        >
          Undo
        </Button>
        <Button
          onClick={onClear}
          style={{ background: "#dc3545" }}
          disabled={!points || points.length === 0}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
