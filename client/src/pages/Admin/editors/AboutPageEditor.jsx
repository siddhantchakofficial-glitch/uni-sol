import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { notifyCMSPublish } from '../../../hooks/useCMS';
import { AboutContent } from '../../About/AboutContent';
import ImagePickerField from '../../../components/admin/ImagePickerField';
import { DEFAULT_ABOUT_DATA } from '../../../constants/aboutDefaults';
import {
  FaSave, FaGlobe, FaExternalLinkAlt, FaPlus, FaTrash,
  FaArrowUp, FaArrowDown, FaCheckCircle, FaSpinner,
  FaEye, FaEyeSlash, FaDesktop, FaTabletAlt, FaMobileAlt,
  FaUndo, FaCloudUploadAlt, FaLayerGroup, FaImage,
  FaSlidersH, FaCompass, FaBullseye, FaChartBar, FaRocket,
  FaAward, FaLightbulb, FaHandshake, FaShieldAlt, FaLanguage, FaTimes,
  FaHeart, FaGlobeAmericas, FaCertificate, FaQuestionCircle, FaServer, FaCogs, FaChartLine
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AVAILABLE_ICONS = [
  { id: 'FaShieldAlt', label: 'Security Shield', Icon: FaShieldAlt },
  { id: 'FaChartLine', label: 'Growth / Analytics', Icon: FaChartLine },
  { id: 'FaHandshake', label: 'Handshake / Partnership', Icon: FaHandshake },
  { id: 'FaLightbulb', label: 'Lightbulb / Innovation', Icon: FaLightbulb },
  { id: 'FaBullseye', label: 'Bullseye / Target', Icon: FaBullseye },
  { id: 'FaEye', label: 'Vision / Eye', Icon: FaEye },
  { id: 'FaAward', label: 'Award / Excellence', Icon: FaAward },
  { id: 'FaRocket', label: 'Rocket / Speed', Icon: FaRocket },
  { id: 'FaGlobe', label: 'Global / Network', Icon: FaGlobe },
  { id: 'FaGlobeAmericas', label: 'International / Globe', Icon: FaGlobeAmericas },
  { id: 'FaCertificate', label: 'Compliance / Certificate', Icon: FaCertificate },
  { id: 'FaServer', label: 'Server / Architecture', Icon: FaServer },
  { id: 'FaCogs', label: 'Operations / Integration', Icon: FaCogs },
  { id: 'FaHeart', label: 'Integrity / Trust', Icon: FaHeart },
  { id: 'FaQuestionCircle', label: 'Help / Question', Icon: FaQuestionCircle },
];


export const AboutPageEditor = () => {
  const { token } = useAuth();
  const [data, setData] = useState(DEFAULT_ABOUT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'draft_saved' | 'published' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'journey' | 'stats' | 'mission' | 'visibility'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoTranslateOnPublish, setAutoTranslateOnPublish] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [translateProgress, setTranslateProgress] = useState(null); // { total, completed, currentLang }
  const [translateStatus, setTranslateStatus] = useState(null); // 'success' | 'error'
  const [translateError, setTranslateError] = useState('');

  const fileInputRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // Fetch initial content from API (prefers draftVersion if available, falls back to published or default)
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE}/pages/about`, { headers });
        if (res.ok) {
          const json = await res.json();
          const page = json.page;
          const remoteContent = page?.draftVersion?.content || page?.publishedVersion?.content;
          if (remoteContent && Object.keys(remoteContent).length > 0) {
            setData((prev) => ({
              ...DEFAULT_ABOUT_DATA,
              ...prev,
              ...remoteContent,
              visibility: { ...DEFAULT_ABOUT_DATA.visibility, ...(remoteContent.visibility || {}) },
              banner: { ...DEFAULT_ABOUT_DATA.banner, ...(remoteContent.banner || {}) },
              overview: { ...DEFAULT_ABOUT_DATA.overview, ...(remoteContent.overview || {}) },
              missionVision: { ...DEFAULT_ABOUT_DATA.missionVision, ...(remoteContent.missionVision || {}) },
              values: { ...DEFAULT_ABOUT_DATA.values, ...(remoteContent.values || {}) },
              globalFocus: { ...DEFAULT_ABOUT_DATA.globalFocus, ...(remoteContent.globalFocus || {}) },
              frameworks: { ...DEFAULT_ABOUT_DATA.frameworks, ...(remoteContent.frameworks || {}) },
              clientsAwards: { ...DEFAULT_ABOUT_DATA.clientsAwards, ...(remoteContent.clientsAwards || {}) },
              faq: { ...DEFAULT_ABOUT_DATA.faq, ...(remoteContent.faq || {}) },
              glanceCards: Array.isArray(remoteContent.glanceCards) && remoteContent.glanceCards.length > 0
                ? remoteContent.glanceCards
                : DEFAULT_ABOUT_DATA.glanceCards,
            }));
          }
        }
      } catch (err) {
        console.warn('Could not fetch remote about configuration, using defaults:', err.message);
      } finally {
        setLoading(false);
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 500);
      }
    };

    fetchContent();
  }, [token]);

  // Debounced Autosave to Draft
  const triggerAutosave = useCallback((updatedData) => {
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
        const res = await fetch(`${API_BASE}/pages/about`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            title: 'About Us',
            slug: 'about',
            content: updatedData,
            publish: false,
          }),
        });

        if (res.ok) {
          setHasUnsavedChanges(false);
          setSaveStatus('draft_saved');
          setTimeout(() => setSaveStatus(null), 3000);
        }
      } catch (err) {
        console.warn('Draft auto-save failed:', err.message);
      } finally {
        setSaving(false);
      }
    }, 1500);
  }, [token]);

  const updateData = (updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      triggerAutosave(next);
      return next;
    });
  };

  // Explicit Save Draft
  const handleSaveDraft = async () => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setSaving(true);
    setSaveStatus(null);
    setErrorMessage('');
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(`${API_BASE}/pages/about`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          title: 'About Us',
          slug: 'about',
          content: data,
          publish: false,
        }),
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
      setSaving(false);
    }
  };

  // Publish Changes to Live Website
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
      const res = await fetch(`${API_BASE}/pages/about`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          title: 'About Us',
          slug: 'about',
          content: data,
          publish: true,
          status: 'published',
          autoTranslate: autoTranslateOnPublish,
        }),
      });

      if (res.ok) {
        setHasUnsavedChanges(false);
        setSaveStatus('published');
        notifyCMSPublish('about');
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

  // Manual: Translate page into all 32 languages now
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
        body: JSON.stringify({
          slug: 'about',
          content: data,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setTranslateProgress({ total: 31, completed: json.translatedLanguages?.length || 31, currentLang: 'done' });
        setTranslateStatus('success');
      } else {
        const err = await res.json();
        setTranslateError(err.message || 'Translation failed');
        setTranslateStatus('error');
      }
    } catch (err) {
      setTranslateError(err.message || 'Server connection error');
      setTranslateStatus('error');
    } finally {
      setTranslating(false);
    }
  };

  // Direct Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'about');

    setUploadingImage(true);
    try {
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        const uploadedUrl = json.media?.url || json.url;
        if (uploadedUrl) {
          updateData((prev) => ({
            ...prev,
            banner: { ...prev.banner, imageUrl: uploadedUrl },
          }));
        }
      } else {
        // Fallback to local Object URL preview
        const localPreview = URL.createObjectURL(file);
        updateData((prev) => ({
          ...prev,
          banner: { ...prev.banner, imageUrl: localPreview },
        }));
      }
    } catch {
      const localPreview = URL.createObjectURL(file);
      updateData((prev) => ({
        ...prev,
        banner: { ...prev.banner, imageUrl: localPreview },
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  // Revert to Default Content
  const handleResetToDefault = () => {
    if (window.confirm('Reset all fields to default content? Unsaved draft changes will be lost.')) {
      updateData(DEFAULT_ABOUT_DATA);
    }
  };

  // Statistics Actions
  const handleAddStat = () => {
    updateData((prev) => ({
      ...prev,
      glanceCards: [
        ...prev.glanceCards,
        { id: `stat_${Date.now()}`, number: '100+', label: 'New Metric Label' },
      ],
    }));
  };

  const handleUpdateStat = (id, field, value) => {
    updateData((prev) => ({
      ...prev,
      glanceCards: prev.glanceCards.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const handleDeleteStat = (id) => {
    updateData((prev) => ({
      ...prev,
      glanceCards: prev.glanceCards.filter((s) => s.id !== id),
    }));
  };

  const handleMoveStat = (index, direction) => {
    updateData((prev) => {
      const list = [...prev.glanceCards];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, glanceCards: list };
    });
  };

  // Values Handlers
  const handleAddValue = () => {
    updateData((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        items: [
          ...(prev.values?.items || []),
          {
            id: `val_${Date.now()}`,
            icon: 'FaShieldAlt',
            title: 'New Value Principle',
            description: 'Describe this principle and its impact on your clients and operations.',
          },
        ],
      },
    }));
  };

  const handleUpdateValue = (id, field, value) => {
    updateData((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        items: (prev.values?.items || []).map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      },
    }));
  };

  const handleDeleteValue = (id) => {
    updateData((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        items: (prev.values?.items || []).filter((item) => item.id !== id),
      },
    }));
  };

  const handleMoveValue = (index, direction) => {
    updateData((prev) => {
      const list = [...(prev.values?.items || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        values: { ...prev.values, items: list },
      };
    });
  };

  // Global Focus Handlers
  const handleAddGlobalFeature = () => {
    updateData((prev) => ({
      ...prev,
      globalFocus: {
        ...prev.globalFocus,
        features: [
          ...(prev.globalFocus?.features || []),
          {
            id: `gf_${Date.now()}`,
            title: 'New Global Operation',
            subtitle: 'Regional Highlight',
            description: 'Describe this operational location or cross-border capability.',
          },
        ],
      },
    }));
  };

  const handleUpdateGlobalFeature = (id, field, value) => {
    updateData((prev) => ({
      ...prev,
      globalFocus: {
        ...prev.globalFocus,
        features: (prev.globalFocus?.features || []).map((f) => (f.id === id ? { ...f, [field]: value } : f)),
      },
    }));
  };

  const handleDeleteGlobalFeature = (id) => {
    updateData((prev) => ({
      ...prev,
      globalFocus: {
        ...prev.globalFocus,
        features: (prev.globalFocus?.features || []).filter((f) => f.id !== id),
      },
    }));
  };

  const handleMoveGlobalFeature = (index, direction) => {
    updateData((prev) => {
      const list = [...(prev.globalFocus?.features || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        globalFocus: { ...prev.globalFocus, features: list },
      };
    });
  };

  // Frameworks Handlers
  const handleAddFramework = () => {
    updateData((prev) => ({
      ...prev,
      frameworks: {
        ...prev.frameworks,
        items: [
          ...(prev.frameworks?.items || []),
          {
            id: `fw_${Date.now()}`,
            icon: 'FaShieldAlt',
            title: 'New Framework Standard',
            description: 'Detail the compliance framework, standard, or governance practice.',
          },
        ],
      },
    }));
  };

  const handleUpdateFramework = (id, field, value) => {
    updateData((prev) => ({
      ...prev,
      frameworks: {
        ...prev.frameworks,
        items: (prev.frameworks?.items || []).map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      },
    }));
  };

  const handleDeleteFramework = (id) => {
    updateData((prev) => ({
      ...prev,
      frameworks: {
        ...prev.frameworks,
        items: (prev.frameworks?.items || []).filter((item) => item.id !== id),
      },
    }));
  };

  const handleMoveFramework = (index, direction) => {
    updateData((prev) => {
      const list = [...(prev.frameworks?.items || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        frameworks: { ...prev.frameworks, items: list },
      };
    });
  };

  // Clients & Awards Handlers
  const handleAddAward = () => {
    updateData((prev) => ({
      ...prev,
      clientsAwards: {
        ...prev.clientsAwards,
        awards: [
          ...(prev.clientsAwards?.awards || []),
          {
            id: `aw_${Date.now()}`,
            title: 'New Industry Recognition',
            issuer: 'Issuing Organization',
            year: '2025',
            description: 'Describe the award, qualification, or government recognition.',
          },
        ],
      },
    }));
  };

  const handleUpdateAward = (id, field, value) => {
    updateData((prev) => ({
      ...prev,
      clientsAwards: {
        ...prev.clientsAwards,
        awards: (prev.clientsAwards?.awards || []).map((aw) => (aw.id === id ? { ...aw, [field]: value } : aw)),
      },
    }));
  };

  const handleDeleteAward = (id) => {
    updateData((prev) => ({
      ...prev,
      clientsAwards: {
        ...prev.clientsAwards,
        awards: (prev.clientsAwards?.awards || []).filter((aw) => aw.id !== id),
      },
    }));
  };

  const handleMoveAward = (index, direction) => {
    updateData((prev) => {
      const list = [...(prev.clientsAwards?.awards || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        clientsAwards: { ...prev.clientsAwards, awards: list },
      };
    });
  };

  const handleAddClient = () => {
    updateData((prev) => ({
      ...prev,
      clientsAwards: {
        ...prev.clientsAwards,
        clients: [
          ...(prev.clientsAwards?.clients || []),
          { id: `cl_${Date.now()}`, name: 'New Client / Partner' },
        ],
      },
    }));
  };

  const handleUpdateClient = (id, field, value) => {
    updateData((prev) => ({
      ...prev,
      clientsAwards: {
        ...prev.clientsAwards,
        clients: (prev.clientsAwards?.clients || []).map((cl) => (cl.id === id ? { ...cl, [field]: value } : cl)),
      },
    }));
  };

  const handleDeleteClient = (id) => {
    updateData((prev) => ({
      ...prev,
      clientsAwards: {
        ...prev.clientsAwards,
        clients: (prev.clientsAwards?.clients || []).filter((cl) => cl.id !== id),
      },
    }));
  };

  // ── Logo Marquee Handlers (CMS-controlled brand logo strip) ──
  const handleAddMarqueeLogo = () => {
    updateData((prev) => ({
      ...prev,
      logoMarquee: {
        ...(prev.logoMarquee || {}),
        logos: [
          ...(prev.logoMarquee?.logos || []),
          { id: `lm_${Date.now()}`, name: 'New Brand', imageUrl: '', enabled: true },
        ],
      },
    }));
  };

  const handleUpdateMarqueeLogo = (id, field, value) => {
    updateData((prev) => ({
      ...prev,
      logoMarquee: {
        ...(prev.logoMarquee || {}),
        logos: (prev.logoMarquee?.logos || []).map((l) => (l.id === id ? { ...l, [field]: value } : l)),
      },
    }));
  };

  const handleDeleteMarqueeLogo = (id) => {
    updateData((prev) => ({
      ...prev,
      logoMarquee: {
        ...(prev.logoMarquee || {}),
        logos: (prev.logoMarquee?.logos || []).filter((l) => l.id !== id),
      },
    }));
  };

  const handleMoveMarqueeLogo = (index, direction) => {
    updateData((prev) => {
      const list = [...(prev.logoMarquee?.logos || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, logoMarquee: { ...(prev.logoMarquee || {}), logos: list } };
    });
  };

  const toggleMarqueeLogo = (id) => {
    updateData((prev) => ({
      ...prev,
      logoMarquee: {
        ...(prev.logoMarquee || {}),
        logos: (prev.logoMarquee?.logos || []).map((l) =>
          l.id === id ? { ...l, enabled: l.enabled === false } : l
        ),
      },
    }));
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    updateData((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: [
          ...(prev.faq?.items || []),
          {
            id: `faq_${Date.now()}`,
            question: 'New Question?',
            answer: 'Provide a clear, enterprise-ready explanation.',
          },
        ],
      },
    }));
  };

  const handleUpdateFaq = (id, field, value) => {
    updateData((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: (prev.faq?.items || []).map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      },
    }));
  };

  const handleDeleteFaq = (id) => {
    updateData((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: (prev.faq?.items || []).filter((item) => item.id !== id),
      },
    }));
  };

  const handleMoveFaq = (index, direction) => {
    updateData((prev) => {
      const list = [...(prev.faq?.items || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        faq: { ...prev.faq, items: list },
      };
    });
  };

  // Section Visibility Toggle
  const toggleVisibility = (key) => {
    updateData((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: prev.visibility?.[key] === false ? true : false,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-400">
        <FaSpinner className="animate-spin w-6 h-6 mr-3 text-sky-400" />
        <span>Loading About Us CMS Editor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-[#1e293b] p-4 rounded-xl border border-[#334155] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <FaCompass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">About Us Live CMS Editor</h2>
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
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#334155] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <FaExternalLinkAlt className="w-3 h-3 text-sky-400" />
            <span>Open Public Site</span>
          </a>

          <button
            type="button"
            onClick={handleSaveDraft}
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

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="text-red-300 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Auto-Translate on Publish Checkbox */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#1e293b] rounded-xl border border-[#334155]">
        <input
          type="checkbox"
          id="autoTranslateChk"
          checked={autoTranslateOnPublish}
          onChange={(e) => setAutoTranslateOnPublish(e.target.checked)}
          className="accent-violet-400 w-4 h-4 cursor-pointer"
        />
        <label htmlFor="autoTranslateChk" className="text-xs text-slate-300 cursor-pointer select-none">
          <span className="font-semibold text-violet-400">Auto-translate into all 32 languages</span>{' '}
          when publishing — runs in background using Google Cloud Translation API.
        </label>
      </div>

      {/* Translation Modal */}
      {showTranslateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-2xl border border-[#334155] w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                  <FaLanguage className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Translate About Us Page</h3>
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

            {/* Progress */}
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
              <p>• Falls back to offline mode if no API key is configured.</p>
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

      {/* Success banner */}
      {saveStatus === 'published' && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>About Us page successfully published! All visitors and open tabs now see the updated content.</span>
        </div>
      )}

      {/* MAIN TWO-COLUMN LIVE WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: EDIT CONTROLS (5 cols on xl) */}
        <div className="xl:col-span-5 bg-[#1e293b] rounded-xl border border-[#334155] flex flex-col overflow-hidden shadow-sm">
          {/* Navigation Category Tabs */}
          <div className="grid grid-cols-5 border-b border-[#334155] bg-[#0f172a]/60 text-[11px] font-semibold text-center">
            {[
              { id: 'hero', label: 'Hero', icon: FaSlidersH },
              { id: 'journey', label: 'Journey', icon: FaCompass },
              { id: 'stats', label: 'Stats', icon: FaChartBar },
              { id: 'mission', label: 'Mission', icon: FaBullseye },
              { id: 'values', label: 'Values', icon: FaHeart },
              { id: 'globalFocus', label: 'Global', icon: FaGlobeAmericas },
              { id: 'frameworks', label: 'Frameworks', icon: FaCertificate },
              { id: 'clientsAwards', label: 'Awards', icon: FaAward },
              { id: 'logoMarquee', label: 'Logos', icon: FaImage },
              { id: 'faq', label: 'FAQ', icon: FaQuestionCircle },
              { id: 'visibility', label: 'Sections', icon: FaLayerGroup },
            ].map((tab) => {
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
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="p-4 space-y-4 max-h-[740px] overflow-y-auto">
            {/* TAB 1: HERO BANNER & BREADCRUMBS */}
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

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={data.banner?.badge || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        banner: { ...prev.banner, badge: e.target.value },
                      }))
                    }
                    placeholder="e.g. ABOUT UNISPARK SECURITY & INNOVATION"
                    className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Main Heading</label>
                  <textarea
                    rows={2}
                    value={data.banner?.title || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        banner: { ...prev.banner, title: e.target.value },
                      }))
                    }
                    placeholder="Enter main headline"
                    className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description / Subtitle</label>
                  <textarea
                    rows={3}
                    value={data.banner?.description || data.banner?.subtitle || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        banner: {
                          ...prev.banner,
                          description: e.target.value,
                          subtitle: e.target.value,
                        },
                      }))
                    }
                    placeholder="Enter descriptive copy"
                    className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Breadcrumb Label</label>
                  <input
                    type="text"
                    value={data.banner?.breadcrumbText || 'About Us'}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        banner: { ...prev.banner, breadcrumbText: e.target.value },
                      }))
                    }
                    placeholder="e.g. About Us"
                    className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Image upload and URL */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Background Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={data.banner?.imageUrl || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          banner: { ...prev.banner, imageUrl: e.target.value },
                        }))
                      }
                      placeholder="https://... or click Upload"
                      className="flex-1 px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-3 py-2 rounded-lg bg-[#334155] hover:bg-[#475569] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                    >
                      {uploadingImage ? <FaSpinner className="animate-spin w-3 h-3" /> : <FaCloudUploadAlt className="w-3.5 h-3.5 text-sky-400" />}
                      <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Overlay Darkness / Opacity Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-medium text-slate-300">Background Overlay Darkness</label>
                    <span className="text-xs font-bold text-sky-400">
                      {data.banner?.overlayOpacity ?? 65}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="95"
                    step="5"
                    value={data.banner?.overlayOpacity ?? 65}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        banner: { ...prev.banner, overlayOpacity: Number(e.target.value) },
                      }))
                    }
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Brighter (10%)</span>
                    <span>Default (65%)</span>
                    <span>Darker (95%)</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: JOURNEY & STORY */}
            {activeTab === 'journey' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Our Journey & Story</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('journey')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.journey !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.journey !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.journey !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Journey Badge</label>
                  <input
                    type="text"
                    value={data.overview?.badge || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        overview: { ...prev.overview, badge: e.target.value },
                      }))
                    }
                    placeholder="e.g. OUR JOURNEY"
                    className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Story Title</label>
                  <input
                    type="text"
                    value={data.overview?.heading || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        overview: { ...prev.overview, heading: e.target.value },
                      }))
                    }
                    placeholder="e.g. The Story of UniSpark Innovation"
                    className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={data.overview?.subtitle || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        overview: { ...prev.overview, subtitle: e.target.value },
                      }))
                    }
                    placeholder="e.g. From a visionary engineering startup in 2020 to a recognized regional technology power."
                    className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Paragraph 1 (Origins & Mission)</label>
                  <textarea
                    rows={4}
                    value={data.overview?.paragraph1 || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        overview: { ...prev.overview, paragraph1: e.target.value },
                      }))
                    }
                    placeholder="Enter first story paragraph"
                    className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Paragraph 2 (Growth & Scale)</label>
                  <textarea
                    rows={4}
                    value={data.overview?.paragraph2 || ''}
                    onChange={(e) =>
                      updateData((prev) => ({
                        ...prev,
                        overview: { ...prev.overview, paragraph2: e.target.value },
                      }))
                    }
                    placeholder="Enter second story paragraph"
                    className="w-full px-3 py-2 rounded-lg bg-[#0f172a] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: STATISTICS METRICS */}
            {activeTab === 'stats' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Statistics Grid</h3>
                    <p className="text-[11px] text-slate-400">Reorder, edit values, or add new stats.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleVisibility('statistics')}
                      className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                        data.visibility?.statistics !== false
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {data.visibility?.statistics !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                      {data.visibility?.statistics !== false ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddStat}
                      className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <FaPlus size={10} /> Add
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {(data.glanceCards || []).map((card, idx) => (
                    <div
                      key={card.id || idx}
                      className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center gap-2.5"
                    >
                      {/* Reorder buttons */}
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveStat(idx, 'up')}
                          className="p-1 rounded bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <FaArrowUp size={9} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === (data.glanceCards || []).length - 1}
                          onClick={() => handleMoveStat(idx, 'down')}
                          className="p-1 rounded bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <FaArrowDown size={9} />
                        </button>
                      </div>

                      {/* Number input */}
                      <div className="w-24">
                        <label className="block text-[10px] text-slate-400 mb-0.5">Value</label>
                        <input
                          type="text"
                          value={card.number || ''}
                          onChange={(e) => handleUpdateStat(card.id, 'number', e.target.value)}
                          placeholder="e.g. 15+"
                          className="w-full px-2 py-1.5 rounded bg-[#1e293b] border border-[#334155] text-xs font-bold text-sky-400 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      {/* Label input */}
                      <div className="flex-1">
                        <label className="block text-[10px] text-slate-400 mb-0.5">Metric Label</label>
                        <input
                          type="text"
                          value={card.label || ''}
                          onChange={(e) => handleUpdateStat(card.id, 'label', e.target.value)}
                          placeholder="e.g. Years of Technical Excellence"
                          className="w-full px-2 py-1.5 rounded bg-[#1e293b] border border-[#334155] text-xs text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteStat(card.id)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete statistic"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: MISSION & VISION */}
            {activeTab === 'mission' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mission & Vision Cards</h3>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('missionVision')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.missionVision !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.missionVision !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    {data.visibility?.missionVision !== false ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                {/* Mission Card Edit */}
                <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">Card 1: Mission</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Icon:</span>
                      <select
                        value={data.missionVision?.missionIcon || 'FaBullseye'}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            missionVision: { ...prev.missionVision, missionIcon: e.target.value },
                          }))
                        }
                        className="bg-[#1e293b] border border-[#334155] text-xs text-white rounded px-2 py-1"
                      >
                        {AVAILABLE_ICONS.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={data.missionVision?.missionTitle || 'Our Mission'}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          missionVision: { ...prev.missionVision, missionTitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={data.missionVision?.missionDesc || data.missionVision?.mission || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          missionVision: {
                            ...prev.missionVision,
                            missionDesc: e.target.value,
                            mission: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                    />
                  </div>
                </div>

                {/* Vision Card Edit */}
                <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">Card 2: Vision</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Icon:</span>
                      <select
                        value={data.missionVision?.visionIcon || 'FaEye'}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            missionVision: { ...prev.missionVision, visionIcon: e.target.value },
                          }))
                        }
                        className="bg-[#1e293b] border border-[#334155] text-xs text-white rounded px-2 py-1"
                      >
                        {AVAILABLE_ICONS.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={data.missionVision?.visionTitle || 'Our Vision'}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          missionVision: { ...prev.missionVision, visionTitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={data.missionVision?.visionDesc || data.missionVision?.vision || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          missionVision: {
                            ...prev.missionVision,
                            visionDesc: e.target.value,
                            vision: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CORE VALUES */}
            {activeTab === 'values' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Core Values & Principles</h3>
                    <p className="text-[11px] text-slate-400">Engineering disciplines, outcomes, and trust pillars.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('values')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.values !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.values !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    <span>{data.visibility?.values !== false ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={data.values?.badge || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          values: { ...prev.values, badge: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Section Heading</label>
                    <input
                      type="text"
                      value={data.values?.heading || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          values: { ...prev.values, heading: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      value={data.values?.subtitle || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          values: { ...prev.values, subtitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>
                </div>

                {/* Values Items List */}
                <div className="pt-2 border-t border-[#334155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Value Cards ({(data.values?.items || []).length})</span>
                    <button
                      type="button"
                      onClick={handleAddValue}
                      className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500/20 flex items-center gap-1"
                    >
                      <FaPlus size={10} /> Add Principle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(data.values?.items || []).map((item, idx) => (
                      <div key={item.id || idx} className="p-3 bg-[#0f172a] rounded-lg border border-[#334155] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-400 border border-[#334155]">
                              #{idx + 1}
                            </span>
                            <select
                              value={item.icon || 'FaShieldAlt'}
                              onChange={(e) => handleUpdateValue(item.id, 'icon', e.target.value)}
                              className="bg-[#1e293b] border border-[#334155] text-xs text-white rounded px-2 py-0.5"
                            >
                              {AVAILABLE_ICONS.map((i) => (
                                <option key={i.id} value={i.id}>{i.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveValue(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move up"
                            >
                              <FaArrowUp size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveValue(idx, 'down')}
                              disabled={idx === (data.values?.items || []).length - 1}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move down"
                            >
                              <FaArrowDown size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteValue(item.id)}
                              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              title="Delete"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Title</label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => handleUpdateValue(item.id, 'title', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Description</label>
                          <textarea
                            rows={2}
                            value={item.description || ''}
                            onChange={(e) => handleUpdateValue(item.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GLOBAL DELIVERY & GCC MODEL */}
            {activeTab === 'globalFocus' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Global Delivery & GCC Model</h3>
                    <p className="text-[11px] text-slate-400">Dual-shore architecture, India engineering hub, UAE operations.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('globalFocus')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.globalFocus !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.globalFocus !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    <span>{data.visibility?.globalFocus !== false ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={data.globalFocus?.badge || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          globalFocus: { ...prev.globalFocus, badge: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Heading</label>
                    <input
                      type="text"
                      value={data.globalFocus?.heading || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          globalFocus: { ...prev.globalFocus, heading: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      value={data.globalFocus?.subtitle || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          globalFocus: { ...prev.globalFocus, subtitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Overview Description</label>
                    <textarea
                      rows={2}
                      value={data.globalFocus?.description || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          globalFocus: { ...prev.globalFocus, description: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>
                </div>

                {/* Operations Pillars List */}
                <div className="pt-2 border-t border-[#334155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Operations Pillars ({(data.globalFocus?.features || []).length})</span>
                    <button
                      type="button"
                      onClick={handleAddGlobalFeature}
                      className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500/20 flex items-center gap-1"
                    >
                      <FaPlus size={10} /> Add Pillar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(data.globalFocus?.features || []).map((feature, idx) => (
                      <div key={feature.id || idx} className="p-3 bg-[#0f172a] rounded-lg border border-[#334155] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-400 border border-[#334155]">
                            #{idx + 1} Pillar
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveGlobalFeature(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move up"
                            >
                              <FaArrowUp size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveGlobalFeature(idx, 'down')}
                              disabled={idx === (data.globalFocus?.features || []).length - 1}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move down"
                            >
                              <FaArrowDown size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGlobalFeature(feature.id)}
                              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              title="Delete"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Title</label>
                          <input
                            type="text"
                            value={feature.title || ''}
                            onChange={(e) => handleUpdateGlobalFeature(feature.id, 'title', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Tagline / Subtitle</label>
                          <input
                            type="text"
                            value={feature.subtitle || ''}
                            onChange={(e) => handleUpdateGlobalFeature(feature.id, 'subtitle', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Description</label>
                          <textarea
                            rows={2}
                            value={feature.description || ''}
                            onChange={(e) => handleUpdateGlobalFeature(feature.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CREDENTIALS & FRAMEWORKS */}
            {activeTab === 'frameworks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Credentials & Frameworks</h3>
                    <p className="text-[11px] text-slate-400">Compliance standards, security-by-design, governance models.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('frameworks')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.frameworks !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.frameworks !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    <span>{data.visibility?.frameworks !== false ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={data.frameworks?.badge || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          frameworks: { ...prev.frameworks, badge: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Heading</label>
                    <input
                      type="text"
                      value={data.frameworks?.heading || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          frameworks: { ...prev.frameworks, heading: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      value={data.frameworks?.subtitle || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          frameworks: { ...prev.frameworks, subtitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>
                </div>

                {/* Frameworks Items List */}
                <div className="pt-2 border-t border-[#334155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Framework Items ({(data.frameworks?.items || []).length})</span>
                    <button
                      type="button"
                      onClick={handleAddFramework}
                      className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500/20 flex items-center gap-1"
                    >
                      <FaPlus size={10} /> Add Framework
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(data.frameworks?.items || []).map((item, idx) => (
                      <div key={item.id || idx} className="p-3 bg-[#0f172a] rounded-lg border border-[#334155] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-400 border border-[#334155]">
                              #{idx + 1}
                            </span>
                            <select
                              value={item.icon || 'FaShieldAlt'}
                              onChange={(e) => handleUpdateFramework(item.id, 'icon', e.target.value)}
                              className="bg-[#1e293b] border border-[#334155] text-xs text-white rounded px-2 py-0.5"
                            >
                              {AVAILABLE_ICONS.map((i) => (
                                <option key={i.id} value={i.id}>{i.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveFramework(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move up"
                            >
                              <FaArrowUp size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveFramework(idx, 'down')}
                              disabled={idx === (data.frameworks?.items || []).length - 1}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move down"
                            >
                              <FaArrowDown size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFramework(item.id)}
                              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              title="Delete"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Title</label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) => handleUpdateFramework(item.id, 'title', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Description</label>
                          <textarea
                            rows={2}
                            value={item.description || ''}
                            onChange={(e) => handleUpdateFramework(item.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CLIENTS & AWARDS */}
            {activeTab === 'clientsAwards' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Clients & Awards</h3>
                    <p className="text-[11px] text-slate-400">Industry recognitions, government certifications & trusted enterprise partners.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('clientsAwards')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.clientsAwards !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.clientsAwards !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    <span>{data.visibility?.clientsAwards !== false ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={data.clientsAwards?.badge || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          clientsAwards: { ...prev.clientsAwards, badge: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Heading</label>
                    <input
                      type="text"
                      value={data.clientsAwards?.heading || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          clientsAwards: { ...prev.clientsAwards, heading: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      value={data.clientsAwards?.subtitle || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          clientsAwards: { ...prev.clientsAwards, subtitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>
                </div>

                {/* Awards List */}
                <div className="pt-3 border-t border-[#334155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Recognitions & Awards ({(data.clientsAwards?.awards || []).length})</span>
                    <button
                      type="button"
                      onClick={handleAddAward}
                      className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 flex items-center gap-1"
                    >
                      <FaPlus size={10} /> Add Award
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(data.clientsAwards?.awards || []).map((award, idx) => (
                      <div key={award.id || idx} className="p-3 bg-[#0f172a] rounded-lg border border-[#334155] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1e293b] text-amber-400 border border-amber-500/30">
                            Award #{idx + 1}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveAward(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move up"
                            >
                              <FaArrowUp size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveAward(idx, 'down')}
                              disabled={idx === (data.clientsAwards?.awards || []).length - 1}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move down"
                            >
                              <FaArrowDown size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAward(award.id)}
                              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              title="Delete"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Award Title</label>
                            <input
                              type="text"
                              value={award.title || ''}
                              onChange={(e) => handleUpdateAward(award.id, 'title', e.target.value)}
                              className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">Year / Status</label>
                            <input
                              type="text"
                              value={award.year || ''}
                              onChange={(e) => handleUpdateAward(award.id, 'year', e.target.value)}
                              className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Issuer / Organization</label>
                          <input
                            type="text"
                            value={award.issuer || ''}
                            onChange={(e) => handleUpdateAward(award.id, 'issuer', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Description</label>
                          <textarea
                            rows={2}
                            value={award.description || ''}
                            onChange={(e) => handleUpdateAward(award.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clients List */}
                <div className="pt-3 border-t border-[#334155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Client / Partner Badges ({(data.clientsAwards?.clients || []).length})</span>
                    <button
                      type="button"
                      onClick={handleAddClient}
                      className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500/20 flex items-center gap-1"
                    >
                      <FaPlus size={10} /> Add Client
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {(data.clientsAwards?.clients || []).map((client, idx) => (
                      <div key={client.id || idx} className="p-2 bg-[#0f172a] rounded-lg border border-[#334155] flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={client.name || ''}
                          onChange={(e) => handleUpdateClient(client.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-1 rounded text-red-400 hover:text-red-300 shrink-0"
                          title="Delete"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LOGO MARQUEE — CMS-controlled brand logo strip */}
            {activeTab === 'logoMarquee' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Logo Marquee</h3>
                    <p className="text-[11px] text-slate-400">Scrolling brand logos under “Trusted by Leading Enterprise Brands”.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateData((prev) => ({
                        ...prev,
                        logoMarquee: { ...(prev.logoMarquee || {}), enabled: prev.logoMarquee?.enabled === false },
                      }))
                    }
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.logoMarquee?.enabled !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.logoMarquee?.enabled !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    <span>{data.logoMarquee?.enabled !== false ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>

                {/* Marquee settings */}
                <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Heading Text</label>
                    <input
                      type="text"
                      value={data.logoMarquee?.heading || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          logoMarquee: { ...(prev.logoMarquee || {}), heading: e.target.value },
                        }))
                      }
                      placeholder="Trusted by Leading Enterprise Brands"
                      className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] text-slate-400">Scroll Speed</label>
                      <span className="text-[10px] font-bold text-sky-400">{data.logoMarquee?.speedSeconds || 35}s / loop</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="5"
                      value={data.logoMarquee?.speedSeconds || 35}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          logoMarquee: { ...(prev.logoMarquee || {}), speedSeconds: Number(e.target.value) },
                        }))
                      }
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>Faster</span>
                      <span>Slower</span>
                    </div>
                  </div>
                </div>

                {/* Logo list */}
                <div className="pt-2 border-t border-[#334155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Brand Logos ({(data.logoMarquee?.logos || []).length})</span>
                    <button
                      type="button"
                      onClick={handleAddMarqueeLogo}
                      className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500/20 flex items-center gap-1"
                    >
                      <FaPlus size={10} /> Add Logo
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(data.logoMarquee?.logos || []).map((logo, idx) => (
                      <div
                        key={logo.id || idx}
                        className={`p-3 rounded-lg border space-y-2.5 ${
                          logo.enabled === false
                            ? 'bg-[#0f172a]/50 border-[#334155] opacity-60'
                            : 'bg-[#0f172a] border-[#334155]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-400 border border-[#334155]">
                            #{idx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveMarqueeLogo(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move earlier"
                            >
                              <FaArrowUp size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveMarqueeLogo(idx, 'down')}
                              disabled={idx === (data.logoMarquee?.logos || []).length - 1}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move later"
                            >
                              <FaArrowDown size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleMarqueeLogo(logo.id)}
                              className={`p-1 rounded ${
                                logo.enabled === false ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'
                              }`}
                              title={logo.enabled === false ? 'Enable logo' : 'Disable logo (kept in list)'}
                            >
                              {logo.enabled === false ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMarqueeLogo(logo.id)}
                              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              title="Remove logo"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Brand Name</label>
                          <input
                            type="text"
                            value={logo.name || ''}
                            onChange={(e) => handleUpdateMarqueeLogo(logo.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>

                        {/* Existing media system: upload / URL / preview / remove */}
                        <ImagePickerField
                          label="Logo Image"
                          folder="logos"
                          value={logo.imageUrl || ''}
                          onChange={(url) => handleUpdateMarqueeLogo(logo.id, 'imageUrl', url)}
                          helpText="Upload from the media library or paste an existing asset URL."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h3>
                    <p className="text-[11px] text-slate-400">Enterprise queries, SLAs, technical integration, compliance.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleVisibility('faq')}
                    className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                      data.visibility?.faq !== false
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {data.visibility?.faq !== false ? <FaEye size={10} /> : <FaEyeSlash size={10} />}
                    <span>{data.visibility?.faq !== false ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Badge</label>
                    <input
                      type="text"
                      value={data.faq?.badge || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          faq: { ...prev.faq, badge: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Heading</label>
                    <input
                      type="text"
                      value={data.faq?.heading || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          faq: { ...prev.faq, heading: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Subtitle</label>
                    <textarea
                      rows={2}
                      value={data.faq?.subtitle || ''}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          faq: { ...prev.faq, subtitle: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-[#0f172a] border border-[#334155] text-xs text-white"
                    />
                  </div>
                </div>

                {/* FAQ Items List */}
                <div className="pt-2 border-t border-[#334155] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Questions & Answers ({(data.faq?.items || []).length})</span>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold hover:bg-sky-500/20 flex items-center gap-1"
                    >
                      <FaPlus size={10} /> Add Q&A
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(data.faq?.items || []).map((item, idx) => (
                      <div key={item.id || idx} className="p-3 bg-[#0f172a] rounded-lg border border-[#334155] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#1e293b] text-slate-400 border border-[#334155]">
                            Q#{idx + 1}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveFaq(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move up"
                            >
                              <FaArrowUp size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveFaq(idx, 'down')}
                              disabled={idx === (data.faq?.items || []).length - 1}
                              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                              title="Move down"
                            >
                              <FaArrowDown size={10} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFaq(item.id)}
                              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              title="Delete"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Question</label>
                          <input
                            type="text"
                            value={item.question || ''}
                            onChange={(e) => handleUpdateFaq(item.id, 'question', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Answer</label>
                          <textarea
                            rows={3}
                            value={item.answer || ''}
                            onChange={(e) => handleUpdateFaq(item.id, 'answer', e.target.value)}
                            className="w-full px-2 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SECTION VISIBILITY MASTER TOGGLES */}
            {activeTab === 'visibility' && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-[#334155]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Section Visibility Manager</h3>
                  <p className="text-[11px] text-slate-400">Toggle sections on or off. Updates reflect instantly in preview.</p>
                </div>

                <div className="space-y-2">
                  {[
                    { key: 'hero', label: 'Hero Banner Section', desc: 'Top banner, headline, description, breadcrumbs' },
                    { key: 'journey', label: 'Our Journey & Story', desc: 'Heading, subtitle, two story narrative paragraphs' },
                    { key: 'statistics', label: 'Glance Statistics Grid', desc: 'Key metrics cards (years, deployments, sqft, compliance)' },
                    { key: 'missionVision', label: 'Mission & Vision Section', desc: 'Two core company purpose cards with icons' },
                    { key: 'values', label: 'Core Values Section', desc: 'Engineering discipline and outcome pillars' },
                    { key: 'globalFocus', label: 'Global Delivery & GCC Model', desc: 'Dual-shore operations & regional execution hubs' },
                    { key: 'frameworks', label: 'Credentials & Frameworks', desc: 'ISO, NIST, Zero-Trust compliance standards' },
                    { key: 'clientsAwards', label: 'Clients & Awards Section', desc: 'Industry recognitions & client trust badges' },
                    { key: 'logoMarquee', label: 'Brand Logo Marquee', desc: 'Scrolling partner/client logo strip under the trust heading' },
                    { key: 'leadership', label: 'Executive Leadership Section', desc: 'Executive board and team member cards' },
                    { key: 'faq', label: 'Frequently Asked Questions (FAQ)', desc: 'Enterprise questions and answers accordion' },
                    { key: 'cta', label: 'Bottom CTA Strip', desc: 'Global consultation & contact action strip' },
                  ].map(({ key, label, desc }) => {
                    const isVisible = data.visibility?.[key] !== false;
                    return (
                      <div
                        key={key}
                        onClick={() => toggleVisibility(key)}
                        className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                          isVisible
                            ? 'bg-[#0f172a] border-sky-500/40'
                            : 'bg-[#0f172a]/40 border-[#334155] opacity-60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{label}</span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                                isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {isVisible ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                        </div>

                        <div className="ml-3">
                          {isVisible ? (
                            <FaEye className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <FaEyeSlash className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REAL-TIME LIVE PREVIEW (7 cols on xl) */}
        <div className="xl:col-span-7 bg-[#1e293b] rounded-xl border border-[#334155] flex flex-col overflow-hidden shadow-sm">
          {/* Live Preview Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#334155] bg-[#0f172a]/70">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-white tracking-wide">Live Preview</span>
              <span className="text-[10px] text-slate-400 font-mono">React Render Engine</span>
            </div>

            {/* Viewport device toggles */}
            <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-lg border border-[#334155]">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded text-xs transition-all ${
                  previewDevice === 'desktop' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View (100%)"
              >
                <FaDesktop size={12} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded text-xs transition-all ${
                  previewDevice === 'tablet' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View (768px)"
              >
                <FaTabletAlt size={12} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded text-xs transition-all ${
                  previewDevice === 'mobile' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View (375px)"
              >
                <FaMobileAlt size={12} />
              </button>
            </div>
          </div>

          {/* Live Preview Viewport Frame */}
          <div className="bg-[#0b1329] p-2 sm:p-4 overflow-x-auto flex justify-center items-start min-h-[720px] max-h-[760px] overflow-y-auto">
            <div
              className={`transition-all duration-300 bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 ${
                previewDevice === 'mobile'
                  ? 'w-[375px] my-2'
                  : previewDevice === 'tablet'
                  ? 'w-[768px] my-2'
                  : 'w-full'
              }`}
            >
              {/* Actual About Content component rendered directly with reactive draft state */}
              <AboutContent data={data} isPreview={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPageEditor;
