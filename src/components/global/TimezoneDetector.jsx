// app/_components/TimezoneDetector.jsx
"use client";
import { useEffect } from "react";

export default function TimezoneDetector() {
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && document.cookie.indexOf("timezone=") === -1) {
        document.cookie = `timezone=${encodeURIComponent(
          tz
        )}; Path=/; Max-Age=31536000; SameSite=Lax`;
      }
    } catch {}
  }, []);
  return null;
}
