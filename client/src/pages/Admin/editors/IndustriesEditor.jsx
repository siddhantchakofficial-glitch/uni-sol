import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { notifyCMSPublish } from '../../../hooks/useCMS';
import ImagePickerField from '../../../components/admin/ImagePickerField';
import { Industries } from '../../Industries/Industries';
import { IndustryDetailsContent } from '../../Industries/IndustryDetails';
import { INDUSTRIES as INDUSTRY_SLUGS } from '../../../utils/constants';
import {
  FaSave, FaExternalLinkAlt, FaPlus, FaTrash, FaEdit,
  FaCheckCircle, FaSpinner, FaIndustry, FaLayerGroup, FaImage,
  FaDraftingCompass, FaThLarge, FaAward, FaQuestionCircle,
  FaEye, FaEyeSlash, FaDesktop, FaTabletAlt, FaMobileAlt,
  FaArrowUp, FaArrowDown, FaSlidersH, FaPaperPlane,
} from 'react-icons/fa';
import {
  INDUSTRIES_EXTRA_DEFAULTS,
  INDUSTRIES_IMAGE_DEFAULTS,
  DEFAULT_INDUSTRIES_VISIBILITY,
  DEFAULT_MAIN_CARDS_HEADER,
  DEFAULT_INDUSTRY_SUBPAGES,
  getIndustrySubpageDefaults,
} from '../../../constants/industriesPageContent';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_INDUSTRIES_DATA = {
  // New reference-structure sections (approach, framework, served, why, faq)
  ...INDUSTRIES_EXTRA_DEFAULTS,
  // Optional per-section/per-item image fields
  ...INDUSTRIES_IMAGE_DEFAULTS,
  // Section visibility for landing page
  visibility: { ...DEFAULT_INDUSTRIES_VISIBILITY },
  // Vertical cards header
  mainCardsHeader: { ...DEFAULT_MAIN_CARDS_HEADER },
  // Per-slug content and image config for every /industries/:slug dropdown page
  industryDetails: { ...DEFAULT_INDUSTRY_SUBPAGES },
  banner: {
    badge: 'INDUSTRY SECTOR SOLUTIONS',
    title: 'Tailored Security Infrastructure for Mission-Critical Sectors',
    subtitle: 'High-compliance surveillance, biometric access, and integrated telemetry customized for diverse enterprise verticals.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    breadcrumbText: 'Industries',
  },
  overview: {
    badge: 'SECTOR OVERVIEW',
    heading: 'Engineered for Unique Operational & Regulatory Demands',
    paragraph1: 'Every industry faces distinct threat profiles and compliance frameworks. UniSpark designs bespoke physical security, automated visitor tracking, and life-safety architectures tailored specifically to your sector.',
    paragraph2: 'From tier-4 data centers with stringent zero-trust mantrap protocols to sprawling manufacturing facilities needing thermal perimeter surveillance, our solutions guarantee uptime and safety.',
    imageUrl: '',
    showImage: true,
  },
  industriesList: [
    {
      id: 'ind_1',
      title: 'Data Centers & Hyperscale Hubs',
      slug: 'data-centers',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      description: 'Multi-layer biometric mantrap entry, thermal server rack monitoring, and zero-trust perimeter defense.',
      highlights: ['Biometric Mantrap Portals', 'Thermal Rack Telemetry', 'Zero-Trust Logging'],
      showImage: true,
    },
    {
      id: 'ind_2',
      title: 'Banking & Financial Institutions',
      slug: 'banking-finance',
      imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80',
      description: 'High-security vault access, biometric ATM telemetry, and automated central branch incident dispatch.',
      highlights: ['Vault Timelock Access', 'ATM CCTV Analytics', 'Central Branch PSIM'],
      showImage: true,
    },
    {
      id: 'ind_3',
      title: 'Manufacturing & Heavy Industry',
      slug: 'manufacturing',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
      description: 'Hazardous area explosion-proof CCTV, automated workforce attendance, and optical gas flare sensors.',
      highlights: ['Explosion-Proof Cameras', 'Automated Muster Logs', 'Gas Telemetry Alarms'],
      showImage: true,
    },
    {
      id: 'ind_4',
      title: 'Healthcare & Pharmaceutical Campuses',
      slug: 'healthcare',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      description: 'Pharmacy cleanroom access, infant protection RFID tags, and emergency lockdown orchestration.',
      highlights: ['Cleanroom Airlock Access', 'Infant RFID Tracking', 'Code-Red Lockdown'],
      showImage: true,
    },
  ],
};

