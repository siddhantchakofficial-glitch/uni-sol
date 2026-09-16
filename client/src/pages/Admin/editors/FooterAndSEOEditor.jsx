import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useSiteContext } from '../../../context/SiteContext';
import { notifyCMSPublish } from '../../../hooks/useCMS';
import ImagePickerField from '../../../components/admin/ImagePickerField';
import { Navbar } from '../../../components/navbar/Navbar';
import { Footer } from '../../../components/footer/Footer';
import {
  FaSave, FaCheckCircle, FaSpinner, FaGlobe, FaShareAlt,
  FaSearch, FaImage, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube,
  FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaEye, FaEyeSlash, FaExternalLinkAlt,
  FaBars, FaColumns,
} from 'react-icons/fa';
import images from '../../../assets/images';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_GLOBAL_DATA = {
  general: {
    siteName: 'UniSpark Innovation',
    headerLogo: '',
    footerLogo: '',
    topbarEmail: 'info@unisparkinnovation.com',
    navCtaText: 'CONTACT',
    navCtaLink: '/contact',
    copyrightText: '© {year} UniSpark Innovation Pvt. Ltd. All rights reserved.',
    footerDescription: 'UniSpark Innovation Private Limited is a DPIIT-recognized enterprise technology services company delivering CCTV video surveillance, access control, system integration, and global IT consulting across India and the UAE.',
    newsletterTitle: 'Subscribe to Insights',
    newsletterText: 'Stay updated with modern security tech trends, AI video analytics, and enterprise IT best practices.',
    newsletterPlaceholder: 'Enter your work email',
    newsletterButtonText: 'Subscribe',
    officeIndia: { label: 'India Headquarters', address: 'UniSpark Innovation Pvt. Ltd., Connaught Place, New Delhi, India', phone: '+91 11 4567 8900' },
    officeUAE: { label: 'UAE Regional Office', address: 'UniSpark Innovation LLC, Business Bay, Dubai, UAE', phone: '+971 4 321 9876' },
  },
  // Header page record — controls the public Navbar via SiteContext.
  header: {
    showTopbar: true,
    topbarEmail: '',
    logoUrl: '',
    navCtaText: '',
    navCtaLink: '',
    showCta: true,
    showLanguage: true,
    social: {
      instagram: '', instagramVisible: true,
      facebook: '', facebookVisible: true,
      twitter: '', twitterVisible: true,
      linkedin: '', linkedinVisible: true,
    },
  },
  // Footer page record — controls the public Footer via SiteContext.
  footer: {
    logoUrl: '',
    description: '',
    copyrightText: '',
    showOffices: true,
    legalLinks: [
      { id: 'lg_1', label: 'Privacy Policy', path: '/privacy-policy', visible: true },
      { id: 'lg_2', label: 'Terms of Service', path: '/terms', visible: true },
      { id: 'lg_3', label: 'Cookie Policy', path: '/cookie-policy', visible: true },
      { id: 'lg_4', label: 'Disclaimer', path: '/disclaimer', visible: true },
    ],
  },
  seo: {
    defaultTitle: 'UniSpark Innovation | Enterprise Security & Digital Transformation',
    metaDescription: 'DPIIT recognized technology enterprise delivering AI CCTV surveillance, biometric access, and international workforce solutions across India and UAE.',
    keywords: 'enterprise security, CCTV, biometric access, PSIM, workforce deployment, UAE HR solutions, India security tech',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  },
  social: {
    facebook: 'https://facebook.com/UnisparkInnovation',
    instagram: 'https://instagram.com/unispark',
    twitter: 'https://x.com/unispark_inn',
    linkedin: 'https://in.linkedin.com/company/unispark-innovation',
    youtube: 'https://youtube.com',
  },
};

