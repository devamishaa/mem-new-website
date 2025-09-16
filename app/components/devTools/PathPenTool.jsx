"use client";

import { useState } from "react";
import PathPenOverlay from "@/app/components/devTools/pen/PathPenOverlay";

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

export default function PathPenTool() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* <Button
        data-pen-toggle
        onClick={() => setOpen((v) => !v)}
        style={{ position: "fixed", top: 20, right: 20, zIndex: 200000, padding: "8px 12px", borderRadius: 24 }}
        title="Toggle Pen Tool Overlay"
      >
        {open ? "Hide Pen Tool" : "Show Pen Tool"}
      </Button> */}
      {open && <PathPenOverlay />}
    </>
  );
}
