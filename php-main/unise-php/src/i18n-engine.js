import { useState, useEffect } from 'react';
import translationEN from './locales/en/translation.json';
import translationHI from './locales/hi/translation.json';

const resources = {
  en: translationEN,
  hi: translationHI,
};

const LISTENERS = new Set();

const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('i18nextLng');
    if (saved && (saved === 'hi' || saved === 'en')) return saved;
  }
  return 'en';
};

let currentLanguage = getInitialLang();

const getNestedValue = (obj, path) => {
  if (!obj || !path) return path;
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = curr[part];
    } else {
      return path; // fallback to key
    }
  }
  return curr;
};

export const i18n = {
  language: currentLanguage,
  changeLanguage: (lang) => {
    currentLanguage = lang;
    i18n.language = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lang);
      document.documentElement.lang = lang;
    }
    LISTENERS.forEach((listener) => listener(lang));
    return Promise.resolve(lang);
  },
  use: () => i18n,
  init: () => i18n,
  t: (key) => {
    const dict = resources[currentLanguage] || resources.en;
    const res = getNestedValue(dict, key);
    if (res === key && currentLanguage !== 'en') {
      return getNestedValue(resources.en, key);
    }
    return res;
  }
};

export function useTranslation() {
  const [lang, setLang] = useState(currentLanguage);

  useEffect(() => {
    const handleLanguageChange = (newLang) => {
      setLang(newLang);
    };
    LISTENERS.add(handleLanguageChange);
    return () => {
      LISTENERS.delete(handleLanguageChange);
    };
  }, []);

  const t = (key) => {
    const dict = resources[lang] || resources.en;
    const res = getNestedValue(dict, key);
    if (res === key && lang !== 'en') {
      return getNestedValue(resources.en, key);
    }
    return res;
  };

  return {
    t,
    i18n: {
      ...i18n,
      language: lang,
      changeLanguage: (newLang) => i18n.changeLanguage(newLang)
    }
  };
}

export const initReactI18next = {
  type: '3rdParty',
  init: () => {}
};

export class LanguageDetector {
  constructor() {}
  init() {}
}

export default i18n;