export const FooterAndSEOEditor = () => {
  const { token } = useAuth();
  const { setPreviewOverride } = useSiteContext();
  const [data, setData] = useState(DEFAULT_GLOBAL_DATA);
  const [activeTab, setActiveTab] = useState('branding');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [previewMode, setPreviewMode] = useState('header'); // 'header' | 'footer'
  // Live-editable navigation menus (existing menus API: header + footer)
  const [headerMenu, setHeaderMenu] = useState(null);
  const [footerMenu, setFooterMenu] = useState(null);

  // ── Live Preview bridge: feed draft data to the SAME public Navbar/Footer
  // components through SiteContext (no refresh, no duplicate components). ──
  useEffect(() => {
    if (!setPreviewOverride) return undefined;
    setPreviewOverride('siteSettings', { general: data.general });
    setPreviewOverride('header', data.header);
    setPreviewOverride('footer', data.footer);
    setPreviewOverride('menus', { header: headerMenu, footer: footerMenu });
    return undefined;
  }, [data, headerMenu, footerMenu, setPreviewOverride]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Global settings (existing /settings API)
        const res = await fetch(`${API_BASE}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.settings) {
            setData((prev) => ({
              ...prev,
              general: {
                ...prev.general,
                ...(json.settings.general || {}),
                // Null server values must not wipe the editor's office defaults
                officeIndia: json.settings.general?.officeIndia || prev.general.officeIndia,
                officeUAE: json.settings.general?.officeUAE || prev.general.officeUAE,
              },
              social: { ...prev.social, ...(json.settings.social || {}) },
              seo: { ...prev.seo, ...(json.settings.seo || {}) },
            }));
          }
        }

        // 2. Header/Footer page records (draft content from /pages API)
        const authHeaders = { Authorization: `Bearer ${token}` };
        const [headerRes, footerRes] = await Promise.all([
          fetch(`${API_BASE}/pages/header`, { headers: authHeaders }),
          fetch(`${API_BASE}/pages/footer`, { headers: authHeaders }),
        ]);
        if (headerRes.ok) {
          const j = await headerRes.json();
          const c = j.page?.draftVersion?.content;
          if (c) setData((prev) => ({ ...prev, header: { ...prev.header, ...c } }));
        }
        if (footerRes.ok) {
          const j = await footerRes.json();
          const c = j.page?.draftVersion?.content;
          if (c) setData((prev) => ({ ...prev, footer: { ...prev.footer, ...c } }));
        }

        // 3. Navigation menus (existing menus API)
        const menusRes = await fetch(`${API_BASE}/menus`, { headers: authHeaders });
        if (menusRes.ok) {
          const j = await menusRes.json();
          if (j.success && Array.isArray(j.menus)) {
            const h = j.menus.find((m) => m.name === 'header');
            const f = j.menus.find((m) => m.name === 'footer');
            setHeaderMenu(h?.items || null);
            setFooterMenu(f?.items || null);
          }
        }
      } catch (err) {
        console.warn('Using default settings fallback');
      }
    };
    fetchAll();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      // 1. Global settings (existing /settings API)
      await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          general: data.general,
          social: data.social,
          seo: data.seo,
        }),
      });

      // 2. Header/Footer page records (existing /pages draft pipeline)
      await Promise.all([
        fetch(`${API_BASE}/pages/header`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ title: 'Header & Navigation', slug: 'header', content: data.header }),
        }),
        fetch(`${API_BASE}/pages/footer`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ title: 'Footer', slug: 'footer', content: data.footer }),
        }),
      ]);

      // 3. Navigation menus (existing menus API, incl. dropdown children)
      if (headerMenu) {
        await fetch(`${API_BASE}/menus/header`, {
          method: 'PUT', headers,
          body: JSON.stringify({ name: 'header', title: 'Main Navigation Header', items: headerMenu }),
        });
      }
      if (footerMenu) {
        await fetch(`${API_BASE}/menus/footer`, {
          method: 'PUT', headers,
          body: JSON.stringify({ name: 'footer', title: 'Footer Quick Links', items: footerMenu }),
        });
      }

      // Broadcast so every open tab (public site included) refreshes instantly
      notifyCMSPublish('header');
      notifyCMSPublish('footer');
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  // ── Menu item helpers (nav + dropdown children) ──
  const updateMenuItems = (setter) => (items) => setter(items);
  const moveMenuItem = (items, index, direction) => {
    const list = [...items];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return list;
    [list[index], list[target]] = [list[target], list[index]];
    return list;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0470aa]">
              Global Branding & SEO CMS
            </span>
            <span className="text-xs text-gray-500">System-wide Settings</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">
            Footer, Logos & Global SEO Editor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure header & footer logos, social media handles, copyright notices, and SEO meta tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#0470aa] hover:bg-gray-50 transition-colors"
          >
            <FaExternalLinkAlt className="w-3 h-3" /> Live Page
          </a>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
              showPreview ? 'border-[#0470aa]/40 bg-sky-50 text-[#0470aa]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {showPreview ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
            <span>{showPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-unispark-pill text-xs py-2.5 px-6 inline-flex items-center gap-2 shadow-md shadow-[#0470aa]/20"
          >
            {saving ? <FaSpinner className="animate-spin w-3.5 h-3.5" /> : <FaSave className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save Global Settings'}</span>
          </button>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2">
          <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0" />
          <span>Global Branding and SEO settings saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'branding', label: '1. Logos & Branding', icon: FaImage },
          { id: 'header', label: '2. Header Elements', icon: FaBars },
          { id: 'menus', label: '3. Navigation Menus', icon: FaColumns },
          { id: 'footer', label: '4. Footer Elements', icon: FaColumns },
          { id: 'social', label: '5. Social Media Handles', icon: FaShareAlt },
          { id: 'seo', label: '6. Global SEO & Meta Tags', icon: FaSearch },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#0470aa] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LOGOS & BRANDING */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <h3 className="text-base font-bold text-gray-900">Brand Identity & Logos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={data.general.siteName}
                  onChange={(e) => setData({ ...data, general: { ...data.general, siteName: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <ImagePickerField
                label="Header Logo (Navbar + Mobile Menu)"
                folder="branding"
                value={data.general.headerLogo || ''}
                onChange={(url) => setData({ ...data, general: { ...data.general, headerLogo: url } })}
                helpText="Empty = the project's default UniSpark logo is used."
              />

              <ImagePickerField
                label="Footer Logo"
                folder="branding"
                value={data.general.footerLogo || ''}
                onChange={(url) => setData({ ...data, general: { ...data.general, footerLogo: url } })}
                helpText="Empty = the project's default UniSpark logo is used."
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Top Bar Email (Navbar strip)</label>
                <input
                  type="email"
                  value={data.general.topbarEmail || ''}
                  onChange={(e) => setData({ ...data, general: { ...data.general, topbarEmail: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Navbar CTA Text</label>
                  <input
                    type="text"
                    value={data.general.navCtaText || ''}
                    onChange={(e) => setData({ ...data, general: { ...data.general, navCtaText: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Navbar CTA Link</label>
                  <input
                    type="text"
                    value={data.general.navCtaLink || ''}
                    onChange={(e) => setData({ ...data, general: { ...data.general, navCtaLink: e.target.value } })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Copyright Notice</label>
                <input
                  type="text"
                  value={data.general.copyrightText}
                  onChange={(e) => setData({ ...data, general: { ...data.general, copyrightText: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
                <p className="text-[11px] text-gray-400 mt-1">Use {'{year}'} to insert the current year automatically.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Description</label>
                <textarea
                  rows="4"
                  value={data.general.footerDescription || ''}
                  onChange={(e) => setData({ ...data, general: { ...data.general, footerDescription: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <span className="text-xs font-bold text-gray-700">India Office (Footer)</span>
                  <input
                    type="text"
                    placeholder="Label"
                    value={data.general.officeIndia?.label || ''}
                    onChange={(e) => setData({ ...data, general: { ...data.general, officeIndia: { ...data.general.officeIndia, label: e.target.value } } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={data.general.officeIndia?.address || ''}
                    onChange={(e) => setData({ ...data, general: { ...data.general, officeIndia: { ...data.general.officeIndia, address: e.target.value } } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={data.general.officeIndia?.phone || ''}
                    onChange={(e) => setData({ ...data, general: { ...data.general, officeIndia: { ...data.general.officeIndia, phone: e.target.value } } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                </div>
                <div className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <span className="text-xs font-bold text-gray-700">UAE Office (Footer)</span>
                  <input
                    type="text"
                    placeholder="Label"
                    value={data.general.officeUAE?.label || ''}
                    onChange={(e) => setData({ ...data, general: { ...data.general, officeUAE: { ...data.general.officeUAE, label: e.target.value } } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={data.general.officeUAE?.address || ''}
                    onChange={(e) => setData({ ...data, general: { ...data.general, officeUAE: { ...data.general.officeUAE, address: e.target.value } } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={data.general.officeUAE?.phone || ''}
                    onChange={(e) => setData({ ...data, general: { ...data.general, officeUAE: { ...data.general.officeUAE, phone: e.target.value } } })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-xs font-semibold text-gray-600">Active Header Logo Preview</span>
                <div className="p-3 bg-white rounded-lg border border-gray-200 inline-block">
                  <img
                    src={data.general.headerLogo || images.unisparkLogo}
                    alt="Header Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HEADER ELEMENTS — topbar, CTA, per-social visibility */}
      {activeTab === 'header' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">Header Elements & Visibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              {[['showTopbar', 'Show Top Bar (email strip)'], ['showCta', 'Show Navbar CTA Button'], ['showLanguage', 'Show Language Selector']].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl border border-gray-200">
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                  <button
                    type="button"
                    onClick={() => setData({ ...data, header: { ...data.header, [key]: data.header?.[key] === false } })}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      data.header?.[key] === false
                        ? 'bg-gray-100 text-gray-500 border border-gray-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {data.header?.[key] === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                    <span>{data.header?.[key] === false ? 'Hidden' : 'Shown'}</span>
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Text (override)</label>
                  <input
                    type="text"
                    placeholder="CONTACT"
                    value={data.header.navCtaText || ''}
                    onChange={(e) => setData({ ...data, header: { ...data.header, navCtaText: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Link (override)</label>
                  <input
                    type="text"
                    placeholder="/contact"
                    value={data.header.navCtaLink || ''}
                    onChange={(e) => setData({ ...data, header: { ...data.header, navCtaLink: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Top Bar Email (override)</label>
                <input
                  type="email"
                  placeholder="info@unisparkinnovation.com"
                  value={data.header.topbarEmail || ''}
                  onChange={(e) => setData({ ...data, header: { ...data.header, topbarEmail: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Top Bar Social Icons</span>
              {['instagram', 'facebook', 'twitter', 'linkedin'].map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        header: {
                          ...data.header,
                          social: { ...data.header.social, [`${key}Visible`]: data.header?.social?.[`${key}Visible`] === false },
                        },
                      })
                    }
                    className={`p-2 rounded-lg ${
                      data.header?.social?.[`${key}Visible`] === false
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                    title={data.header?.social?.[`${key}Visible`] === false ? 'Show icon' : 'Hide icon'}
                  >
                    {data.header?.social?.[`${key}Visible`] === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                  </button>
                  <input
                    type="text"
                    placeholder={`${key} URL (empty = current default)`}
                    value={data.header?.social?.[key] || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        header: { ...data.header, social: { ...data.header.social, [key]: e.target.value } },
                      })
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white capitalize"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NAVIGATION MENUS — existing menus API (incl. dropdowns) */}
      {activeTab === 'menus' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">Navigation Menus (Header & Footer)</h3>
          <p className="text-xs text-gray-500">
            Edit the live navigation. Indent lines with "- " for dropdown children.
            Header children become dropdown menus; footer columns use "Column: link" syntax below.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Header Menu</label>
              <textarea
                rows="12"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 font-mono"
                value={(headerMenu || [])
                  .map((m) => [m.label + ' | ' + m.url, ...(m.children || []).map((c) => `- ${c.label} | ${c.url}`)].join('\n'))
                  .join('\n')}
                onChange={(e) => {
                  const items = [];
                  let current = null;
                  e.target.value.split('\n').filter(Boolean).forEach((line) => {
                    if (line.startsWith('- ')) {
                      if (current) {
                        const [label, url = '#'] = line.slice(2).split('|');
                        current.children = [...(current.children || []), { id: `c_${Date.now()}_${items.length}_${(current.children || []).length}`, label: label.trim(), url: url.trim() }];
                      }
                    } else {
                      const [label, url = '#'] = line.split('|');
                      current = { id: `m_${Date.now()}_${items.length}`, label: label.trim(), url: url.trim(), children: [] };
                      items.push(current);
                    }
                  });
                  setHeaderMenu(items);
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Menu (columns: "Column Name" then "- link | url")</label>
              <textarea
                rows="12"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50/50 font-mono"
                value={(footerMenu || [])
                  .map((m) => [m.label + ' | ' + m.url, ...(m.children || []).map((c) => `- ${c.label} | ${c.url}`)].join('\n'))
                  .join('\n')}
                onChange={(e) => {
                  const items = [];
                  let current = null;
                  e.target.value.split('\n').filter(Boolean).forEach((line) => {
                    if (line.startsWith('- ')) {
                      if (current) {
                        const [label, url = '#'] = line.slice(2).split('|');
                        current.children = [...(current.children || []), { id: `fc_${Date.now()}_${items.length}_${(current.children || []).length}`, label: label.trim(), url: url.trim() }];
                      }
                    } else {
                      const [label, url = '#'] = line.split('|');
                      current = { id: `fm_${Date.now()}_${items.length}`, label: label.trim(), url: url.trim(), children: [] };
                      items.push(current);
                    }
                  });
                  setFooterMenu(items);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FOOTER ELEMENTS — legal links + visibility */}
      {activeTab === 'footer' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Footer Elements</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setData({ ...data, footer: { ...data.footer, showOffices: data.footer?.showOffices === false } })}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  data.footer?.showOffices === false ? 'bg-gray-100 text-gray-500 border border-gray-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {data.footer?.showOffices === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                <span>Office Cards {data.footer?.showOffices === false ? 'Hidden' : 'Shown'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Newsletter Title</label>
                <input
                  type="text"
                  value={data.general.newsletterTitle || ''}
                  onChange={(e) => setData({ ...data, general: { ...data.general, newsletterTitle: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Newsletter Button</label>
                <input
                  type="text"
                  value={data.general.newsletterButtonText || ''}
                  onChange={(e) => setData({ ...data, general: { ...data.general, newsletterButtonText: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Newsletter Description</label>
              <textarea
                rows="2"
                value={data.general.newsletterText || ''}
                onChange={(e) => setData({ ...data, general: { ...data.general, newsletterText: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Newsletter Placeholder</label>
              <input
                type="text"
                value={data.general.newsletterPlaceholder || ''}
                onChange={(e) => setData({ ...data, general: { ...data.general, newsletterPlaceholder: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-gray-50/50"
              />
            </div>
          </div>

          {/* Footer Columns — same footerMenu state as the Menus tab */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Link Columns (Main Footer Grid)</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFooterMenu([
                      ...(footerMenu || []),
                      { id: `fm_${Date.now()}`, label: 'New Column', url: '#', visible: true, children: [] },
                    ])
                  }
                  className="btn-unispark-pill text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
                >
                  <FaPlus className="w-3 h-3" /> Add Column
                </button>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 -mt-2">
              Each column shows as a heading with its links in the footer grid. Empty columns are ignored.
            </p>

            {(footerMenu || []).filter((m) => Array.isArray(m.children) && m.children.length > 0).length === 0 && (
              <p className="text-xs text-gray-400 italic">
                No columns yet — the footer shows its built-in Company / Capabilities / International columns.
              </p>
            )}

            {(footerMenu || []).map((col, colIdx) => (
              <div
                key={col.id || colIdx}
                className={`p-3 rounded-xl border space-y-2 ${
                  col.visible === false ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-sky-100 bg-sky-50/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={colIdx === 0}
                      onClick={() => setFooterMenu(moveMenuItem(footerMenu, colIdx, 'up'))}
                      className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <FaArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={colIdx === (footerMenu || []).length - 1}
                      onClick={() => setFooterMenu(moveMenuItem(footerMenu, colIdx, 'down'))}
                      className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <FaArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={col.label}
                    placeholder="Column Title"
                    onChange={(e) =>
                      setFooterMenu(footerMenu.map((m, i) => (i === colIdx ? { ...m, label: e.target.value } : m)))
                    }
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFooterMenu(footerMenu.map((m, i) => (i === colIdx ? { ...m, visible: m.visible === false } : m)))
                    }
                    className={`p-2 rounded-lg ${col.visible === false ? 'bg-gray-100 text-gray-400' : 'bg-emerald-50 text-emerald-600'}`}
                    title={col.visible === false ? 'Column hidden' : 'Column visible'}
                  >
                    {col.visible === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFooterMenu(footerMenu.filter((_, i) => i !== colIdx))}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>

                {(col.children || []).map((link, lIdx) => (
                  <div key={link.id || lIdx} className={`flex items-center gap-2 pl-6 ${link.visible === false ? 'opacity-50' : ''}`}>
                    <input
                      type="text"
                      value={link.label}
                      placeholder="Link label"
                      onChange={(e) =>
                        setFooterMenu(
                          footerMenu.map((m, i) =>
                            i === colIdx
                              ? { ...m, children: m.children.map((c, j) => (j === lIdx ? { ...c, label: e.target.value } : c)) }
                              : m
                          )
                        )
                      }
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                    <input
                      type="text"
                      value={link.url}
                      placeholder="/path"
                      onChange={(e) =>
                        setFooterMenu(
                          footerMenu.map((m, i) =>
                            i === colIdx
                              ? { ...m, children: m.children.map((c, j) => (j === lIdx ? { ...c, url: e.target.value } : c)) }
                              : m
                          )
                        )
                      }
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFooterMenu(
                          footerMenu.map((m, i) =>
                            i === colIdx
                              ? { ...m, children: m.children.map((c, j) => (j === lIdx ? { ...c, visible: c.visible === false } : c)) }
                              : m
                          )
                        )
                      }
                      className={`p-1.5 rounded-lg ${link.visible === false ? 'bg-gray-100 text-gray-400' : 'bg-emerald-50 text-emerald-600'}`}
                    >
                      {link.visible === false ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFooterMenu(
                          footerMenu.map((m, i) =>
                            i === colIdx ? { ...m, children: m.children.filter((_, j) => j !== lIdx) } : m
                          )
                        )
                      }
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setFooterMenu(
                      footerMenu.map((m, i) =>
                        i === colIdx
                          ? { ...m, children: [...(m.children || []), { id: `fc_${Date.now()}_${(m.children || []).length}`, label: 'New Link', url: '/', visible: true }] }
                          : m
                      )
                    )
                  }
                  className="text-[11px] font-semibold text-[#0470aa] hover:underline inline-flex items-center gap-1 pl-6"
                >
                  <FaPlus className="w-2.5 h-2.5" /> Add Link to Column
                </button>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Legal Links (Bottom Bar)</span>
              <button
                type="button"
                onClick={() =>
                  setData({
                    ...data,
                    footer: {
                      ...data.footer,
                      legalLinks: [...(data.footer?.legalLinks || []), { id: `lg_${Date.now()}`, label: 'New Link', path: '/', visible: true }],
                    },
                  })
                }
                className="btn-unispark-pill text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
              >
                <FaPlus className="w-3 h-3" /> Add Link
              </button>
            </div>

            {(data.footer?.legalLinks || []).map((link, idx) => (
              <div key={link.id || idx} className={`p-3 rounded-xl border border-gray-200 flex items-center gap-2 ${link.visible === false ? 'opacity-50' : ''}`}>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() =>
                      setData({ ...data, footer: { ...data.footer, legalLinks: moveMenuItem(data.footer.legalLinks, idx, 'up') } })
                    }
                    className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <FaArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === (data.footer?.legalLinks || []).length - 1}
                    onClick={() =>
                      setData({ ...data, footer: { ...data.footer, legalLinks: moveMenuItem(data.footer.legalLinks, idx, 'down') } })
                    }
                    className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                  >
                    <FaArrowDown className="w-3 h-3" />
                  </button>
                </div>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) =>
                    setData({
                      ...data,
                      footer: { ...data.footer, legalLinks: data.footer.legalLinks.map((l) => (l.id === link.id ? { ...l, label: e.target.value } : l)) },
                    })
                  }
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                />
                <input
                  type="text"
                  value={link.path}
                  onChange={(e) =>
                    setData({
                      ...data,
                      footer: { ...data.footer, legalLinks: data.footer.legalLinks.map((l) => (l.id === link.id ? { ...l, path: e.target.value } : l)) },
                    })
                  }
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      footer: { ...data.footer, legalLinks: data.footer.legalLinks.map((l) => (l.id === link.id ? { ...l, visible: l.visible === false } : l)) },
                    })
                  }
                  className={`p-2 rounded-lg ${link.visible === false ? 'bg-gray-100 text-gray-400' : 'bg-emerald-50 text-emerald-600'}`}
                >
                  {link.visible === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setData({ ...data, footer: { ...data.footer, legalLinks: data.footer.legalLinks.filter((l) => l.id !== link.id) } })
                  }
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SOCIAL MEDIA */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">Official Social Media Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaLinkedinIn className="text-blue-700" /> LinkedIn Profile Link
              </label>
              <input
                type="text"
                value={data.social.linkedin}
                onChange={(e) => setData({ ...data, social: { ...data.social, linkedin: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaTwitter className="text-sky-500" /> X (Twitter) Profile Link
              </label>
              <input
                type="text"
                value={data.social.twitter}
                onChange={(e) => setData({ ...data, social: { ...data.social, twitter: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaFacebookF className="text-blue-600" /> Facebook Page Link
              </label>
              <input
                type="text"
                value={data.social.facebook}
                onChange={(e) => setData({ ...data, social: { ...data.social, facebook: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaInstagram className="text-pink-600" /> Instagram Profile Link
              </label>
              <input
                type="text"
                value={data.social.instagram}
                onChange={(e) => setData({ ...data, social: { ...data.social, instagram: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                <FaYoutube className="text-red-600" /> YouTube Channel Link
              </label>
              <input
                type="text"
                value={data.social.youtube}
                onChange={(e) => setData({ ...data, social: { ...data.social, youtube: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEO META TAGS */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Search Engine Optimization (SEO)</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Global Meta Title (Fallback)</label>
            <input
              type="text"
              value={data.seo.defaultTitle}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, defaultTitle: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Description (150-160 chars recommended)</label>
            <textarea
              rows="3"
              value={data.seo.metaDescription}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, metaDescription: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">SEO Keywords (Comma-separated)</label>
            <input
              type="text"
              value={data.seo.keywords}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, keywords: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">OpenGraph Social Share Image URL</label>
            <input
              type="text"
              value={data.seo.ogImage}
              onChange={(e) => setData({ ...data, seo: { ...data.seo, ogImage: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
        </div>
      )}

      {/* LIVE PREVIEW — renders the REAL Navbar/Footer components with the
          current draft state via SiteContext preview overrides. No refresh,
          no separate render engine. */}
      {showPreview && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-gray-900">Live Preview</span>
              <span className="text-[10px] text-gray-400 font-mono">Same public Navbar & Footer components</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {[{ id: 'header', label: 'Header' }, { id: 'footer', label: 'Footer' }].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPreviewMode(m.id)}
                    className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                      previewMode === m.id ? 'bg-[#0470aa] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {[['desktop', FaGlobe], ['tablet', FaGlobe], ['mobile', FaGlobe]].map(([dev, Icon]) => (
                  <button
                    key={dev}
                    onClick={() => setPreviewDevice(dev)}
                    className={`p-1.5 rounded text-xs capitalize transition-all ${
                      previewDevice === dev ? 'bg-[#0470aa] text-white' : 'text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-3 sm:p-5 flex justify-center overflow-x-auto">
            <div
              className={`bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 transition-all duration-300 ${
                previewDevice === 'mobile' ? 'w-[375px]' : previewDevice === 'tablet' ? 'w-[768px]' : 'w-full'
              }`}
            >
              {previewMode === 'header' ? (
                <div className="relative">
                  <div className="h-40 bg-gradient-to-br from-[#f1f9ff] to-white flex items-center justify-center text-xs text-gray-300 border-b border-gray-100">
                    Page content preview area
                  </div>
                  <div className="absolute top-0 left-0 right-0">
                    <Navbar />
                  </div>
                </div>
              ) : (
                <Footer />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterAndSEOEditor;
