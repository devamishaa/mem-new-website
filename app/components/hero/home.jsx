"use client";

import DynamicPageRenderer from "@/global/DynamicPageRenderer";

import MotionPathOverlay from "@/app/overlay/MotionPathOverlay";
import PathPenTool from "@/app/components/devTools/PathPenTool";

export default function HomeView() {
  return (
    <>
      <DynamicPageRenderer pageId="HOME" suspense />
      {/* Motion path overlay animates the character along the current SVG path */}
      {/* <MotionPathOverlay /> */}
      {/* Helper: click "Show Pen Tool" to draw/edit the path. It live-updates the motion. */}
      {/* <PathPenTool /> */}
    </>
  );
}
