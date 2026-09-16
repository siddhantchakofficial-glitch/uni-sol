import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { COUNTRIES } from '../data/countries';

export default function CountrySelect({
  value,
  onChange,
  variant = 'full', // 'full' or 'dialCodeOnly'
  placeholder = 'Select Country...',
  label = 'Country'
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

  const isCompact = variant === 'dialCodeOnly';

  return (
    <div className={`country-select-container ${isCompact ? 'compact' : 'full'}`} ref={dropdownRef} style={{ position: 'relative', width: isCompact ? 'auto' : '100%' }}>
      {!isCompact && label && (
        <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      {isCompact ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="form-control"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            padding: '0.6rem 0.85rem',
            cursor: 'pointer',
            minWidth: '105px',
            height: '100%',
            fontWeight: 600,
            fontSize: '0.85rem',
            background: 'var(--bg-input)',
            borderColor: isOpen ? 'var(--primary)' : 'var(--border-color)',
            color: 'var(--text-main)'
          }}
          title={`Country: ${selectedCountry?.name || 'Select'} (${selectedCountry?.dialCode})`}
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{selectedCountry?.flag || '🌐'}</span>
          <span style={{ fontFamily: 'monospace' }}>{selectedCountry?.dialCode || '+971'}</span>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="form-control"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 1rem',
            cursor: 'pointer',
            width: '100%',
            background: 'var(--bg-input)',
            borderColor: isOpen ? 'var(--primary)' : 'var(--border-color)',
            color: 'var(--text-main)',
            fontSize: '0.9rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{selectedCountry?.flag || '🌐'}</span>
            <span style={{ fontWeight: 500 }}>{selectedCountry?.name || placeholder}</span>
            <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'var(--bg-hover)', color: 'var(--primary)', fontFamily: 'monospace' }}>
              {selectedCountry?.dialCode}
            </span>
          </div>
          <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
        </button>
      )}

      {/* Searchable Dropdown Popup */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: isCompact ? 'auto' : 0,
          width: isCompact ? '320px' : '100%',
          zIndex: 1000,
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          {/* Search Header */}
          <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.75rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)'
            }}>
              <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code (e.g. UAE, +91, Saudi)..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem'
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* List of Countries */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '0.4rem' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No country found for "{search}"
              </div>
            ) : (
              filtered.map((country) => {
                const isSelected = selectedCountry?.code === country.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: isSelected ? 'var(--primary-light)' : 'transparent',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.825rem',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{country.flag}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{country.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', background: 'var(--bg-input)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                        {country.dialCode}
                      </span>
                      {isSelected && <Check size={14} style={{ color: 'var(--primary)' }} />}
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
