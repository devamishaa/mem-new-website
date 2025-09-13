import { NextResponse } from "next/server";
import { LATIN_AMERICAN_TIMEZONES } from "@/constants/time-zone-constants";
import { shouldExcludePath } from "@/configs/routing-config";

const SUPPORTED = new Set(["en", "es"]);
const HOME_SLUG = "home";
const ONE_YEAR = 60 * 60 * 24 * 365;

// Precompiled REs
const LANG_ONLY_RE = /^\/(en|es)\/?$/i;
const PREFIXED_RE = /^\/(en|es)(\/|$)/i;

// helpers
function baseLang(tag = "") {
  return tag.toLowerCase().split("-")[0];
}

function negotiateFromAcceptLanguage(header = "") {
  // Parse q-values: "es-419,es;q=0.9,en;q=0.8"
  const items = header
    .split(",")
    .map((s) => {
      const [tag, qStr] = s.trim().split(";q=");
      return { base: baseLang(tag || ""), q: qStr ? parseFloat(qStr) : 1 };
    })
    .filter((x) => SUPPORTED.has(x.base))
    .sort((a, b) => b.q - a.q);
  return items[0]?.base || "en";
}

function isLatinAmericanTimezone(timezone) {
  return timezone && LATIN_AMERICAN_TIMEZONES?.has?.(timezone);
}

function decideLanguage(langCookie, tzCookie, acceptLanguage) {
  // 0) user preference cookie wins
  if (langCookie && SUPPORTED.has(langCookie)) return langCookie;
  // 1) timezone cookie → es for LATAM timezones
  if (isLatinAmericanTimezone(tzCookie)) return "es";
  // 2) Accept-Language fallback
  return negotiateFromAcceptLanguage(acceptLanguage);
}

function normalizePath(p) {
  // ensure leading slash, collapse duplicate slashes, drop trailing slash (except root)
  const lead = p?.startsWith("/") ? p : `/${p || ""}`;
  const collapsed = lead.replace(/\/{2,}/g, "/");
  return collapsed !== "/" ? collapsed.replace(/\/+$/g, "") : "/";
}

function localizedPath(lang, pathname) {
  const path = normalizePath(pathname || "/");
  if (path === "/") return `/${lang}/${HOME_SLUG}`;
  return normalizePath(`/${lang}${path}`);
}

function withVary(res) {
  res.headers.set("Vary", "Cookie, Accept-Language");
  return res;
}

function handleLanguageOnlyPath(request, langMatch) {
  const lang = langMatch[1].toLowerCase();
  const url = request.nextUrl.clone();
  url.pathname = localizedPath(lang, "/"); // -> /{lang}/home
  const res = NextResponse.redirect(url, 308);
  res.cookies.set("lang", lang, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "Lax",
  });
  return withVary(res);
}

function handlePrefixedPath(request, prefixMatch) {
  const lang = prefixMatch[1].toLowerCase();
  const res = NextResponse.next();
  res.cookies.set("lang", lang, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "Lax",
  });
  return withVary(res);
}

function handleUnprefixedPath(request) {
  const langCookie = request.cookies.get("lang")?.value || "";
  const tzCookie = request.cookies.get("timezone")?.value || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  const lang = decideLanguage(langCookie, tzCookie, acceptLanguage);

  const url = request.nextUrl.clone();
  url.pathname = localizedPath(lang, request.nextUrl.pathname);

  const res = NextResponse.redirect(url, 307);
  res.cookies.set("lang", lang, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "Lax",
  });
  return withVary(res);
}

// ---------- middleware ----------
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const method = request.method || "GET";

  // Avoid breaking non-idempotent requests
  if (method !== "GET" && method !== "HEAD") return NextResponse.next();

  // Skip internal/static paths
  if (shouldExcludePath?.(pathname)) return NextResponse.next();

  // A) /en or /es (with/without trailing slash) → /{lang}/home  (permanent)
  const langOnly = pathname.match(LANG_ONLY_RE);
  if (langOnly) return handleLanguageOnlyPath(request, langOnly);

  // B) Already prefixed (/en/... or /es/...) → pass through & stick choice
  const prefixed = pathname.match(PREFIXED_RE);
  if (prefixed) return handlePrefixedPath(request, prefixed);

  // C) Unprefixed → detect language
  return handleUnprefixedPath(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|sitemap.xml|manifest.webmanifest|assets/|fonts/|images/).*)",
  ],
};
