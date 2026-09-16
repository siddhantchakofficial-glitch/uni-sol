import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ENV } from '../config/env';

const SiteContext = createContext();
const API_BASE = ENV.API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_SETTINGS = {
  general: {
    siteName: ENV.SITE_NAME || 'UniSpark Innovation',
    logo: '/assets/images/unispark-logo.png',
    favicon: '/favicon.ico',
    contactEmail: ENV.CONTACT_EMAIL || 'info@unisparkinnovation.com',
    phone: ENV.CONTACT_PHONE_INDIA || '+91 11 4567 8900',
    address: ENV.ADDRESS_INDIA || 'Connaught Place, New Delhi, India',
    copyrightText: '© 2026 UniSpark Innovation Pvt. Ltd. All rights reserved.',
  },
  social: {
    instagram: 'https://instagram.com/unispark',
    facebook: 'https://facebook.com/UnisparkInnovation',
    linkedin: 'https://in.linkedin.com/company/unispark-innovation',
    youtube: 'https://youtube.com',
    x: 'https://x.com/unispark_inn',
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
  const [menus, setMenus] = useState({ header: null, footer: null });

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/public?_t=${Date.now()}`, {
        cache: 'no-cache',
      });
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

  const fetchMenus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/menus/public?_t=${Date.now()}`, {
        cache: 'no-cache',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.menus)) {
          const header = data.menus.find((m) => m.name === 'header');
          const footer = data.menus.find((m) => m.name === 'footer');
          setMenus({
            header: header?.items || null,
            footer: footer?.items || null,
          });
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchSettings();
    fetchMenus();
  }, [fetchSettings, fetchMenus]);

  useEffect(() => {
    refreshAll();

    const handleFocus = () => refreshAll();
    window.addEventListener('focus', handleFocus);

    const handleStorage = (e) => {
      if (e.key === 'unisol_cms_update') {
        refreshAll();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshAll]);

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
        menus,
        refreshSettings: refreshAll,
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

export default SiteContext;
