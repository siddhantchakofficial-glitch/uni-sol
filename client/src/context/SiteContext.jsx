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
  // Full CMS content for the `header` and `footer` page records (nav links,
  // dropdowns, CTA, columns, visibility). Fetched from the same
  // /api/pages/public/:slug pipeline every other page uses.
  const [headerContent, setHeaderContent] = useState(null);
  const [footerContent, setFooterContent] = useState(null);
  // Live Preview override — when an admin editor registers draft data, the
  // same public components render the DRAFT instead of published content.
  const [previewOverrides, setPreviewOverrides] = useState({});

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

  const fetchPageContent = useCallback(async (slug, setter) => {
    try {
      const res = await fetch(`${API_BASE}/pages/public/${slug}?_t=${Date.now()}`, {
        cache: 'no-cache',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.page?.content) setter(json.page.content);
      }
    } catch {
      // Keep existing/default content on failure
    }
  }, []);

  const refreshAll = useCallback(() => {
    fetchSettings();
    fetchMenus();
    fetchPageContent('header', setHeaderContent);
    fetchPageContent('footer', setFooterContent);
  }, [fetchSettings, fetchMenus, fetchPageContent]);

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

    // Cross-tab/same-tab instant refresh when a CMS editor saves or publishes
    // (notifyCMSPublish broadcasts on this channel).
    let channel;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('unisol_cms_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'PUBLISH') refreshAll();
        };
      }
    } catch {
      // Fallback
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      if (channel) channel.close();
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

  // Live Preview: editors call these to render draft header/footer/footer
  // settings through the same public components (no refresh, no duplicates).
  const setPreviewOverride = useCallback((key, value) => {
    setPreviewOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

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
        siteSettings: previewOverrides.siteSettings || siteSettings,
        menus: previewOverrides.menus || menus,
        headerContent: previewOverrides.header || headerContent,
        footerContent: previewOverrides.footer || footerContent,
        refreshSettings: refreshAll,
        setPreviewOverride,
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
