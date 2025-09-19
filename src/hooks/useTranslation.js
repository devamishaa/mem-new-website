"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useSSRLang } from "@/contexts/SsrLangContext";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { ROUTING_CONFIG } from "@/configs/routing-config";
import {
  resolveTranslation,
  isLanguageSyncNeeded,
  computeLanguage,
  makeChangeLanguage,
} from "@/utils/translation-helpers";

// helpers moved to utils to reduce per-file complexity

// compute final language preference in one place
// memoized translator hook with improved dependency handling
function useTranslator(dicts) {
  return useMemo(() => {
    return (key, vars = {}) => {
      if (!key) return "";
      return resolveTranslation(dicts, key, vars);
    };
  }, [dicts]);
}

// memoized change-language hook
function useChangeLanguageMemo(
  language,
  changeLanguageAndRedirect,
  setLanguage
) {
  return useCallback(
    (lang, pathname) => {
      if (lang === language) return;
      const doChange = makeChangeLanguage(
        changeLanguageAndRedirect,
        setLanguage
      );
      doChange(lang, pathname);
    },
    [language, changeLanguageAndRedirect, setLanguage]
  );
}

// effect hook to sync language once
function useSyncLanguageEffect(
  contextLang,
  ssrLang,
  storeLanguage,
  setLanguage
) {
  useEffect(() => {
    if (!isLanguageSyncNeeded(contextLang, ssrLang, storeLanguage, setLanguage))
      return;
    const sourceLang = contextLang || ssrLang;
    setLanguage(sourceLang);
  }, [contextLang, ssrLang, storeLanguage, setLanguage]);
}

export const useTranslation = () => {
  const ssrLang = useSSRLang();
  const { lang: contextLang, dicts } = useTranslationContext();

  const storeLanguage = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const supportedLanguages = useLanguageStore(
    (state) => state.supportedLanguages
  );
  const changeLanguageAndRedirect = useLanguageStore(
    (state) => state.changeLanguageAndRedirect
  );

  const language = computeLanguage(contextLang, ssrLang, storeLanguage);
  const supported = supportedLanguages ??
    ROUTING_CONFIG?.supportedLangs ?? ["en"];

  const t = useTranslator(dicts);
  const changeLanguage = useChangeLanguageMemo(
    language,
    changeLanguageAndRedirect,
    setLanguage
  );
  useSyncLanguageEffect(contextLang, ssrLang, storeLanguage, setLanguage);

  return {
    t,
    language,
    setLanguage,
    supportedLanguages: supported,
    changeLanguage,
    changeLanguageAndRedirect,
  };
};
