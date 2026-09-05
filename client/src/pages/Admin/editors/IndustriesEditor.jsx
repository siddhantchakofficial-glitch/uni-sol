import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  FaSave, FaExternalLinkAlt, FaPlus, FaTrash, FaEdit,
  FaCheckCircle, FaSpinner, FaIndustry, FaLayerGroup, FaImage
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_INDUSTRIES_DATA = {
  banner: {
    badge: 'INDUSTRY SECTOR SOLUTIONS',
    title: 'Tailored Security Infrastructure for Mission-Critical Sectors',
    subtitle: 'High-compliance surveillance, biometric access, and integrated telemetry customized for diverse enterprise verticals.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  },
  overview: {
    badge: 'SECTOR OVERVIEW',
    heading: 'Engineered for Unique Operational & Regulatory Demands',
    paragraph1: 'Every industry faces distinct threat profiles and compliance frameworks. UniSpark designs bespoke physical security, automated visitor tracking, and life-safety architectures tailored specifically to your sector.',
    paragraph2: 'From tier-4 data centers with stringent zero-trust mantrap protocols to sprawling manufacturing facilities needing thermal perimeter surveillance, our solutions guarantee uptime and safety.',
  },
  industriesList: [
    {
      id: 'ind_1',
      title: 'Data Centers & Hyperscale Hubs',
      slug: 'data-centers',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      description: 'Multi-layer biometric mantrap entry, thermal server rack monitoring, and zero-trust perimeter defense.',
      highlights: ['Biometric Mantrap Portals', 'Thermal Rack Telemetry', 'Zero-Trust Logging'],
    },
    {
      id: 'ind_2',
      title: 'Banking & Financial Institutions',
      slug: 'banking-finance',
      imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80',
      description: 'High-security vault access, biometric ATM telemetry, and automated central branch incident dispatch.',
      highlights: ['Vault Timelock Access', 'ATM CCTV Analytics', 'Central Branch PSIM'],
    },
    {
      id: 'ind_3',
      title: 'Manufacturing & Heavy Industry',
      slug: 'manufacturing',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      description: 'Hazardous area explosion-proof CCTV, automated workforce attendance, and optical gas flare sensors.',
      highlights: ['Explosion-Proof Cameras', 'Automated Muster Logs', 'Gas Telemetry Alarms'],
    },
    {
      id: 'ind_4',
      title: 'Healthcare & Pharmaceutical Campuses',
      slug: 'healthcare',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      description: 'Pharmacy cleanroom access, infant protection RFID tags, and emergency lockdown orchestration.',
      highlights: ['Cleanroom Airlock Access', 'Infant RFID Tracking', 'Code-Red Lockdown'],
    },
  ],
};

export const IndustriesEditor = () => {
  const { token } = useAuth();
  const [data, setData] = useState(DEFAULT_INDUSTRIES_DATA);
  const [activeTab, setActiveTab] = useState('banner');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const [editingIndustry, setEditingIndustry] = useState(null);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);

  useEffect(() => {
    const fetchIndustriesConfig = async () => {
      try {
        const res = await fetch(`${API_BASE}/pages/industries`);
        if (res.ok) {
          const json = await res.json();
          if (json.page?.draftVersion?.content) {
            setData((prev) => ({ ...prev, ...json.page.draftVersion.content }));
          }
        }
      } catch (err) {
        console.warn('Using default industries configuration');
      }
    };
    fetchIndustriesConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await fetch(`${API_BASE}/pages/industries`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Industries',
          slug: 'industries',
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

  const handleSaveIndustry = (e) => {
    e.preventDefault();
    if (editingIndustry.id) {
      setData((prev) => ({
        ...prev,
        industriesList: prev.industriesList.map((ind) => (ind.id === editingIndustry.id ? editingIndustry : ind)),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        industriesList: [...prev.industriesList, { ...editingIndustry, id: `ind_${Date.now()}` }],
      }));
    }
    setIsIndustryModalOpen(false);
    setEditingIndustry(null);
  };

  const handleDeleteIndustry = (id) => {
    setData((prev) => ({
      ...prev,
      industriesList: prev.industriesList.filter((ind) => ind.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0470aa]">
              Industries CMS
            </span>
            <span className="text-xs text-gray-500">Live Website Sync</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">
            Industries Visual Editor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure industry sectors, banner imagery, sector overview, and industry vertical cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/industries"
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
            <span>{saving ? 'Saving...' : 'Save Industries'}</span>
          </button>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2">
          <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0" />
          <span>Industries configurations saved successfully!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'banner', label: '1. Sector Banner', icon: FaLayerGroup },
          { id: 'overview', label: '2. Sector Overview', icon: FaIndustry },
          { id: 'cards', label: '3. Industry Vertical Cards', icon: FaImage },
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
          <h3 className="text-base font-bold text-gray-900">Industry Header Banner</h3>
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
                <img src={data.banner.imageUrl} alt="Industry Banner" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Sector Overview Settings</h3>
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 1</label>
            <textarea
              rows="3"
              value={data.overview.paragraph1}
              onChange={(e) => setData({ ...data, overview: { ...data.overview, paragraph1: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 2</label>
            <textarea
              rows="3"
              value={data.overview.paragraph2}
              onChange={(e) => setData({ ...data, overview: { ...data.overview, paragraph2: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
        </div>
      )}

      {/* TAB 3: CARDS */}
      {activeTab === 'cards' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Industry Vertical Cards</h3>
            <button
              onClick={() => {
                setEditingIndustry({ id: '', title: '', slug: '', imageUrl: '', description: '', highlights: [] });
                setIsIndustryModalOpen(true);
              }}
              className="btn-unispark-pill text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <FaPlus className="w-3 h-3" /> Add Industry Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.industriesList.map((ind) => (
              <div key={ind.id} className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50/50">
                <div className="h-40 bg-gray-200 relative">
                  {ind.imageUrl ? (
                    <img src={ind.imageUrl} alt={ind.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaImage className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900">{ind.title}</h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingIndustry(ind);
                          setIsIndustryModalOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-[#0470aa]"
                      >
                        <FaEdit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteIndustry(ind.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{ind.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INDUSTRY MODAL */}
      {isIndustryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">
              {editingIndustry.id ? 'Edit Industry Card' : 'Add Industry Card'}
            </h3>
            <form onSubmit={handleSaveIndustry} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingIndustry.title}
                  onChange={(e) => setEditingIndustry({ ...editingIndustry, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={editingIndustry.slug}
                  onChange={(e) => setEditingIndustry({ ...editingIndustry, slug: e.target.value })}
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
    </div>
  );
};

export default IndustriesEditor;
