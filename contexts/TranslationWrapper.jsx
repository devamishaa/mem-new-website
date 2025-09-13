"use client";

import { TranslationProvider } from "./TranslationContext";

export default function TranslationWrapper({ children, lang, dicts }) {
  return (
    <TranslationProvider value={{ lang, dicts }}>
      {children}
    </TranslationProvider>
  );
}
