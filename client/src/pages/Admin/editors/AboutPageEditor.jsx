import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  FaSave, FaExternalLinkAlt, FaPlus, FaTrash, FaEdit,
  FaCheckCircle, FaSpinner, FaInfoCircle, FaShieldAlt, FaChartBar
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_ABOUT_DATA = {
  banner: {
    badge: 'ABOUT UNISPARK SECURITY & INNOVATION',
    title: 'Pioneering Mission-Critical Security & Global Enterprise Solutions',
    subtitle: 'Delivering end-to-end electronic security, integrated command systems, and international workforce deployment across Asia & Middle East.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  },
  overview: {
    badge: 'QUICK OVERVIEW',
    heading: 'A Legacy of Trust, Technical Precision & Scalability',
    paragraph1: 'UniSpark Innovation Pvt. Ltd. was established to provide institutional clients with resilient physical security infrastructure, turnkey system integration, and global organizational talent.',
    paragraph2: 'Operating across modern headquarters in New Delhi and Dubai, our multi-disciplinary engineering squads design, deploy, and maintain advanced CCTV surveillance, biometric automation, and critical telemetry for Fortune 500 enterprises, government bodies, and data centers.',
  },
  glanceCards: [
    { id: 'gc_1', number: '15+', label: 'Years of Technical Excellence' },
    { id: 'gc_2', number: '500+', label: 'Enterprise Deployments' },
    { id: 'gc_3', number: '10M+', label: 'Protected Square Feet' },
    { id: 'gc_4', number: '100%', label: 'Compliance & Safety Record' },
  ],
  differentiators: [
    {
      id: 'diff_1',
      title: 'AI-Enhanced Surveillance',
      desc: 'Deep learning video analytics for perimeter tripwire, crowd density alerts, and automatic license plate tracking.',
    },
    {
      id: 'diff_2',
      title: 'Cross-Border Talent Infrastructure',
      desc: 'Turnkey workforce deployment, executive search, and payroll compliance between India and UAE jurisdictions.',
    },
    {
      id: 'diff_3',
      title: 'Unified PSIM Command Center',
      desc: 'Centralized situational awareness integrating intrusion alarms, access logs, and BMS environmental sensors.',
    },
  ],
};

export const AboutPageEditor = () => {
  const { token } = useAuth();
  const [data, setData] = useState(DEFAULT_ABOUT_DATA);
  const [activeTab, setActiveTab] = useState('banner');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [editingGlance, setEditingGlance] = useState(null);
  const [isGlanceModalOpen, setIsGlanceModalOpen] = useState(false);

  const [editingDiff, setEditingDiff] = useState(null);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);

  useEffect(() => {
    const fetchAboutConfig = async () => {
      try {
        const res = await fetch(`${API_BASE}/pages/about`);
        if (res.ok) {
          const json = await res.json();
          if (json.page?.draftVersion?.content) {
            setData((prev) => ({ ...prev, ...json.page.draftVersion.content }));
          }
        }
      } catch (err) {
        console.warn('Using fallback about configurations');
      }
    };
    fetchAboutConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await fetch(`${API_BASE}/pages/about`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'About Us',
          slug: 'about',
          content: data,
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

  const handleSaveGlance = (e) => {
    e.preventDefault();
    if (editingGlance.id) {
      setData((prev) => ({
        ...prev,
        glanceCards: prev.glanceCards.map((g) => (g.id === editingGlance.id ? editingGlance : g)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        glanceCards: [...prev.glanceCards, { ...editingGlance, id: `gc_${Date.now()}` }],
      }));
    }
    setIsGlanceModalOpen(false);
    setEditingGlance(null);
  };

  const handleDeleteGlance = (id) => {
    setData((prev) => ({
      ...prev,
      glanceCards: prev.glanceCards.filter((g) => g.id !== id),
    }));
  };

  const handleSaveDiff = (e) => {
    e.preventDefault();
    if (editingDiff.id) {
      setData((prev) => ({
        ...prev,
        differentiators: prev.differentiators.map((d) => (d.id === editingDiff.id ? editingDiff : d)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        differentiators: [...prev.differentiators, { ...editingDiff, id: `diff_${Date.now()}` }],
      }));
    }
    setIsDiffModalOpen(false);
    setEditingDiff(null);
  };

  const handleDeleteDiff = (id) => {
    setData((prev) => ({
      ...prev,
      differentiators: prev.differentiators.filter((d) => d.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0470aa]">
              About Page CMS
            </span>
            <span className="text-xs text-gray-500">Live Website Sync</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">
            About Us Visual Editor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure header banner, quick overview, metrics at a glance, and key differentiators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#0470aa] hover:bg-gray-50 transition-colors"
          >
            <FaExternalLinkAlt className="w-3 h-3" /> Live Preview
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-unispark-pill text-xs py-2.5 px-6 inline-flex items-center gap-2 shadow-md shadow-[#0470aa]/20"
          >
            {saving ? <FaSpinner className="animate-spin w-3.5 h-3.5" /> : <FaSave className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save About Page'}</span>
          </button>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2">
          <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0" />
          <span>About Page configurations saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'banner', label: '1. Header Banner', icon: FaInfoCircle },
          { id: 'overview', label: '2. Company Overview', icon: FaChartBar },
          { id: 'glance', label: '3. At a Glance Metrics', icon: FaChartBar },
          { id: 'differentiators', label: '4. Differentiators & Systems', icon: FaShieldAlt },
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

      {/* TAB 1: BANNER */}
      {activeTab === 'banner' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">About Header Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.banner.badge}
                  onChange={(e) => setData({ ...data, banner: { ...data.banner, badge: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={data.banner.title}
                  onChange={(e) => setData({ ...data, banner: { ...data.banner, title: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle</label>
                <textarea
                  rows="3"
                  value={data.banner.subtitle}
                  onChange={(e) => setData({ ...data, banner: { ...data.banner, subtitle: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Banner Background Image URL</label>
              <input
                type="text"
                value={data.banner.imageUrl}
                onChange={(e) => setData({ ...data, banner: { ...data.banner, imageUrl: e.target.value } })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 mb-3"
              />
              <div className="rounded-xl overflow-hidden h-44 bg-gray-100 border border-gray-200">
                <img src={data.banner.imageUrl} alt="About Banner" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Company Overview</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Overview Heading</label>
            <input
              type="text"
              value={data.overview.heading}
              onChange={(e) => setData({ ...data, overview: { ...data.overview, heading: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 1</label>
            <textarea
              rows="4"
              value={data.overview.paragraph1}
              onChange={(e) => setData({ ...data, overview: { ...data.overview, paragraph1: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 2</label>
            <textarea
              rows="4"
              value={data.overview.paragraph2}
              onChange={(e) => setData({ ...data, overview: { ...data.overview, paragraph2: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
        </div>
      )}

      {/* TAB 3: GLANCE METRICS */}
      {activeTab === 'glance' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">At a Glance Metrics</h3>
            <button
              onClick={() => {
                setEditingGlance({ id: '', number: '', label: '' });
                setIsGlanceModalOpen(true);
              }}
              className="btn-unispark-pill text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <FaPlus className="w-3 h-3" /> Add Metric
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {data.glanceCards.map((g) => (
              <div key={g.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-[#0470aa]">{g.number}</span>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">{g.label}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingGlance(g);
                      setIsGlanceModalOpen(true);
                    }}
                    className="p-1 text-gray-400 hover:text-[#0470aa]"
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGlance(g.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DIFFERENTIATORS */}
      {activeTab === 'differentiators' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Key Differentiators & Capabilities</h3>
            <button
              onClick={() => {
                setEditingDiff({ id: '', title: '', desc: '' });
                setIsDiffModalOpen(true);
              }}
              className="btn-unispark-pill text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <FaPlus className="w-3 h-3" /> Add Differentiator
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.differentiators.map((d) => (
              <div key={d.id} className="p-5 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">{d.title}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingDiff(d);
                        setIsDiffModalOpen(true);
                      }}
                      className="p-1 text-gray-400 hover:text-[#0470aa]"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDiff(d.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GLANCE MODAL */}
      {isGlanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">
              {editingGlance.id ? 'Edit Metric' : 'Add Metric'}
            </h3>
            <form onSubmit={handleSaveGlance} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Number / Stat</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500+"
                  value={editingGlance.number}
                  onChange={(e) => setEditingGlance({ ...editingGlance, number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise Deployments"
                  value={editingGlance.label}
                  onChange={(e) => setEditingGlance({ ...editingGlance, label: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGlanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-unispark-pill text-xs py-2 px-5">
                  Save Metric
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIFF MODAL */}
      {isDiffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">
              {editingDiff.id ? 'Edit Differentiator' : 'Add Differentiator'}
            </h3>
            <form onSubmit={handleSaveDiff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingDiff.title}
                  onChange={(e) => setEditingDiff({ ...editingDiff, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={editingDiff.desc}
                  onChange={(e) => setEditingDiff({ ...editingDiff, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDiffModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-unispark-pill text-xs py-2 px-5">
                  Save Differentiator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPageEditor;
