"use client";

import { useRef } from "react";
import Image from "next/image";
import { useMotionPath } from "@/app/overlay/useMotionPath";

export default function MotionPathOverlay() {
  const overlayRef = useRef(null);
  const ghostRef = useRef(null);
  useMotionPath(overlayRef, ghostRef);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[2] pointer-events-none"
      aria-hidden="true"
    >
      <Image
        ref={ghostRef}
        src="/homepage/Memorae_Character 1.svg"
        alt="Memorae character moving"
        width={200}
        height={200}
        className="opacity-0 invisible"
        unoptimized
      />
    </div>
  );
}
