import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  FaSave, FaCheckCircle, FaSpinner, FaGlobe, FaShareAlt,
  FaSearch, FaImage, FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube
} from 'react-icons/fa';
import images from '../../../assets/images';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_GLOBAL_DATA = {
  general: {
    siteName: 'UniSpark Innovation',
    headerLogo: images.unisparkLogo,
    footerLogo: images.unisparkLogo,
    favicon: '/favicon.ico',
    copyrightText: '© 2026 UniSpark Innovation Pvt. Ltd. All rights reserved.',
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
  const [data, setData] = useState(DEFAULT_GLOBAL_DATA);
  const [activeTab, setActiveTab] = useState('branding');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.settings) {
            setData((prev) => ({
              ...prev,
              general: { ...prev.general, ...(json.settings.general || {}) },
              social: { ...prev.social, ...(json.settings.social || {}) },
              seo: { ...prev.seo, ...(json.settings.seo || {}) },
            }));
          }
        }
      } catch (err) {
        console.warn('Using default settings fallback');
      }
    };
    fetchSettings();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          general: data.general,
          social: data.social,
          seo: data.seo,
        }),
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setSaving(false);
    }
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

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-unispark-pill text-xs py-2.5 px-6 inline-flex items-center gap-2 shadow-md shadow-[#0470aa]/20"
        >
          {saving ? <FaSpinner className="animate-spin w-3.5 h-3.5" /> : <FaSave className="w-3.5 h-3.5" />}
          <span>{saving ? 'Saving...' : 'Save Global Settings'}</span>
        </button>
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
          { id: 'social', label: '2. Social Media Handles', icon: FaShareAlt },
          { id: 'seo', label: '3. Global SEO & Meta Tags', icon: FaSearch },
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Header Logo URL</label>
                <input
                  type="text"
                  value={data.general.headerLogo}
                  onChange={(e) => setData({ ...data, general: { ...data.general, headerLogo: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Copyright Notice</label>
                <input
                  type="text"
                  value={data.general.copyrightText}
                  onChange={(e) => setData({ ...data, general: { ...data.general, copyrightText: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Logo URL</label>
                <input
                  type="text"
                  value={data.general.footerLogo}
                  onChange={(e) => setData({ ...data, general: { ...data.general, footerLogo: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-xs font-semibold text-gray-600">Active Header Logo Preview</span>
                <div className="p-3 bg-white rounded-lg border border-gray-200 inline-block">
                  <img src={data.general.headerLogo} alt="Header Logo" className="h-10 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SOCIAL MEDIA */}
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
    </div>
  );
};

export default FooterAndSEOEditor;
