"use client";

import { useRef } from "react";
import { useMotionPath } from "@/components/overlays/useMotionPath";

export default function MotionPathOverlay() {
  const overlayRef = useRef(null);
  const ghostRef = useRef(null);
  useMotionPath(overlayRef, ghostRef);

  return (
    <div
      ref={overlayRef}
      style={{ position: "fixed", inset: 0, zIndex: "var(--z-motion-path, 2)", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <img
        ref={ghostRef}
        src="https://cdn.memorae.ai/mem-next/homepage/Memorae_Character 1.svg"
        alt="Memorae character moving"
        style={{ opacity: 0, visibility: "hidden" }}
      />
    </div>
  );
}
