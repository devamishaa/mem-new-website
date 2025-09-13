// Service Worker for cache clearing on page refresh
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    clearAllCaches();
  }
});

async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
    console.log("All caches cleared successfully");
  } catch (error) {
    console.error("Error clearing caches:", error);
  }
}

// Clear cache on service worker activation
self.addEventListener("activate", (event) => {
  event.waitUntil(clearAllCaches());
});
