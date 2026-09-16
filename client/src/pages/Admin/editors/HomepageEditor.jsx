import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { notifyCMSPublish } from '../../../hooks/useCMS';
import { Home } from '../../Home/Home';
import ImagePickerField from '../../../components/admin/ImagePickerField';
import { DEFAULT_HOME_DATA } from '../../../constants/defaultCMS';
import {
  FaSave, FaGlobe, FaExternalLinkAlt, FaPlus, FaTrash,
  FaArrowUp, FaArrowDown, FaCheckCircle, FaSpinner,
  FaEye, FaEyeSlash, FaDesktop, FaTabletAlt, FaMobileAlt,
  FaLayerGroup, FaImage, FaBullhorn, FaIndustry,
  FaStar, FaShieldAlt, FaThLarge, FaInfoCircle,
  FaHome, FaRocket, FaChartBar, FaQuoteLeft, FaBolt,
  FaTimes, FaUndo, FaLanguage, FaQuestionCircle, FaSlidersH
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEFAULT_HOME_FULL = {
  visibility: {
    ticker: true,
    hero: true,
    whoWeAre: true,
    whyUs: true,
    capabilities: true,
    lifecycle: true,
    industries: true,
    results: true,
    testimonials: true,
    faqs: true,
    cta: true,
  },
  ...DEFAULT_HOME_DATA,
  results: {
    badge: 'Proven Track Record',
    title: 'Delivering Quantifiable Enterprise Results',
    subtitle: 'Our engineering standards deliver direct operational efficiency, cost reduction, and total risk mitigation.',
    stats: [
      { id: 's1', value: '500+', label: 'Enterprise Deployments' },
      { id: 's2', value: '10M+', label: 'Protected Sq. Ft.' },
      { id: 's3', value: '24/7', label: 'NOC Monitoring' },
      { id: 's4', value: '99.98%', label: 'System Uptime SLA' },
    ],
  },
  lifecycle: {
    badge: 'Project Lifecycle',
    title: 'Our 5-Stage Turnkey Delivery Process',
    subtitle: 'A structured, SLA-driven engineering methodology that guarantees seamless execution from concept to lifecycle maintenance.',
    steps: [
      { id: 'lc1', num: '01', title: 'Consult & Audit', desc: 'In-depth site risk analysis, compliance evaluation, and coverage heat mapping.' },
      { id: 'lc2', num: '02', title: 'Architecture & Design', desc: 'CAD drawings, network bandwidth planning, and bill of materials (BOM) creation.' },
      { id: 'lc3', num: '03', title: 'Supply & Commissioning', desc: 'SIRA/Civil Defense compliant hardware installation, cabling, and system testing.' },
      { id: 'lc4', num: '04', title: '24/7 Managed SLA', desc: 'NOC monitoring, quarterly preventive maintenance, and quick spares replacement.' },
      { id: 'lc5', num: '05', title: 'Continuous Optimization', desc: 'AI model fine-tuning, firmware updates, and expansion roadmap planning.' },
    ],
  },
  cta: {
    title: 'Ready to Transform Your Enterprise Security & Infrastructure?',
    subtitle: 'Schedule a confidential technical consultation with our senior solutions architects today.',
    imageUrl: '',
  },
};

export const HomepageEditor = () => {
  const { token } = useAuth();
  const [data, setData] = useState(DEFAULT_HOME_FULL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Translation modal state
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateProgress, setTranslateProgress] = useState(null);
  const [translateStatus, setTranslateStatus] = useState(null);
  const [translateError, setTranslateError] = useState('');
  const [autoTranslateOnPublish, setAutoTranslateOnPublish] = useState(false);

  const autosaveTimerRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // ── Fetch from API on mount ──────────────────────────────────────────────
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE}/pages/home`, { headers });
        if (res.ok) {
          const json = await res.json();
          const page = json.page;
          const remote = page?.draftVersion?.content || page?.publishedVersion?.content;
          if (remote && Object.keys(remote).length > 0) {
            setData((prev) => ({
              ...DEFAULT_HOME_FULL,
              ...remote,
              visibility: { ...DEFAULT_HOME_FULL.visibility, ...(remote.visibility || {}) },
              hero: { ...DEFAULT_HOME_FULL.hero, ...(remote.hero || {}) },
              ticker: { ...DEFAULT_HOME_FULL.ticker, ...(remote.ticker || {}) },
              section2: { ...DEFAULT_HOME_FULL.section2, ...(remote.section2 || {}) },
              whyUs: { ...DEFAULT_HOME_FULL.whyUs, ...(remote.whyUs || {}) },
              results: { ...DEFAULT_HOME_FULL.results, ...(remote.results || {}) },
              lifecycle: { ...DEFAULT_HOME_FULL.lifecycle, ...(remote.lifecycle || {}) },
              cta: { ...DEFAULT_HOME_FULL.cta, ...(remote.cta || {}) },
              divisions: Array.isArray(remote.divisions) && remote.divisions.length > 0
                ? remote.divisions : DEFAULT_HOME_FULL.divisions,
              industries: Array.isArray(remote.industries) && remote.industries.length > 0
                ? remote.industries : DEFAULT_HOME_FULL.industries,
              testimonials: Array.isArray(remote.testimonials) && remote.testimonials.length > 0
                ? remote.testimonials : DEFAULT_HOME_FULL.testimonials,
              faqs: Array.isArray(remote.faqs) && remote.faqs.length > 0
                ? remote.faqs : DEFAULT_HOME_FULL.faqs,
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch home page config:', err.message);
      } finally {
        setLoading(false);
        setTimeout(() => { isInitialLoadRef.current = false; }, 500);
      }
    };
    fetchContent();
  }, [token]);

  // ── Autosave (1500ms debounce) ───────────────────────────────────────────
  const updateData = useCallback((updater) => {
    setData(updater);
    if (!isInitialLoadRef.current) setHasUnsavedChanges(true);
  }, []);

  useEffect(() => {
    if (isInitialLoadRef.current || !hasUnsavedChanges) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      handleSaveDraft(true);
    }, 1500);
    return () => { if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current); };
  }, [data, hasUnsavedChanges]);

  // ── Save Draft ───────────────────────────────────────────────────────────
  const handleSaveDraft = async (isAutoSave = false) => {
    if (saving) return;
    if (!isAutoSave) setSaving(true);
    setSaveStatus(null);
    setErrorMessage('');
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_BASE}/pages/home`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ title: 'Home Page', slug: 'home', content: data, publish: false }),
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        setSaveStatus('draft_saved');
        setTimeout(() => setSaveStatus(null), 3500);
      } else {
        const err = await res.json();
        setErrorMessage(err.message || 'Failed to save draft');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server connection error');
    } finally {
      if (!isAutoSave) setSaving(false);
    }
  };

  // ── Publish ──────────────────────────────────────────────────────────────
  const handlePublish = async () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setPublishing(true);
    setSaveStatus(null);
    setErrorMessage('');
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_BASE}/pages/home`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          title: 'Home Page',
          slug: 'home',
          content: data,
          publish: true,
          status: 'published',
          autoTranslate: autoTranslateOnPublish,
        }),
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        setSaveStatus('published');
        notifyCMSPublish('home');
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        const err = await res.json();
        setErrorMessage(err.message || 'Failed to publish');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server connection error');
    } finally {
      setPublishing(false);
    }
  };

  // ── Reset to default ─────────────────────────────────────────────────────
  const handleResetToDefault = () => {
    if (window.confirm('Reset all Home Page content back to default values? Any unsaved edits will be discarded.')) {
      updateData(DEFAULT_HOME_FULL);
    }
  };

  // ── Translation handler ──────────────────────────────────────────────────
  const handleTranslatePage = async () => {
    setTranslating(true);
    setTranslateProgress({ total: 31, completed: 0, currentLang: '...' });
    setTranslateStatus(null);
    setTranslateError('');
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_BASE}/translations/translate-page`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ slug: 'home', content: data }),
      });
      if (res.ok) {
        const json = await res.json();
        setTranslateProgress({ total: 31, completed: 31, currentLang: 'Done' });
        setTranslateStatus('success');
      } else {
        const err = await res.json();
        setTranslateStatus('error');
        setTranslateError(err.message || 'Translation failed');
      }
    } catch (err) {
      setTranslateStatus('error');
      setTranslateError(err.message || 'Network error');
    } finally {
      setTranslating(false);
    }
  };

  // ── Visibility Toggle ────────────────────────────────────────────────────
  const toggleVisibility = (key) => {
    updateData((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, [key]: prev.visibility?.[key] === false ? true : false },
    }));
  };

  // ── Generic field updater helpers ────────────────────────────────────────
  const setField = (section, field, value) => {
    updateData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  // ── Ticker helpers ───────────────────────────────────────────────────────
  const addTickerItem = () => updateData((prev) => ({
    ...prev, ticker: { ...prev.ticker, items: [...(prev.ticker?.items || []), 'New ticker announcement'] },
  }));
  const updateTickerItem = (idx, val) => updateData((prev) => {
    const items = [...(prev.ticker?.items || [])];
    items[idx] = val;
    return { ...prev, ticker: { ...prev.ticker, items } };
  });
  const deleteTickerItem = (idx) => updateData((prev) => ({
    ...prev, ticker: { ...prev.ticker, items: (prev.ticker?.items || []).filter((_, i) => i !== idx) },
  }));

  // ── Divisions (Capabilities) helpers ─────────────────────────────────────
  const addDivision = () => updateData((prev) => ({
    ...prev,
    divisions: [...(prev.divisions || []), { id: `div_${Date.now()}`, title: 'New Solution', description: 'Describe this solution capability.', icon: 'FaShieldAlt', imageUrl: '', link: '/', tag: 'New Tag', featured: true }],
  }));
  const updateDivision = (id, field, value) => updateData((prev) => ({
    ...prev, divisions: (prev.divisions || []).map((d) => d.id === id ? { ...d, [field]: value } : d),
  }));
  const deleteDivision = (id) => updateData((prev) => ({
    ...prev, divisions: (prev.divisions || []).filter((d) => d.id !== id),
  }));
  const moveDivision = (idx, dir) => updateData((prev) => {
    const list = [...(prev.divisions || [])];
    const ti = dir === 'up' ? idx - 1 : idx + 1;
    if (ti < 0 || ti >= list.length) return prev;
    [list[idx], list[ti]] = [list[ti], list[idx]];
    return { ...prev, divisions: list };
  });

  // ── Industries helpers ────────────────────────────────────────────────────
  const addIndustry = () => updateData((prev) => ({
    ...prev,
    industries: [...(prev.industries || []), { id: `ind_${Date.now()}`, title: 'New Industry Sector', description: 'Describe this industry sector solution.', imageUrl: '', link: '/' }],
  }));
  const updateIndustry = (id, field, value) => updateData((prev) => ({
    ...prev, industries: (prev.industries || []).map((i) => i.id === id ? { ...i, [field]: value } : i),
  }));
  const deleteIndustry = (id) => updateData((prev) => ({
    ...prev, industries: (prev.industries || []).filter((i) => i.id !== id),
  }));
  const moveIndustry = (idx, dir) => updateData((prev) => {
    const list = [...(prev.industries || [])];
    const ti = dir === 'up' ? idx - 1 : idx + 1;
    if (ti < 0 || ti >= list.length) return prev;
    [list[idx], list[ti]] = [list[ti], list[idx]];
    return { ...prev, industries: list };
  });

  // ── Why Us Pillars helpers ────────────────────────────────────────────────
  const addPillar = () => updateData((prev) => ({
    ...prev,
    whyUs: { ...prev.whyUs, pillars: [...(prev.whyUs?.pillars || []), { id: `p_${Date.now()}`, title: 'New Trust Pillar', desc: 'Describe why clients select UniSpark.' }] },
  }));
  const updatePillar = (id, field, value) => updateData((prev) => ({
    ...prev, whyUs: { ...prev.whyUs, pillars: (prev.whyUs?.pillars || []).map((p) => p.id === id ? { ...p, [field]: value } : p) },
  }));
  const deletePillar = (id) => updateData((prev) => ({
    ...prev, whyUs: { ...prev.whyUs, pillars: (prev.whyUs?.pillars || []).filter((p) => p.id !== id) },
  }));
  const movePillar = (idx, dir) => updateData((prev) => {
    const list = [...(prev.whyUs?.pillars || [])];
    const ti = dir === 'up' ? idx - 1 : idx + 1;
    if (ti < 0 || ti >= list.length) return prev;
    [list[idx], list[ti]] = [list[ti], list[idx]];
    return { ...prev, whyUs: { ...prev.whyUs, pillars: list } };
  });

  // ── Stats helpers ─────────────────────────────────────────────────────────
  const addStat = () => updateData((prev) => ({
    ...prev,
    results: { ...prev.results, stats: [...(prev.results?.stats || []), { id: `s_${Date.now()}`, value: '100+', label: 'New Metric' }] },
  }));
  const updateStat = (id, field, value) => updateData((prev) => ({
    ...prev, results: { ...prev.results, stats: (prev.results?.stats || []).map((s) => s.id === id ? { ...s, [field]: value } : s) },
  }));
  const deleteStat = (id) => updateData((prev) => ({
    ...prev, results: { ...prev.results, stats: (prev.results?.stats || []).filter((s) => s.id !== id) },
  }));
  const moveStat = (idx, dir) => updateData((prev) => {
    const list = [...(prev.results?.stats || [])];
    const ti = dir === 'up' ? idx - 1 : idx + 1;
    if (ti < 0 || ti >= list.length) return prev;
    [list[idx], list[ti]] = [list[ti], list[idx]];
    return { ...prev, results: { ...prev.results, stats: list } };
  });

  // ── Lifecycle Steps helpers ───────────────────────────────────────────────
  const addStep = () => updateData((prev) => {
    const steps = prev.lifecycle?.steps || [];
    return { ...prev, lifecycle: { ...prev.lifecycle, steps: [...steps, { id: `lc_${Date.now()}`, num: String(steps.length + 1).padStart(2, '0'), title: 'New Process Step', desc: 'Describe this turnkey stage.' }] } };
  });
  const updateStep = (id, field, value) => updateData((prev) => ({
    ...prev, lifecycle: { ...prev.lifecycle, steps: (prev.lifecycle?.steps || []).map((s) => s.id === id ? { ...s, [field]: value } : s) },
  }));
  const deleteStep = (id) => updateData((prev) => ({
    ...prev, lifecycle: { ...prev.lifecycle, steps: (prev.lifecycle?.steps || []).filter((s) => s.id !== id) },
  }));
  const moveStep = (idx, dir) => updateData((prev) => {
    const list = [...(prev.lifecycle?.steps || [])];
    const ti = dir === 'up' ? idx - 1 : idx + 1;
    if (ti < 0 || ti >= list.length) return prev;
    [list[idx], list[ti]] = [list[ti], list[idx]];
    return { ...prev, lifecycle: { ...prev.lifecycle, steps: list } };
  });

  // ── Testimonials helpers ───────────────────────────────────────────────────
  const addTestimonial = () => updateData((prev) => ({
    ...prev,
    testimonials: [...(prev.testimonials || []), { id: `t_${Date.now()}`, quote: 'Outstanding security engineering and responsive 24/7 SLA.', author: 'Name', title: 'Role', company: 'Enterprise Client' }],
  }));
  const updateTestimonial = (id, field, value) => updateData((prev) => ({
    ...prev, testimonials: (prev.testimonials || []).map((t) => t.id === id ? { ...t, [field]: value } : t),
  }));
  const deleteTestimonial = (id) => updateData((prev) => ({
    ...prev, testimonials: (prev.testimonials || []).filter((t) => t.id !== id),
  }));

  // ── FAQ helpers ────────────────────────────────────────────────────────────
  const addFaq = () => updateData((prev) => ({
    ...prev,
    faqs: [...(prev.faqs || []), { id: `faq_${Date.now()}`, question: 'New Question?', answer: 'Provide an enterprise-ready answer.' }],
  }));
  const updateFaq = (id, field, value) => updateData((prev) => ({
    ...prev, faqs: (prev.faqs || []).map((f) => f.id === id ? { ...f, [field]: value } : f),
  }));
  const deleteFaq = (id) => updateData((prev) => ({
    ...prev, faqs: (prev.faqs || []).filter((f) => f.id !== id),
  }));
  const moveFaq = (idx, dir) => updateData((prev) => {
    const list = [...(prev.faqs || [])];
    const ti = dir === 'up' ? idx - 1 : idx + 1;
    if (ti < 0 || ti >= list.length) return prev;
    [list[idx], list[ti]] = [list[ti], list[idx]];
    return { ...prev, faqs: list };
  });

  // ── UI Input Helpers ──────────────────────────────────────────────────────
  const Label = ({ children }) => <label className="block text-xs font-medium text-slate-300 mb-1">{children}</label>;
  const Input = ({ value, onChange, placeholder, className = '' }) => (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors ${className}`}
    />
  );
  const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
    <textarea
      rows={rows}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors resize-none"
    />
  );

  const TABS = [
    { id: 'hero', label: 'Hero', icon: FaSlidersH },
    { id: 'ticker', label: 'Ticker', icon: FaBullhorn },
    { id: 'whoWeAre', label: 'Who We Are', icon: FaInfoCircle },
    { id: 'whyUs', label: 'Why Us', icon: FaStar },
    { id: 'capabilities', label: 'Divisions', icon: FaThLarge },
    { id: 'lifecycle', label: 'Lifecycle', icon: FaRocket },
    { id: 'industries', label: 'Industries', icon: FaIndustry },
    { id: 'results', label: 'Results', icon: FaChartBar },
    { id: 'testimonials', label: 'Quotes', icon: FaQuoteLeft },
    { id: 'faqs', label: 'FAQ', icon: FaQuestionCircle },
    { id: 'cta', label: 'CTA', icon: FaBolt },
    { id: 'visibility', label: 'Sections', icon: FaLayerGroup },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-400">
        <FaSpinner className="animate-spin w-6 h-6 mr-3 text-sky-400" />
        <span>Loading Home Page CMS Editor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── TOP HEADER & ACTIONS BAR (Exact match to About CMS) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-[#1e293b] p-4 rounded-xl border border-[#334155] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <FaHome className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Home Live CMS Editor</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                Live Dual-View
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Edits reflect immediately in the Live Preview. Publish syncs the live site in real-time.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status badge */}
          <div className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#0f172a] border border-[#334155]">
            {saving ? (
              <span className="text-amber-400 flex items-center gap-1.5">
                <FaSpinner className="animate-spin w-3 h-3" /> Autosaving draft...
              </span>
            ) : hasUnsavedChanges ? (
              <span className="text-amber-300">Unsaved changes</span>
            ) : saveStatus === 'draft_saved' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <FaCheckCircle className="w-3 h-3" /> Draft saved
              </span>
            ) : saveStatus === 'published' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <FaCheckCircle className="w-3 h-3" /> Published live!
              </span>
            ) : (
              <span className="text-slate-400">Draft in sync</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetToDefault}
            title="Reset to default content"
            className="p-2 rounded-lg border border-[#334155] text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <FaUndo className="w-3.5 h-3.5" />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#334155] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <FaExternalLinkAlt className="w-3 h-3 text-sky-400" />
            <span>Open Public Site</span>
          </a>

          <button
            type="button"
            onClick={() => handleSaveDraft(false)}
            disabled={saving || publishing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 text-xs font-semibold text-sky-400 hover:bg-sky-500/20 transition-all disabled:opacity-50"
          >
            {saving ? <FaSpinner className="animate-spin w-3 h-3" /> : <FaSave className="w-3 h-3" />}
            <span>Save Draft</span>
          </button>

          {/* Translate button */}
          <button
            type="button"
            onClick={() => setShowTranslateModal(true)}
            disabled={saving || publishing || translating}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-violet-500/40 bg-violet-500/10 text-xs font-semibold text-violet-400 hover:bg-violet-500/20 transition-all disabled:opacity-50"
            title="Translate this page into all 32 languages"
          >
            <FaLanguage className="w-3.5 h-3.5" />
            <span>Translate (32 Lang)</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={saving || publishing}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-xs font-bold text-white shadow-md hover:from-sky-400 hover:to-indigo-500 transition-all disabled:opacity-50"
          >
            {publishing ? <FaSpinner className="animate-spin w-3 h-3" /> : <FaGlobe className="w-3 h-3" />}
            <span>Publish to Live Site</span>
          </button>
        </div>
      </div>

      {/* ── AUTO-TRANSLATE ON PUBLISH CHECKBOX ── */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#1e293b] rounded-xl border border-[#334155]">
        <input
          type="checkbox"
          id="autoTranslateChkHome"
          checked={autoTranslateOnPublish}
          onChange={(e) => setAutoTranslateOnPublish(e.target.checked)}
          className="accent-violet-400 w-4 h-4 cursor-pointer"
        />
        <label htmlFor="autoTranslateChkHome" className="text-xs text-slate-300 cursor-pointer select-none">
          <span className="font-semibold text-violet-400">Auto-translate into all 32 languages</span>{' '}
          when publishing — runs in background using Google Cloud Translation API.
        </label>
      </div>

      {/* ── TRANSLATION MODAL ── */}
      {showTranslateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-2xl border border-[#334155] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                  <FaLanguage className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Translate Home Page</h3>
                  <p className="text-[11px] text-slate-400">Generates translations in all 32 supported languages</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { if (!translating) { setShowTranslateModal(false); setTranslateStatus(null); setTranslateProgress(null); } }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {translateProgress && (
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                  <span>{translateStatus === 'success' ? 'All languages translated!' : `Translating: ${translateProgress.currentLang}`}</span>
                  <span>{translateProgress.completed} / {translateProgress.total}</span>
                </div>
                <div className="w-full bg-[#0f172a] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((translateProgress.completed / translateProgress.total) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {translateStatus === 'success' && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2 mb-4">
                <FaCheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>All 31 languages translated and saved to the database successfully!</span>
              </div>
            )}

            {translateStatus === 'error' && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 mb-4">
                <strong>Translation failed:</strong> {translateError}
              </div>
            )}

            <div className="text-[11px] text-slate-400 bg-[#0f172a] rounded-lg p-3 mb-4 space-y-1">
              <p>• Content is sent to <strong className="text-slate-300">Google Cloud Translation API v2</strong> via the secure backend.</p>
              <p>• Images, URLs, icons, and numbers are preserved as-is.</p>
              <p>• Results are cached in MongoDB — no redundant API calls.</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowTranslateModal(false); setTranslateStatus(null); setTranslateProgress(null); }}
                disabled={translating}
                className="flex-1 py-2 rounded-lg border border-[#334155] text-xs font-semibold text-slate-400 hover:text-white hover:bg-[#334155] transition-colors disabled:opacity-50"
              >
                {translateStatus === 'success' ? 'Close' : 'Cancel'}
              </button>
              {translateStatus !== 'success' && (
                <button
                  type="button"
                  onClick={handleTranslatePage}
                  disabled={translating}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white shadow-md hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {translating ? (
                    <><FaSpinner className="animate-spin w-3 h-3" /> Translating...</>
                  ) : (
                    <><FaLanguage className="w-3 h-3" /> Start Translation</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── ERROR & SUCCESS BANNERS ── */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-red-300 font-bold ml-2">✕</button>
        </div>
      )}
      {saveStatus === 'published' && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Home page successfully published! All visitors and open tabs now see the updated content in real-time.</span>
        </div>
      )}

      {/* ── MAIN TWO-COLUMN WORKSPACE ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: EDIT CONTROLS (5 cols on xl) */}
        <div className="xl:col-span-5 bg-[#1e293b] rounded-xl border border-[#334155] flex flex-col overflow-hidden shadow-sm">
          {/* Navigation Category Tabs (exact grid matching screenshot) */}
          <div className="grid grid-cols-4 sm:grid-cols-6 border-b border-[#334155] bg-[#0f172a]/60 text-[11px] font-semibold text-center">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-1 flex flex-col items-center gap-1 transition-all border-b-2 ${
                    isActive
                      ? 'border-sky-500 text-sky-400 bg-[#1e293b]'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate w-full text-[10px]">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="p-4 space-y-4 max-h-[740px] overflow-y-auto">

            {/* TAB: HERO */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Hero Section Details</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('hero')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.hero !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.hero !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.hero !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div><Label>Badge Text</Label><Input value={data.hero?.badge} onChange={(v) => setField('hero', 'badge', v)} placeholder="e.g. DPIIT RECOGNIZED TECH ENTERPRISE" /></div>
                <div><Label>Main Heading</Label><Textarea value={data.hero?.heading} onChange={(v) => setField('hero', 'heading', v)} rows={2} placeholder="Main headline" /></div>
                <div><Label>Description / Subtitle</Label><Textarea value={data.hero?.description} onChange={(v) => setField('hero', 'description', v)} rows={3} placeholder="Hero description paragraph" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Primary Btn Text</Label><Input value={data.hero?.primaryBtnText} onChange={(v) => setField('hero', 'primaryBtnText', v)} /></div>
                  <div><Label>Primary Btn Link</Label><Input value={data.hero?.primaryBtnLink} onChange={(v) => setField('hero', 'primaryBtnLink', v)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Secondary Btn Text</Label><Input value={data.hero?.secondaryBtnText} onChange={(v) => setField('hero', 'secondaryBtnText', v)} /></div>
                  <div><Label>Secondary Btn Link</Label><Input value={data.hero?.secondaryBtnLink} onChange={(v) => setField('hero', 'secondaryBtnLink', v)} /></div>
                </div>
                <div>
                  <Label>Background Image</Label>
                  <ImagePickerField
                    value={data.hero?.imageUrl || ''}
                    onChange={(url) => setField('hero', 'imageUrl', url)}
                    label="Hero Background Image"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Leave blank to use the high-tech video background.</p>
                </div>
                <div>
                  <Label>Background Video URL</Label>
                  <Input value={data.hero?.videoUrl} onChange={(v) => setField('hero', 'videoUrl', v)} placeholder="e.g. /assets/video/hero.webm" />
                </div>
              </div>
            )}

            {/* TAB: TICKER */}
            {activeTab === 'ticker' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Global Ticker Strip</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('ticker')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.ticker !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.ticker !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.ticker !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0f172a] border border-[#334155]">
                  <span className="text-xs font-medium text-slate-300">Ticker Marquee Active</span>
                  <button
                    type="button"
                    onClick={() => updateData((p) => ({ ...p, ticker: { ...p.ticker, enabled: !p.ticker?.enabled } }))}
                    className={`px-3 py-1 rounded text-[10px] font-bold ${data.ticker?.enabled ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    {data.ticker?.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Ticker Items</span>
                    <button type="button" onClick={addTickerItem} className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold">
                      <FaPlus size={10} /> Add Item
                    </button>
                  </div>
                  {(data.ticker?.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateTickerItem(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white"
                      />
                      <button type="button" onClick={() => deleteTickerItem(idx)} className="p-2 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <FaTrash size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: WHO WE ARE */}
            {activeTab === 'whoWeAre' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Who We Are Section</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('whoWeAre')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.whoWeAre !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.whoWeAre !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.whoWeAre !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div><Label>Badge Text</Label><Input value={data.section2?.badge} onChange={(v) => setField('section2', 'badge', v)} placeholder="WHO WE ARE" /></div>
                <div><Label>Main Title</Label><Textarea value={data.section2?.title} onChange={(v) => setField('section2', 'title', v)} rows={2} /></div>
                <div><Label>Subtitle (Paragraph 1)</Label><Textarea value={data.section2?.description1} onChange={(v) => setField('section2', 'description1', v)} rows={3} /></div>
                <div><Label>Body Paragraph (Paragraph 2)</Label><Textarea value={data.section2?.description2} onChange={(v) => setField('section2', 'description2', v)} rows={4} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Stat Number</Label><Input value={data.section2?.statNumber} onChange={(v) => setField('section2', 'statNumber', v)} placeholder="24+" /></div>
                  <div><Label>Stat Label</Label><Input value={data.section2?.statLabel} onChange={(v) => setField('section2', 'statLabel', v)} placeholder="Years Leadership" /></div>
                </div>
                <div>
                  <Label>Section Image</Label>
                  <ImagePickerField
                    value={data.section2?.imageUrl || ''}
                    onChange={(url) => setField('section2', 'imageUrl', url)}
                    label="Who We Are Image"
                  />
                </div>
              </div>
            )}

            {/* TAB: WHY US */}
            {activeTab === 'whyUs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Why UniSpark Details</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('whyUs')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.whyUs !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.whyUs !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.whyUs !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div><Label>Section Heading</Label><Textarea value={data.whyUs?.heading} onChange={(v) => setField('whyUs', 'heading', v)} rows={2} /></div>
                <div><Label>Section Subheading</Label><Textarea value={data.whyUs?.subheading} onChange={(v) => setField('whyUs', 'subheading', v)} rows={2} /></div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Trust Pillars</span>
                    <button type="button" onClick={addPillar} className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold">
                      <FaPlus size={10} /> Add Pillar
                    </button>
                  </div>
                  {(data.whyUs?.pillars || []).map((p, idx) => (
                    <div key={p.id} className="bg-[#0f172a] border border-[#334155] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400">Pillar {idx + 1}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => movePillar(idx, 'up')} disabled={idx === 0} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowUp size={10} /></button>
                          <button type="button" onClick={() => movePillar(idx, 'down')} disabled={idx === (data.whyUs?.pillars || []).length - 1} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowDown size={10} /></button>
                          <button type="button" onClick={() => deletePillar(p.id)} className="p-1 rounded text-red-400 hover:text-red-300"><FaTrash size={10} /></button>
                        </div>
                      </div>
                      <div><Label>Title</Label><Input value={p.title} onChange={(v) => updatePillar(p.id, 'title', v)} /></div>
                      <div><Label>Description</Label><Textarea rows={2} value={p.desc} onChange={(v) => updatePillar(p.id, 'desc', v)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CAPABILITIES / DIVISIONS */}
            {activeTab === 'capabilities' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Capabilities & Divisions</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('capabilities')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.capabilities !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.capabilities !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.capabilities !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Division Cards</span>
                    <button type="button" onClick={addDivision} className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"><FaPlus size={10} /> Add Division</button>
                  </div>
                  {(data.divisions || []).map((d, idx) => (
                    <div key={d.id} className="bg-[#0f172a] border border-[#334155] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400">{d.title || `Division ${idx + 1}`}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveDivision(idx, 'up')} disabled={idx === 0} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowUp size={10} /></button>
                          <button type="button" onClick={() => moveDivision(idx, 'down')} disabled={idx === (data.divisions || []).length - 1} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowDown size={10} /></button>
                          <button type="button" onClick={() => deleteDivision(d.id)} className="p-1 rounded text-red-400 hover:text-red-300"><FaTrash size={10} /></button>
                        </div>
                      </div>
                      <div><Label>Title</Label><Input value={d.title} onChange={(v) => updateDivision(d.id, 'title', v)} /></div>
                      <div><Label>Description</Label><Textarea rows={2} value={d.description} onChange={(v) => updateDivision(d.id, 'description', v)} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>Tag</Label><Input value={d.tag} onChange={(v) => updateDivision(d.id, 'tag', v)} /></div>
                        <div><Label>Link URL</Label><Input value={d.link} onChange={(v) => updateDivision(d.id, 'link', v)} /></div>
                      </div>
                      <div>
                        <Label>Card Image</Label>
                        <ImagePickerField value={d.imageUrl || ''} onChange={(url) => updateDivision(d.id, 'imageUrl', url)} label="Division Image" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: LIFECYCLE */}
            {activeTab === 'lifecycle' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Project Lifecycle Details</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('lifecycle')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.lifecycle !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.lifecycle !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.lifecycle !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div><Label>Section Badge</Label><Input value={data.lifecycle?.badge} onChange={(v) => updateData((p) => ({ ...p, lifecycle: { ...p.lifecycle, badge: v } }))} /></div>
                <div><Label>Section Title</Label><Textarea value={data.lifecycle?.title} onChange={(v) => updateData((p) => ({ ...p, lifecycle: { ...p.lifecycle, title: v } }))} rows={2} /></div>
                <div><Label>Section Subtitle</Label><Textarea value={data.lifecycle?.subtitle} onChange={(v) => updateData((p) => ({ ...p, lifecycle: { ...p.lifecycle, subtitle: v } }))} rows={2} /></div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Steps</span>
                    <button type="button" onClick={addStep} className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"><FaPlus size={10} /> Add Step</button>
                  </div>
                  {(data.lifecycle?.steps || []).map((step, idx) => (
                    <div key={step.id} className="bg-[#0f172a] border border-[#334155] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400">Step {step.num}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveStep(idx, 'up')} disabled={idx === 0} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowUp size={10} /></button>
                          <button type="button" onClick={() => moveStep(idx, 'down')} disabled={idx === (data.lifecycle?.steps || []).length - 1} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowDown size={10} /></button>
                          <button type="button" onClick={() => deleteStep(step.id)} className="p-1 rounded text-red-400 hover:text-red-300"><FaTrash size={10} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>Step Num</Label><Input value={step.num} onChange={(v) => updateStep(step.id, 'num', v)} /></div>
                        <div><Label>Title</Label><Input value={step.title} onChange={(v) => updateStep(step.id, 'title', v)} /></div>
                      </div>
                      <div><Label>Description</Label><Textarea rows={2} value={step.desc} onChange={(v) => updateStep(step.id, 'desc', v)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: INDUSTRIES */}
            {activeTab === 'industries' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Industries Details</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('industries')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.industries !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.industries !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.industries !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Industry Cards</span>
                    <button type="button" onClick={addIndustry} className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"><FaPlus size={10} /> Add Industry</button>
                  </div>
                  {(data.industries || []).map((ind, idx) => (
                    <div key={ind.id} className="bg-[#0f172a] border border-[#334155] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400">{ind.title || `Industry ${idx + 1}`}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveIndustry(idx, 'up')} disabled={idx === 0} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowUp size={10} /></button>
                          <button type="button" onClick={() => moveIndustry(idx, 'down')} disabled={idx === (data.industries || []).length - 1} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowDown size={10} /></button>
                          <button type="button" onClick={() => deleteIndustry(ind.id)} className="p-1 rounded text-red-400 hover:text-red-300"><FaTrash size={10} /></button>
                        </div>
                      </div>
                      <div><Label>Title</Label><Input value={ind.title} onChange={(v) => updateIndustry(ind.id, 'title', v)} /></div>
                      <div><Label>Description</Label><Textarea rows={2} value={ind.description} onChange={(v) => updateIndustry(ind.id, 'description', v)} /></div>
                      <div><Label>Link URL</Label><Input value={ind.link} onChange={(v) => updateIndustry(ind.id, 'link', v)} /></div>
                      <div>
                        <Label>Card Image</Label>
                        <ImagePickerField value={ind.imageUrl || ''} onChange={(url) => updateIndustry(ind.id, 'imageUrl', url)} label="Industry Image" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: RESULTS & STATS */}
            {activeTab === 'results' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Results & Statistics</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('results')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.results !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.results !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.results !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div><Label>Section Badge</Label><Input value={data.results?.badge} onChange={(v) => updateData((p) => ({ ...p, results: { ...p.results, badge: v } }))} /></div>
                <div><Label>Section Title</Label><Textarea value={data.results?.title} onChange={(v) => updateData((p) => ({ ...p, results: { ...p.results, title: v } }))} rows={2} /></div>
                <div><Label>Section Subtitle</Label><Textarea value={data.results?.subtitle} onChange={(v) => updateData((p) => ({ ...p, results: { ...p.results, subtitle: v } }))} rows={2} /></div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Statistics</span>
                    <button type="button" onClick={addStat} className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"><FaPlus size={10} /> Add Stat</button>
                  </div>
                  {(data.results?.stats || []).map((stat, idx) => (
                    <div key={stat.id} className="bg-[#0f172a] border border-[#334155] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400">Stat {idx + 1}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveStat(idx, 'up')} disabled={idx === 0} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowUp size={10} /></button>
                          <button type="button" onClick={() => moveStat(idx, 'down')} disabled={idx === (data.results?.stats || []).length - 1} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowDown size={10} /></button>
                          <button type="button" onClick={() => deleteStat(stat.id)} className="p-1 rounded text-red-400 hover:text-red-300"><FaTrash size={10} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>Value</Label><Input value={stat.value} onChange={(v) => updateStat(stat.id, 'value', v)} /></div>
                        <div><Label>Label</Label><Input value={stat.label} onChange={(v) => updateStat(stat.id, 'label', v)} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Client Testimonials</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('testimonials')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.testimonials !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.testimonials !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.testimonials !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Testimonials</span>
                    <button type="button" onClick={addTestimonial} className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"><FaPlus size={10} /> Add Testimonial</button>
                  </div>
                  {(data.testimonials || []).map((t, idx) => (
                    <div key={t.id} className="bg-[#0f172a] border border-[#334155] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400">Testimonial {idx + 1}</span>
                        <button type="button" onClick={() => deleteTestimonial(t.id)} className="p-1 rounded text-red-400 hover:text-red-300"><FaTrash size={10} /></button>
                      </div>
                      <div><Label>Quote</Label><Textarea rows={3} value={t.quote} onChange={(v) => updateTestimonial(t.id, 'quote', v)} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><Label>Author</Label><Input value={t.author} onChange={(v) => updateTestimonial(t.id, 'author', v)} /></div>
                        <div><Label>Title / Role</Label><Input value={t.title} onChange={(v) => updateTestimonial(t.id, 'title', v)} /></div>
                      </div>
                      <div><Label>Company</Label><Input value={t.company} onChange={(v) => updateTestimonial(t.id, 'company', v)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">FAQ Section Details</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('faqs')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.faqs !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.faqs !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.faqs !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">FAQ Items</span>
                    <button type="button" onClick={addFaq} className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"><FaPlus size={10} /> Add FAQ</button>
                  </div>
                  {(data.faqs || []).map((faq, idx) => (
                    <div key={faq.id} className="bg-[#0f172a] border border-[#334155] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400">FAQ {idx + 1}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveFaq(idx, 'up')} disabled={idx === 0} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowUp size={10} /></button>
                          <button type="button" onClick={() => moveFaq(idx, 'down')} disabled={idx === (data.faqs || []).length - 1} className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"><FaArrowDown size={10} /></button>
                          <button type="button" onClick={() => deleteFaq(faq.id)} className="p-1 rounded text-red-400 hover:text-red-300"><FaTrash size={10} /></button>
                        </div>
                      </div>
                      <div><Label>Question</Label><Input value={faq.question} onChange={(v) => updateFaq(faq.id, 'question', v)} /></div>
                      <div><Label>Answer</Label><Textarea rows={3} value={faq.answer} onChange={(v) => updateFaq(faq.id, 'answer', v)} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CTA */}
            {activeTab === 'cta' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Bottom CTA Details</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('cta')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.cta !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.cta !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.cta !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <div><Label>CTA Title</Label><Textarea value={data.cta?.title} onChange={(v) => setField('cta', 'title', v)} rows={2} /></div>
                <div><Label>CTA Subtitle</Label><Textarea value={data.cta?.subtitle} onChange={(v) => setField('cta', 'subtitle', v)} rows={2} /></div>
                <div>
                  <Label>Background Image</Label>
                  <ImagePickerField
                    value={data.cta?.imageUrl || ''}
                    onChange={(url) => setField('cta', 'imageUrl', url)}
                    label="CTA Background"
                  />
                </div>
              </div>
            )}

            {/* TAB: VISIBILITY */}
            {activeTab === 'visibility' && (
              <div className="space-y-3">
                <div className="pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Section Visibility Controls</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle sections on/off. Updates reflect instantly in preview.</p>
                </div>
                {[
                  { key: 'ticker', label: 'Global Ticker Strip', desc: 'Top live marquee with announcements' },
                  { key: 'hero', label: 'Hero Banner', desc: 'Main headline, buttons, and high-tech background' },
                  { key: 'whoWeAre', label: 'Who We Are', desc: 'Corporate identity, leadership badge & imagery' },
                  { key: 'whyUs', label: 'Why UniSpark', desc: 'Core differentiator and trust pillar cards' },
                  { key: 'capabilities', label: 'Capabilities / Divisions', desc: 'Core solution capability cards' },
                  { key: 'lifecycle', label: 'Project Lifecycle', desc: '5-stage turnkey engineering delivery process' },
                  { key: 'industries', label: 'Industries Served', desc: 'Sector solution grid' },
                  { key: 'results', label: 'Results & Statistics', desc: 'Quantifiable metrics and SLA numbers' },
                  { key: 'testimonials', label: 'Client Testimonials', desc: 'Verified customer feedback and quotes' },
                  { key: 'faqs', label: 'Enterprise FAQ', desc: 'Common inquiries and regulatory answers' },
                  { key: 'cta', label: 'Bottom CTA', desc: 'Final technical consultation conversion banner' },
                ].map(({ key, label, desc }) => {
                  const isVisible = data.visibility?.[key] !== false;
                  return (
                    <div
                      key={key}
                      onClick={() => toggleVisibility(key)}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        isVisible ? 'bg-[#0f172a] border-sky-500/40' : 'bg-[#0f172a]/40 border-[#334155] opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{label}</span>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isVisible ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                      </div>
                      <div className="ml-3">
                        {isVisible ? <FaEye className="w-4 h-4 text-emerald-400" /> : <FaEyeSlash className="w-4 h-4 text-slate-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW (7 cols on xl - Exact match to About CMS) */}
        <div className="xl:col-span-7 bg-[#1e293b] rounded-xl border border-[#334155] flex flex-col overflow-hidden shadow-sm sticky top-4">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155] bg-[#0f172a]/60">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-white tracking-wide">Live Preview</span>
              <span className="text-[10px] text-slate-400 font-mono">react render engine</span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-lg border border-[#334155]">
              {[
                { id: 'desktop', Icon: FaDesktop, title: 'Desktop (100%)' },
                { id: 'tablet', Icon: FaTabletAlt, title: 'Tablet (768px)' },
                { id: 'mobile', Icon: FaMobileAlt, title: 'Mobile (375px)' },
              ].map(({ id, Icon, title }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPreviewDevice(id)}
                  className={`p-1.5 rounded text-xs transition-all ${previewDevice === id ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  title={title}
                >
                  <Icon size={12} />
                </button>
              ))}
            </div>
          </div>

          {/* Preview Viewport Container */}
          <div className="p-2 sm:p-3 bg-[#0b1329] max-h-[740px] overflow-y-auto">
            <div
              className={`transition-all duration-300 mx-auto overflow-hidden rounded-xl border border-slate-700/50 bg-white ${
                previewDevice === 'mobile' ? 'w-[375px]' : previewDevice === 'tablet' ? 'w-[768px]' : 'w-full'
              }`}
            >
              <Home _previewData={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageEditor;
