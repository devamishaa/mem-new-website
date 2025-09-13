export const LANGUAGE_STORAGE_KEY = "preferredLanguage";
export const LANGUAGE_COOKIE_KEY = "lang";

export const saveLanguagePreference = (language) => {
  if (typeof window === "undefined") return;

  // Save to localStorage
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);

  // Save to cookie for middleware access
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${language}; path=/; max-age=31536000; SameSite=Lax`;
};

export const getStoredLanguage = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(LANGUAGE_STORAGE_KEY);
};
