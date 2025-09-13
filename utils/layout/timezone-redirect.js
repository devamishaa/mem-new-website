/**
 * Timezone-based redirect logic
 * Redirects users from Latin American timezones to Spanish version
 */

/**
 * Builds the timezone redirect script string
 * @param {string[]} tzList - Array of Latin American timezone strings
 * @returns {string} - JavaScript code as string for inline execution
 */
export function buildTimezoneRedirectScript(tzList) {
  const tzListJson = JSON.stringify(tzList);

  return `
    (function(){
      if (typeof window === 'undefined') return;
      if (/bot|crawl|spider/i.test(navigator.userAgent)) return;

      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.cookie = 'timezone=' + encodeURIComponent(tz) + '; path=/; max-age=86400; SameSite=Lax';
        window.__MEMOARE_USER_TIMEZONE__ = tz;

        const LATIN_AMERICAN_TIMEZONES = new Set(${tzListJson});
        const parts = location.pathname.split('/');
        if (parts.length > 1 && ['en','es'].includes(parts[1])) return;
        if (sessionStorage.getItem('memoare_redirect_attempted')) return;

        sessionStorage.setItem('memoare_redirect_attempted','1');
        if (LATIN_AMERICAN_TIMEZONES.has(tz)) {
          const target = location.pathname === '/' ? '/es' : '/es' + location.pathname;
          location.replace(target + location.search + location.hash);
        }
      } catch (e) { /* no-op */ }
    })();
  `;
}
