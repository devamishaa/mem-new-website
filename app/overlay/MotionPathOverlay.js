"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useMotionPath } from "@/app/overlay/useMotionPath";

export default function MotionPathOverlay() {
  const overlayRef = useRef(null);
  const ghostRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width =
        window.innerWidth || document.documentElement.clientWidth || 1024;
      setIsSmallScreen(width <= 1000); // Disable on screens 1000px and less
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Only use motion path on larger screens
  if (!isSmallScreen) {
    useMotionPath(overlayRef, ghostRef);
  }

  // Don't render on small screens
  if (isSmallScreen) {
    return null;
  }

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
