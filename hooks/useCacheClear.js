"use client";

import { useEffect } from "react";

export const useCacheClear = () => {
  useEffect(() => {
    // Clear various caches on page load/refresh
    const clearCaches = async () => {
      try {
        // Clear browser cache for static assets
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
          console.log("Browser caches cleared");
        }

        // Clear localStorage (optional - uncomment if needed)
        // localStorage.clear();

        // Clear sessionStorage (optional - uncomment if needed)
        // sessionStorage.clear();

        // Clear IndexedDB (optional - uncomment if needed)
        // if ('indexedDB' in window) {
        //   const databases = await indexedDB.databases();
        //   await Promise.all(
        //     databases.map(db => {
        //       return new Promise((resolve, reject) => {
        //         const deleteReq = indexedDB.deleteDatabase(db.name);
        //         deleteReq.onsuccess = () => resolve();
        //         deleteReq.onerror = () => reject(deleteReq.error);
        //       });
        //     })
        //   );
        // }

        // Force reload if needed (uncomment if you want to force reload after clearing)
        // window.location.reload();
      } catch (error) {
        console.error("Error clearing caches:", error);
      }
    };

    // Clear caches on component mount (page refresh)
    clearCaches();

    // Also clear on beforeunload (when user is about to leave)
    const handleBeforeUnload = () => {
      clearCaches();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
};
