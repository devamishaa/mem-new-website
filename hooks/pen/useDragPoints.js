"use client";

import { useCallback, useEffect, useRef } from "react";

export function useDragPoints({ getDocPoint, setPoints }) {
  const dragRef = useRef(null); // { type, index, lastX, lastY }
  const isDraggingRef = useRef(false);

  const onMouseMove = useCallback(
    (e) => {
      const drag = dragRef.current;
      if (!drag) return;
      isDraggingRef.current = true;
      const { x, y } = getDocPoint(e.clientX, e.clientY);
      const dx = x - drag.lastX;
      const dy = y - drag.lastY;

      setPoints((prev) => {
        const next = prev.map((p) => ({ ...p }));
        if (drag.type === "anchor") {
          next[drag.index].x += dx;
          next[drag.index].y += dy;
        } else if (drag.type === "control") {
          const idx = drag.index;
          const base = next[idx];
          const baseCtrl = base.control || { x: base.x, y: base.y };
          base.control = { x: baseCtrl.x + dx, y: baseCtrl.y + dy };
        } else if (drag.type === "mid") {
          const idx = drag.index;
          next[idx] = next[idx] || {};
          next[idx].control = { x, y };
        }
        return next;
      });

      dragRef.current = { ...drag, lastX: x, lastY: y };
    },
    [getDocPoint, setPoints]
  );

  const onMouseUp = useCallback(() => {
    dragRef.current = null;
    // microtask delay to avoid click adding after a drag
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  }, []);

  useEffect(() => {
    const move = (e) => onMouseMove(e);
    const up = () => onMouseUp();
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [onMouseMove, onMouseUp]);

  const onStartDrag = useCallback(
    (type, index, e) => {
      const { x, y } = getDocPoint(e.clientX, e.clientY);
      dragRef.current = { type, index, lastX: x, lastY: y };
    },
    [getDocPoint]
  );

  return { isDraggingRef, onStartDrag };
}
