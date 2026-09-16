import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2, X, Building, Check, Star, UploadCloud, Layers, FileText, ExternalLink, Image as ImageIcon, AlertTriangle, ShieldAlert } from 'lucide-react';
import { fetchSection5Config, updateSection5Config, WEBSITE_BASE_URL } from '../services/api';

const QUICK_ICONS = [
  { name: 'Plane (Aviation)', class: 'fa-plane' },
  { name: 'Building (Real Estate)', class: 'fa-building' },
  { name: 'Industry (Oil & Gas)', class: 'fa-industry' },
  { name: 'Hotel (Hospitality)', class: 'fa-hotel' },
  { name: 'Hospital (Healthcare)', class: 'fa-hospital' },
  { name: 'Shield (Consumer)', class: 'fa-shield-halved' },
  { name: 'Factory', class: 'fa-warehouse' },
  { name: 'Ship', class: 'fa-ship' },
  { name: 'Education', class: 'fa-graduation-cap' },
];

export default function IndustriesEditor({ onShowToast }) {
  const [mainTitle, setMainTitle] = useState('INDUSTRIES WE SERVE');
  const [mainHeading, setMainHeading] = useState('Security Solutions Built for Your Sector');
  const [mainDescription, setMainDescription] = useState('');

  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Add/Edit Card Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSlug, setModalSlug] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalSubtitle, setModalSubtitle] = useState('');
  const [modalIcon, setModalIcon] = useState('fa-building');
  const [modalImage, setModalImage] = useState('');
  const [modalImageBase64, setModalImageBase64] = useState('');
  const [modalLink, setModalLink] = useState('');

  // =========================================================================
  // INSIDE PAGE FULL CMS MODAL STATE
  // =========================================================================
  const [showInsidePageModal, setShowInsidePageModal] = useState(false);
  const [activeInsideIndustry, setActiveInsideIndustry] = useState(null);
  const [insideActiveTab, setInsideActiveTab] = useState('banner');

  // Section 1: Header Banner
  const [insidePageTitle, setInsidePageTitle] = useState('');
  const [insideBannerTagline, setInsideBannerTagline] = useState('');
  const [insideBannerBgImage, setInsideBannerBgImage] = useState('');
  const [insideBannerBgBase64, setInsideBannerBgBase64] = useState('');
  const [insideHeroCtaText, setInsideHeroCtaText] = useState('');
  const [insideHeroCtaLink, setInsideHeroCtaLink] = useState('');

  // Section 2: Overview
  const [insideOverviewBadge, setInsideOverviewBadge] = useState('');
  const [insideOverviewHeading, setInsideOverviewHeading] = useState('');
  const [insideOverviewParagraph1, setInsideOverviewParagraph1] = useState('');
  const [insideOverviewParagraph2, setInsideOverviewParagraph2] = useState('');
  const [insideOverviewImage, setInsideOverviewImage] = useState('');
  const [insideOverviewImageBase64, setInsideOverviewImageBase64] = useState('');

  // Section 3: Key Challenges
  const [insideChallengesBadge, setInsideChallengesBadge] = useState('');
  const [insideChallengesHeading, setInsideChallengesHeading] = useState('');
  const [insideChallenges, setInsideChallenges] = useState([]);

  // Section 4: Tailored Solutions Provided
  const [insideSolutionsBadge, setInsideSolutionsBadge] = useState('');
  const [insideSolutionsHeading, setInsideSolutionsHeading] = useState('');
  const [insideSolutionsProvided, setInsideSolutionsProvided] = useState([]);

  // Section 5: Key Brands
  const [insideBrandsHeading, setInsideBrandsHeading] = useState('');
  const [insideBrandsSubheading, setInsideBrandsSubheading] = useState('');
  const [insideBrands, setInsideBrands] = useState([]);

  // Section 6: Sub-Sectors / Verticals
  const [insideSectorsBadge, setInsideSectorsBadge] = useState('');
  const [insideSectorsHeading, setInsideSectorsHeading] = useState('');
  const [insideSectorsDesc, setInsideSectorsDesc] = useState('');
  const [insideTargetSectors, setInsideTargetSectors] = useState([]);

  // Section 7: Why Choose Us
  const [insideWhyBadge, setInsideWhyBadge] = useState('');
  const [insideWhyHeading, setInsideWhyHeading] = useState('');
  const [insideWhyChooseUs, setInsideWhyChooseUs] = useState([]);

  // Section 8: Bottom CTA
  const [insideCtaHeading, setInsideCtaHeading] = useState('');
  const [insideCtaDesc, setInsideCtaDesc] = useState('');
  const [insideCtaBtn1Text, setInsideCtaBtn1Text] = useState('');
  const [insideCtaBtn1Link, setInsideCtaBtn1Link] = useState('');
  const [insideCtaBtn2Text, setInsideCtaBtn2Text] = useState('');
  const [insideCtaBtn2Link, setInsideCtaBtn2Link] = useState('');

  const [isSavingInsidePage, setIsSavingInsidePage] = useState(false);

  // ===========================================================================
  // Load Data
  // ===========================================================================
  const loadIndustriesData = async () => {
    setLoading(true);
    const res = await fetchSection5Config();
    if (res.success && res.data) {
      setMainTitle(res.data.title || 'INDUSTRIES WE SERVE');
      setMainHeading(res.data.heading || 'Security Solutions Built for Your Sector');
      setMainDescription(res.data.description || '');
      if (Array.isArray(res.data.cards)) {
        setIndustries(res.data.cards);
      }
    } else {
      if (onShowToast) onShowToast('Failed to load industries data from backend');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadIndustriesData();
  }, []);

  // ===========================================================================
  // Add/Edit Modal Handlers
  // ===========================================================================
  const handleOpenAddModal = () => {
    setEditingId(null);
    setModalTitle('');
    setModalSlug('');
    setModalDesc('');
    setModalSubtitle('');
    setModalIcon('fa-building');
    setModalImage('');
    setModalImageBase64('');
    setModalLink('');
    setShowModal(true);
  };

  const handleOpenEditModal = (industry) => {
    setEditingId(industry.id);
    setModalTitle(industry.title || '');
    setModalSlug(industry.id || '');
    setModalDesc(industry.description || industry.desc || '');
    setModalSubtitle(industry.subtitle || '');
    setModalIcon(industry.icon || 'fa-building');
    setModalImage(industry.image || '');
    setModalImageBase64('');
    setModalLink(industry.link || '');
    setShowModal(true);
  };

  const handleSaveModalIndustry = async () => {
    if (!modalTitle.trim()) {
      if (onShowToast) onShowToast('Industry Title is required');
      return;
    }
    const slug = modalSlug.trim() || modalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newObj = {
      ...(editingId ? industries.find(i => i.id === editingId) || {} : {}),
      id: editingId || slug,
      title: modalTitle.trim(),
      subtitle: modalSubtitle.trim(),
      description: modalDesc.trim(),
      icon: modalIcon.trim() || 'fa-building',
      image: modalImageBase64 || modalImage,
      link: modalLink.trim() || `/industries/${slug}`,
    };

    let updated = [];
    if (editingId) {
      updated = industries.map(i => i.id === editingId ? newObj : i);
    } else {
      updated = [...industries, newObj];
    }
    setIndustries(updated);
    setShowModal(false);

    setIsSaving(true);
    const res = await updateSection5Config({ title: mainTitle, heading: mainHeading, description: mainDescription, cards: updated });
    setIsSaving(false);
    if (res.success) {
      if (onShowToast) onShowToast(editingId ? 'Industry updated successfully!' : 'New Industry added successfully!');
    } else {
      if (onShowToast) onShowToast(res.message || 'Failed to save industry.');
    }
  };

  const handleDeleteIndustry = async (idToDelete) => {
    if (!window.confirm('Are you sure you want to delete this industry?')) return;
    const updated = industries.filter(i => i.id !== idToDelete);
    setIndustries(updated);
    const res = await updateSection5Config({ title: mainTitle, heading: mainHeading, description: mainDescription, cards: updated });
    if (res.success) {
      if (onShowToast) onShowToast('Industry deleted successfully!');
    } else {
      if (onShowToast) onShowToast('Error deleting industry.');
    }
  };

  // Main header settings save
  const handleSaveMainSettings = async () => {
    setIsSaving(true);
    const res = await updateSection5Config({ title: mainTitle, heading: mainHeading, description: mainDescription, cards: industries });
    setIsSaving(false);
    if (res.success) {
      if (onShowToast) onShowToast('Industries section settings saved!');
    } else {
      if (onShowToast) onShowToast(res.message || 'Failed to save settings.');
    }
  };

  // ===========================================================================
  // Inside Page Modal Handlers
  // ===========================================================================
  const handleOpenInsidePageModal = (industry) => {
    setActiveInsideIndustry(industry);
    setInsideActiveTab('banner');

    // Section 1: Banner
    setInsidePageTitle(industry.pageTitle || industry.title || '');
    setInsideBannerTagline(industry.bannerTagline || 'SIRA Compliant · Sector-Specialist Engineers · UAE-Wide Coverage');
    setInsideBannerBgImage(industry.bannerBgImage || industry.image || '');
    setInsideBannerBgBase64('');
    setInsideHeroCtaText(industry.heroCtaText || 'Request Sector Assessment');
    setInsideHeroCtaLink(industry.heroCtaLink || '/contact-us');

    // Section 2: Overview
    setInsideOverviewBadge(industry.overviewBadge || 'SECTOR OVERVIEW');
    setInsideOverviewHeading(industry.overviewHeading || '');
    setInsideOverviewParagraph1(industry.overviewParagraph1 || industry.description || industry.desc || '');
    setInsideOverviewParagraph2(industry.overviewParagraph2 || '');
    setInsideOverviewImage(industry.overviewImage || industry.image || '');
    setInsideOverviewImageBase64('');

    // Section 3: Key Challenges
    setInsideChallengesBadge(industry.keyChallengesBadge || 'Sector Challenges');
    setInsideChallengesHeading(industry.keyChallengesHeading || 'CRITICAL SECURITY THREATS & COMPLIANCE DEMANDS');
    setInsideChallenges(Array.isArray(industry.keyChallenges) ? industry.keyChallenges : []);

    // Section 4: Solutions Provided
    setInsideSolutionsBadge(industry.solutionsProvidedBadge || 'Tailored Solutions');
    setInsideSolutionsHeading(industry.solutionsProvidedHeading || 'ENGINEERED SECURITY MATRIX');
    setInsideSolutionsProvided(Array.isArray(industry.solutionsProvided) ? industry.solutionsProvided : []);

    // Section 5: Brands
    setInsideBrandsHeading(industry.brandsHeading || 'APPROVED ECOSYSTEM BRANDS');
    setInsideBrandsSubheading(industry.brandsSubheading || 'Enterprise-grade equipment from global security leaders.');
    setInsideBrands(Array.isArray(industry.brands) ? industry.brands : []);

    // Section 6: Sub-Sectors
    setInsideSectorsBadge(industry.sectorsBadge || 'Sub-Sectors');
    setInsideSectorsHeading(industry.sectorsHeading || 'SPECIALIZED VERTICALS SERVED');
    setInsideSectorsDesc(industry.sectorsDesc || '');
    setInsideTargetSectors(Array.isArray(industry.targetSectors) ? industry.targetSectors : []);

    // Section 7: Why Choose Us
    setInsideWhyBadge(industry.whyBadge || 'WHY UNISPARK');
    setInsideWhyHeading(industry.whyHeading || 'Why Leading Enterprises Trust UniSpark');
    setInsideWhyChooseUs(Array.isArray(industry.whyChooseUs) ? industry.whyChooseUs : []);

    // Section 8: Bottom CTA
    setInsideCtaHeading(industry.ctaHeading || `Ready to Fortify Your ${industry.title} Operations?`);
    setInsideCtaDesc(industry.ctaDesc || 'Our sector security specialists provide SIRA-compliant site surveys and custom system designs across all UAE emirates.');
    setInsideCtaBtn1Text(industry.ctaBtn1Text || 'Request Sector Assessment');
    setInsideCtaBtn1Link(industry.ctaBtn1Link || '/contact-us');
    setInsideCtaBtn2Text(industry.ctaBtn2Text || 'Call Sector Engineers (+971 50 288 5874)');
    setInsideCtaBtn2Link(industry.ctaBtn2Link || 'tel:+971502885874');

    setShowInsidePageModal(true);
  };

  const handleSaveInsidePageCMS = async () => {
    if (!activeInsideIndustry) return;
    setIsSavingInsidePage(true);

    const updatedIndustry = {
      ...activeInsideIndustry,
      // 1. Banner
      pageTitle: insidePageTitle,
      bannerTagline: insideBannerTagline,
      bannerBgImage: insideBannerBgBase64 || insideBannerBgImage,
      heroCtaText: insideHeroCtaText,
      heroCtaLink: insideHeroCtaLink,
      // 2. Overview
      overviewBadge: insideOverviewBadge,
      overviewHeading: insideOverviewHeading,
      overviewParagraph1: insideOverviewParagraph1,
      overviewParagraph2: insideOverviewParagraph2,
      overviewImage: insideOverviewImageBase64 || insideOverviewImage,
      // 3. Key Challenges
      keyChallengesBadge: insideChallengesBadge,
      keyChallengesHeading: insideChallengesHeading,
      keyChallenges: insideChallenges,
      // 4. Solutions Provided
      solutionsProvidedBadge: insideSolutionsBadge,
      solutionsProvidedHeading: insideSolutionsHeading,
      solutionsProvided: insideSolutionsProvided,
      // 5. Brands
      brandsHeading: insideBrandsHeading,
      brandsSubheading: insideBrandsSubheading,
      brands: insideBrands,
      // 6. Sub-Sectors
      sectorsBadge: insideSectorsBadge,
      sectorsHeading: insideSectorsHeading,
      sectorsDesc: insideSectorsDesc,
      targetSectors: insideTargetSectors,
      // 7. Why Choose Us
      whyBadge: insideWhyBadge,
      whyHeading: insideWhyHeading,
      whyChooseUs: insideWhyChooseUs,
      // 8. CTA
      ctaHeading: insideCtaHeading,
      ctaDesc: insideCtaDesc,
      ctaBtn1Text: insideCtaBtn1Text,
      ctaBtn1Link: insideCtaBtn1Link,
      ctaBtn2Text: insideCtaBtn2Text,
      ctaBtn2Link: insideCtaBtn2Link,
    };

    const updatedList = industries.map(i => i.id === activeInsideIndustry.id ? updatedIndustry : i);
    setIndustries(updatedList);

    const res = await updateSection5Config({ title: mainTitle, heading: mainHeading, description: mainDescription, cards: updatedList });
    setIsSavingInsidePage(false);
    setShowInsidePageModal(false);

    if (res.success) {
      if (onShowToast) onShowToast(`Inside Page CMS for "${activeInsideIndustry.title}" saved successfully!`);
    } else {
      if (onShowToast) onShowToast(res.message || 'Error saving Inside Page CMS.');
    }
  };

  // ===========================================================================
  // Image Upload Helpers
  // ===========================================================================
  const handleImageFileSelect = (file, setDisplayUrl, setBase64) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please select a valid image file');
      return;
    }
    setDisplayUrl(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleModalImageSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setModalImage(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setModalImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBrandImageSelect = (file, index) => {
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () =>
        setInsideBrands(prev => prev.map((b, i) => i === index ? { ...b, src: reader.result, previewUrl: preview } : b));
      reader.readAsDataURL(file);
    }
  };

  const handleItemImageSelect = (file, index, setter) => {
    if (file && file.type.startsWith('image/')) {
      const preview = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () =>
        setter(prev => prev.map((item, i) => i === index ? { ...item, image: reader.result, previewUrl: preview } : item));
      reader.readAsDataURL(file);
    }
  };

  // ===========================================================================
  // Shared Tab Button Style
  // ===========================================================================
  const tabBtn = (tab) => ({
    padding: '0.5rem 1rem',
    fontSize: '0.825rem',
    fontWeight: 600,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    backgroundColor: insideActiveTab === tab ? '#0073b7' : 'transparent',
    color: insideActiveTab === tab ? '#ffffff' : 'var(--text-muted)',
  });

  // ===========================================================================
  // RENDER
  // ===========================================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ===== Main Section Settings ===== */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building className="text-primary" size={20} />
              <span>Industries Section — Main Settings</span>
            </h3>
            <p className="card-subtitle">Controls the section title, heading, and description shown on the homepage industries section.</p>
          </div>
          <button type="button" onClick={handleSaveMainSettings} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} disabled={isSaving}>
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Section Badge / Label</label>
              <input type="text" className="form-control" value={mainTitle} onChange={e => setMainTitle(e.target.value)} placeholder="e.g. INDUSTRIES WE SERVE" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Section Main Heading</label>
              <input type="text" className="form-control" value={mainHeading} onChange={e => setMainHeading(e.target.value)} placeholder="e.g. Security Solutions Built for Your Sector" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Section Description</label>
            <textarea className="form-control" rows={3} value={mainDescription} onChange={e => setMainDescription(e.target.value)} placeholder="Deploying custom, advanced cyber-security, monitoring..." />
          </div>
        </div>
      </div>

      {/* ===== Industries Cards Grid ===== */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers className="text-primary" size={20} />
              <span>Industry Sectors ({industries.length})</span>
            </h3>
            <p className="card-subtitle">All industry sector cards shown on the Industries page. Click "Inside Page" to edit full CMS.</p>
          </div>
          <button type="button" onClick={handleOpenAddModal} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            <Plus size={16} />
            <span>+ Add New Industry</span>
          </button>
        </div>

        <div className="card-body">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading industries from MongoDB Atlas...</div>
          ) : industries.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No industries found. Click <strong>"+ Add New Industry"</strong> to create one.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {industries.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    position: 'relative',
                  }}
                >
                  {/* Card Image */}
                  {item.image && (
                    <div style={{ width: '100%', height: '140px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />
                    </div>
                  )}

                  <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(10,110,171,0.1)', color: '#0a6eab', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`fa-solid ${item.icon || 'fa-building'}`} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', lineHeight: 1.3 }}>{item.title}</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', lineHeight: 1.4 }}>{item.subtitle || 'No subtitle provided'}</p>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description || 'No description provided.'}
                    </p>

                    <div style={{ fontSize: '0.72rem', color: '#0073b7', fontWeight: 600, marginTop: 'auto' }}>
                      Route: /industries/{item.id}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenInsidePageModal(item)}
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#0073b7', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        title={`Open Inside Page CMS for /industries/${item.id}`}
                      >
                        <FileText size={13} />
                        <span>Inside Page</span>
                      </button>

                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="file-upload-btn"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteIndustry(item.id)}
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
       ADD / EDIT INDUSTRY CARD MODAL
      ========================================================================= */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(5px)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '640px', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                {editingId ? 'Edit Industry Card' : 'Add New Industry Card'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Industry Title *</label>
                  <input type="text" className="form-control" value={modalTitle} onChange={e => setModalTitle(e.target.value)} placeholder="e.g. Aviation Security" />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>URL Slug (auto-generated if empty)</label>
                  <input type="text" className="form-control" value={modalSlug} onChange={e => setModalSlug(e.target.value)} placeholder="e.g. aviation-security" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Subtitle</label>
                <input type="text" className="form-control" value={modalSubtitle} onChange={e => setModalSubtitle(e.target.value)} placeholder="e.g. Airports, Airlines, MRO Facilities & Cargo Terminals" />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Short Description</label>
                <textarea className="form-control" rows={3} value={modalDesc} onChange={e => setModalDesc(e.target.value)} placeholder="Brief description of this industry sector..." />
              </div>

              {/* Icon Picker */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Font Awesome Icon Class</label>
                <input type="text" className="form-control" value={modalIcon} onChange={e => setModalIcon(e.target.value)} placeholder="e.g. fa-plane" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {QUICK_ICONS.map(qi => (
                    <button
                      key={qi.class}
                      type="button"
                      onClick={() => setModalIcon(qi.class)}
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px', border: `1px solid ${modalIcon === qi.class ? '#0073b7' : 'var(--border-color)'}`, backgroundColor: modalIcon === qi.class ? 'rgba(0,115,183,0.1)' : 'var(--bg-input)', color: modalIcon === qi.class ? '#0073b7' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <i className={`fa-solid ${qi.class} text-xs`} />
                      <span>{qi.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Image Upload */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ImageIcon size={15} color="#0073b7" /> Card Image Upload
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <input type="file" accept="image/*" onChange={e => handleModalImageSelect(e.target.files[0])} className="form-control" style={{ flex: 1 }} />
                  {modalImage && (
                    <img src={modalImage} alt="Preview" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                  )}
                </div>
                <input type="text" className="form-control" style={{ marginTop: '0.5rem', fontSize: '0.82rem' }} value={typeof modalImage === 'string' && !modalImage.startsWith('blob:') && !modalImage.startsWith('data:') ? modalImage : ''} onChange={e => { setModalImage(e.target.value); setModalImageBase64(''); }} placeholder="OR enter image URL/path (e.g. /images/ind1.jpg)" />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Custom Link (optional)</label>
                <input type="text" className="form-control" value={modalLink} onChange={e => setModalLink(e.target.value)} placeholder="e.g. /industries/aviation-security (auto-generated if blank)" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button type="button" onClick={() => setShowModal(false)} className="file-upload-btn" style={{ padding: '0.6rem 1.25rem' }}>Cancel</button>
              <button type="button" onClick={handleSaveModalIndustry} className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                <Save size={15} />
                <span>{editingId ? 'Update Industry' : 'Add Industry'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
       INSIDE PAGE FULL CMS MODAL (8 SECTIONS)
      ========================================================================= */}
      {showInsidePageModal && activeInsideIndustry && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '95vw', maxWidth: '1200px', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', height: '94vh', maxHeight: '980px' }}>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={22} color="#0073b7" />
                  <span>Inside Page CMS — {activeInsideIndustry.title}</span>
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#0073b7', fontWeight: 600 }}>
                  Route: {WEBSITE_BASE_URL}/industries/{activeInsideIndustry.id}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a
                  href={`${WEBSITE_BASE_URL}/industries/${activeInsideIndustry.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', backgroundColor: '#0073b7', color: '#fff', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontWeight: 600 }}
                >
                  <ExternalLink size={14} />
                  <span>Open Live Route</span>
                </a>
                <button onClick={() => setShowInsidePageModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Section Tab Navigation */}
            <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', padding: '0.6rem 1.25rem', backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
              <button type="button" onClick={() => setInsideActiveTab('banner')} style={tabBtn('banner')}>1. Banner</button>
              <button type="button" onClick={() => setInsideActiveTab('overview')} style={tabBtn('overview')}>2. Overview</button>
              <button type="button" onClick={() => setInsideActiveTab('challenges')} style={tabBtn('challenges')}>3. Challenges ({insideChallenges.length})</button>
              <button type="button" onClick={() => setInsideActiveTab('solutions')} style={tabBtn('solutions')}>4. Solutions ({insideSolutionsProvided.length})</button>
              <button type="button" onClick={() => setInsideActiveTab('brands')} style={tabBtn('brands')}>5. Brands ({insideBrands.length})</button>
              <button type="button" onClick={() => setInsideActiveTab('sectors')} style={tabBtn('sectors')}>6. Sub-Sectors ({insideTargetSectors.length})</button>
              <button type="button" onClick={() => setInsideActiveTab('why')} style={tabBtn('why')}>7. Why Us ({insideWhyChooseUs.length})</button>
              <button type="button" onClick={() => setInsideActiveTab('cta')} style={tabBtn('cta')}>8. Bottom CTA</button>
            </div>

            {/* Modal Body Tab Contents */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', flex: 1 }}>

              {/* ===== TAB 1: BANNER ===== */}
              {insideActiveTab === 'banner' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Inner Page Banner Main Title</label>
                    <input type="text" className="form-control" value={insidePageTitle} onChange={e => setInsidePageTitle(e.target.value)} placeholder="e.g. Aviation & Airport Security Systems" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Banner Tagline / Subtitle</label>
                    <input type="text" className="form-control" value={insideBannerTagline} onChange={e => setInsideBannerTagline(e.target.value)} placeholder="e.g. ICAO & GCAA Compliant · 24/7 Protection · UAE-Wide" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ImageIcon size={15} color="#0073b7" /> Banner Background Image Upload
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <input type="file" accept="image/*" onChange={e => handleImageFileSelect(e.target.files[0], setInsideBannerBgImage, setInsideBannerBgBase64)} className="form-control" style={{ flex: 1 }} />
                      {insideBannerBgImage && (
                        <img src={insideBannerBgImage} alt="Banner Preview" style={{ width: '120px', height: '65px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                      )}
                    </div>
                    <input type="text" className="form-control" style={{ marginTop: '0.5rem', fontSize: '0.82rem' }} value={typeof insideBannerBgImage === 'string' && !insideBannerBgImage.startsWith('blob:') && !insideBannerBgImage.startsWith('data:') ? insideBannerBgImage : ''} onChange={e => { setInsideBannerBgImage(e.target.value); setInsideBannerBgBase64(''); }} placeholder="OR Image URL / path" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>CTA Button Text</label>
                      <input type="text" className="form-control" value={insideHeroCtaText} onChange={e => setInsideHeroCtaText(e.target.value)} placeholder="e.g. Request Aviation Security Audit" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>CTA Button Link</label>
                      <input type="text" className="form-control" value={insideHeroCtaLink} onChange={e => setInsideHeroCtaLink(e.target.value)} placeholder="e.g. /contact-us" />
                    </div>
                  </div>
                </div>
              )}

              {/* ===== TAB 2: OVERVIEW ===== */}
              {insideActiveTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Overview Badge Text</label>
                      <input type="text" className="form-control" value={insideOverviewBadge} onChange={e => setInsideOverviewBadge(e.target.value)} placeholder="e.g. SECTOR OVERVIEW" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Overview Main Heading</label>
                      <input type="text" className="form-control" value={insideOverviewHeading} onChange={e => setInsideOverviewHeading(e.target.value)} placeholder="e.g. MISSION-CRITICAL AIRPORT DEFENCE" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Overview Paragraph 1</label>
                    <textarea className="form-control" rows={4} value={insideOverviewParagraph1} onChange={e => setInsideOverviewParagraph1(e.target.value)} placeholder="Main overview description..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Overview Paragraph 2</label>
                    <textarea className="form-control" rows={3} value={insideOverviewParagraph2} onChange={e => setInsideOverviewParagraph2(e.target.value)} placeholder="Additional details..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ImageIcon size={15} color="#0073b7" /> Overview Feature Image Upload
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <input type="file" accept="image/*" onChange={e => handleImageFileSelect(e.target.files[0], setInsideOverviewImage, setInsideOverviewImageBase64)} className="form-control" style={{ flex: 1 }} />
                      {insideOverviewImage && (
                        <img src={insideOverviewImage} alt="Overview Preview" style={{ width: '120px', height: '70px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                      )}
                    </div>
                    <input type="text" className="form-control" style={{ marginTop: '0.5rem', fontSize: '0.82rem' }} value={typeof insideOverviewImage === 'string' && !insideOverviewImage.startsWith('blob:') && !insideOverviewImage.startsWith('data:') ? insideOverviewImage : ''} onChange={e => { setInsideOverviewImage(e.target.value); setInsideOverviewImageBase64(''); }} placeholder="OR Image URL / path (e.g. /images/ind1.jpg)" />
                  </div>
                </div>
              )}

              {/* ===== TAB 3: KEY CHALLENGES ===== */}
              {insideActiveTab === 'challenges' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Challenges Section Badge</label>
                      <input type="text" className="form-control" value={insideChallengesBadge} onChange={e => setInsideChallengesBadge(e.target.value)} placeholder="e.g. Sector Challenges" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Challenges Section Heading</label>
                      <input type="text" className="form-control" value={insideChallengesHeading} onChange={e => setInsideChallengesHeading(e.target.value)} placeholder="e.g. CRITICAL SECURITY THREATS" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Challenge Items ({insideChallenges.length})</h4>
                    <button type="button" onClick={() => setInsideChallenges(prev => [...prev, { title: 'New Challenge', desc: 'Challenge description...', icon: 'fa-triangle-exclamation' }])} className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
                      <Plus size={13} /> <span>Add Challenge</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.75rem' }}>
                    {insideChallenges.map((item, idx) => (
                      <div key={idx} style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0073b7' }}>Challenge #{idx + 1}</span>
                          <button type="button" onClick={() => setInsideChallenges(prev => prev.filter((_, i) => i !== idx))} style={{ padding: '0.2rem 0.45rem', backgroundColor: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                        </div>
                        <input type="text" className="form-control" style={{ fontSize: '0.85rem' }} value={item.title || ''} onChange={e => setInsideChallenges(prev => prev.map((c, i) => i === idx ? { ...c, title: e.target.value } : c))} placeholder="Challenge Title" />
                        <textarea className="form-control" rows={2} style={{ fontSize: '0.8rem' }} value={item.desc || ''} onChange={e => setInsideChallenges(prev => prev.map((c, i) => i === idx ? { ...c, desc: e.target.value } : c))} placeholder="Challenge Description" />
                        <input type="text" className="form-control" style={{ fontSize: '0.78rem' }} value={item.icon || ''} onChange={e => setInsideChallenges(prev => prev.map((c, i) => i === idx ? { ...c, icon: e.target.value } : c))} placeholder="Icon Class (e.g. fa-triangle-exclamation)" />
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ImageIcon size={12} color="#0073b7" /> Challenge Image</label>
                          <input type="file" accept="image/*" className="form-control" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }} onChange={e => handleItemImageSelect(e.target.files[0], idx, setInsideChallenges)} />
                          {(item.previewUrl || item.image) && <img src={item.previewUrl || item.image} alt="preview" style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px', marginTop: '0.3rem' }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== TAB 4: SOLUTIONS PROVIDED ===== */}
              {insideActiveTab === 'solutions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Solutions Section Badge</label>
                      <input type="text" className="form-control" value={insideSolutionsBadge} onChange={e => setInsideSolutionsBadge(e.target.value)} placeholder="e.g. Tailored Solutions" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Solutions Section Heading</label>
                      <input type="text" className="form-control" value={insideSolutionsHeading} onChange={e => setInsideSolutionsHeading(e.target.value)} placeholder="e.g. ENGINEERED AIRPORT SECURITY MATRIX" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Solution Items ({insideSolutionsProvided.length})</h4>
                    <button type="button" onClick={() => setInsideSolutionsProvided(prev => [...prev, { title: 'New Solution', desc: 'Solution description...', icon: 'fa-shield-halved' }])} className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
                      <Plus size={13} /> <span>Add Solution</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.75rem' }}>
                    {insideSolutionsProvided.map((item, idx) => (
                      <div key={idx} style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0073b7' }}>Solution #{idx + 1}</span>
                          <button type="button" onClick={() => setInsideSolutionsProvided(prev => prev.filter((_, i) => i !== idx))} style={{ padding: '0.2rem 0.45rem', backgroundColor: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                        </div>
                        <input type="text" className="form-control" style={{ fontSize: '0.85rem' }} value={item.title || ''} onChange={e => setInsideSolutionsProvided(prev => prev.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))} placeholder="Solution Title" />
                        <textarea className="form-control" rows={2} style={{ fontSize: '0.8rem' }} value={item.desc || ''} onChange={e => setInsideSolutionsProvided(prev => prev.map((s, i) => i === idx ? { ...s, desc: e.target.value } : s))} placeholder="Solution Description" />
                        <input type="text" className="form-control" style={{ fontSize: '0.78rem' }} value={item.icon || ''} onChange={e => setInsideSolutionsProvided(prev => prev.map((s, i) => i === idx ? { ...s, icon: e.target.value } : s))} placeholder="Icon Class (e.g. fa-eye)" />
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ImageIcon size={12} color="#0073b7" /> Solution Image</label>
                          <input type="file" accept="image/*" className="form-control" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }} onChange={e => handleItemImageSelect(e.target.files[0], idx, setInsideSolutionsProvided)} />
                          {(item.previewUrl || item.image) && <img src={item.previewUrl || item.image} alt="preview" style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px', marginTop: '0.3rem' }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== TAB 5: KEY BRANDS ===== */}
              {insideActiveTab === 'brands' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Brands Heading</label>
                      <input type="text" className="form-control" value={insideBrandsHeading} onChange={e => setInsideBrandsHeading(e.target.value)} placeholder="e.g. APPROVED ECOSYSTEM BRANDS" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Brands Subheading</label>
                      <input type="text" className="form-control" value={insideBrandsSubheading} onChange={e => setInsideBrandsSubheading(e.target.value)} placeholder="e.g. Enterprise-grade equipment from global leaders." />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Brand Logos ({insideBrands.length})</h4>
                    <button type="button" onClick={() => setInsideBrands(prev => [...prev, { name: 'New Brand', src: '' }])} className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                      <Plus size={14} /> <span>+ Add Brand Logo</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                    {insideBrands.map((b, bIdx) => (
                      <div key={bIdx} style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0073b7' }}>Brand #{bIdx + 1}</span>
                          <button type="button" onClick={() => setInsideBrands(prev => prev.filter((_, i) => i !== bIdx))} style={{ padding: '0.2rem 0.45rem', backgroundColor: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                        </div>
                        <input type="text" className="form-control" style={{ fontSize: '0.85rem' }} value={b.name || ''} onChange={e => setInsideBrands(prev => prev.map((item, i) => i === bIdx ? { ...item, name: e.target.value } : item))} placeholder="Brand Name (e.g. Bosch Aviation)" />
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>Upload Brand Logo</label>
                          <input type="file" accept="image/*" className="form-control" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }} onChange={e => handleBrandImageSelect(e.target.files[0], bIdx)} />
                        </div>
                        <input type="text" className="form-control" style={{ fontSize: '0.78rem' }} value={typeof b.src === 'string' && !b.src.startsWith('data:') ? b.src : ''} onChange={e => setInsideBrands(prev => prev.map((item, i) => i === bIdx ? { ...item, src: e.target.value } : item))} placeholder="OR Image URL / path" />
                        {(b.previewUrl || b.src) && (
                          <img src={b.previewUrl || b.src} alt="Brand Preview" style={{ width: '80px', height: '40px', objectFit: 'contain', backgroundColor: '#fff', borderRadius: '4px', padding: '4px', border: '1px solid var(--border-color)' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== TAB 6: SUB-SECTORS / VERTICALS ===== */}
              {insideActiveTab === 'sectors' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Sub-Sectors Badge</label>
                      <input type="text" className="form-control" value={insideSectorsBadge} onChange={e => setInsideSectorsBadge(e.target.value)} placeholder="e.g. Sub-Sectors" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Sub-Sectors Heading</label>
                      <input type="text" className="form-control" value={insideSectorsHeading} onChange={e => setInsideSectorsHeading(e.target.value)} placeholder="e.g. SPECIALIZED VERTICALS SERVED" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Sub-Sectors Description</label>
                    <textarea className="form-control" rows={2} value={insideSectorsDesc} onChange={e => setInsideSectorsDesc(e.target.value)} placeholder="Optional description..." />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Sub-Sector Cards ({insideTargetSectors.length})</h4>
                    <button type="button" onClick={() => setInsideTargetSectors(prev => [...prev, { title: 'New Sub-Sector', desc: '', icon: 'fa-building' }])} className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
                      <Plus size={13} /> <span>Add Sub-Sector</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                    {insideTargetSectors.map((sec, idx) => (
                      <div key={idx} style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0073b7' }}>Sub-Sector #{idx + 1}</span>
                          <button type="button" onClick={() => setInsideTargetSectors(prev => prev.filter((_, i) => i !== idx))} style={{ padding: '0.2rem 0.45rem', backgroundColor: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                        </div>
                        <input type="text" className="form-control" style={{ fontSize: '0.85rem' }} value={sec.title || ''} onChange={e => setInsideTargetSectors(prev => prev.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))} placeholder="Sub-Sector Title" />
                        <textarea className="form-control" rows={2} style={{ fontSize: '0.8rem' }} value={sec.desc || ''} onChange={e => setInsideTargetSectors(prev => prev.map((s, i) => i === idx ? { ...s, desc: e.target.value } : s))} placeholder="Description" />
                        <input type="text" className="form-control" style={{ fontSize: '0.78rem' }} value={sec.icon || ''} onChange={e => setInsideTargetSectors(prev => prev.map((s, i) => i === idx ? { ...s, icon: e.target.value } : s))} placeholder="Icon Class" />
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ImageIcon size={12} color="#0073b7" /> Sub-Sector Image</label>
                          <input type="file" accept="image/*" className="form-control" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }} onChange={e => handleItemImageSelect(e.target.files[0], idx, setInsideTargetSectors)} />
                          {(sec.previewUrl || sec.image) && <img src={sec.previewUrl || sec.image} alt="preview" style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px', marginTop: '0.3rem' }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== TAB 7: WHY CHOOSE US ===== */}
              {insideActiveTab === 'why' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Why Section Badge</label>
                      <input type="text" className="form-control" value={insideWhyBadge} onChange={e => setInsideWhyBadge(e.target.value)} placeholder="e.g. WHY UNISPARK" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Why Section Heading</label>
                      <input type="text" className="form-control" value={insideWhyHeading} onChange={e => setInsideWhyHeading(e.target.value)} placeholder="e.g. Why Leading Enterprises Trust UniSpark" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Why Choose Us Items ({insideWhyChooseUs.length})</h4>
                    <button type="button" onClick={() => setInsideWhyChooseUs(prev => [...prev, { title: 'New Advantage', desc: 'Description...', icon: 'fa-certificate' }])} className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
                      <Plus size={13} /> <span>Add Item</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                    {insideWhyChooseUs.map((item, idx) => (
                      <div key={idx} style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0073b7' }}>Advantage #{idx + 1}</span>
                          <button type="button" onClick={() => setInsideWhyChooseUs(prev => prev.filter((_, i) => i !== idx))} style={{ padding: '0.2rem 0.45rem', backgroundColor: 'rgba(239,68,68,0.15)', color: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Trash2 size={13} /></button>
                        </div>
                        <input type="text" className="form-control" style={{ fontSize: '0.85rem' }} value={item.title || ''} onChange={e => setInsideWhyChooseUs(prev => prev.map((w, i) => i === idx ? { ...w, title: e.target.value } : w))} placeholder="Advantage Title" />
                        <textarea className="form-control" rows={2} style={{ fontSize: '0.8rem' }} value={item.desc || ''} onChange={e => setInsideWhyChooseUs(prev => prev.map((w, i) => i === idx ? { ...w, desc: e.target.value } : w))} placeholder="Description" />
                        <input type="text" className="form-control" style={{ fontSize: '0.78rem' }} value={item.icon || ''} onChange={e => setInsideWhyChooseUs(prev => prev.map((w, i) => i === idx ? { ...w, icon: e.target.value } : w))} placeholder="Icon Class (e.g. fa-certificate)" />
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ImageIcon size={12} color="#0073b7" /> Image (optional)</label>
                          <input type="file" accept="image/*" className="form-control" style={{ fontSize: '0.75rem', marginTop: '0.2rem' }} onChange={e => handleItemImageSelect(e.target.files[0], idx, setInsideWhyChooseUs)} />
                          {(item.previewUrl || item.image) && <img src={item.previewUrl || item.image} alt="preview" style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '4px', marginTop: '0.3rem' }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== TAB 8: BOTTOM CTA ===== */}
              {insideActiveTab === 'cta' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>CTA Heading</label>
                    <input type="text" className="form-control" value={insideCtaHeading} onChange={e => setInsideCtaHeading(e.target.value)} placeholder="e.g. Ready to Fortify Your Aviation Operations?" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>CTA Description</label>
                    <textarea className="form-control" rows={3} value={insideCtaDesc} onChange={e => setInsideCtaDesc(e.target.value)} placeholder="Our sector specialists provide SIRA-compliant site surveys..." />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Button 1 Text</label>
                      <input type="text" className="form-control" value={insideCtaBtn1Text} onChange={e => setInsideCtaBtn1Text(e.target.value)} placeholder="e.g. Request Sector Assessment" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Button 1 Link</label>
                      <input type="text" className="form-control" value={insideCtaBtn1Link} onChange={e => setInsideCtaBtn1Link(e.target.value)} placeholder="e.g. /contact-us" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Button 2 Text</label>
                      <input type="text" className="form-control" value={insideCtaBtn2Text} onChange={e => setInsideCtaBtn2Text(e.target.value)} placeholder="e.g. Call Sector Engineers (+971 50 288 5874)" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 600 }}>Button 2 Link</label>
                      <input type="text" className="form-control" value={insideCtaBtn2Link} onChange={e => setInsideCtaBtn2Link(e.target.value)} placeholder="e.g. tel:+971502885874" />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Save Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.75rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', flexShrink: 0 }}>
              <button type="button" onClick={() => setShowInsidePageModal(false)} className="file-upload-btn" style={{ padding: '0.65rem 1.25rem' }}>Cancel</button>
              <button type="button" onClick={handleSaveInsidePageCMS} className="btn-primary" style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem' }} disabled={isSavingInsidePage}>
                <Save size={16} />
                <span>{isSavingInsidePage ? 'Saving Inside Page...' : 'Save Inside Page CMS'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
