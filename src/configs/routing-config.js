/**
 * @fileoverview Routing Configuration for Language-Based Middleware
 *
 * This file contains configuration for language routing behavior,
 * including special routes and exclusion patterns.
 */

// Routing configuration for middleware
export const ROUTING_CONFIG = {
  supportedLangs: ["en", "es"],
  specialRoutes: {
    "/": {
      useTimezoneDetection: true, // Enable timezone-based redirection for root path
    },
    // Add more special routes here as needed
    // '/special-page': { forceLanguage: 'es' }
  },
};

/**
 * Function to get forced language for specific routes
 * @param {string} pathname - The pathname to check
 * @returns {string|null} Language code if forced, null otherwise
 *
 * @example
 * // Add specific route language forcing logic here if needed
 * // if (pathname === '/special-page') return 'es';
 */
export function getRouteLanguage(pathname) {
  // Add specific route language forcing logic here if needed
  // For now, return null to use timezone-based detection for all routes
  return null;
}

/**
 * Function to check if a path should be excluded from middleware processing
 * @param {string} pathname - The pathname to check
 * @returns {boolean} True if path should be excluded, false otherwise
 */
export function shouldExcludePath(pathname) {
  // Static files and framework routes
  const excludePatterns = [
    "/_next/", // Next.js framework files
    "/api/", // API routes
    "/static/", // Static assets
    "/favicon.ico", // Favicon
    "/robots.txt", // SEO files
    "/sitemap.xml", // SEO files
  ];

  // Check if pathname starts with any exclude pattern
  const shouldExclude = excludePatterns.some((pattern) =>
    pathname.startsWith(pattern)
  );

  // Also exclude files with extensions (like .png, .jpg, .css, .js)
  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);

  return shouldExclude || hasFileExtension;
}
