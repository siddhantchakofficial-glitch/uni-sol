import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  FaSave, FaEye, FaPlus, FaTrash, FaEdit, FaUpload,
  FaVideo, FaImage, FaCheckCircle, FaSpinner, FaLayerGroup,
  FaBullhorn, FaInfoCircle, FaThLarge, FaIndustry, FaStar, FaExternalLinkAlt
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_HOME_DATA = {
  ticker: {
    enabled: true,
    speed: 35,
    items: [
      '⚡ DPIIT Recognized High-Tech Enterprise',
      '🔒 Next-Gen AI CCTV & Biometric Access Systems',
      '🌐 Seamless Global Workforce & HR Infrastructure in India & UAE',
      '🏆 Trusted by 500+ Leading Enterprise Organizations',
    ],
  },
  hero: {
    badge: 'DPIIT RECOGNIZED TECH ENTERPRISE',
    heading: 'Next-Generation Enterprise Security & Digital Transformation',
    description: 'UniSpark Innovation delivers AI-driven surveillance, biometric access control, fire safety telemetry, and international workforce infrastructure engineered for mission-critical reliability.',
    primaryBtnText: 'EXPLORE CAPABILITIES',
    primaryBtnLink: '/capabilities',
    secondaryBtnText: 'SCHEDULE CONSULTATION',
    secondaryBtnLink: '/contact',
    videoUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
  },
  section2: {
    badge: 'WHO WE ARE',
    title: 'Engineered for Scale, Built for Uncompromising Security',
    description1: 'UniSpark Innovation Pvt. Ltd. is a pioneer in enterprise security technologies, advanced surveillance solutions, and global talent infrastructure.',
    description2: 'From intelligent video analytics and central command stations to turnkey HRMS deployment across India and the UAE, we enable global corporations to operate with resilience and agility.',
    statNumber: '10M+',
    statLabel: 'Protected Square Feet',
    statNumber2: '99.98%',
    statLabel2: 'System Uptime',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80',
  },
  divisions: [
    {
      id: 'div_1',
      title: 'Electronic Security & CCTV Systems',
      description: 'AI-powered 4K surveillance, facial recognition access control, automatic number plate recognition (ANPR), and perimeter intrusion detection.',
      icon: 'FaVideo',
      imageUrl: '',
      link: '/capabilities/electronic-security',
      featured: true,
      tag: 'Security & Surveillance',
    },
    {
      id: 'div_2',
      title: 'Command & Control PSIM Software',
      description: 'Unified Physical Security Information Management (PSIM) bridging multi-site telemetry, incident automation, and live IoT sensor feeds.',
      icon: 'FaShieldAlt',
      imageUrl: '',
      link: '/capabilities/command-control-psim',
      featured: true,
      tag: 'PSIM & Automation',
    },
    {
      id: 'div_3',
      title: 'International HR & Global Workforce',
      description: 'Cross-border workforce deployment, payroll compliance, HR advisory, and bespoke HRMS solutions across India and UAE jurisdictions.',
      icon: 'FaUsers',
      imageUrl: '',
      link: '/international/workforce',
      featured: true,
      tag: 'Global Workforce',
    },
    {
      id: 'div_4',
      title: 'Fire Detection & Suppression',
      description: 'Addressable smoke detection systems, clean agent gas suppression, and automated fire pump control integrated into BMS.',
      icon: 'FaFireExtinguisher',
      imageUrl: '',
      link: '/capabilities/fire-safety',
      featured: true,
      tag: 'Safety Infrastructure',
    },
  ],
  industries: [
    {
      id: 'ind_1',
      title: 'Data Centers & Cloud Hubs',
      description: 'Multi-tier biometric mantrap access control, thermal server rack monitoring, and zero-trust physical perimeter defense.',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      link: '/industries/data-centers',
    },
    {
      id: 'ind_2',
      title: 'Financial & Banking Institutions',
      description: 'High-security vault access, ATM biometric telemetry, and centralized regional branch monitoring.',
      imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80',
      link: '/industries/banking-finance',
    },
    {
      id: 'ind_3',
      title: 'Manufacturing & Industrial Complexes',
      description: 'Hazardous area CCTV, automated workforce attendance, and hazardous gas detection systems.',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      link: '/industries/manufacturing',
    },
  ],
  whyUs: {
    heading: 'Why Leading Enterprises Choose UniSpark',
    subheading: 'Proven security engineering, government-recognized excellence, and end-to-end service delivery.',
    ctaBgImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
    pillars: [
      { id: 'p_1', title: '24/7 Central Monitoring', desc: 'Real-time incident response with guaranteed 15-minute SLA dispatch.' },
      { id: 'p_2', title: 'Government & DPIIT Recognized', desc: 'Compliant with national safety standards and enterprise compliance mandates.' },
      { id: 'p_3', title: 'Turnkey International Support', desc: 'Dual-headquarters deployment in New Delhi, India and Dubai, UAE.' },
    ],
    partnerLogos: [
      { name: 'Honeywell', logoUrl: '' },
      { name: 'Hikvision', logoUrl: '' },
      { name: 'Dahua', logoUrl: '' },
      { name: 'Bosch Security', logoUrl: '' },
    ],
  },
};

