const BASE = process.env.NEXT_PUBLIC_CDN_BASE_URL || "https://cdn.memorae.ai";

/**
 * Build a CDN URL from a key.
 * @param {object} p
 * @param {string} p.key    e.g. "hero/phone" or "1-en"
 * @param {string} [p.ext]  default 'webp'
 * @param {string} [p.prefix] optional extra folder
 */
export function buildCdnSrc({ key, ext = "webp", prefix = "" }) {
  if (!key) throw new Error("buildCdnSrc: key is required");
  const cleanPrefix = prefix ? prefix.replace(/^\/|\/$/g, "") + "/" : "";
  const cleanKey = String(key).replace(/^\/+/g, "");
  return `${BASE}/${cleanPrefix}${cleanKey}.${ext}`;
}
