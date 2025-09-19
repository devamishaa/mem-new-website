import "@/styles/globals.css";
import SmoothScroll from "@/components/providers/LenisProvider";
import TimezoneDetector from "@/components/global/TimezoneDetector";
import HeadContent from "@/components/layout/HeadContent";
import LoadingScreen from "@/components/global/LoadingScreen";
import { cookies } from "next/headers";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://memorae.ai"
  ),
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get("lang")?.value || "en";
  return (
    <html lang={cookieLang}>
      <head>
        <HeadContent />
      </head>
      <body>
        <LoadingScreen />
        <TimezoneDetector />
        <SmoothScroll>{children} </SmoothScroll>
      </body>
    </html>
  );
}
