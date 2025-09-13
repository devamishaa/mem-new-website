"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from "@/constants/language-constants";

// Only select the setter; do NOT subscribe to current language.
const selectSetLanguage = (s) => s.setLanguage;

const LangSyncWrapper = ({ lang, children }) => {
  const setLanguage = useLanguageStore(selectSetLanguage);

  useEffect(() => {
    const target = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
    // setLanguage must be idempotent (no-op if value is same)
    setLanguage(target);
    // deps: only the URL param lang and the stable setter reference
  }, [lang, setLanguage]);

  return children;
};

export default LangSyncWrapper;
