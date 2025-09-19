"use client";

import DynamicPageRenderer from "@/components/global/DynamicPageRenderer";
import MotionPathOverlay from "@/components/overlays/MotionPathOverlay";
import PathPenTool from "@/components/devTools/PathPenTool";

export default function HomeView() {
  return (
    <>
      <DynamicPageRenderer pageId="HOME" suspense />
      {/* Motion path overlay animates the character along the current SVG path */}
      <MotionPathOverlay />
      {/* Helper: click "Show Pen Tool" to draw/edit the path. It live-updates the motion. */}
      <PathPenTool />
    </>
  );
}
