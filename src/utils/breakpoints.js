export const BREAKPOINTS = {
  MOBILE_S: 320,
  MOBILE_M: 375,
  MOBILE_L: 425,
  TABLET: 768,
  LAPTOP: 1024,
  LAPTOP_L: 1440,
};

/**
 * Dynamic utility to get responsive dimensions for any image
 * @param {Object} dimensionMap - Object with breakpoint dimensions
 * @param {string} breakpoint - Current breakpoint
 * @returns {Object} - {width, height} or single size for square images
 */
export const getResponsiveDimensions = (
  dimensionMap,
  breakpoint = "LAPTOP_L"
) => {
  // Try current breakpoint first
  if (dimensionMap[breakpoint]) {
    return dimensionMap[breakpoint];
  }

  // Fallback logic for missing breakpoints
  const fallbackOrder = {
    MOBILE_S: ["MOBILE_L", "TABLET", "LAPTOP_L"],
    MOBILE_M: ["MOBILE_L", "TABLET", "LAPTOP_L"],
    MOBILE_L: ["TABLET", "LAPTOP_L"],
    TABLET: ["MOBILE_L", "LAPTOP_L"],
    LAPTOP: ["LAPTOP_L", "TABLET"],
    LAPTOP_L: ["LAPTOP", "TABLET"],
  };

  const fallbacks = fallbackOrder[breakpoint] || ["LAPTOP_L"];

  for (const fallback of fallbacks) {
    if (dimensionMap[fallback]) {
      return dimensionMap[fallback];
    }
  }

  // Final fallback
  return { width: 100, height: 100 };
};
