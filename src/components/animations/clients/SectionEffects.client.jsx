// SectionEffects.client.jsx
"use client";
import React from "react";
import { useSectionAnimations } from "@/hooks/useSectionAnimation";

export default function SectionEffects({
  as: As = "section",
  children,
  ...props
}) {
  const ref = useSectionAnimations();
  return (
    <As ref={ref} {...props}>
      {children}
    </As>
  );
}
