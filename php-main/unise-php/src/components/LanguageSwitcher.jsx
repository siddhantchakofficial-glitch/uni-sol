import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', label: 'EN' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇦🇪', label: 'AR' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳', label: 'HI' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸', label: 'ES' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷', label: 'FR' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪', label: 'DE' },
  { code: 'zh-CN', name: '中文 (Chinese)', flag: '🇨🇳', label: 'ZH' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵', label: 'JA' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺', label: 'RU' },
  { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹', label: 'PT' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹', label: 'IT' },
  { code: 'tr', name: 'Türkçe (Turkish)', flag: '🇹🇷', label: 'TR' },
  { code: 'ur', name: 'اردو (Urdu)', flag: '🇵🇰', label: 'UR' },
  { code: 'fa', name: 'فارسی (Persian)', flag: '🇮🇷', label: 'FA' },
  { code: 'bn', name: 'বাংলা (Bengali)', flag: '🇧🇩', label: 'BN' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷', label: 'KO' },
  { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱', label: 'NL' },
  { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱', label: 'PL' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', label: 'ID' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)', flag: '🇻🇳', label: 'VI' },
  { code: 'tl', name: 'Tagalog (Filipino)', flag: '🇵🇭', label: 'TL' },
  { code: 'th', name: 'ไทย (Thai)', flag: '🇹🇭', label: 'TH' },
  { code: 'el', name: 'Ελληνικά (Greek)', flag: '🇬🇷', label: 'EL' },
  { code: 'he', name: 'עברית (Hebrew)', flag: '🇮🇱', label: 'HE' },
  { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪', label: 'SV' },
  { code: 'ro', name: 'Română (Romanian)', flag: '🇷🇴', label: 'RO' },
  { code: 'hu', name: 'Magyar (Hungarian)', flag: '🇭🇺', label: 'HU' },
  { code: 'cs', name: 'Čeština (Czech)', flag: '🇨🇿', label: 'CS' },
  { code: 'uk', name: 'Українська (Ukrainian)', flag: '🇺🇦', label: 'UK' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', label: 'MS' },
  { code: 'sw', name: 'Kiswahili (Swahili)', flag: '🇰🇪', label: 'SW' },
];

const LanguageSwitcher = ({ isMobile = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Retrieve saved language from cookie or localStorage
  const getActiveLangCode = () => {
    if (typeof document !== 'undefined') {
      const cookieMatch = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
      if (cookieMatch && cookieMatch[1]) return cookieMatch[1];
    }
    return i18n?.language || 'en';
  };

  const [activeCode, setActiveCode] = useState(getActiveLangCode());

  const currentLanguage = languages.find((lang) => lang.code === activeCode) || languages[0];

  const triggerGoogleTranslate = (langCode) => {
    // 1. Set translation cookies (both domain and default path)
    const host = window.location.hostname;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${host}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    localStorage.setItem('i18nextLng', langCode);
    document.documentElement.lang = langCode;

    // 2. Trigger Google Translate combo select element if available
    const googleCombo = document.querySelector('.goog-te-combo');
    if (googleCombo) {
      googleCombo.value = langCode;
      googleCombo.dispatchEvent(new Event('change'));
    } else {
      // Reload to force cookie translation if element isn't ready
      window.location.reload();
    }
  };

  const handleLanguageChange = (langCode) => {
    setActiveCode(langCode);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(langCode);
    }
    triggerGoogleTranslate(langCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Select Language / भाषा चुनें:</span>
        </div>
        <select
          value={currentLanguage.code}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-medium rounded-lg p-2.5 outline-none focus:border-cyan-400"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 hover:text-white border border-slate-600/60 transition-all text-xs font-medium shadow-sm group"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-base leading-none">{currentLanguage.flag}</span>
        <span className="font-semibold tracking-wide">{currentLanguage.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 pb-2 pt-1 border-b border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>All Languages ({languages.length})</span>
              <span className="text-cyan-400">{currentLanguage.flag} {currentLanguage.label}</span>
            </div>
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-400 transition-colors"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto custom-scrollbar py-1">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                    currentLanguage.code === lang.code
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base shrink-0">{lang.flag}</span>
                    <span className="truncate">{lang.name}</span>
                  </div>
                  {currentLanguage.code === lang.code && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
