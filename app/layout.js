// app/layout.jsx
import "@/styles/globals.css";
import Script from "next/script";
import SmoothScroll from "@/components/SmoothScroll";
import { NavbarThemeProvider } from "@/contexts/NavbarThemeContext";
import { AnimationProvider } from "@/contexts/AnimationContext";
import AnimationInitializer from "@/app/components/AnimationInitializer";

export const metadata = {};

export default function RootLayout({ children }) {
  return (
    <html lang="es-ES">
      <head>
        {/* ✅ Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* ✅ Preconnect for font CDN */}
        <link
          rel="preconnect"
          href="https://fonts.cdnfonts.com"
          crossOrigin="anonymous"
        />

        {/* ✅ Preload Fonts (critical) */}
        <link
          rel="preload"
          href="https://fonts.cdnfonts.com/s/45240/CamptonBook.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.cdnfonts.com/s/45240/CamptonMedium.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://fonts.cdnfonts.com/s/45240/CamptonBold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />

        {/* ✅ Inline font-face CSS (with font-display: swap) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Campton';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url('https://fonts.cdnfonts.com/s/45240/CamptonBook.woff') format('woff');
              }
              @font-face {
                font-family: 'Campton';
                font-style: normal;
                font-weight: 500;
                font-display: swap;
                src: url('https://fonts.cdnfonts.com/s/45240/CamptonMedium.woff') format('woff');
              }
              @font-face {
                font-family: 'Campton';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url('https://fonts.cdnfonts.com/s/45240/CamptonBold.woff') format('woff');
              }
              body {
                font-family: 'Campton', sans-serif;
              }
            `,
          }}
        />

        {/* ✅ Preload logo for faster LCP */}
        <link rel="preload" as="image" href="/logo.svg" type="image/svg+xml" />

        {/* ✅ SEO Meta Tags (already covered in metadata, fallback here optional) */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#EC4899" />
        <meta name="robots" content="index, follow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#EC4899" />
      </head>

      <body>
        {/* ✅ SmoothScroll wrapper for entire application */}
        <SmoothScroll>
          {/* ✅ NavbarThemeProvider for entire application */}
          <NavbarThemeProvider>
            {/* ✅ AnimationProvider for animations */}
            <AnimationProvider>
              {/* ✅ Cache clearer for page refresh */}
              {/* ✅ Animation initializer */}
              <AnimationInitializer />
              {/* ✅ SideNav context */}
              {children}
            </AnimationProvider>
          </NavbarThemeProvider>
        </SmoothScroll>

        {/* ✅ Lazy load analytics or 3rd party (optional example) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
