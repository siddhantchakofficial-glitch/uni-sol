import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, RTL_LANGUAGES, DEFAULT_LANGUAGE } from '../constants/languages';
import {
  changeGoogleTranslate,
  restoreGoogleTranslate,
  getActiveLanguage,
  PAGE_LANGUAGE,
} from '../utils/googleTranslate';

const STORAGE_KEY = 'site_language';

const LanguageContext = createContext(null);

/**
 * LanguageProvider – wraps the app to provide currentLanguage state.
 * - Persists selection in localStorage under 'site_language'
 * - Dynamically sets dir="rtl" / dir="ltr" on <html> for Arabic, Urdu, Hebrew
 * - NO external i18n libraries — pure native React context
 */
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    } catch {
      // localStorage blocked (iframe / private mode)
    }
    return DEFAULT_LANGUAGE;
  });

  // Sync document direction whenever language changes
  useEffect(() => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);
    const dir = lang?.dir || 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = useCallback((code) => {
    if (!SUPPORTED_LANGUAGES.some((l) => l.code === code)) return;
    setCurrentLanguage(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
    // Drive the Google Website Translator so the whole page is translated.
    changeGoogleTranslate(code);
  }, []);

  // On first mount, sync React state with the persisted language and re-apply
  // translation through Google's widget (fresh widget on load = clean state).
  useEffect(() => {
    const storedLang = getActiveLanguage();
    if (storedLang !== PAGE_LANGUAGE && SUPPORTED_LANGUAGES.some((l) => l.code === storedLang)) {
      setCurrentLanguage(storedLang);
    }
    restoreGoogleTranslate();
  }, []);

  const currentLangMeta = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        currentLangMeta,
        changeLanguage,
        isRTL: RTL_LANGUAGES.includes(currentLanguage),
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * useLanguage – primary hook for components to read/set the active language.
 */
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside a <LanguageProvider>');
  }
  return ctx;
};

export default LanguageProvider;
