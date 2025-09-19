"use client";

// small pure helpers extracted to reduce per-file complexity in useTranslation

export function getNested(obj, path) {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((curr, key) => curr?.[key], obj);
}

export function hasNamespace(key) {
  return key.includes(":");
}

export function getFromNs(dicts, ns, path) {
  const dict = dicts?.[ns];
  return dict ? getNested(dict, path) : undefined;
}

export function searchAllNs(dicts, key) {
  for (const ns in dicts || {}) {
    const val = getFromNs(dicts, ns, key);
    if (val !== undefined) return val;
  }
  return undefined;
}

export function getTranslation(dicts, key) {
  if (!dicts || !key) return undefined;
  if (hasNamespace(key)) {
    const [ns, path] = key.split(":", 2);
    return getFromNs(dicts, ns, path);
  }
  return searchAllNs(dicts, key);
}

export function interpolate(str, vars) {
  if (!vars || typeof str !== "string") return str;
  return str.replace(/\{([^}]+)\}/g, (match, key) =>
    vars[key] !== undefined ? String(vars[key]) : match
  );
}

export function resolveTranslation(dicts, key, vars) {
  const value = getTranslation(dicts, key);
  if (value === undefined) return key;
  return typeof value === "string" ? interpolate(value, vars) : value;
}

export function isLanguageSyncNeeded(
  contextLang,
  ssrLang,
  storeLanguage,
  setLanguage
) {
  const sourceLang = contextLang || ssrLang;
  return Boolean(sourceLang && sourceLang !== storeLanguage && setLanguage);
}

export function computeLanguage(contextLang, ssrLang, storeLanguage) {
  return contextLang || ssrLang || storeLanguage || "en";
}

export function makeChangeLanguage(changeLanguageAndRedirect, setLanguage) {
  if (changeLanguageAndRedirect) {
    return (lang, pathname) => changeLanguageAndRedirect(lang, pathname);
  }
  return (lang) => setLanguage?.(lang);
}
