"use client";

import { create } from "zustand";
import { redirectToLanguage } from "@/utils/lang/routing";
import { ROUTING_CONFIG } from "@/configs/routing-config";
import { saveLanguagePreference } from "@/utils/lang/persistence";

const SUPPORTED = ROUTING_CONFIG.supportedLangs ?? ["en"];
const DEFAULT_LANGUAGE = SUPPORTED[0]; // First language is default

export const useLanguageStore = create((set, get) => ({
  language: DEFAULT_LANGUAGE,
  supportedLanguages: SUPPORTED,

  setLanguage: (newLang) => {
    if (!SUPPORTED.includes(newLang)) return;
    const prev = get().language;
    if (prev === newLang) return;
    set({ language: newLang });
    saveLanguagePreference(newLang);
  },

  changeLanguageAndRedirect: (newLang, pathname) => {
    if (!SUPPORTED.includes(newLang)) return;

    // Set cookie so middleware respects user choice on future requests
    if (typeof document !== "undefined") {
      document.cookie = `lang=${newLang}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }

    get().setLanguage(newLang);
    redirectToLanguage(newLang, pathname);
  },

  // Removed t() function - use useTranslation hook with namespaced translations instead
}));
