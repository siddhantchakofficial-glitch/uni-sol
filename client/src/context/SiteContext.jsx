import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ENV } from '../config/env';

const SiteContext = createContext();
const API_BASE = ENV.API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_SETTINGS = {
  general: {
    siteName: ENV.SITE_NAME || 'UniSpark Innovation',
    logo: '/assets/logo.png',
    favicon: '/favicon.svg',
    contactEmail: ENV.CONTACT_EMAIL || 'info@unisparkinnovation.com',
    phone: ENV.CONTACT_PHONE_INDIA || '+91 11 4567 8900',
    address: ENV.ADDRESS_INDIA || 'Connaught Place, New Delhi, India',
  },
  social: {
    instagram: 'https://instagram.com/unispark',
    facebook: 'https://facebook.com/unispark',
    linkedin: 'https://linkedin.com/company/unispark',
    youtube: 'https://youtube.com',
    x: 'https://x.com/unispark',
  },
  branding: {
    primaryColor: '#0284c7',
  },
};

export const SiteProvider = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [siteSettings, setSiteSettings] = useState(DEFAULT_SETTINGS);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/public`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSiteSettings((prev) => ({
            ...prev,
            ...data.settings,
            general: { ...prev.general, ...(data.settings.general || {}) },
            social: { ...prev.social, ...(data.settings.social || {}) },
            branding: { ...prev.branding, ...(data.settings.branding || {}) },
          }));
        }
      }
    } catch {
      // Graceful fallback to default settings
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <SiteContext.Provider
      value={{
        mobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        consultationModalOpen,
        setConsultationModalOpen,
        searchOpen,
        setSearchOpen,
        toast,
        showToast,
        siteSettings,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};
