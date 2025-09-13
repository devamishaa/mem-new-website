"use client";

import { useEffect } from "react";

export default function CacheClearer() {
  useEffect(() => {
    // Clear caches on page load/refresh
    const clearCaches = async () => {
      try {
        // Clear browser cache for static assets
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
          console.log("✅ Browser caches cleared on page refresh");
        }

        // Clear service worker cache if it exists
        if ("serviceWorker" in navigator) {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            registrations.map((registration) => registration.unregister())
          );
          console.log("✅ Service worker caches cleared");
        }

        // Add timestamp to prevent aggressive caching
        const timestamp = Date.now();
        sessionStorage.setItem("cache-buster", timestamp.toString());
      } catch (error) {
        console.error("❌ Error clearing caches:", error);
      }
    };

    // Clear caches immediately on mount
    clearCaches();

    // Also clear on page visibility change (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        clearCaches();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
