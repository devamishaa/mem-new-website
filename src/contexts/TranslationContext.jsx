"use client";

import { createContext, useContext } from "react";

const TranslationContext = createContext({
  lang: "en",
  dicts: {},
});

export const TranslationProvider = TranslationContext.Provider;

export function useTranslationContext() {
  return useContext(TranslationContext);
}
