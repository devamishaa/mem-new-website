/**
 * Critical CSS styles for loading screen
 * These styles are inlined to prevent FOUC
 */
export const CRITICAL_CSS = `
  /* Prevent scroll during loading */
  html:has([data-loading-screen]),
  body:has([data-loading-screen]) {
    overflow: hidden !important;
    height: 100% !important;
    position: fixed !important;
    width: 100% !important;
  }
  
  /* Loading overlay only (no FOUC suppression) */
  [data-loading-screen] {
    position: fixed !important;
    inset: 0 !important;
    background-color: white !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    /* Use token when available; fallback keeps behavior */
    z-index: var(--z-maximum, 999999999) !important;
    overflow: hidden !important;
    width: 100vw !important;
    height: 100vh !important;
  }
  [data-loading-screen] .container {
    width: 100svw !important;
    height: 100svh !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background-color: white !important;
    overflow: hidden !important;
    position: fixed !important;
    inset: 0 !important;
    z-index: var(--z-maximum, 999999999) !important;
  }
  @keyframes spin { 
    from { transform: rotate(0deg); } 
    to { transform: rotate(360deg); } 
  }
`;
