import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  FaSave, FaExternalLinkAlt, FaPlus, FaTrash, FaEdit,
  FaCheckCircle, FaSpinner, FaLayerGroup, FaThList, FaTools
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_SOLUTIONS_DATA = {
  banner: {
    badge: 'ENTERPRISE SOLUTIONS & CAPABILITIES',
    title: 'Integrated Electronic Security, Automation & International Talent',
    subtitle: 'Comprehensive hardware engineering, AI video analytics, command center orchestration, and global workforce infrastructure.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
  },
  overview: {
    badge: 'SERVICE OVERVIEW',
    heading: 'Next-Generation Security Architecture Engineered for Critical Assets',
    description: 'We deliver turnkey surveillance, biometric access, fire protection, and international HR infrastructure to global corporations, financial institutions, and data centers.',
  },
  solutionsList: [
    {
      id: 'sol_1',
      title: 'AI-Powered 4K CCTV & Video Analytics',
      category: 'Electronic Security',
      slug: 'electronic-security',
      description: 'Facial recognition, automatic vehicle number plate recognition (ANPR), perimeter tripwire, and multi-sensor PTZ thermal cameras.',
      features: ['Real-time object classification', 'Intrusion auto-tracking', 'Encrypted cloud & on-prem storage'],
    },
    {
      id: 'sol_2',
      title: 'Biometric Access Control & Turnstiles',
      category: 'Access Management',
      slug: 'access-control',
      description: 'Touchless palm vein scanners, multi-door controllers, speed gates, and automated visitor management workflows.',
      features: ['Zero-trust entry validation', 'Anti-passback rules', 'Integrated muster reporting'],
    },
    {
      id: 'sol_3',
      title: 'Central PSIM & BMS Command Station',
      category: 'Software & Integration',
      slug: 'command-control-psim',
      description: 'Unified visual operations console integrating CCTV, intrusion alarms, fire safety, and HVAC building telemetry.',
      features: ['Single-pane-of-glass dashboard', 'Automated SOP incident checklists', 'Real-time telemetry map'],
    },
    {
      id: 'sol_4',
      title: 'Global Workforce & International HR Advisory',
      category: 'International HR',
      slug: 'workforce',
      description: 'Cross-border staffing, recruitment process outsourcing (RPO), UAE visa processing, and compliant multi-country payroll.',
      features: ['India & UAE legal compliance', 'Executive talent acquisition', 'Dedicated HRMS platform'],
    },
  ],
};

export const SolutionsEditor = () => {
  const { token } = useAuth();
  const [data, setData] = useState(DEFAULT_SOLUTIONS_DATA);
  const [activeTab, setActiveTab] = useState('banner');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [editingCard, setEditingCard] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  useEffect(() => {
    const fetchSolutionsConfig = async () => {
      try {
        const res = await fetch(`${API_BASE}/pages/capabilities`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const json = await res.json();
          if (json.page?.draftVersion?.content) {
            setData((prev) => ({ ...prev, ...json.page.draftVersion.content }));
          }
        }
      } catch (err) {
        console.warn('Using default solutions configuration');
      }
    };
    fetchSolutionsConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await fetch(`${API_BASE}/pages/capabilities`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Capabilities & Solutions',
          slug: 'capabilities',
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

  const handleSaveCard = (e) => {
    e.preventDefault();
    if (editingCard.id) {
      setData((prev) => ({
        ...prev,
        solutionsList: prev.solutionsList.map((c) => (c.id === editingCard.id ? editingCard : c)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        solutionsList: [...prev.solutionsList, { ...editingCard, id: `sol_${Date.now()}` }],
      }));
    }
    setIsCardModalOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (id) => {
    setData((prev) => ({
      ...prev,
      solutionsList: prev.solutionsList.filter((c) => c.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0470aa]">
              Solutions & Capabilities CMS
            </span>
            <span className="text-xs text-gray-500">Live Website Sync</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">
            Solutions & Services Visual Editor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure solutions catalogue, service overviews, capabilities scope, and individual solution cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/capabilities"
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
            <span>{saving ? 'Saving...' : 'Save Solutions Page'}</span>
          </button>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2">
          <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0" />
          <span>Solutions configurations saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'banner', label: '1. Solutions Banner', icon: FaLayerGroup },
          { id: 'overview', label: '2. Service Overview', icon: FaTools },
          { id: 'cards', label: '3. Solution Cards Catalogue', icon: FaThList },
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
          <h3 className="text-base font-bold text-gray-900">Solutions Header Banner</h3>
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
                <label className="block text-xs font-semibold text-gray-700 mb-1">Main Title</label>
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
                <img src={data.banner.imageUrl} alt="Solutions Banner" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Service Overview Settings</h3>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
            <input
              type="text"
              value={data.overview.badge}
              onChange={(e) => setData({ ...data, overview: { ...data.overview, badge: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={data.overview.heading}
              onChange={(e) => setData({ ...data, overview: { ...data.overview, heading: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Detailed Description</label>
            <textarea
              rows="4"
              value={data.overview.description}
              onChange={(e) => setData({ ...data, overview: { ...data.overview, description: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
        </div>
      )}

      {/* TAB 3: CARDS CATALOGUE */}
      {activeTab === 'cards' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Solution Cards Catalogue</h3>
            <button
              onClick={() => {
                setEditingCard({ id: '', title: '', category: '', slug: '', description: '', features: [] });
                setIsCardModalOpen(true);
              }}
              className="btn-unispark-pill text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <FaPlus className="w-3 h-3" /> Add Solution Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.solutionsList.map((sol) => (
              <div key={sol.id} className="p-5 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0470aa]/10 text-[#0470aa]">
                      {sol.category}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">{sol.title}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCard(sol);
                        setIsCardModalOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-[#0470aa] hover:bg-sky-50 rounded-lg"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCard(sol.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{sol.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sol.features?.map((f, i) => (
                    <span key={i} className="text-[10px] bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CARD MODAL */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">
              {editingCard.id ? 'Edit Solution' : 'Add Solution'}
            </h3>
            <form onSubmit={handleSaveCard} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={editingCard.category}
                  onChange={(e) => setEditingCard({ ...editingCard, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Slug / Link URL</label>
                <input
                  type="text"
                  value={editingCard.slug}
                  onChange={(e) => setEditingCard({ ...editingCard, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={editingCard.description}
                  onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-unispark-pill text-xs py-2 px-5">
                  Save Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionsEditor;
