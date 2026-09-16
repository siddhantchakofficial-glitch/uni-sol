import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaGlobe, FaCheck, FaChevronDown, FaSearch } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

/**
 * LanguageSelector – accessible dropdown for switching between 32 languages.
 * Props:
 *  - compact: boolean – if true, shows only globe icon + code (for navbar tight spaces)
 */
export const LanguageSelector = ({ compact = false }) => {
  const { currentLanguage, currentLangMeta, changeLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Auto-focus search when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = useCallback((code) => {
    changeLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  }, [changeLanguage]);

  const filteredLanguages = searchQuery.trim()
    ? supportedLanguages.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : supportedLanguages;

  return (
    <div className="relative notranslate" translate="no" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="language-selector-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Language: ${currentLangMeta.name}. Click to change language.`}
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all text-xs font-semibold ${
          compact
            ? 'px-2 py-1 border-gray-200 bg-gray-50 text-gray-700 hover:border-[#0470aa]/40 hover:bg-sky-50/60 hover:text-[#0470aa]'
            : 'px-3 py-1.5 border-gray-200 bg-white text-gray-700 hover:border-[#0470aa]/50 hover:bg-sky-50/60 hover:text-[#0470aa] shadow-xs'
        }`}
      >
        <FaGlobe className="w-3 h-3 text-[#0470aa] flex-shrink-0" />
        <span className="uppercase tracking-wider">{currentLanguage}</span>
        {!compact && (
          <span className="text-gray-500 font-normal hidden sm:inline">{currentLangMeta.nativeName}</span>
        )}
        <FaChevronDown
          className={`w-2.5 h-2.5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in"
          style={{ maxHeight: '380px' }}
        >
          {/* Search */}
          <div className="p-2.5 border-b border-gray-100 bg-gray-50/80">
            <div className="relative">
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language…"
                aria-label="Search languages"
                className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-[#0470aa]/50 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Language List */}
          <div className="overflow-y-auto" style={{ maxHeight: '304px' }}>
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400">No languages found</div>
            ) : (
              filteredLanguages.map((lang) => {
                const isActive = lang.code === currentLanguage;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-sky-50 ${
                      isActive ? 'bg-sky-50/80 text-[#0470aa]' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex flex-col">
                      <span className={`font-semibold ${isActive ? 'text-[#0470aa]' : 'text-gray-800'}`}>
                        {lang.nativeName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">{lang.name}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-[#0470aa]/10 text-[#0470aa]'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {lang.code}
                      </span>
                      {isActive && <FaCheck className="w-3 h-3 text-[#0470aa]" />}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-3.5 py-2 border-t border-gray-100 bg-gray-50/60 text-[10px] text-gray-400 text-center">
            {supportedLanguages.length} languages supported
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
