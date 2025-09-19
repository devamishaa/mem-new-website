import path from "node:path";
import { promises as fs } from "node:fs";

// Translation cache to avoid repeated file reads
const translationCache = new Map();

async function readJson(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // File doesn't exist - this is expected for missing translations
      return null;
    }

    // Log other errors for debugging (JSON parse errors, permission issues, etc.)
    console.error(
      `[loadNamespaces] Failed to read translation file ${filePath}:`,
      error.message
    );
    return null;
  }
}

/**
 * Get cached translation or return null if not found
 */
function getCachedTranslation(cacheKey) {
  return translationCache.has(cacheKey) ? translationCache.get(cacheKey) : null;
}

/**
 * Load translations with English fallback
 */
async function loadTranslationWithFallback(localesDir, lang, namespace) {
  // Try requested language first
  const langPath = path.join(localesDir, lang, `${namespace}.json`);
  let translations = await readJson(langPath);

  // Fallback to English if needed
  if (!translations && lang !== "en") {
    const enPath = path.join(localesDir, "en", `${namespace}.json`);
    translations = await readJson(enPath);

    // Warn in development if both fail
    if (process.env.NODE_ENV === "development" && !translations) {
      console.warn(
        `[loadNamespaces] Missing translations for ${lang}:${namespace}, English fallback also failed`
      );
    }
  }

  return translations || {};
}

/**
 * Load single namespace with caching
 */
async function loadSingleNamespace(localesDir, lang, namespace) {
  const cacheKey = `${lang}:${namespace}`;

  // Check cache first
  const cached = getCachedTranslation(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Load with fallback
  const translations = await loadTranslationWithFallback(
    localesDir,
    lang,
    namespace
  );

  // Cache and return
  translationCache.set(cacheKey, translations);
  return translations;
}

/**
 * Load translation namespaces for server-side rendering
 * @param {string} lang - Language code ('en', 'es')
 * @param {string[]} namespaces - Namespaces to load (['common', 'landing-l5'])
 * @returns {Promise<Object>} Dictionary object { namespace: translations }
 */
export async function loadNamespaces(lang, namespaces) {
  const localesDir = path.join(process.cwd(), "src", "lang");
  const result = {};

  for (const ns of namespaces) {
    result[ns] = await loadSingleNamespace(localesDir, lang, ns);
  }

  return result;
}