export const IndustriesEditor = ({ initialSubpage }) => {
  const { token } = useAuth();
  const initialSlug = initialSubpage && INDUSTRY_SLUGS.some((i) => i.slug === initialSubpage) ? initialSubpage : 'main';
  const [activeScope, setActiveScope] = useState(initialSlug); // 'main' | industry slug
  const [data, setData] = useState(DEFAULT_INDUSTRIES_DATA);
  const [activeTab, setActiveTab] = useState('banner');
  const [subpageActiveTab, setSubpageActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'draft_saved' | 'published' | 'error' | null
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const autosaveTimerRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  const [editingIndustry, setEditingIndustry] = useState(null);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);

  // Live Preview state
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState(initialSlug === 'main' ? 'landing' : 'details'); // 'landing' | 'details'
  const [previewSlug, setPreviewSlug] = useState(initialSlug === 'main' ? (INDUSTRY_SLUGS[0]?.slug || 'aviation') : initialSlug);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // desktop | tablet | mobile

  // Load stored CMS content for main industries page
  useEffect(() => {
    const fetchIndustriesConfig = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE}/pages/industries`, { headers });
        if (res.ok) {
          const json = await res.json();
          const remote = json.page?.draftVersion?.content || json.page?.publishedVersion?.content;
          if (remote) {
            setData((prev) => ({
              ...DEFAULT_INDUSTRIES_DATA,
              ...remote,
              banner: { ...DEFAULT_INDUSTRIES_DATA.banner, ...(remote.banner || {}) },
              overview: { ...DEFAULT_INDUSTRIES_DATA.overview, ...(remote.overview || {}) },
              visibility: { ...DEFAULT_INDUSTRIES_VISIBILITY, ...(remote.visibility || {}) },
              mainCardsHeader: { ...DEFAULT_MAIN_CARDS_HEADER, ...(remote.mainCardsHeader || {}) },
              approach: { ...DEFAULT_INDUSTRIES_DATA.approach, ...(remote.approach || {}) },
              capabilityFramework: { ...DEFAULT_INDUSTRIES_DATA.capabilityFramework, ...(remote.capabilityFramework || {}) },
              industriesServed: { ...DEFAULT_INDUSTRIES_DATA.industriesServed, ...(remote.industriesServed || {}) },
              whyChooseUs: { ...DEFAULT_INDUSTRIES_DATA.whyChooseUs, ...(remote.whyChooseUs || {}) },
              faq: { ...DEFAULT_INDUSTRIES_DATA.faq, ...(remote.faq || {}) },
              cta: { ...DEFAULT_INDUSTRIES_DATA.cta, ...(remote.cta || {}) },
              industriesList: Array.isArray(remote.industriesList) && remote.industriesList.length > 0
                ? remote.industriesList
                : DEFAULT_INDUSTRIES_DATA.industriesList,
              industryDetails: {
                ...DEFAULT_INDUSTRY_SUBPAGES,
                ...(remote.industryDetails || {}),
              },
            }));
          }
        }
      } catch (err) {
        console.warn('Using default industries configuration:', err);
      } finally {
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 600);
      }
    };
    fetchIndustriesConfig();
  }, [token]);

  // Load dedicated subpage content if opening or switching to a subpage
  const fetchSubpageConfig = useCallback(async (slug) => {
    if (!slug || slug === 'main') return;
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/pages/industries/${slug}`, { headers });
      if (res.ok) {
        const json = await res.json();
        const remote = json.page?.draftVersion?.content || json.page?.publishedVersion?.content;
        if (remote && Object.keys(remote).length > 0 && remote.hero) {
          setData((prev) => ({
            ...prev,
            industryDetails: {
              ...(prev.industryDetails || {}),
              [slug]: {
                ...getIndustrySubpageDefaults(slug),
                ...remote,
              },
            },
          }));
        }
      }
    } catch (err) {
      console.warn(`Could not load dedicated subpage CMS record for ${slug}:`, err.message);
    }
  }, [token]);

  // Switch between Main Landing Page and any Sector Subpage
  const handleSwitchScope = (scope) => {
    setActiveScope(scope);
    if (scope === 'main') {
      setPreviewMode('landing');
      setActiveTab('banner');
    } else {
      setPreviewMode('details');
      setPreviewSlug(scope);
      setSubpageActiveTab('hero');
      fetchSubpageConfig(scope);
    }
  };

  // Debounced Autosave (1500ms) - saves to dedicated endpoint based on activeScope
  const triggerAutosave = useCallback((updatedData, currentSlug = activeScope) => {
    if (isInitialLoadRef.current) return;
    setHasUnsavedChanges(true);

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        if (currentSlug === 'main') {
          await fetch(`${API_BASE}/pages/industries`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              title: 'Industry Verticals',
              slug: 'industries',
              content: updatedData,
              publish: false,
            }),
          });
        } else {
          const subData = updatedData.industryDetails?.[currentSlug] || getIndustrySubpageDefaults(currentSlug);
          const currentMeta = INDUSTRY_SLUGS.find((i) => i.slug === currentSlug);
          await fetch(`${API_BASE}/pages/industries/${currentSlug}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({
              title: currentMeta?.title || currentSlug,
              slug: `industries/${currentSlug}`,
              content: subData,
              publish: false,
            }),
          });
        }

        setHasUnsavedChanges(false);
        setSaveStatus('draft_saved');
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (err) {
        console.warn('Draft autosave failed:', err);
      } finally {
        setSaving(false);
      }
    }, 1500);
  }, [token, activeScope]);

  // Main updater function
  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      triggerAutosave(next, activeScope);
      return next;
    });
  };

  // Subpage helper functions
  const getActiveSubpage = (slug = activeScope !== 'main' ? activeScope : previewSlug) => {
    const raw = data.industryDetails?.[slug];
    const def = getIndustrySubpageDefaults(slug);
    return {
      hero: { ...def.hero, ...(raw?.hero || {}) },
      overview: { ...def.overview, ...(raw?.overview || {}) },
      cards: Array.isArray(raw?.cards) ? raw.cards : def.cards,
      features: Array.isArray(raw?.features) ? raw.features : def.features,
      statistics: Array.isArray(raw?.statistics) ? raw.statistics : def.statistics,
      visibility: { ...def.visibility, ...(raw?.visibility || {}) },
      cta: { ...(def.cta || {}), ...(raw?.cta || {}) },
      heroImageUrl: raw?.heroImageUrl || raw?.hero?.heroImageUrl || '',
    };
  };

  const updateActiveSubpage = (patch, targetSlug = activeScope !== 'main' ? activeScope : previewSlug) => {
    updateData((prev) => {
      const current = prev.industryDetails?.[targetSlug] || getIndustrySubpageDefaults(targetSlug);
      const nextSubpage = typeof patch === 'function' ? patch(current) : { ...current, ...patch };
      return {
        ...prev,
        industryDetails: {
          ...(prev.industryDetails || {}),
          [targetSlug]: nextSubpage,
        },
      };
    });
  };

  // Explicit Save Draft
  const handleSaveDraft = async () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setSaving(true);
    setSaveStatus(null);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (activeScope === 'main') {
        const res = await fetch(`${API_BASE}/pages/industries`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            title: 'Industry Verticals',
            slug: 'industries',
            content: data,
            publish: false,
          }),
        });
        if (res.ok) {
          setHasUnsavedChanges(false);
          setSaveStatus('draft_saved');
          setTimeout(() => setSaveStatus(null), 3500);
        } else {
          setSaveStatus('error');
        }
      } else {
        const subData = getActiveSubpage(activeScope);
        const currentMeta = INDUSTRY_SLUGS.find((i) => i.slug === activeScope);
        const res = await fetch(`${API_BASE}/pages/industries/${activeScope}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            title: currentMeta?.title || activeScope,
            slug: `industries/${activeScope}`,
            content: subData,
            publish: false,
          }),
        });
        if (res.ok) {
          setHasUnsavedChanges(false);
          setSaveStatus('draft_saved');
          setTimeout(() => setSaveStatus(null), 3500);
        } else {
          setSaveStatus('error');
        }
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  // Publish to Live Website
  const handlePublish = async () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setPublishing(true);
    setSaveStatus(null);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (activeScope === 'main') {
        const res = await fetch(`${API_BASE}/pages/industries`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            title: 'Industry Verticals',
            slug: 'industries',
            content: data,
            publish: true,
          }),
        });
        if (res.ok) {
          notifyCMSPublish('industries');
          setHasUnsavedChanges(false);
          setSaveStatus('published');
          setTimeout(() => setSaveStatus(null), 4000);
        } else {
          setSaveStatus('error');
        }
      } else {
        const subData = getActiveSubpage(activeScope);
        const currentMeta = INDUSTRY_SLUGS.find((i) => i.slug === activeScope);
        const res = await fetch(`${API_BASE}/pages/industries/${activeScope}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            title: currentMeta?.title || activeScope,
            slug: `industries/${activeScope}`,
            content: subData,
            publish: true,
          }),
        });
        if (res.ok) {
          notifyCMSPublish(`industries/${activeScope}`);
          notifyCMSPublish(`industries-${activeScope}`);
          notifyCMSPublish('industries');
          setHasUnsavedChanges(false);
          setSaveStatus('published');
          setTimeout(() => setSaveStatus(null), 4000);
        } else {
          setSaveStatus('error');
        }
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveIndustry = (e) => {
    e.preventDefault();
    if (editingIndustry.id) {
      updateData((prev) => ({
        ...prev,
        industriesList: prev.industriesList.map((ind) => (ind.id === editingIndustry.id ? editingIndustry : ind)),
      }));
    } else {
      updateData((prev) => ({
        ...prev,
        industriesList: [...prev.industriesList, { ...editingIndustry, id: `ind_${Date.now()}` }],
      }));
    }
    setIsIndustryModalOpen(false);
    setEditingIndustry(null);
  };

  const handleDeleteIndustry = (id) => {
    updateData((prev) => ({
      ...prev,
      industriesList: prev.industriesList.filter((ind) => ind.id !== id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0470aa]">
              Industries CMS
            </span>
            <span className="text-xs text-gray-500">Live Website Sync</span>
            {saving && (
              <span className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                <FaSpinner className="animate-spin w-2.5 h-2.5" /> Autosaving draft...
              </span>
            )}
            {hasUnsavedChanges && !saving && (
              <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                Unsaved edits
              </span>
            )}
            {saveStatus === 'draft_saved' && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                <FaCheckCircle className="w-2.5 h-2.5" /> Draft saved
              </span>
            )}
            {saveStatus === 'published' && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                <FaCheckCircle className="w-2.5 h-2.5" /> Published to live site!
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">
            Industries & Sub-Pages Live Editor
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure every element of the Industries landing page and all 8+ industry subpages with instant live preview.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="/industries"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#0470aa] hover:bg-gray-50 transition-colors"
          >
            <FaExternalLinkAlt className="w-3 h-3" />
            <span>View Live Site</span>
          </a>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || publishing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? <FaSpinner className="animate-spin w-3 h-3 text-[#0470aa]" /> : <FaSave className="w-3 h-3 text-gray-500" />}
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={saving || publishing}
            className="btn-unispark-pill text-xs py-2 px-4.5 inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {publishing ? <FaSpinner className="animate-spin w-3 h-3" /> : <FaPaperPlane className="w-3 h-3" />}
            <span>{publishing ? 'Publishing...' : 'Publish to Live Site'}</span>
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'banner', label: '1. Sector Banner', icon: FaLayerGroup },
          { id: 'overview', label: '2. Sector Overview', icon: FaIndustry },
          { id: 'cards', label: '3. Vertical Cards', icon: FaImage },
          { id: 'approach', label: '4. Approach', icon: FaDraftingCompass },
          { id: 'framework', label: '5. Capability Framework', icon: FaThLarge },
          { id: 'served', label: '6. Industries Served', icon: FaLayerGroup },
          { id: 'why', label: '7. Why Choose Us', icon: FaAward },
          { id: 'faq', label: '8. FAQ', icon: FaQuestionCircle },
          { id: 'cta', label: '9. CTA Image', icon: FaImage },
          { id: 'subpages', label: '10. Industry Sub-Pages', icon: FaDesktop },
          { id: 'visibility', label: '11. Section Visibility', icon: FaSlidersH },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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
                  onChange={(e) => updateData({ banner: { ...data.banner, badge: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={data.banner.title}
                  onChange={(e) => updateData({ banner: { ...data.banner, title: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle</label>
                <textarea
                  rows="3"
                  value={data.banner.subtitle}
                  onChange={(e) => updateData({ banner: { ...data.banner, subtitle: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Breadcrumb Label</label>
                <input
                  type="text"
                  value={data.banner.breadcrumbText || 'Industries'}
                  onChange={(e) => updateData({ banner: { ...data.banner, breadcrumbText: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <ImagePickerField
                label="Banner Background Image"
                folder="industries"
                value={data.banner.imageUrl || ''}
                onChange={(url) => updateData({ banner: { ...data.banner, imageUrl: url } })}
                helpText="Upload from the media library or paste an image URL."
              />
              {data.banner.imageUrl && (
                <div className="rounded-xl overflow-hidden h-44 bg-gray-100 border border-gray-200">
                  <img src={data.banner.imageUrl} alt="Industry Banner" className="w-full h-full object-cover" />
                </div>
              )}
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
              onChange={(e) => updateData({ overview: { ...data.overview, badge: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={data.overview.heading}
              onChange={(e) => updateData({ overview: { ...data.overview, heading: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 1</label>
            <textarea
              rows="3"
              value={data.overview.paragraph1}
              onChange={(e) => updateData({ overview: { ...data.overview, paragraph1: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 2</label>
            <textarea
              rows="3"
              value={data.overview.paragraph2}
              onChange={(e) => updateData({ overview: { ...data.overview, paragraph2: e.target.value } })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
            />
          </div>
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Section Image</h4>
              <button
                type="button"
                onClick={() =>
                  updateData({
                    overview: {
                      ...data.overview,
                      showImage: data.overview.showImage === false,
                    },
                  })
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  data.overview.showImage === false
                    ? 'bg-gray-100 text-gray-500 border border-gray-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {data.overview.showImage === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                <span>{data.overview.showImage === false ? 'Image Hidden' : 'Image Shown'}</span>
              </button>
            </div>
            <ImagePickerField
              label="Overview Side Image"
              folder="industries"
              value={data.overview.imageUrl || ''}
              onChange={(url) => updateData({ overview: { ...data.overview, imageUrl: url } })}
              helpText="Shown in the right-hand image slot of the Sector Overview section."
            />
          </div>
        </div>
      )}

      {/* TAB 3: CARDS & MAIN SECTION HEADER */}
      {activeTab === 'cards' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          {/* Section Header Controls */}
          <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/40 space-y-3">
            <h4 className="text-xs font-bold text-[#0470aa] uppercase tracking-wider">
              Section Header ("Industries We Serve")
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.mainCardsHeader?.badge || ''}
                  onChange={(e) =>
                    updateData({
                      mainCardsHeader: { ...data.mainCardsHeader, badge: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={data.mainCardsHeader?.title || ''}
                  onChange={(e) =>
                    updateData({
                      mainCardsHeader: { ...data.mainCardsHeader, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Highlight Word</label>
                <input
                  type="text"
                  value={data.mainCardsHeader?.highlight || ''}
                  onChange={(e) =>
                    updateData({
                      mainCardsHeader: { ...data.mainCardsHeader, highlight: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={data.mainCardsHeader?.subtitle || ''}
                  onChange={(e) =>
                    updateData({
                      mainCardsHeader: { ...data.mainCardsHeader, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
                />
              </div>
            </div>
          </div>

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
                  {ind.imageUrl && (
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ind.showImage === false
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {ind.showImage === false ? 'Image hidden' : 'Image shown'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: APPROACH */}
      {activeTab === 'approach' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Approach Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.approach.badge}
                  onChange={(e) => updateData({ approach: { ...data.approach, badge: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={data.approach.title}
                  onChange={(e) => updateData({ approach: { ...data.approach, title: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Principles (one per line)</label>
              <textarea
                rows="6"
                value={(data.approach.principles || []).join('\n')}
                onChange={(e) =>
                  updateData({
                    approach: {
                      ...data.approach,
                      principles: e.target.value.split('\n').filter(Boolean),
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
              <p className="text-[11px] text-gray-400 mt-1">Shown as numbered principle cards.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CAPABILITY FRAMEWORK */}
      {activeTab === 'framework' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Capability Framework Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.capabilityFramework.badge}
                  onChange={(e) =>
                    updateData({
                      capabilityFramework: { ...data.capabilityFramework, badge: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={data.capabilityFramework.title}
                  onChange={(e) =>
                    updateData({
                      capabilityFramework: { ...data.capabilityFramework, title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle</label>
                <textarea
                  rows="2"
                  value={data.capabilityFramework.subtitle || ''}
                  onChange={(e) =>
                    updateData({
                      capabilityFramework: { ...data.capabilityFramework, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Framework Items (Title | Description per line)
              </label>
              <textarea
                rows="9"
                value={(data.capabilityFramework.items || []).map((it) => `${it.title} | ${it.desc}`).join('\n')}
                onChange={(e) =>
                  updateData({
                    capabilityFramework: {
                      ...data.capabilityFramework,
                      items: e.target.value.split('\n').filter(Boolean).map((line, i) => {
                        const [title, desc = ''] = line.split('|');
                        return { id: `cf_${Date.now()}_${i}`, title: title.trim(), desc: desc.trim() };
                      }),
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INDUSTRIES SERVED */}
      {activeTab === 'served' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Industries Served Band</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.industriesServed.badge}
                  onChange={(e) =>
                    updateData({
                      industriesServed: { ...data.industriesServed, badge: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={data.industriesServed.title}
                  onChange={(e) =>
                    updateData({
                      industriesServed: { ...data.industriesServed, title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Industry Names (one per line — Name | slug)
              </label>
              <textarea
                rows="8"
                value={(data.industriesServed.items || []).map((it) => `${it.name} | ${it.slug || ''}`).join('\n')}
                onChange={(e) =>
                  updateData({
                    industriesServed: {
                      ...data.industriesServed,
                      items: e.target.value.split('\n').filter(Boolean).map((line, i) => {
                        const [name, slug = ''] = line.split('|');
                        return { id: `is_${Date.now()}_${i}`, name: name.trim(), slug: slug.trim() };
                      }),
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 font-mono text-xs"
              />
              <p className="text-[11px] text-gray-400 mt-1">Slug links the chip to /industries/&lt;slug&gt;.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: WHY CHOOSE US */}
      {activeTab === 'why' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Why Choose Us Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.whyChooseUs.badge}
                  onChange={(e) =>
                    updateData({
                      whyChooseUs: { ...data.whyChooseUs, badge: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={data.whyChooseUs.title}
                  onChange={(e) =>
                    updateData({
                      whyChooseUs: { ...data.whyChooseUs, title: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Benefits (Title | Description per line)
              </label>
              <textarea
                rows="9"
                value={(data.whyChooseUs.items || []).map((it) => `${it.title} | ${it.desc}`).join('\n')}
                onChange={(e) =>
                  updateData({
                    whyChooseUs: {
                      ...data.whyChooseUs,
                      items: e.target.value.split('\n').filter(Boolean).map((line, i) => {
                        const [title, desc = ''] = line.split('|');
                        return { id: `why_${Date.now()}_${i}`, title: title.trim(), desc: desc.trim() };
                      }),
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: FAQ */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">FAQ Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={data.faq.badge}
                  onChange={(e) => updateData({ faq: { ...data.faq, badge: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={data.faq.title}
                  onChange={(e) => updateData({ faq: { ...data.faq, title: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle</label>
                <textarea
                  rows="2"
                  value={data.faq.subtitle || ''}
                  onChange={(e) => updateData({ faq: { ...data.faq, subtitle: e.target.value } })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Questions (Question | Answer per line)</label>
              <textarea
                rows="10"
                value={(data.faq.items || []).map((it) => `${it.question} | ${it.answer}`).join('\n')}
                onChange={(e) =>
                  updateData({
                    faq: {
                      ...data.faq,
                      items: e.target.value.split('\n').filter(Boolean).map((line) => {
                        const [question, answer = ''] = line.split('|');
                        return { question: question.trim(), answer: answer.trim() };
                      }),
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: CTA */}
      {activeTab === 'cta' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h3 className="text-base font-bold text-gray-900">Consultation CTA Band Settings</h3>
          <p className="text-xs text-gray-500">
            Configure the call-to-action title, subtitle narrative, and optional background imagery.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Heading Title</label>
              <input
                type="text"
                value={data.cta?.title || ''}
                placeholder="Ready to Transform Your Enterprise Security & Infrastructure?"
                onChange={(e) =>
                  updateData({
                    cta: { ...(data.cta || {}), title: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">CTA Subtitle Narrative</label>
              <textarea
                rows="2"
                value={data.cta?.subtitle || ''}
                placeholder="Schedule a confidential technical consultation with our senior solutions architects today."
                onChange={(e) =>
                  updateData({
                    cta: { ...(data.cta || {}), subtitle: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Show CTA background image</span>
              <button
                type="button"
                onClick={() =>
                  updateData({
                    cta: {
                      ...(data.cta || {}),
                      showImage: data.cta?.showImage === false,
                    },
                  })
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  data.cta?.showImage === false
                    ? 'bg-gray-100 text-gray-500 border border-gray-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {data.cta?.showImage === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                <span>{data.cta?.showImage === false ? 'Image Hidden' : 'Image Shown'}</span>
              </button>
            </div>
            <ImagePickerField
              label="CTA Background Image"
              folder="industries"
              value={data.cta?.imageUrl || ''}
              onChange={(url) => updateData({ cta: { ...(data.cta || {}), imageUrl: url } })}
              helpText="Keep OFF to preserve the default gradient background."
            />
          </div>
        </div>
      )}

      {/* TAB 10: INDUSTRY SUB-PAGES (EVERY /industries/:slug SUBPAGE) */}
      {activeTab === 'subpages' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          {/* Sub-Page Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-sky-50/50 border border-sky-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0470aa] text-white">
                  Sector Subpage
                </span>
                <span className="text-xs font-bold text-gray-800">
                  /industries/{previewSlug}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select an industry sector below to edit its hero, domain cards, features, and statistics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-700">Active Sector:</label>
              <select
                value={previewSlug}
                onChange={(e) => setPreviewSlug(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white font-bold text-[#0470aa] shadow-xs"
              >
                {INDUSTRY_SLUGS.map((ind) => (
                  <option key={ind.slug} value={ind.slug}>{ind.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subpage Edit Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-2">
            {[
              { id: 'hero', label: 'Hero' },
              { id: 'overview', label: 'Overview' },
              { id: 'cards', label: 'Domain Cards' },
              { id: 'features', label: 'Capabilities' },
              { id: 'stats', label: 'Statistics' },
              { id: 'visibility', label: 'Visibility' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSubpageActiveTab(st.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  subpageActiveTab === st.id
                    ? 'bg-[#0470aa] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {(() => {
            const sub = getActiveSubpage();

            return (
              <div className="space-y-5">
                {/* SUBPAGE TAB: HERO */}
                {subpageActiveTab === 'hero' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Badge</label>
                        <input
                          type="text"
                          value={sub.hero.badge || ''}
                          onChange={(e) =>
                            updateActiveSubpage({
                              hero: { ...sub.hero, badge: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Title</label>
                        <input
                          type="text"
                          value={sub.hero.title || ''}
                          onChange={(e) =>
                            updateActiveSubpage({
                              hero: { ...sub.hero, title: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Breadcrumb Label</label>
                        <input
                          type="text"
                          value={sub.hero.breadcrumbText || ''}
                          onChange={(e) =>
                            updateActiveSubpage({
                              hero: { ...sub.hero, breadcrumbText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Description</label>
                        <textarea
                          rows="2"
                          value={sub.hero.description || ''}
                          onChange={(e) =>
                            updateActiveSubpage({
                              hero: { ...sub.hero, description: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <ImagePickerField
                        label="Hero Background Image"
                        folder="industries"
                        value={sub.hero.heroImageUrl || sub.heroImageUrl || ''}
                        onChange={(url) =>
                          updateActiveSubpage({
                            heroImageUrl: url,
                            hero: { ...sub.hero, heroImageUrl: url },
                          })
                        }
                        helpText="Leave empty to use the sector's default bundled image."
                      />
                    </div>
                  </div>
                )}

                {/* SUBPAGE TAB: OVERVIEW */}
                {subpageActiveTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Overview Badge</label>
                        <input
                          type="text"
                          value={sub.overview.badge || ''}
                          onChange={(e) =>
                            updateActiveSubpage({
                              overview: { ...sub.overview, badge: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Overview Heading</label>
                        <input
                          type="text"
                          value={sub.overview.heading || ''}
                          onChange={(e) =>
                            updateActiveSubpage({
                              overview: { ...sub.overview, heading: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle / Sub-Heading</label>
                      <input
                        type="text"
                        value={sub.overview.subtitle || ''}
                        onChange={(e) =>
                          updateActiveSubpage({
                            overview: { ...sub.overview, subtitle: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 1</label>
                      <textarea
                        rows="3"
                        value={sub.overview.paragraph1 || ''}
                        onChange={(e) =>
                          updateActiveSubpage({
                            overview: { ...sub.overview, paragraph1: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 2</label>
                      <textarea
                        rows="3"
                        value={sub.overview.paragraph2 || ''}
                        onChange={(e) =>
                          updateActiveSubpage({
                            overview: { ...sub.overview, paragraph2: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/50"
                      />
                    </div>
                  </div>
                )}

                {/* SUBPAGE TAB: DOMAIN CARDS */}
                {subpageActiveTab === 'cards' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Domain cards for {previewSlug} (e.g., Challenges, Solutions, Compliance).
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const newCard = {
                            id: `c_${Date.now()}`,
                            title: 'New Architecture Focus',
                            desc: 'Describe domain engineering focus, challenge, or compliance framework.',
                            imageUrl: '',
                            showImage: true,
                          };
                          updateActiveSubpage({ cards: [...sub.cards, newCard] });
                        }}
                        className="btn-unispark-pill text-xs py-1.5 px-3 inline-flex items-center gap-1"
                      >
                        <FaPlus className="w-2.5 h-2.5" /> Add Card
                      </button>
                    </div>

                    <div className="space-y-4">
                      {sub.cards.map((card, idx) => (
                        <div key={card.id || `card_${idx}`} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-800">
                              Card #{idx + 1}: {card.title || 'Untitled'}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const arr = [...sub.cards];
                                  const temp = arr[idx - 1];
                                  arr[idx - 1] = arr[idx];
                                  arr[idx] = temp;
                                  updateActiveSubpage({ cards: arr });
                                }}
                                className="p-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 text-xs"
                                title="Move Up"
                              >
                                <FaArrowUp className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === sub.cards.length - 1}
                                onClick={() => {
                                  const arr = [...sub.cards];
                                  const temp = arr[idx + 1];
                                  arr[idx + 1] = arr[idx];
                                  arr[idx] = temp;
                                  updateActiveSubpage({ cards: arr });
                                }}
                                className="p-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 text-xs"
                                title="Move Down"
                              >
                                <FaArrowDown className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const arr = sub.cards.filter((_, i) => i !== idx);
                                  updateActiveSubpage({ cards: arr });
                                }}
                                className="p-1 rounded bg-white border border-gray-200 text-red-500 hover:bg-red-50 text-xs"
                                title="Delete Card"
                              >
                                <FaTrash className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Title</label>
                              <input
                                type="text"
                                value={card.title || ''}
                                onChange={(e) => {
                                  const arr = [...sub.cards];
                                  arr[idx] = { ...arr[idx], title: e.target.value };
                                  updateActiveSubpage({ cards: arr });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Description</label>
                              <textarea
                                rows="2"
                                value={card.desc || card.description || ''}
                                onChange={(e) => {
                                  const arr = [...sub.cards];
                                  arr[idx] = { ...arr[idx], desc: e.target.value, description: e.target.value };
                                  updateActiveSubpage({ cards: arr });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                              />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-gray-200/60">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-semibold text-gray-600">Card Image</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const arr = [...sub.cards];
                                  arr[idx] = { ...arr[idx], showImage: card.showImage === false };
                                  updateActiveSubpage({ cards: arr });
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  card.showImage === false
                                    ? 'bg-gray-100 text-gray-500'
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {card.showImage === false ? <FaEyeSlash className="w-2.5 h-2.5" /> : <FaEye className="w-2.5 h-2.5" />}
                                <span>{card.showImage === false ? 'Image Hidden' : 'Image Shown'}</span>
                              </button>
                            </div>
                            <ImagePickerField
                              label=""
                              folder="industries"
                              value={card.imageUrl || ''}
                              onChange={(url) => {
                                const arr = [...sub.cards];
                                arr[idx] = { ...arr[idx], imageUrl: url };
                                updateActiveSubpage({ cards: arr });
                              }}
                              helpText="Empty = text-only card."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBPAGE TAB: CAPABILITIES / FEATURES */}
                {subpageActiveTab === 'features' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Capabilities and solutions list for {previewSlug}.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const newFeat = {
                            id: `f_${Date.now()}`,
                            title: 'New Engineering Capability',
                            desc: 'Detailed capability description.',
                          };
                          updateActiveSubpage({ features: [...sub.features, newFeat] });
                        }}
                        className="btn-unispark-pill text-xs py-1.5 px-3 inline-flex items-center gap-1"
                      >
                        <FaPlus className="w-2.5 h-2.5" /> Add Capability
                      </button>
                    </div>

                    <div className="space-y-3">
                      {sub.features.map((feat, idx) => (
                        <div key={feat.id || `feat_${idx}`} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-800">
                              Capability #{idx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const arr = [...sub.features];
                                  const temp = arr[idx - 1];
                                  arr[idx - 1] = arr[idx];
                                  arr[idx] = temp;
                                  updateActiveSubpage({ features: arr });
                                }}
                                className="p-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 text-xs"
                              >
                                <FaArrowUp className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === sub.features.length - 1}
                                onClick={() => {
                                  const arr = [...sub.features];
                                  const temp = arr[idx + 1];
                                  arr[idx + 1] = arr[idx];
                                  arr[idx] = temp;
                                  updateActiveSubpage({ features: arr });
                                }}
                                className="p-1 rounded bg-white border border-gray-200 text-gray-500 hover:text-gray-900 disabled:opacity-30 text-xs"
                              >
                                <FaArrowDown className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const arr = sub.features.filter((_, i) => i !== idx);
                                  updateActiveSubpage({ features: arr });
                                }}
                                className="p-1 rounded bg-white border border-gray-200 text-red-500 hover:bg-red-50 text-xs"
                              >
                                <FaTrash className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={feat.title || ''}
                              placeholder="Title"
                              onChange={(e) => {
                                const arr = [...sub.features];
                                arr[idx] = { ...arr[idx], title: e.target.value };
                                updateActiveSubpage({ features: arr });
                              }}
                              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                            />
                            <input
                              type="text"
                              value={feat.desc || feat.description || ''}
                              placeholder="Description"
                              onChange={(e) => {
                                const arr = [...sub.features];
                                arr[idx] = { ...arr[idx], desc: e.target.value, description: e.target.value };
                                updateActiveSubpage({ features: arr });
                              }}
                              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBPAGE TAB: STATISTICS */}
                {subpageActiveTab === 'stats' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Key statistics metrics for {previewSlug}.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const newStat = {
                            id: `s_${Date.now()}`,
                            value: '99.9%',
                            label: 'Metrics Label',
                          };
                          updateActiveSubpage({ statistics: [...sub.statistics, newStat] });
                        }}
                        className="btn-unispark-pill text-xs py-1.5 px-3 inline-flex items-center gap-1"
                      >
                        <FaPlus className="w-2.5 h-2.5" /> Add Statistic
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {sub.statistics.map((stat, idx) => (
                        <div key={stat.id || `stat_${idx}`} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-600">Metric #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const arr = sub.statistics.filter((_, i) => i !== idx);
                                updateActiveSubpage({ statistics: arr });
                              }}
                              className="text-red-400 hover:text-red-600 text-xs"
                            >
                              <FaTrash className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-500">Value</label>
                            <input
                              type="text"
                              value={stat.value || ''}
                              onChange={(e) => {
                                const arr = [...sub.statistics];
                                arr[idx] = { ...arr[idx], value: e.target.value };
                                updateActiveSubpage({ statistics: arr });
                              }}
                              className="w-full px-2.5 py-1 rounded border border-gray-200 text-xs font-bold text-[#0470aa] bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-500">Label</label>
                            <input
                              type="text"
                              value={stat.label || ''}
                              onChange={(e) => {
                                const arr = [...sub.statistics];
                                arr[idx] = { ...arr[idx], label: e.target.value };
                                updateActiveSubpage({ statistics: arr });
                              }}
                              className="w-full px-2.5 py-1 rounded border border-gray-200 text-xs text-gray-700 bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBPAGE TAB: SECTION VISIBILITY */}
                {subpageActiveTab === 'visibility' && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">
                      Toggle section visibility specifically for the <strong>{previewSlug}</strong> subpage:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'hero', label: 'Hero Header' },
                        { key: 'overview', label: 'Overview Section' },
                        { key: 'cards', label: 'Domain Cards' },
                        { key: 'features', label: 'Capabilities List' },
                        { key: 'statistics', label: 'Key Statistics' },
                        { key: 'cta', label: 'Bottom CTA' },
                      ].map((item) => {
                        const isVisible = sub.visibility[item.key] !== false;
                        return (
                          <div
                            key={item.key}
                            className="p-3 rounded-xl border border-gray-200 bg-gray-50/50 flex items-center justify-between"
                          >
                            <span className="text-xs font-bold text-gray-800">{item.label}</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateActiveSubpage({
                                  visibility: {
                                    ...sub.visibility,
                                    [item.key]: !isVisible,
                                  },
                                })
                              }
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                isVisible
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {isVisible ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
                              <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 11: SECTION VISIBILITY (MAIN LANDING PAGE) */}
      {activeTab === 'visibility' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900">Main Landing Page Section Visibility</h3>
          <p className="text-xs text-gray-500">
            Show or hide individual sections on the main /industries landing page. Hidden sections are preserved in the CMS and can be re-enabled at any time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {[
              { key: 'hero', label: '1. Sector Header Banner', desc: 'Hero title, badge, breadcrumb, and imagery' },
              { key: 'overview', label: '2. Sector Overview', desc: 'Heading, narrative paragraphs, and side image' },
              { key: 'cards', label: '3. Industry Vertical Cards', desc: 'Grid of specialized industry verticals' },
              { key: 'approach', label: '4. Engineering Approach', desc: 'Numbered core architectural principles' },
              { key: 'framework', label: '5. Capability Framework', desc: 'Multi-layer system capability grid' },
              { key: 'served', label: '6. Industries Served Band', desc: 'Interactive industry name pills' },
              { key: 'why', label: '7. Why Choose Us', desc: 'UniSpark differentiator highlights' },
              { key: 'faq', label: '8. FAQ Section', desc: 'Accordion of common industry questions' },
              { key: 'cta', label: '9. Bottom CTA Band', desc: 'Consultation booking and background imagery' },
            ].map((sec) => {
              const isShown = data.visibility?.[sec.key] !== false;
              return (
                <div
                  key={sec.key}
                  className={`p-4 rounded-xl border transition-all ${
                    isShown
                      ? 'border-sky-200 bg-sky-50/30'
                      : 'border-gray-200 bg-gray-50/50 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-gray-900">{sec.label}</h4>
                    <button
                      type="button"
                      onClick={() =>
                        updateData({
                          visibility: {
                            ...(data.visibility || {}),
                            [sec.key]: !isShown,
                          },
                        })
                      }
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isShown
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isShown ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
                      <span>{isShown ? 'Shown' : 'Hidden'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{sec.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIVE PREVIEW PANEL */}
      {showPreview && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-gray-900">Live Preview</span>
              <span className="text-[10px] text-gray-400 font-mono">React Render Engine — instant draft sync</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {[
                  { id: 'landing', label: 'Main Page' },
                  { id: 'details', label: 'Sub-Page' },
                ].map((m) => (
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

              {previewMode === 'details' && (
                <select
                  value={previewSlug}
                  onChange={(e) => setPreviewSlug(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-[#0470aa] bg-white"
                >
                  {INDUSTRY_SLUGS.map((ind) => (
                    <option key={ind.slug} value={ind.slug}>{ind.title}</option>
                  ))}
                </select>
              )}

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {[
                  ['desktop', FaDesktop],
                  ['tablet', FaTabletAlt],
                  ['mobile', FaMobileAlt],
                ].map(([dev, Icon]) => (
                  <button
                    key={dev}
                    onClick={() => setPreviewDevice(dev)}
                    className={`p-1.5 rounded text-xs transition-all ${
                      previewDevice === dev ? 'bg-[#0470aa] text-white' : 'text-gray-400 hover:text-gray-700'
                    }`}
                    title={`${dev[0].toUpperCase()}${dev.slice(1)} view`}
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
              {previewMode === 'landing' ? (
                <Industries data={data} />
              ) : (
                <IndustryDetailsContent
                  industry={
                    INDUSTRY_SLUGS.find((i) => i.slug === previewSlug) || INDUSTRY_SLUGS[0]
                  }
                  details={data.industryDetails?.[previewSlug] || {}}
                  ctaImage={data.cta || {}}
                />
              )}
            </div>
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
              <ImagePickerField
                label="Card Image"
                folder="industries"
                value={editingIndustry.imageUrl || ''}
                onChange={(url) => setEditingIndustry({ ...editingIndustry, imageUrl: url })}
                helpText="Optional per-card image from the media library. Leave empty for the icon-only card."
              />
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-200">
                <span className="text-xs font-semibold text-gray-700">Show card image</span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingIndustry({
                      ...editingIndustry,
                      showImage: editingIndustry.showImage === false,
                    })
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    editingIndustry.showImage === false
                      ? 'bg-gray-100 text-gray-500 border border-gray-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {editingIndustry.showImage === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                  <span>{editingIndustry.showImage === false ? 'Hidden' : 'Shown'}</span>
                </button>
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
