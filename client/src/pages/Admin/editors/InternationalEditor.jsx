import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { notifyCMSPublish } from '../../../hooks/useCMS';
import ImagePickerField from '../../../components/admin/ImagePickerField';
import { International } from '../../International/International';
import { IntlSubpageContent } from '../../International/IntlSubpageContent';
import {
  DEFAULT_INTERNATIONAL_DATA,
  DEFAULT_INTERNATIONAL_VISIBILITY,
  DEFAULT_INTERNATIONAL_SUBPAGES,
  INTERNATIONAL_SUBPAGES_LIST,
  getInternationalSubpageDefaults,
} from '../../../constants/internationalDefaults';
import {
  FaSave, FaExternalLinkAlt, FaPlus, FaTrash,
  FaCheckCircle, FaSpinner, FaEye, FaEyeSlash,
  FaDesktop, FaTabletAlt, FaMobileAlt, FaPaperPlane,
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input {...props} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30" />
);

const Textarea = (props) => (
  <textarea {...props} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#0470aa]/30 resize-none" />
);

const VisibilityToggle = ({ visible, onToggle, label }) => (
  <button type="button" onClick={onToggle}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${visible === false ? 'bg-gray-100 text-gray-500 border border-gray-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
    {visible === false ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
    <span>{visible === false ? `${label} Hidden` : `${label} Shown`}</span>
  </button>
);

const DEFAULT_DATA = {
  ...DEFAULT_INTERNATIONAL_DATA,
  visibility: { ...DEFAULT_INTERNATIONAL_VISIBILITY },
  subpages: { ...DEFAULT_INTERNATIONAL_SUBPAGES },
};

export const InternationalEditor = () => {
  const { token } = useAuth();
  // 'main' = International landing page; any other string = subpage slug
  const [activeScope, setActiveScope] = useState('main');
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState('banner');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autosaveTimerRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState('landing');
  const [previewSlug, setPreviewSlug] = useState(INTERNATIONAL_SUBPAGES_LIST[0]?.slug || 'technology-security');
  const [previewDevice, setPreviewDevice] = useState('desktop');

  // Load main International landing page CMS record
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE}/pages/international`, { headers });
        if (res.ok) {
          const json = await res.json();
          const remote = json.page?.draftVersion?.content || json.page?.publishedVersion?.content;
          if (remote) {
            setData((prev) => ({
              ...DEFAULT_DATA, ...remote,
              banner: { ...DEFAULT_DATA.banner, ...(remote.banner || {}) },
              intro: { ...DEFAULT_DATA.intro, ...(remote.intro || {}) },
              complexity: { ...DEFAULT_DATA.complexity, ...(remote.complexity || {}) },
              framework: { ...DEFAULT_DATA.framework, ...(remote.framework || {}) },
              whyChooseUs: { ...DEFAULT_DATA.whyChooseUs, ...(remote.whyChooseUs || {}) },
              cta: { ...DEFAULT_DATA.cta, ...(remote.cta || {}) },
              visibility: { ...DEFAULT_INTERNATIONAL_VISIBILITY, ...(remote.visibility || {}) },
              domains: Array.isArray(remote.domains) && remote.domains.length > 0 ? remote.domains : DEFAULT_DATA.domains,
              detailedSolutions: Array.isArray(remote.detailedSolutions) && remote.detailedSolutions.length > 0 ? remote.detailedSolutions : DEFAULT_DATA.detailedSolutions,
              categories: Array.isArray(remote.categories) && remote.categories.length > 0 ? remote.categories : DEFAULT_DATA.categories,
              faqs: Array.isArray(remote.faqs) && remote.faqs.length > 0 ? remote.faqs : DEFAULT_DATA.faqs,
              subpages: { ...DEFAULT_INTERNATIONAL_SUBPAGES, ...(remote.subpages || {}) },
            }));
          }
        }
      } catch (err) { console.warn('Using default international configuration:', err); }
      finally { setTimeout(() => { isInitialLoadRef.current = false; }, 600); }
    };
    fetchData();
  }, [token]);

  // Load dedicated subpage CMS record when switching to a subpage scope
  const fetchSubpageConfig = useCallback(async (slug) => {
    if (!slug || slug === 'main') return;
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE}/pages/international/${slug}`, { headers });
      if (res.ok) {
        const json = await res.json();
        const remote = json.page?.draftVersion?.content || json.page?.publishedVersion?.content;
        if (remote && Object.keys(remote).length > 0 && remote.hero) {
          setData((prev) => ({
            ...prev,
            subpages: {
              ...(prev.subpages || {}),
              [slug]: {
                ...getInternationalSubpageDefaults(slug),
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

  // Switch between Main Landing and any Subpage
  const handleSwitchScope = (scope) => {
    setActiveScope(scope);
    if (scope === 'main') {
      setPreviewMode('landing');
      setActiveTab('banner');
    } else {
      setPreviewMode('subpage');
      setPreviewSlug(scope);
      setActiveTab('sp_hero');
      fetchSubpageConfig(scope);
    }
  };

  const triggerAutosave = useCallback((updatedData, currentScope = activeScope) => {
    if (isInitialLoadRef.current) return;
    setHasUnsavedChanges(true);
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
        if (currentScope === 'main') {
          await fetch(`${API_BASE}/pages/international`, {
            method: 'PUT', headers,
            body: JSON.stringify({ title: 'International', slug: 'international', content: updatedData, publish: false }),
          });
        } else {
          const subData = updatedData.subpages?.[currentScope] || getInternationalSubpageDefaults(currentScope);
          const spMeta = INTERNATIONAL_SUBPAGES_LIST.find((s) => s.slug === currentScope);
          await fetch(`${API_BASE}/pages/international/${currentScope}`, {
            method: 'PUT', headers,
            body: JSON.stringify({
              title: spMeta?.title || currentScope,
              slug: `international/${currentScope}`,
              content: subData,
              publish: false,
            }),
          });
        }
        setHasUnsavedChanges(false); setSaveStatus('draft_saved'); setTimeout(() => setSaveStatus(null), 3000);
      } catch { } finally { setSaving(false); }
    }, 1500);
  }, [token, activeScope]);

  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      triggerAutosave(next, activeScope);
      return next;
    });
  };

  const handleSaveDraft = async () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setSaving(true); setSaveStatus(null);
    try {
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      if (activeScope === 'main') {
        const res = await fetch(`${API_BASE}/pages/international`, {
          method: 'PUT', headers,
          body: JSON.stringify({ title: 'International', slug: 'international', content: data, publish: false }),
        });
        if (res.ok) { setHasUnsavedChanges(false); setSaveStatus('draft_saved'); setTimeout(() => setSaveStatus(null), 3500); }
        else setSaveStatus('error');
      } else {
        const subData = data.subpages?.[activeScope] || getInternationalSubpageDefaults(activeScope);
        const spMeta = INTERNATIONAL_SUBPAGES_LIST.find((s) => s.slug === activeScope);
        const res = await fetch(`${API_BASE}/pages/international/${activeScope}`, {
          method: 'PUT', headers,
          body: JSON.stringify({
            title: spMeta?.title || activeScope,
            slug: `international/${activeScope}`,
            content: subData,
            publish: false,
          }),
        });
        if (res.ok) { setHasUnsavedChanges(false); setSaveStatus('draft_saved'); setTimeout(() => setSaveStatus(null), 3500); }
        else setSaveStatus('error');
      }
    } catch { setSaveStatus('error'); } finally { setSaving(false); }
  };

  const handlePublish = async () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setPublishing(true); setSaveStatus(null);
    try {
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      if (activeScope === 'main') {
        const res = await fetch(`${API_BASE}/pages/international`, {
          method: 'PUT', headers,
          body: JSON.stringify({ title: 'International', slug: 'international', content: data, publish: true }),
        });
        if (res.ok) { notifyCMSPublish('international'); setHasUnsavedChanges(false); setSaveStatus('published'); setTimeout(() => setSaveStatus(null), 4000); }
        else setSaveStatus('error');
      } else {
        const subData = data.subpages?.[activeScope] || getInternationalSubpageDefaults(activeScope);
        const spMeta = INTERNATIONAL_SUBPAGES_LIST.find((s) => s.slug === activeScope);
        const res = await fetch(`${API_BASE}/pages/international/${activeScope}`, {
          method: 'PUT', headers,
          body: JSON.stringify({
            title: spMeta?.title || activeScope,
            slug: `international/${activeScope}`,
            content: subData,
            publish: true,
          }),
        });
        if (res.ok) {
          notifyCMSPublish(`international/${activeScope}`);
          notifyCMSPublish('international'); // Also refresh parent
          setHasUnsavedChanges(false); setSaveStatus('published'); setTimeout(() => setSaveStatus(null), 4000);
        } else setSaveStatus('error');
      }
    } catch { setSaveStatus('error'); } finally { setPublishing(false); }
  };

  // The effective subpage slug for the editor panel
  const editSlug = activeScope !== 'main' ? activeScope : previewSlug;

  const getActiveSubpage = (slug = editSlug) => {
    const raw = data.subpages?.[slug];
    const def = getInternationalSubpageDefaults(slug);
    return {
      hero: { ...def.hero, ...(raw?.hero || {}) },
      intro: { ...def.intro, ...(raw?.intro || {}) },
      challenges: { ...def.challenges, ...(raw?.challenges || {}) },
      services: { ...def.services, ...(raw?.services || {}) },
      checklist: { ...def.checklist, ...(raw?.checklist || {}) },
      insight: { ...def.insight, ...(raw?.insight || {}) },
      cta: { ...def.cta, ...(raw?.cta || {}) },
      visibility: { ...def.visibility, ...(raw?.visibility || {}) },
    };
  };

  const updateActiveSubpage = (patch, targetSlug = editSlug) => {
    updateData((prev) => {
      const current = prev.subpages?.[targetSlug] || getInternationalSubpageDefaults(targetSlug);
      const next = typeof patch === 'function' ? patch(current) : { ...current, ...patch };
      return { ...prev, subpages: { ...(prev.subpages || {}), [targetSlug]: next } };
    });
  };

  const deviceWidth = previewDevice === 'mobile' ? 'max-w-[390px]' : previewDevice === 'tablet' ? 'max-w-[768px]' : 'max-w-full';
  const TAB_BASE = 'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all';
  const TAB_ACTIVE = 'bg-[#0470aa] text-white shadow-sm';
  const TAB_IDLE = 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200';
  const activeSubpage = getActiveSubpage();
  const previewData = { ...data, subpages: data.subpages || {} };

  const MAIN_TABS = [
    { id: 'banner', label: '1. Hero Banner' },
    { id: 'intro', label: '2. Operating Model' },
    { id: 'complexity', label: '3. Complexity' },
    { id: 'domains', label: '4. Domains' },
    { id: 'solutions', label: '5. Solutions' },
    { id: 'framework', label: '6. Framework' },
    { id: 'categories', label: '7. Categories' },
    { id: 'why', label: '8. Why Us' },
    { id: 'cta', label: '9. CTA' },
    { id: 'faqs', label: '10. FAQs' },
    { id: 'subpages', label: '11. Sub-Pages' },
    { id: 'visibility', label: '12. Visibility' },
  ];

  const SUB_TABS = [
    {id:'sp_hero',label:'Hero'},{id:'sp_intro',label:'Overview'},
    {id:'sp_challenges',label:'Challenges'},{id:'sp_services',label:'Services'},
    {id:'sp_checklist',label:'Checklist'},{id:'sp_insight',label:'Insight'},
    {id:'sp_cta',label:'CTA'},{id:'sp_visibility',label:'Visibility'},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-[#0470aa]">International CMS</span>
            {activeScope !== 'main' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                {INTERNATIONAL_SUBPAGES_LIST.find((s) => s.slug === activeScope)?.title || activeScope}
              </span>
            )}
            <span className="text-xs text-gray-500">Live Website Sync</span>
            {saving && <span className="flex items-center gap-1 text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium"><FaSpinner className="animate-spin w-2.5 h-2.5" /> Autosaving...</span>}
            {hasUnsavedChanges && !saving && <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Unsaved edits</span>}
            {saveStatus === 'draft_saved' && <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium"><FaCheckCircle className="w-2.5 h-2.5" /> Draft saved</span>}
            {saveStatus === 'published' && <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold"><FaCheckCircle className="w-2.5 h-2.5" /> Published!</span>}
            {saveStatus === 'error' && <span className="text-[11px] text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">Save failed</span>}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 font-poppins">International Enterprise Operations — Live Editor</h1>
          <p className="text-xs text-gray-500 mt-0.5">Configure the International landing page and all 14+ sub-pages with instant live preview.</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button type="button" onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50">
            {showPreview ? <FaEyeSlash className="w-3 h-3" /> : <FaEye className="w-3 h-3" />}
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>
          <a href={activeScope === 'main' ? '/international' : `/international/${activeScope}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#0470aa] hover:bg-gray-50 transition-colors">
            <FaExternalLinkAlt className="w-3 h-3" /><span>View Live Site</span>
          </a>
          <button type="button" onClick={handleSaveDraft} disabled={saving || publishing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition-colors disabled:opacity-50">
            {saving ? <FaSpinner className="animate-spin w-3 h-3 text-[#0470aa]" /> : <FaSave className="w-3 h-3 text-gray-500" />}
            <span>Save Draft</span>
          </button>
          <button type="button" onClick={handlePublish} disabled={saving || publishing}
            className="btn-unispark-pill text-xs py-2 px-4 inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50">
            {publishing ? <FaSpinner className="animate-spin w-3 h-3" /> : <FaPaperPlane className="w-3 h-3" />}
            <span>{publishing ? 'Publishing...' : 'Publish to Live Site'}</span>
          </button>
        </div>
      </div>

      {/* Scope Switcher: Main Landing vs Sub-Pages */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSwitchScope('main')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeScope === 'main'
                ? 'bg-[#0470aa] text-white border-[#0470aa] shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white hover:border-[#0470aa]/40'
            }`}
          >
            🌐 Main Landing Page
          </button>
          <span className="text-xs text-gray-400 font-medium">or select a sub-page →</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
          {INTERNATIONAL_SUBPAGES_LIST.map((sp) => (
            <button
              key={sp.slug}
              type="button"
              onClick={() => handleSwitchScope(sp.slug)}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold text-left transition-all ${
                activeScope === sp.slug
                  ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-xs'
                  : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-white hover:border-purple-300/60'
              }`}
            >
              {sp.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tabs (only shown when editing main landing page) */}
      {activeScope === 'main' && (
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {MAIN_TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`${TAB_BASE} ${activeTab === tab.id ? TAB_ACTIVE : TAB_IDLE}`}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Sub-Page Tabs (only shown when editing a subpage) */}
      {activeScope !== 'main' && (
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          <button type="button" onClick={() => handleSwitchScope('main')} className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            ← Main Page
          </button>
          {SUB_TABS.map((st) => (
            <button key={st.id} onClick={() => setActiveTab(st.id)}
              className={`${TAB_BASE} ${activeTab === st.id ? 'bg-purple-600 text-white shadow-sm' : TAB_IDLE}`}>
              {st.label}
            </button>
          ))}
        </div>
      )}

      {/* Split layout */}
      <div className={`flex gap-6 ${showPreview ? 'flex-col xl:flex-row' : ''}`}>
        {/* Editor Panel */}
        <div className={showPreview ? 'xl:w-[480px] flex-shrink-0' : 'w-full'}>

          {/* 1. HERO BANNER */}
          {activeTab === 'banner' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h3 className="text-base font-bold text-gray-900">Hero Banner</h3>
              <Field label="Badge"><Input value={data.banner?.badge || ''} onChange={(e) => updateData({ banner: { ...data.banner, badge: e.target.value } })} /></Field>
              <Field label="Title"><Input value={data.banner?.title || ''} onChange={(e) => updateData({ banner: { ...data.banner, title: e.target.value } })} /></Field>
              <Field label="Description"><Textarea rows={3} value={data.banner?.description || ''} onChange={(e) => updateData({ banner: { ...data.banner, description: e.target.value } })} /></Field>
              <Field label="Primary Button Text"><Input value={data.banner?.primaryBtnText || ''} onChange={(e) => updateData({ banner: { ...data.banner, primaryBtnText: e.target.value } })} /></Field>
              <Field label="Secondary Button Text"><Input value={data.banner?.secondaryBtnText || ''} onChange={(e) => updateData({ banner: { ...data.banner, secondaryBtnText: e.target.value } })} /></Field>
              <ImagePickerField label="Hero Background Image" folder="international" value={data.banner?.imageUrl || ''}
                onChange={(url) => updateData({ banner: { ...data.banner, imageUrl: url } })} helpText="Shown as the hero background." />
              {data.banner?.imageUrl && <div className="rounded-xl overflow-hidden h-40 bg-gray-100 border border-gray-200"><img src={data.banner.imageUrl} alt="" className="w-full h-full object-cover" /></div>}
            </div>
          )}

          {/* 2. INTRO */}
          {activeTab === 'intro' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Operating Model Introduction</h3>
              <Field label="Badge"><Input value={data.intro?.badge || ''} onChange={(e) => updateData({ intro: { ...data.intro, badge: e.target.value } })} /></Field>
              <Field label="Title"><Input value={data.intro?.title || ''} onChange={(e) => updateData({ intro: { ...data.intro, title: e.target.value } })} /></Field>
              <Field label="Subtitle"><Textarea rows={2} value={data.intro?.subtitle || ''} onChange={(e) => updateData({ intro: { ...data.intro, subtitle: e.target.value } })} /></Field>
              <Field label="Description Paragraph 1"><Textarea rows={3} value={data.intro?.description1 || ''} onChange={(e) => updateData({ intro: { ...data.intro, description1: e.target.value } })} /></Field>
              <Field label="Description Paragraph 2"><Textarea rows={3} value={data.intro?.description2 || ''} onChange={(e) => updateData({ intro: { ...data.intro, description2: e.target.value } })} /></Field>
              <ImagePickerField label="Section Image" folder="international" value={data.intro?.imageUrl || ''} onChange={(url) => updateData({ intro: { ...data.intro, imageUrl: url } })} helpText="Image alongside intro text." />
            </div>
          )}

          {/* 3. COMPLEXITY */}
          {activeTab === 'complexity' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h3 className="text-base font-bold text-gray-900">Operational Complexity Section</h3>
              <Field label="Badge"><Input value={data.complexity?.badge || ''} onChange={(e) => updateData({ complexity: { ...data.complexity, badge: e.target.value } })} /></Field>
              <Field label="Title"><Input value={data.complexity?.title || ''} onChange={(e) => updateData({ complexity: { ...data.complexity, title: e.target.value } })} /></Field>
              <Field label="Subtitle"><Textarea rows={2} value={data.complexity?.subtitle || ''} onChange={(e) => updateData({ complexity: { ...data.complexity, subtitle: e.target.value } })} /></Field>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Challenge Cards</h4>
                  <button type="button"
                    onClick={() => updateData({ complexity: { ...data.complexity, challenges: [...(data.complexity?.challenges || []), { num: String((data.complexity?.challenges?.length || 0) + 1).padStart(2,'0'), title: 'New Challenge', desc: '' }] } })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-[#0470aa] text-xs font-semibold border border-sky-200 hover:bg-sky-100">
                    <FaPlus className="w-3 h-3" /> Add
                  </button>
                </div>
                {(data.complexity?.challenges || []).map((ch, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 space-y-3 mb-3 bg-gray-50/40">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-[#0470aa]">Challenge {idx + 1}</span>
                      <button type="button" onClick={() => updateData({ complexity: { ...data.complexity, challenges: (data.complexity?.challenges || []).filter((_, i) => i !== idx) } })} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button>
                    </div>
                    <Field label="Number"><Input value={ch.num || ''} onChange={(e) => { const a=[...(data.complexity?.challenges||[])]; a[idx]={...a[idx],num:e.target.value}; updateData({complexity:{...data.complexity,challenges:a}}); }} /></Field>
                    <Field label="Title"><Input value={ch.title || ''} onChange={(e) => { const a=[...(data.complexity?.challenges||[])]; a[idx]={...a[idx],title:e.target.value}; updateData({complexity:{...data.complexity,challenges:a}}); }} /></Field>
                    <Field label="Description"><Textarea rows={2} value={ch.desc || ''} onChange={(e) => { const a=[...(data.complexity?.challenges||[])]; a[idx]={...a[idx],desc:e.target.value}; updateData({complexity:{...data.complexity,challenges:a}}); }} /></Field>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-800 uppercase">Summary Paragraphs</h4>
                  <button type="button" onClick={() => updateData({ complexity: { ...data.complexity, summaryProse: [...(data.complexity?.summaryProse || []), ''] } })} className="text-xs text-[#0470aa] font-semibold flex items-center gap-1"><FaPlus className="w-3 h-3" /> Add</button>
                </div>
                {(data.complexity?.summaryProse || []).map((para, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Textarea rows={2} value={para} onChange={(e) => { const a=[...(data.complexity?.summaryProse||[])]; a[idx]=e.target.value; updateData({complexity:{...data.complexity,summaryProse:a}}); }} />
                    <button type="button" onClick={() => updateData({ complexity: { ...data.complexity, summaryProse: (data.complexity?.summaryProse||[]).filter((_,i)=>i!==idx) } })} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. DOMAINS */}
          {activeTab === 'domains' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div className="flex justify-between">
                <h3 className="text-base font-bold text-gray-900">Core Operational Domains</h3>
                <button type="button" onClick={() => updateData({ domains: [...(data.domains||[]), { id:`dom_${Date.now()}`, name:'New Domain', path:'/international/new', iconName:'FaGlobe', badge:'Domain', blurb:'', drawer:[] }] })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-[#0470aa] text-xs font-semibold border border-sky-200 hover:bg-sky-100"><FaPlus className="w-3 h-3" /> Add</button>
              </div>
              {(data.domains || []).map((domain, dIdx) => (
                <div key={domain.id || dIdx} className="p-4 rounded-xl border border-gray-200 space-y-4 bg-gray-50/40">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-[#0470aa]">Domain {dIdx + 1}</span>
                    <button type="button" onClick={() => updateData({ domains: (data.domains||[]).filter((_,i)=>i!==dIdx) })} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name"><Input value={domain.name||''} onChange={(e)=>{const a=[...(data.domains||[])];a[dIdx]={...a[dIdx],name:e.target.value};updateData({domains:a});}} /></Field>
                    <Field label="Badge"><Input value={domain.badge||''} onChange={(e)=>{const a=[...(data.domains||[])];a[dIdx]={...a[dIdx],badge:e.target.value};updateData({domains:a});}} /></Field>
                    <Field label="Path"><Input value={domain.path||''} onChange={(e)=>{const a=[...(data.domains||[])];a[dIdx]={...a[dIdx],path:e.target.value};updateData({domains:a});}} /></Field>
                  </div>
                  <Field label="Blurb"><Textarea rows={2} value={domain.blurb||''} onChange={(e)=>{const a=[...(data.domains||[])];a[dIdx]={...a[dIdx],blurb:e.target.value};updateData({domains:a});}} /></Field>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-[11px] font-bold text-gray-600 uppercase">Sub-Links</span>
                      <button type="button" onClick={()=>{const a=[...(data.domains||[])];a[dIdx]={...a[dIdx],drawer:[...(a[dIdx].drawer||[]),{name:'New',path:'/international/new',desc:''}]};updateData({domains:a});}}
                        className="text-xs text-[#0470aa] font-semibold flex items-center gap-1"><FaPlus className="w-2.5 h-2.5" /> Add</button>
                    </div>
                    {(domain.drawer || []).map((sub, sIdx) => (
                      <div key={sIdx} className="p-3 rounded-xl border border-gray-100 space-y-2 mb-2 bg-white">
                        <div className="flex justify-between">
                          <span className="text-[11px] font-semibold text-gray-500">Sub-link {sIdx+1}</span>
                          <button type="button" onClick={()=>{const a=[...(data.domains||[])];a[dIdx]={...a[dIdx],drawer:a[dIdx].drawer.filter((_,i)=>i!==sIdx)};updateData({domains:a});}} className="text-red-400 hover:text-red-600"><FaTrash className="w-3 h-3" /></button>
                        </div>
                        <Field label="Name"><Input value={sub.name||''} onChange={(e)=>{const a=[...(data.domains||[])];a[dIdx].drawer[sIdx]={...a[dIdx].drawer[sIdx],name:e.target.value};updateData({domains:a});}} /></Field>
                        <Field label="Path"><Input value={sub.path||''} onChange={(e)=>{const a=[...(data.domains||[])];a[dIdx].drawer[sIdx]={...a[dIdx].drawer[sIdx],path:e.target.value};updateData({domains:a});}} /></Field>
                        <Field label="Desc"><Textarea rows={2} value={sub.desc||''} onChange={(e)=>{const a=[...(data.domains||[])];a[dIdx].drawer[sIdx]={...a[dIdx].drawer[sIdx],desc:e.target.value};updateData({domains:a});}} /></Field>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. SOLUTIONS */}
          {activeTab === 'solutions' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div className="flex justify-between">
                <h3 className="text-base font-bold text-gray-900">Detailed Enterprise Solutions</h3>
                <button type="button" onClick={()=>updateData({detailedSolutions:[...(data.detailedSolutions||[]),{id:`sol_${Date.now()}`,domain:'Technology & Security',title:'New Solution',path:'/international/new',desc:'',features:[]}]})}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-[#0470aa] text-xs font-semibold border border-sky-200 hover:bg-sky-100"><FaPlus className="w-3 h-3" /> Add</button>
              </div>
              {(data.detailedSolutions || []).map((sol, idx) => (
                <div key={sol.id||idx} className="p-4 rounded-xl border border-gray-200 space-y-3 bg-gray-50/40">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-[#0470aa]">{sol.title||`Solution ${idx+1}`}</span>
                    <button type="button" onClick={()=>updateData({detailedSolutions:(data.detailedSolutions||[]).filter((_,i)=>i!==idx)})} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Title"><Input value={sol.title||''} onChange={(e)=>{const a=[...(data.detailedSolutions||[])];a[idx]={...a[idx],title:e.target.value};updateData({detailedSolutions:a});}} /></Field>
                    <Field label="Domain">
                      <select value={sol.domain||''} onChange={(e)=>{const a=[...(data.detailedSolutions||[])];a[idx]={...a[idx],domain:e.target.value};updateData({detailedSolutions:a});}} className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50/50">
                        <option>Technology &amp; Security</option><option>Workforce &amp; Business</option><option>Security Infrastructure</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Path"><Input value={sol.path||''} onChange={(e)=>{const a=[...(data.detailedSolutions||[])];a[idx]={...a[idx],path:e.target.value};updateData({detailedSolutions:a});}} /></Field>
                  <Field label="Description"><Textarea rows={2} value={sol.desc||''} onChange={(e)=>{const a=[...(data.detailedSolutions||[])];a[idx]={...a[idx],desc:e.target.value};updateData({detailedSolutions:a});}} /></Field>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-gray-600 uppercase">Features</span>
                      <button type="button" onClick={()=>{const a=[...(data.detailedSolutions||[])];a[idx]={...a[idx],features:[...(a[idx].features||[]),'']};updateData({detailedSolutions:a});}} className="text-xs text-[#0470aa] font-semibold flex items-center gap-1"><FaPlus className="w-2.5 h-2.5" /> Add</button>
                    </div>
                    {(sol.features||[]).map((feat,fIdx)=>(
                      <div key={fIdx} className="flex gap-2 mb-1.5">
                        <Input value={feat} onChange={(e)=>{const a=[...(data.detailedSolutions||[])];a[idx].features[fIdx]=e.target.value;updateData({detailedSolutions:a});}} />
                        <button type="button" onClick={()=>{const a=[...(data.detailedSolutions||[])];a[idx].features=a[idx].features.filter((_,i)=>i!==fIdx);updateData({detailedSolutions:a});}} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 6. FRAMEWORK */}
          {activeTab === 'framework' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h3 className="text-base font-bold text-gray-900">Capability Framework</h3>
              <Field label="Badge"><Input value={data.framework?.badge||''} onChange={(e)=>updateData({framework:{...data.framework,badge:e.target.value}})} /></Field>
              <Field label="Title"><Input value={data.framework?.title||''} onChange={(e)=>updateData({framework:{...data.framework,title:e.target.value}})} /></Field>
              <Field label="Subtitle"><Textarea rows={2} value={data.framework?.subtitle||''} onChange={(e)=>updateData({framework:{...data.framework,subtitle:e.target.value}})} /></Field>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-800 uppercase">Steps</h4>
                  <button type="button" onClick={()=>updateData({framework:{...data.framework,steps:[...(data.framework?.steps||[]),{step:String((data.framework?.steps?.length||0)+1).padStart(2,'0'),title:'New Step',desc:''}]}})}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-[#0470aa] text-xs font-semibold border border-sky-200 hover:bg-sky-100"><FaPlus className="w-3 h-3" /> Add Step</button>
                </div>
                {(data.framework?.steps||[]).map((step,idx)=>(
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 space-y-3 mb-3 bg-gray-50/40">
                    <div className="flex justify-between"><span className="text-xs font-bold text-[#0470aa]">Step {step.step}</span><button type="button" onClick={()=>updateData({framework:{...data.framework,steps:(data.framework?.steps||[]).filter((_,i)=>i!==idx)}})} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button></div>
                    <Field label="Step #"><Input value={step.step||''} onChange={(e)=>{const a=[...(data.framework?.steps||[])];a[idx]={...a[idx],step:e.target.value};updateData({framework:{...data.framework,steps:a}});}} /></Field>
                    <Field label="Title"><Input value={step.title||''} onChange={(e)=>{const a=[...(data.framework?.steps||[])];a[idx]={...a[idx],title:e.target.value};updateData({framework:{...data.framework,steps:a}});}} /></Field>
                    <Field label="Description"><Textarea rows={2} value={step.desc||''} onChange={(e)=>{const a=[...(data.framework?.steps||[])];a[idx]={...a[idx],desc:e.target.value};updateData({framework:{...data.framework,steps:a}});}} /></Field>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div className="flex justify-between"><h3 className="text-base font-bold text-gray-900">Solution Categories</h3>
                <button type="button" onClick={()=>updateData({categories:[...(data.categories||[]),{title:'New Category',desc:'',path:'/international/new',tag:'New'}]})}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-[#0470aa] text-xs font-semibold border border-sky-200 hover:bg-sky-100"><FaPlus className="w-3 h-3" /> Add</button>
              </div>
              {(data.categories||[]).map((cat,idx)=>(
                <div key={idx} className="p-4 rounded-xl border border-gray-200 space-y-3 bg-gray-50/40">
                  <div className="flex justify-between"><span className="text-xs font-bold text-[#0470aa]">Category {idx+1}</span><button type="button" onClick={()=>updateData({categories:(data.categories||[]).filter((_,i)=>i!==idx)})} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button></div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Title"><Input value={cat.title||''} onChange={(e)=>{const a=[...(data.categories||[])];a[idx]={...a[idx],title:e.target.value};updateData({categories:a});}} /></Field>
                    <Field label="Tag"><Input value={cat.tag||''} onChange={(e)=>{const a=[...(data.categories||[])];a[idx]={...a[idx],tag:e.target.value};updateData({categories:a});}} /></Field>
                    <Field label="Path"><Input value={cat.path||''} onChange={(e)=>{const a=[...(data.categories||[])];a[idx]={...a[idx],path:e.target.value};updateData({categories:a});}} /></Field>
                  </div>
                  <Field label="Description"><Textarea rows={2} value={cat.desc||''} onChange={(e)=>{const a=[...(data.categories||[])];a[idx]={...a[idx],desc:e.target.value};updateData({categories:a});}} /></Field>
                </div>
              ))}
            </div>
          )}

          {/* 8. WHY */}
          {activeTab === 'why' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <h3 className="text-base font-bold text-gray-900">Why Choose Us</h3>
              <Field label="Badge"><Input value={data.whyChooseUs?.badge||''} onChange={(e)=>updateData({whyChooseUs:{...data.whyChooseUs,badge:e.target.value}})} /></Field>
              <Field label="Title"><Input value={data.whyChooseUs?.title||''} onChange={(e)=>updateData({whyChooseUs:{...data.whyChooseUs,title:e.target.value}})} /></Field>
              <Field label="Subtitle"><Textarea rows={2} value={data.whyChooseUs?.subtitle||''} onChange={(e)=>updateData({whyChooseUs:{...data.whyChooseUs,subtitle:e.target.value}})} /></Field>
              <Field label="Insight Quote"><Textarea rows={3} value={data.whyChooseUs?.insightQuote||''} onChange={(e)=>updateData({whyChooseUs:{...data.whyChooseUs,insightQuote:e.target.value}})} /></Field>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between mb-3"><h4 className="text-xs font-bold text-gray-800 uppercase">Value Pillars</h4>
                  <button type="button" onClick={()=>updateData({whyChooseUs:{...data.whyChooseUs,pillars:[...(data.whyChooseUs?.pillars||[]),{title:'New Pillar',desc:''}]}})}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-[#0470aa] text-xs font-semibold border border-sky-200 hover:bg-sky-100"><FaPlus className="w-3 h-3" /> Add</button>
                </div>
                {(data.whyChooseUs?.pillars||[]).map((pillar,idx)=>(
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 space-y-3 mb-3 bg-gray-50/40">
                    <div className="flex justify-between"><span className="text-xs font-bold text-[#0470aa]">Pillar {idx+1}</span><button type="button" onClick={()=>updateData({whyChooseUs:{...data.whyChooseUs,pillars:(data.whyChooseUs?.pillars||[]).filter((_,i)=>i!==idx)}})} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button></div>
                    <Field label="Title"><Input value={pillar.title||''} onChange={(e)=>{const a=[...(data.whyChooseUs?.pillars||[])];a[idx]={...a[idx],title:e.target.value};updateData({whyChooseUs:{...data.whyChooseUs,pillars:a}});}} /></Field>
                    <Field label="Description"><Textarea rows={2} value={pillar.desc||''} onChange={(e)=>{const a=[...(data.whyChooseUs?.pillars||[])];a[idx]={...a[idx],desc:e.target.value};updateData({whyChooseUs:{...data.whyChooseUs,pillars:a}});}} /></Field>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. CTA */}
          {activeTab === 'cta' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Consultation / CTA Section</h3>
              <Field label="Badge"><Input value={data.cta?.badge||''} onChange={(e)=>updateData({cta:{...data.cta,badge:e.target.value}})} /></Field>
              <Field label="Title"><Input value={data.cta?.title||''} onChange={(e)=>updateData({cta:{...data.cta,title:e.target.value}})} /></Field>
              <Field label="Subtitle"><Textarea rows={2} value={data.cta?.subtitle||''} onChange={(e)=>updateData({cta:{...data.cta,subtitle:e.target.value}})} /></Field>
              <Field label="Primary Button Text"><Input value={data.cta?.primaryBtnText||''} onChange={(e)=>updateData({cta:{...data.cta,primaryBtnText:e.target.value}})} /></Field>
              <Field label="Secondary Button Text"><Input value={data.cta?.secondaryBtnText||''} onChange={(e)=>updateData({cta:{...data.cta,secondaryBtnText:e.target.value}})} /></Field>
              <Field label="Secondary Button Link"><Input value={data.cta?.secondaryBtnLink||''} onChange={(e)=>updateData({cta:{...data.cta,secondaryBtnLink:e.target.value}})} /></Field>
            </div>
          )}

          {/* 10. FAQs */}
          {activeTab === 'faqs' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div className="flex justify-between"><h3 className="text-base font-bold text-gray-900">FAQ Accordion</h3>
                <button type="button" onClick={()=>updateData({faqs:[...(data.faqs||[]),{question:'New Question?',answer:''}]})}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-[#0470aa] text-xs font-semibold border border-sky-200 hover:bg-sky-100"><FaPlus className="w-3 h-3" /> Add FAQ</button>
              </div>
              {(data.faqs||[]).map((faq,idx)=>(
                <div key={idx} className="p-4 rounded-xl border border-gray-200 space-y-3 bg-gray-50/40">
                  <div className="flex justify-between"><span className="text-xs font-bold text-[#0470aa]">FAQ {idx+1}</span><button type="button" onClick={()=>updateData({faqs:(data.faqs||[]).filter((_,i)=>i!==idx)})} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button></div>
                  <Field label="Question"><Input value={faq.question||''} onChange={(e)=>{const a=[...(data.faqs||[])];a[idx]={...a[idx],question:e.target.value};updateData({faqs:a});}} /></Field>
                  <Field label="Answer"><Textarea rows={3} value={faq.answer||''} onChange={(e)=>{const a=[...(data.faqs||[])];a[idx]={...a[idx],answer:e.target.value};updateData({faqs:a});}} /></Field>
                </div>
              ))}
            </div>
          )}

          {/* 11. SUB-PAGES selector (kept for backward compat but now just links to scope switcher) */}
          {activeTab === 'subpages' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Select Sub-Page to Edit</h3>
              <p className="text-xs text-gray-500">Use the scope switcher at the top to edit any sub-page with its own dedicated CMS record and live preview.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTERNATIONAL_SUBPAGES_LIST.map((sp) => (
                  <button key={sp.slug} type="button"
                    onClick={() => handleSwitchScope(sp.slug)}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${activeScope===sp.slug?'border-purple-400 bg-purple-50 text-purple-700 shadow-xs':'border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-white hover:border-purple-300/60'}`}>
                    {sp.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SUB-PAGE EDITING — renders when activeScope is a subpage OR from the old sp_ tabs in subpages mode */}
          {(activeScope !== 'main' || activeTab.startsWith('sp_')) && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    {INTERNATIONAL_SUBPAGES_LIST.find((sp) => sp.slug === editSlug)?.title || editSlug}
                  </h3>
                  <a href={`/international/${editSlug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0470aa] font-semibold hover:underline flex items-center gap-1">
                    <FaExternalLinkAlt className="w-2.5 h-2.5" /> View Page
                  </a>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                {activeTab==='sp_hero' && <>
                  <Field label="Badge"><Input value={activeSubpage.hero?.badge||''} onChange={(e)=>updateActiveSubpage({hero:{...activeSubpage.hero,badge:e.target.value}})} /></Field>
                  <Field label="Title"><Input value={activeSubpage.hero?.title||''} onChange={(e)=>updateActiveSubpage({hero:{...activeSubpage.hero,title:e.target.value}})} /></Field>
                  <Field label="Description"><Textarea rows={3} value={activeSubpage.hero?.description||''} onChange={(e)=>updateActiveSubpage({hero:{...activeSubpage.hero,description:e.target.value}})} /></Field>
                  <Field label="Breadcrumb Text"><Input value={activeSubpage.hero?.breadcrumbText||''} onChange={(e)=>updateActiveSubpage({hero:{...activeSubpage.hero,breadcrumbText:e.target.value}})} /></Field>
                  <ImagePickerField label="Hero Background Image" folder="international" value={activeSubpage.hero?.imageUrl||''} onChange={(url)=>updateActiveSubpage({hero:{...activeSubpage.hero,imageUrl:url}})} />
                  {activeSubpage.hero?.imageUrl && <div className="rounded-xl overflow-hidden h-36 bg-gray-100 border border-gray-200"><img src={activeSubpage.hero.imageUrl} alt="" className="w-full h-full object-cover" /></div>}
                </>}
                {activeTab==='sp_intro' && <>
                  <Field label="Badge"><Input value={activeSubpage.intro?.badge||''} onChange={(e)=>updateActiveSubpage({intro:{...activeSubpage.intro,badge:e.target.value}})} /></Field>
                  <Field label="Title"><Input value={activeSubpage.intro?.title||''} onChange={(e)=>updateActiveSubpage({intro:{...activeSubpage.intro,title:e.target.value}})} /></Field>
                  <Field label="Subtitle"><Textarea rows={2} value={activeSubpage.intro?.subtitle||''} onChange={(e)=>updateActiveSubpage({intro:{...activeSubpage.intro,subtitle:e.target.value}})} /></Field>
                  {(activeSubpage.intro?.paragraphs||[]).map((para,idx)=>(
                    <div key={idx} className="flex gap-2">
                      <Textarea rows={3} value={para} onChange={(e)=>{const a=[...(activeSubpage.intro?.paragraphs||[])];a[idx]=e.target.value;updateActiveSubpage({intro:{...activeSubpage.intro,paragraphs:a}});}} />
                      <button type="button" onClick={()=>updateActiveSubpage({intro:{...activeSubpage.intro,paragraphs:(activeSubpage.intro?.paragraphs||[]).filter((_,i)=>i!==idx)}})} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={()=>updateActiveSubpage({intro:{...activeSubpage.intro,paragraphs:[...(activeSubpage.intro?.paragraphs||[]),'']}})}
                    className="text-xs text-[#0470aa] font-semibold flex items-center gap-1"><FaPlus className="w-3 h-3" /> Add Paragraph</button>
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-700">Section Image</span>
                    <VisibilityToggle visible={activeSubpage.intro?.showImage} onToggle={()=>updateActiveSubpage({intro:{...activeSubpage.intro,showImage:!(activeSubpage.intro?.showImage!==false)}})} label="Image" />
                  </div>
                  <ImagePickerField label="Intro Image" folder="international" value={activeSubpage.intro?.imageUrl||''} onChange={(url)=>updateActiveSubpage({intro:{...activeSubpage.intro,imageUrl:url}})} />
                </>}
                {activeTab==='sp_challenges' && <>
                  <Field label="Badge"><Input value={activeSubpage.challenges?.badge||''} onChange={(e)=>updateActiveSubpage({challenges:{...activeSubpage.challenges,badge:e.target.value}})} /></Field>
                  <Field label="Title"><Input value={activeSubpage.challenges?.title||''} onChange={(e)=>updateActiveSubpage({challenges:{...activeSubpage.challenges,title:e.target.value}})} /></Field>
                  <Field label="Subtitle"><Textarea rows={2} value={activeSubpage.challenges?.subtitle||''} onChange={(e)=>updateActiveSubpage({challenges:{...activeSubpage.challenges,subtitle:e.target.value}})} /></Field>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between mb-3"><span className="text-xs font-bold text-gray-700 uppercase">Items</span>
                      <button type="button" onClick={()=>updateActiveSubpage({challenges:{...activeSubpage.challenges,items:[...(activeSubpage.challenges?.items||[]),{title:'New',desc:''}]}})}
                        className="text-xs text-[#0470aa] font-semibold flex items-center gap-1"><FaPlus className="w-2.5 h-2.5" /> Add</button>
                    </div>
                    {(activeSubpage.challenges?.items||[]).map((item,idx)=>(
                      <div key={idx} className="p-3 rounded-xl border border-gray-200 space-y-2 mb-2 bg-gray-50/40">
                        <div className="flex justify-between"><span className="text-[11px] font-semibold text-[#0470aa]">Item {idx+1}</span><button type="button" onClick={()=>updateActiveSubpage({challenges:{...activeSubpage.challenges,items:(activeSubpage.challenges?.items||[]).filter((_,i)=>i!==idx)}})} className="text-red-400 hover:text-red-600"><FaTrash className="w-3 h-3" /></button></div>
                        <Field label="Title"><Input value={item.title||''} onChange={(e)=>{const a=[...(activeSubpage.challenges?.items||[])];a[idx]={...a[idx],title:e.target.value};updateActiveSubpage({challenges:{...activeSubpage.challenges,items:a}});}} /></Field>
                        <Field label="Description"><Textarea rows={2} value={item.desc||''} onChange={(e)=>{const a=[...(activeSubpage.challenges?.items||[])];a[idx]={...a[idx],desc:e.target.value};updateActiveSubpage({challenges:{...activeSubpage.challenges,items:a}});}} /></Field>
                      </div>
                    ))}
                  </div>
                </>}
                {activeTab==='sp_services' && <>
                  <Field label="Badge"><Input value={activeSubpage.services?.badge||''} onChange={(e)=>updateActiveSubpage({services:{...activeSubpage.services,badge:e.target.value}})} /></Field>
                  <Field label="Title"><Input value={activeSubpage.services?.title||''} onChange={(e)=>updateActiveSubpage({services:{...activeSubpage.services,title:e.target.value}})} /></Field>
                  <Field label="Subtitle"><Textarea rows={2} value={activeSubpage.services?.subtitle||''} onChange={(e)=>updateActiveSubpage({services:{...activeSubpage.services,subtitle:e.target.value}})} /></Field>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between mb-3"><span className="text-xs font-bold text-gray-700 uppercase">Service Cards</span>
                      <button type="button" onClick={()=>updateActiveSubpage({services:{...activeSubpage.services,items:[...(activeSubpage.services?.items||[]),{title:'New Service',desc:'',bullets:[],imageUrl:'',showImage:true}]}})}
                        className="text-xs text-[#0470aa] font-semibold flex items-center gap-1"><FaPlus className="w-2.5 h-2.5" /> Add</button>
                    </div>
                    {(activeSubpage.services?.items||[]).map((svc,idx)=>(
                      <div key={idx} className="p-4 rounded-xl border border-gray-200 space-y-3 mb-3 bg-gray-50/40">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-bold text-[#0470aa]">Service {idx+1}</span>
                          <div className="flex gap-2">
                            <VisibilityToggle visible={svc.showImage} onToggle={()=>{const a=[...(activeSubpage.services?.items||[])];a[idx]={...a[idx],showImage:!a[idx].showImage};updateActiveSubpage({services:{...activeSubpage.services,items:a}});}} label="Img" />
                            <button type="button" onClick={()=>updateActiveSubpage({services:{...activeSubpage.services,items:(activeSubpage.services?.items||[]).filter((_,i)=>i!==idx)}})} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <Field label="Title"><Input value={svc.title||''} onChange={(e)=>{const a=[...(activeSubpage.services?.items||[])];a[idx]={...a[idx],title:e.target.value};updateActiveSubpage({services:{...activeSubpage.services,items:a}});}} /></Field>
                        <Field label="Description"><Textarea rows={2} value={svc.desc||''} onChange={(e)=>{const a=[...(activeSubpage.services?.items||[])];a[idx]={...a[idx],desc:e.target.value};updateActiveSubpage({services:{...activeSubpage.services,items:a}});}} /></Field>
                        <ImagePickerField label="Card Image" folder="international" value={svc.imageUrl||''} onChange={(url)=>{const a=[...(activeSubpage.services?.items||[])];a[idx]={...a[idx],imageUrl:url};updateActiveSubpage({services:{...activeSubpage.services,items:a}});}} />
                        <div>
                          <div className="flex justify-between mb-1"><span className="text-[11px] font-bold text-gray-600">Bullets</span>
                            <button type="button" onClick={()=>{const a=[...(activeSubpage.services?.items||[])];a[idx].bullets=[...(a[idx].bullets||[]),''];updateActiveSubpage({services:{...activeSubpage.services,items:a}});}} className="text-xs text-[#0470aa] font-semibold flex items-center gap-1"><FaPlus className="w-2.5 h-2.5" /> Add</button>
                          </div>
                          {(svc.bullets||[]).map((b,bIdx)=>(
                            <div key={bIdx} className="flex gap-2 mb-1.5">
                              <Input value={b} onChange={(e)=>{const a=[...(activeSubpage.services?.items||[])];a[idx].bullets[bIdx]=e.target.value;updateActiveSubpage({services:{...activeSubpage.services,items:a}});}} />
                              <button type="button" onClick={()=>{const a=[...(activeSubpage.services?.items||[])];a[idx].bullets=a[idx].bullets.filter((_,i)=>i!==bIdx);updateActiveSubpage({services:{...activeSubpage.services,items:a}});}} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>}
                {activeTab==='sp_checklist' && <>
                  <Field label="Badge"><Input value={activeSubpage.checklist?.badge||''} onChange={(e)=>updateActiveSubpage({checklist:{...activeSubpage.checklist,badge:e.target.value}})} /></Field>
                  <Field label="Title"><Input value={activeSubpage.checklist?.title||''} onChange={(e)=>updateActiveSubpage({checklist:{...activeSubpage.checklist,title:e.target.value}})} /></Field>
                  <Field label="Subtitle"><Textarea rows={2} value={activeSubpage.checklist?.subtitle||''} onChange={(e)=>updateActiveSubpage({checklist:{...activeSubpage.checklist,subtitle:e.target.value}})} /></Field>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between mb-2"><span className="text-xs font-bold text-gray-700 uppercase">Items</span>
                      <button type="button" onClick={()=>updateActiveSubpage({checklist:{...activeSubpage.checklist,items:[...(activeSubpage.checklist?.items||[]),'']}})} className="text-xs text-[#0470aa] font-semibold flex items-center gap-1"><FaPlus className="w-2.5 h-2.5" /> Add</button>
                    </div>
                    {(activeSubpage.checklist?.items||[]).map((item,idx)=>(
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input value={item} onChange={(e)=>{const a=[...(activeSubpage.checklist?.items||[])];a[idx]=e.target.value;updateActiveSubpage({checklist:{...activeSubpage.checklist,items:a}});}} />
                        <button type="button" onClick={()=>updateActiveSubpage({checklist:{...activeSubpage.checklist,items:(activeSubpage.checklist?.items||[]).filter((_,i)=>i!==idx)}})} className="text-red-400 hover:text-red-600"><FaTrash className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </>}
                {activeTab==='sp_insight' && <>
                  <Field label="Badge"><Input value={activeSubpage.insight?.badge||''} onChange={(e)=>updateActiveSubpage({insight:{...activeSubpage.insight,badge:e.target.value}})} /></Field>
                  <Field label="Quote / Insight"><Textarea rows={5} value={activeSubpage.insight?.quote||''} onChange={(e)=>updateActiveSubpage({insight:{...activeSubpage.insight,quote:e.target.value}})} /></Field>
                  <Field label="Attribution"><Input value={activeSubpage.insight?.author||''} onChange={(e)=>updateActiveSubpage({insight:{...activeSubpage.insight,author:e.target.value}})} /></Field>
                </>}
                {activeTab==='sp_cta' && <>
                  <Field label="Title"><Input value={activeSubpage.cta?.title||''} onChange={(e)=>updateActiveSubpage({cta:{...activeSubpage.cta,title:e.target.value}})} /></Field>
                  <Field label="Subtitle"><Textarea rows={2} value={activeSubpage.cta?.subtitle||''} onChange={(e)=>updateActiveSubpage({cta:{...activeSubpage.cta,subtitle:e.target.value}})} /></Field>
                  <div className="flex justify-between">
                    <span className="text-xs font-semibold text-gray-700">Background Image</span>
                    <VisibilityToggle visible={activeSubpage.cta?.showImage} onToggle={()=>updateActiveSubpage({cta:{...activeSubpage.cta,showImage:!activeSubpage.cta?.showImage}})} label="Image" />
                  </div>
                  <ImagePickerField label="Background Image" folder="international" value={activeSubpage.cta?.imageUrl||''} onChange={(url)=>updateActiveSubpage({cta:{...activeSubpage.cta,imageUrl:url}})} />
                </>}
                {activeTab==='sp_visibility' && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">Toggle sections of this sub-page on/off.</p>
                    {Object.entries(activeSubpage.visibility||{}).map(([key,val])=>(
                      <div key={key} className="flex justify-between p-3 rounded-xl border border-gray-200 bg-gray-50/40">
                        <span className="text-xs font-semibold text-gray-700 capitalize">{key} Section</span>
                        <VisibilityToggle visible={val} onToggle={()=>updateActiveSubpage({visibility:{...activeSubpage.visibility,[key]:!val}})} label={key} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 12. MAIN VISIBILITY */}
          {activeTab === 'visibility' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900">Main Page Section Visibility</h3>
              <p className="text-xs text-gray-500">Toggle entire sections of the International landing page on or off.</p>
              {Object.entries(data.visibility||{}).map(([key,val])=>(
                <div key={key} className="flex justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/40">
                  <div>
                    <span className="text-sm font-semibold text-gray-800 capitalize">{key}</span>
                    <p className="text-xs text-gray-500 mt-0.5">Toggle the <strong>{key}</strong> section</p>
                  </div>
                  <VisibilityToggle visible={val} onToggle={()=>updateData({visibility:{...data.visibility,[key]:!val}})} label={key} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LIVE PREVIEW */}
        {showPreview && (
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Live Preview</span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-[#0470aa] text-[10px] font-bold">DRAFT</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button type="button" onClick={()=>setPreviewMode('landing')} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${previewMode==='landing'?'bg-white text-gray-900 shadow-xs':'text-gray-500 hover:text-gray-700'}`}>Landing</button>
                    <button type="button" onClick={()=>setPreviewMode('subpage')} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${previewMode==='subpage'?'bg-white text-gray-900 shadow-xs':'text-gray-500 hover:text-gray-700'}`}>Sub-Page</button>
                  </div>
                  {previewMode==='subpage' && (
                    <select value={previewSlug} onChange={(e)=>setPreviewSlug(e.target.value)} className="px-2 py-1 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-700 bg-white max-w-[180px]">
                      {INTERNATIONAL_SUBPAGES_LIST.map(sp=><option key={sp.slug} value={sp.slug}>{sp.title}</option>)}
                    </select>
                  )}
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                    {[{m:'desktop',I:FaDesktop},{m:'tablet',I:FaTabletAlt},{m:'mobile',I:FaMobileAlt}].map(({m,I})=>(
                      <button key={m} type="button" onClick={()=>setPreviewDevice(m)} className={`p-1.5 rounded-md transition-all ${previewDevice===m?'bg-white shadow-xs text-gray-900':'text-gray-400 hover:text-gray-700'}`}><I className="w-3 h-3" /></button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="overflow-auto bg-gray-100 p-4" style={{maxHeight:'82vh'}}>
                <div className={`mx-auto bg-white shadow-lg transition-all duration-300 ${deviceWidth}`}>
                  {previewMode==='landing' ? <International data={previewData} /> : <IntlSubpageContent slug={previewSlug} data={previewData} />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternationalEditor;
