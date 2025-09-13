import { ROUTING_CONFIG } from "@/configs/routing-config";

const SUPPORTED_LANGUAGES = ROUTING_CONFIG.supportedLangs ?? ["en"];
const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0];
export const getLanguageFromPath = (pathname) => {
  const pathParts = pathname.split("/").filter(Boolean);
  if (pathParts.length > 0 && SUPPORTED_LANGUAGES.includes(pathParts[0])) {
    return pathParts[0];
  }
  return DEFAULT_LANGUAGE;
};

export const removeLanguageFromPath = (pathname) => {
  const pathParts = pathname.split("/").filter(Boolean);
  if (pathParts.length > 0 && SUPPORTED_LANGUAGES.includes(pathParts[0])) {
    pathParts.shift();
  }
  return pathParts.length > 0 ? "/" + pathParts.join("/") : "/";
};

export const buildLocalizedPath = (language, pathname) => {
  const cleanPath = removeLanguageFromPath(pathname);
  const out =
    language === DEFAULT_LANGUAGE
      ? cleanPath || "/"
      : `/${language}${cleanPath}`;
  return out.replace(/\/{2,}/g, "/");
};

export const redirectToLanguage = (newLanguage, pathname) => {
  if (!SUPPORTED_LANGUAGES.includes(newLanguage)) return;
  const target = buildLocalizedPath(newLanguage, pathname).replace(
    /\/{2,}/g,
    "/"
  );
  if (typeof window !== "undefined") {
    const current = window.location.pathname || "/";
    if (current === target) return;
    window.location.assign(target);
  }
};
