import Script from "next/script";
import { CRITICAL_CSS } from "@/utils/layout/critical-styles";
import { buildTimezoneRedirectScript } from "@/utils/layout/timezone-redirect";
import { LATIN_AMERICAN_TIMEZONES } from "@/constants/time-zone-constants";

const TZ_LIST = Array.from(LATIN_AMERICAN_TIMEZONES);

/**
 * Head content component containing critical CSS and scripts
 * Separated from main layout for better organization
 */
export default function HeadContent() {
  return (
    <>
      {process.env.NEXT_PUBLIC_CDN_BASE_URL ? (
        <>
          <link
            rel="preconnect"
            href={process.env.NEXT_PUBLIC_CDN_BASE_URL}
            crossOrigin=""
          />
          <link
            rel="dns-prefetch"
            href={process.env.NEXT_PUBLIC_CDN_BASE_URL}
          />
        </>
      ) : null}
      <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
      <noscript>
        <style>{`[data-loading-screen]{display:none !important;}`}</style>
      </noscript>
      <Script
        id="instant-timezone-redirect"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: buildTimezoneRedirectScript(TZ_LIST),
        }}
      />
    </>
  );
}
