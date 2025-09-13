"use client";

import { useEffect } from "react";
import { useAnimationContext } from "@/contexts/AnimationContext";

export default function AnimationInitializer() {
  const { setLoadingComplete } = useAnimationContext();

  useEffect(() => {
    // Set loading complete after a short delay to allow page to load
    const timer = setTimeout(() => {
      console.log("AnimationInitializer: Setting loading complete to true");
      setLoadingComplete(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [setLoadingComplete]);

  return null; // This component doesn't render anything
}
