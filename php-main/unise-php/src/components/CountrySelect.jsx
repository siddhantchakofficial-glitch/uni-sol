import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { COUNTRIES } from '../data/countries';

export default function CountrySelect({
  value,
  onChange,
  variant = 'full', // 'full' or 'dialCodeOnly'
  theme = 'light',
  placeholder = 'Select Country...',
  label = 'Country *'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Find selected country by name, code, or dialCode
  const selectedCountry = COUNTRIES.find(
    c => (c.name || '').toLowerCase() === (value || '').toLowerCase() ||
         (c.code || '').toLowerCase() === (value || '').toLowerCase() ||
         (c.dialCode || '') === (value || '')
  ) || COUNTRIES.find(c => c.code === 'AE');

  // Filter countries by name, code, or dial code
  const filtered = COUNTRIES.filter(c => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const dialClean = c.dialCode.replace('+', '');
    const searchClean = q.replace('+', '');
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      dialClean.includes(searchClean)
    );
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (country) => {
    onChange(country);
    setIsOpen(false);
    setSearch('');
  };

  const isDark = theme === 'dark';
  const isCompact = variant === 'dialCodeOnly';

  return (
    <div className={`relative ${isCompact ? 'flex-shrink-0' : 'w-full'}`} ref={dropdownRef}>
      {!isCompact && label && (
        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400 font-semibold' : 'text-slate-700'}`}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      {isCompact ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-full min-h-[46px] px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-1.5 transition ${
            isDark
              ? 'bg-slate-950/90 border-slate-800 text-white hover:border-slate-700 focus:border-blue-500'
              : 'bg-slate-100 border-slate-200 text-slate-900 hover:border-slate-300 focus:border-[#0073b7] focus:bg-white'
          }`}
          style={{ minWidth: '100px' }}
          title={`Country: ${selectedCountry?.name || 'Select'} (${selectedCountry?.dialCode})`}
        >
          <span className="text-base leading-none">{selectedCountry?.flag || '🌐'}</span>
          <span className="font-mono">{selectedCountry?.dialCode || '+971'}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition text-left ${
            isDark
              ? 'bg-slate-950/80 border-slate-800 text-white hover:border-slate-700 focus:border-blue-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300 focus:border-[#0073b7] focus:bg-white'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-lg leading-none">{selectedCountry?.flag || '🌐'}</span>
            <span className="font-medium truncate">{selectedCountry?.name || placeholder}</span>
            <span className={`text-xs px-2 py-0.5 rounded-md font-mono ${
              isDark ? 'bg-slate-800 text-blue-400' : 'bg-slate-200/70 text-slate-600'
            }`}>
              {selectedCountry?.dialCode}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute z-50 mt-2 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-xl animate-fadeIn ${
          isCompact ? 'left-0 w-72 sm:w-80' : 'left-0 right-0'
        } ${
          isDark
            ? 'bg-slate-900/95 border-slate-700 text-slate-100'
            : 'bg-white/98 border-slate-200 text-slate-900'
        }`}>
          {/* Search Box Header */}
          <div className={`p-2.5 border-b ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'}`}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white focus-within:border-blue-500'
                : 'bg-white border-slate-200 text-slate-900 focus-within:border-[#0073b7]'
            }`}>
              <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code (e.g. UAE, +91)..."
                className="w-full bg-transparent border-none outline-none text-xs placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-slate-400 hover:text-slate-200 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching country found for "{search}"
              </div>
            ) : (
              filtered.map((country) => {
                const isSelected = selectedCountry?.code === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                      isSelected
                        ? isDark
                          ? 'bg-blue-600/20 text-blue-400 font-semibold'
                          : 'bg-blue-50 text-[#0073b7] font-semibold'
                        : isDark
                          ? 'hover:bg-slate-800/80 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base leading-none">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {country.dialCode}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