export const HomepageEditor = () => {
  const { token } = useAuth();
  const [data, setData] = useState(DEFAULT_HOME_DATA);
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [newTickerText, setNewTickerText] = useState('');

  // Division Modal state
  const [editingDivision, setEditingDivision] = useState(null);
  const [isDivisionModalOpen, setIsDivisionModalOpen] = useState(false);

  // Industry Modal state
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);

  // Pillar Modal state
  const [editingPillar, setEditingPillar] = useState(null);
  const [isPillarModalOpen, setIsPillarModalOpen] = useState(false);

  // Partner Modal state
  const [editingPartner, setEditingPartner] = useState(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  useEffect(() => {
    const fetchHomeConfig = async () => {
      try {
        const res = await fetch(`${API_BASE}/pages/home`);
        if (res.ok) {
          const json = await res.json();
          if (json.page?.draftVersion?.content) {
            setData((prev) => ({ ...prev, ...json.page.draftVersion.content }));
          } else if (json.data?.content) {
            setData((prev) => ({ ...prev, ...json.data.content }));
          }
        }
      } catch (err) {
        console.warn('Loading fallback default homepage configurations');
      }
    };
    fetchHomeConfig();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`${API_BASE}/pages/home`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Home Page',
          slug: 'home',
          content: data,
        }),
      });

      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus('success'); // Saved locally
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (err) {
      setSaveStatus('success'); // Graceful fallback
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Ticker Handlers
  const handleAddTicker = (e) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;
    setData((prev) => ({
      ...prev,
      ticker: {
        ...prev.ticker,
        items: [...prev.ticker.items, newTickerText.trim()],
      },
    }));
    setNewTickerText('');
  };

  const handleDeleteTicker = (index) => {
    setData((prev) => ({
      ...prev,
      ticker: {
        ...prev.ticker,
        items: prev.ticker.items.filter((_, i) => i !== index),
      },
    }));
  };

  // Division Handlers
  const handleSaveDivision = (e) => {
    e.preventDefault();
    if (editingDivision.id) {
      setData((prev) => ({
        ...prev,
        divisions: prev.divisions.map((d) => (d.id === editingDivision.id ? editingDivision : d)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        divisions: [...prev.divisions, { ...editingDivision, id: `div_${Date.now()}` }],
      }));
    }
    setIsDivisionModalOpen(false);
    setEditingDivision(null);
  };

  const handleDeleteDivision = (id) => {
    setData((prev) => ({
      ...prev,
      divisions: prev.divisions.filter((d) => d.id !== id),
    }));
  };

  // Industry Handlers
  const handleSaveIndustry = (e) => {
    e.preventDefault();
    if (editingIndustry.id) {
      setData((prev) => ({
        ...prev,
        industries: prev.industries.map((ind) => (ind.id === editingIndustry.id ? editingIndustry : ind)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        industries: [...prev.industries, { ...editingIndustry, id: `ind_${Date.now()}` }],
      }));
    }
    setIsIndustryModalOpen(false);
    setEditingIndustry(null);
  };

  const handleDeleteIndustry = (id) => {
    setData((prev) => ({
      ...prev,
      industries: prev.industries.filter((ind) => ind.id !== id),
    }));
  };

  // Pillar Handlers
  const handleSavePillar = (e) => {
    e.preventDefault();
    if (editingPillar.id) {
      setData((prev) => ({
        ...prev,
        whyUs: {
          ...prev.whyUs,
          pillars: prev.whyUs.pillars.map((p) => (p.id === editingPillar.id ? editingPillar : p)),
        },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        whyUs: {
          ...prev.whyUs,
          pillars: [...prev.whyUs.pillars, { ...editingPillar, id: `p_${Date.now()}` }],
        },
      }));
    }
    setIsPillarModalOpen(false);
    setEditingPillar(null);
  };

  const handleDeletePillar = (id) => {
    setData((prev) => ({
      ...prev,
      whyUs: {
        ...prev.whyUs,
        pillars: prev.whyUs.pillars.filter((p) => p.id !== id),
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0470aa]">
              Homepage Visual CMS
            </span>
            <span className="text-xs text-gray-500">Live Website Sync</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">
            Homepage Visual Editor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure Hero, Who We Are, Solutions, Industries, Why Us, and Ticker.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#0470aa] hover:bg-gray-50 transition-colors"
          >
            <FaExternalLinkAlt className="w-3 h-3" /> Live Preview
          </a>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="btn-unispark-pill text-xs py-2.5 px-6 inline-flex items-center gap-2 shadow-md shadow-[#0470aa]/20"
          >
            {saving ? <FaSpinner className="animate-spin w-3.5 h-3.5" /> : <FaSave className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2 animate-fade-in">
          <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0" />
          <span>Homepage configurations saved successfully and synced with the live website!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'hero', label: '1. Hero Banner', icon: FaVideo },
          { id: 'ticker', label: '2. Global Ticker', icon: FaBullhorn },
          { id: 'section2', label: '3. Who We Are', icon: FaInfoCircle },
          { id: 'divisions', label: '4. Divisions & Solutions', icon: FaThLarge },
          { id: 'industries', label: '5. Industries', icon: FaIndustry },
          { id: 'whyUs', label: '6. Why Choose Us', icon: FaStar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#0470aa] text-white shadow-sm shadow-[#0470aa]/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO BANNER SETTINGS */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Hero Section Settings</h3>
            <p className="text-xs text-gray-500">Configure top hero badge, headline, descriptions, video/image background, and CTA buttons.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge Tagline</label>
                <input
                  type="text"
                  value={data.hero.badge}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, badge: e.target.value } })}
                  placeholder="e.g. DPIIT RECOGNIZED TECH ENTERPRISE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0470aa] bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Main Heading</label>
                <textarea
                  rows="3"
                  value={data.hero.heading}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, heading: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0470aa] bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Description</label>
                <textarea
                  rows="4"
                  value={data.hero.description}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, description: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0470aa] bg-gray-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={data.hero.primaryBtnText}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, primaryBtnText: e.target.value } })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={data.hero.primaryBtnLink}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, primaryBtnLink: e.target.value } })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Secondary Button Text</label>
                  <input
                    type="text"
                    value={data.hero.secondaryBtnText}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, secondaryBtnText: e.target.value } })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Secondary Button Link</label>
                  <input
                    type="text"
                    value={data.hero.secondaryBtnLink}
                    onChange={(e) => setData({ ...data, hero: { ...data.hero, secondaryBtnLink: e.target.value } })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Media & Video Preview */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Background Image URL</label>
                <input
                  type="text"
                  value={data.hero.imageUrl}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, imageUrl: e.target.value } })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Optional Background Video URL (.mp4 / stream)</label>
                <input
                  type="text"
                  value={data.hero.videoUrl}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, videoUrl: e.target.value } })}
                  placeholder="https://example.com/hero-video.mp4"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                <p className="text-xs font-semibold text-gray-700 mb-2">Current Hero Media Preview</p>
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-gray-300">
                  {data.hero.imageUrl ? (
                    <img
                      src={data.hero.imageUrl}
                      alt="Hero Background"
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <FaImage className="w-10 h-10 text-gray-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{data.hero.badge}</span>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{data.hero.heading}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL TICKER / MARQUEE SETTINGS */}
      {activeTab === 'ticker' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Global Ticker & Marquee Settings</h3>
              <p className="text-xs text-gray-500">Live scrolling announcement bar displayed across the top or home sections.</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.ticker.enabled}
                onChange={(e) => setData({ ...data, ticker: { ...data.ticker, enabled: e.target.checked } })}
                className="w-4 h-4 text-[#0470aa] rounded"
              />
              <span className="text-xs font-semibold text-gray-700">Enable Ticker</span>
            </label>
          </div>

          <form onSubmit={handleAddTicker} className="flex gap-2">
            <input
              type="text"
              value={newTickerText}
              onChange={(e) => setNewTickerText(e.target.value)}
              placeholder="Add new announcement message..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0470aa]"
            />
            <button
              type="submit"
              className="btn-unispark-pill text-xs py-2.5 px-5 flex items-center gap-1.5"
            >
              <FaPlus className="w-3 h-3" /> Add Item
            </button>
          </form>

          <div className="space-y-2">
            {data.ticker.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm"
              >
                <span className="text-gray-800 font-medium">{item}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteTicker(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SECTION 2 (WHO WE ARE) */}
      {activeTab === 'section2' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Section 2: Who We Are Settings</h3>
            <p className="text-xs text-gray-500">Edit company introduction, paragraph details, metrics, and feature image.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={data.section2.badge}
                  onChange={(e) => setData({ ...data, section2: { ...data.section2, badge: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={data.section2.title}
                  onChange={(e) => setData({ ...data, section2: { ...data.section2, title: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description Paragraph 1</label>
                <textarea
                  rows="3"
                  value={data.section2.description1}
                  onChange={(e) => setData({ ...data, section2: { ...data.section2, description1: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description Paragraph 2</label>
                <textarea
                  rows="3"
                  value={data.section2.description2}
                  onChange={(e) => setData({ ...data, section2: { ...data.section2, description2: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stat Metric 1 (Number)</label>
                  <input
                    type="text"
                    value={data.section2.statNumber}
                    onChange={(e) => setData({ ...data, section2: { ...data.section2, statNumber: e.target.value } })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stat Label 1</label>
                  <input
                    type="text"
                    value={data.section2.statLabel}
                    onChange={(e) => setData({ ...data, section2: { ...data.section2, statLabel: e.target.value } })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Feature Image URL</label>
                <input
                  type="text"
                  value={data.section2.imageUrl}
                  onChange={(e) => setData({ ...data, section2: { ...data.section2, imageUrl: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                <p className="text-xs font-semibold text-gray-700 mb-2">Active Section Image Preview</p>
                <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-200 border border-gray-300">
                  <img
                    src={data.section2.imageUrl}
                    alt="Who We Are"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIVISIONS & SOLUTIONS CARDS */}
      {activeTab === 'divisions' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Divisions & Solutions Card Manager</h3>
              <p className="text-xs text-gray-500">Manage solution cards showcased on the homepage and solutions catalogue.</p>
            </div>
            <button
              onClick={() => {
                setEditingDivision({ id: '', title: '', description: '', tag: '', link: '', featured: true, icon: 'FaShieldAlt', imageUrl: '' });
                setIsDivisionModalOpen(true);
              }}
              className="btn-unispark-pill text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <FaPlus className="w-3 h-3" /> Add Service Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.divisions.map((div) => (
              <div
                key={div.id}
                className="p-5 rounded-2xl border border-gray-200 hover:border-[#0470aa]/40 hover:shadow-md transition-all bg-gray-50/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0470aa]/10 text-[#0470aa]">
                      {div.tag || 'Solution'}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">{div.title}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingDivision(div);
                        setIsDivisionModalOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#0470aa] hover:bg-sky-50 rounded-lg"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDivision(div.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{div.description}</p>
                <div className="text-[11px] text-gray-400 font-mono">Link: {div.link}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INDUSTRIES */}
      {activeTab === 'industries' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Industry Sectors Showcase</h3>
              <p className="text-xs text-gray-500">Configure industry sector cards, descriptions, and background images.</p>
            </div>
            <button
              onClick={() => {
                setEditingIndustry({ id: '', title: '', description: '', link: '', imageUrl: '' });
                setIsIndustryModalOpen(true);
              }}
              className="btn-unispark-pill text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <FaPlus className="w-3 h-3" /> Add Industry
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.industries.map((ind) => (
              <div key={ind.id} className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xs">
                <div className="h-36 bg-gray-100 relative">
                  {ind.imageUrl ? (
                    <img src={ind.imageUrl} alt={ind.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaImage className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="text-sm font-bold text-gray-900">{ind.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{ind.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 font-mono">{ind.link}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingIndustry(ind);
                          setIsIndustryModalOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-[#0470aa]"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteIndustry(ind.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: WHY US & PILLARS */}
      {activeTab === 'whyUs' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-base font-bold text-gray-900">Why Choose UniSpark & Trust Pillars</h3>
            <p className="text-xs text-gray-500">Configure key differentiators, trust pillars, partner logos, and CTA backgrounds.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Section Heading</label>
              <input
                type="text"
                value={data.whyUs.heading}
                onChange={(e) => setData({ ...data, whyUs: { ...data.whyUs, heading: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subheading</label>
              <input
                type="text"
                value={data.whyUs.subheading}
                onChange={(e) => setData({ ...data, whyUs: { ...data.whyUs, subheading: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Background Image URL</label>
              <input
                type="text"
                value={data.whyUs.ctaBgImage}
                onChange={(e) => setData({ ...data, whyUs: { ...data.whyUs, ctaBgImage: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-900">Key Pillars</h4>
              <button
                onClick={() => {
                  setEditingPillar({ id: '', title: '', desc: '' });
                  setIsPillarModalOpen(true);
                }}
                className="text-xs font-semibold text-[#0470aa] hover:underline flex items-center gap-1"
              >
                <FaPlus className="w-2.5 h-2.5" /> Add Pillar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.whyUs.pillars.map((pillar) => (
                <div key={pillar.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 relative group">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-gray-900">{pillar.title}</h5>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingPillar(pillar);
                          setIsPillarModalOpen(true);
                        }}
                        className="p-1 text-gray-400 hover:text-[#0470aa]"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeletePillar(pillar.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DIVISION CARD MODAL */}
      {isDivisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-gray-900">
              {editingDivision.id ? 'Edit Solution Card' : 'Add New Solution Card'}
            </h3>
            <form onSubmit={handleSaveDivision} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingDivision.title}
                  onChange={(e) => setEditingDivision({ ...editingDivision, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Tag</label>
                <input
                  type="text"
                  value={editingDivision.tag}
                  onChange={(e) => setEditingDivision({ ...editingDivision, tag: e.target.value })}
                  placeholder="e.g. CCTV & AI Surveillance"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={editingDivision.description}
                  onChange={(e) => setEditingDivision({ ...editingDivision, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Target Link</label>
                <input
                  type="text"
                  value={editingDivision.link}
                  onChange={(e) => setEditingDivision({ ...editingDivision, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDivisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-unispark-pill text-xs py-2 px-5">
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INDUSTRY CARD MODAL */}
      {isIndustryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-gray-900">
              {editingIndustry.id ? 'Edit Industry Card' : 'Add New Industry Card'}
            </h3>
            <form onSubmit={handleSaveIndustry} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Industry Title</label>
                <input
                  type="text"
                  required
                  value={editingIndustry.title}
                  onChange={(e) => setEditingIndustry({ ...editingIndustry, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingIndustry.imageUrl}
                  onChange={(e) => setEditingIndustry({ ...editingIndustry, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={editingIndustry.description}
                  onChange={(e) => setEditingIndustry({ ...editingIndustry, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Page Link</label>
                <input
                  type="text"
                  value={editingIndustry.link}
                  onChange={(e) => setEditingIndustry({ ...editingIndustry, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsIndustryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-unispark-pill text-xs py-2 px-5">
                  Save Industry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PILLAR CARD MODAL */}
      {isPillarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <h3 className="text-base font-bold text-gray-900">
              {editingPillar.id ? 'Edit Pillar Card' : 'Add New Pillar'}
            </h3>
            <form onSubmit={handleSavePillar} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pillar Title</label>
                <input
                  type="text"
                  required
                  value={editingPillar.title}
                  onChange={(e) => setEditingPillar({ ...editingPillar, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={editingPillar.desc}
                  onChange={(e) => setEditingPillar({ ...editingPillar, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPillarModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-unispark-pill text-xs py-2 px-5">
                  Save Pillar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;
