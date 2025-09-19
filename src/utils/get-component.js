"use client";

import dynamic from "next/dynamic";
import { COMPONENT_VARIANTS } from "@/configs/dynamic-page-config";

const componentCache = Object.create(null);
const NullComponent = () => null;
const DefaultLoading = () => <div className="loading-spinner" />;

function getEntry(type, variant) {
  const entry = COMPONENT_VARIANTS?.[type]?.[variant];
  if (!entry) return null;
  // Support function-only shorthand { Default: () => import('...') }
  return typeof entry === "function" ? { importer: entry } : entry;
}

// Tiny Levenshtein (dev DX)
function distance(a = "", b = "") {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array(b.length).fill(0),
  ]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return m[a.length][b.length];
}

function suggest(type, variant) {
  const all = Object.keys(COMPONENT_VARIANTS?.[type] || {});
  const suggestions = all
    .map((v) => ({
      v,
      d: distance((variant || "").toLowerCase(), v.toLowerCase()),
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map((x) => x.v);
  return { all, suggestions };
}

/**
 * getComponent(type, variant, opts?)
 * opts: { suspense?: boolean, loading?: React.FC, ssr?: boolean }
 */
export function getComponent(type, variant, { suspense, loading, ssr } = {}) {
  const key = `${type}_${variant}`;
  if (componentCache[key]) return componentCache[key];

  const meta = getEntry(type, variant);
  if (!meta?.importer) {
    const { all, suggestions } = suggest(type, variant);
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[getComponent] Missing importer for ${type} → "${variant}". Known: [${all.join(
          ", "
        )}]` +
          (suggestions.length
            ? ` • Did you mean: ${suggestions.join(", ")}?`
            : "")
      );
    }
    componentCache[key] = NullComponent;
    return componentCache[key];
  }

  const importer = meta.importer;

  // Precedence: caller > registry > defaults
  const useSuspense = suspense ?? meta.suspense ?? false;
  const Loading = loading ?? meta.loading ?? DefaultLoading;
  const useSSR = ssr ?? (meta.clientOnly ? false : meta.ssr ?? true);

  const Comp = useSuspense
    ? dynamic(importer, { ssr: useSSR, suspense: true })
    : dynamic(importer, { ssr: useSSR, loading: Loading });

  Comp.displayName = `Dyn(${key})`;
  componentCache[key] = Comp;
  return Comp;
}
