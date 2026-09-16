import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2, X, Lightbulb, Shield, Check, Star, UploadCloud, Layers, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { fetchSection3Config, updateSection3Config, WEBSITE_BASE_URL } from '../services/api';

const QUICK_ICONS = [
  { name: 'CCTV Camera', class: 'fa-video' },
  { name: 'Access Control', class: 'fa-id-card-clip' },
  { name: 'Intruder Alarm', class: 'fa-bell' },
  { name: 'Video Intercom', class: 'fa-door-open' },
  { name: 'Perimeter Security', class: 'fa-shield-halved' },
  { name: 'Fire Alarm', class: 'fa-fire-extinguisher' },
  { name: 'Biometrics', class: 'fa-fingerprint' },
  { name: 'Control Room', class: 'fa-display' },
  { name: 'Maintenance AMC', class: 'fa-screwdriver-wrench' }
];

export default function SolutionsEditor({ onShowToast }) {
  const [badgeText, setBadgeText] = useState('WHAT WE DO');
  const [mainHeading, setMainHeading] = useState('End-to-End Physical Security Solutions');
  const [description, setDescription] = useState(
    'From initial site survey and system design through to professional installation, commissioning, and long-term maintenance — UniSpark delivers complete security infrastructure for every environment.'
  );
  const [viewAllBtnText, setViewAllBtnText] = useState('View All Services');
  const [viewAllBtnLink, setViewAllBtnLink] = useState('/solutions');

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSavingServices, setIsSavingServices] = useState(false);

  // Modal State for Adding/Editing Solution Card
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalSlug, setModalSlug] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalIcon, setModalIcon] = useState('fa-video');
  const [modalIconUrl, setModalIconUrl] = useState('');
  const [modalIconBase64, setModalIconBase64] = useState('');
  const [modalFeatured, setModalFeatured] = useState(true);

  // =========================================================================
  // INSIDE PAGE FULL CMS MODAL STATE (INCREASED SIZE & IMAGE UPLOADS ON ALL SECTIONS)
  // =========================================================================
  const [showInsidePageModal, setShowInsidePageModal] = useState(false);
  const [activeInsideService, setActiveInsideService] = useState(null);
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
  const [insideDesc, setInsideDesc] = useState('');
  const [insideSecImage, setInsideSecImage] = useState('');
  const [insideSecImageBase64, setInsideSecImageBase64] = useState('');

  // Section 3: Scope of Work
  const [insideScopeBadge, setInsideScopeBadge] = useState('');
  const [insideScopeHeading, setInsideScopeHeading] = useState('');
  const [insideScopeSecImage, setInsideScopeSecImage] = useState('');
  const [insideScopeSecImageBase64, setInsideScopeSecImageBase64] = useState('');
  const [insideScopeItems, setInsideScopeItems] = useState([]);

  // Section 4: Key Brands
  const [insideBrandsHeading, setInsideBrandsHeading] = useState('');
  const [insideBrands, setInsideBrands] = useState([]);

  // Section 5: Targeted Sectors
  const [insideSectorsBadge, setInsideSectorsBadge] = useState('');
  const [insideSectorsHeading, setInsideSectorsHeading] = useState('');
  const [insideSectorsDesc, setInsideSectorsDesc] = useState('');
  const [insideTargetSectors, setInsideTargetSectors] = useState([]);

  // Section 6: Why Choose Us
  const [insideWhyBadge, setInsideWhyBadge] = useState('');
  const [insideWhyHeading, setInsideWhyHeading] = useState('');
  const [insideWhyChooseUs, setInsideWhyChooseUs] = useState([]);

  // Section 7: Bottom CTA
  const [insideCtaHeading, setInsideCtaHeading] = useState('');
  const [insideCtaDesc, setInsideCtaDesc] = useState('');
  const [insideCtaBgImage, setInsideCtaBgImage] = useState('');
  const [insideCtaBgBase64, setInsideCtaBgBase64] = useState('');
  const [insideCtaBtn1Text, setInsideCtaBtn1Text] = useState('');
  const [insideCtaBtn1Link, setInsideCtaBtn1Link] = useState('');
  const [insideCtaBtn2Text, setInsideCtaBtn2Text] = useState('');
  const [insideCtaBtn2Link, setInsideCtaBtn2Link] = useState('');

  const [isSavingInsidePage, setIsSavingInsidePage] = useState(false);

  // Load Section 3 Data from Backend API
  const loadSolutionsData = async () => {
    setLoading(true);
    const res = await fetchSection3Config();
    if (res.success && res.data) {
      setBadgeText(res.data.badgeText || 'WHAT WE DO');
      setMainHeading(res.data.mainHeading || 'End-to-End Physical Security Solutions');
      setDescription(res.data.description || '');
      if (res.data.viewAllButton) {
        setViewAllBtnText(res.data.viewAllButton.text || 'View All Services');
        setViewAllBtnLink(res.data.viewAllButton.link || '/solutions');
      }
      if (Array.isArray(res.data.services)) {
        setServices(res.data.services);
      }
    } else {
      if (onShowToast) onShowToast('Failed to load solutions data from backend');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSolutionsData();
  }, []);

  // Open Modal to Add New Solution Card
  const handleOpenAddModal = () => {
    setEditingId(null);
    setModalTitle('');
    setModalSlug('');
    setModalDesc('');
    setModalIcon('fa-video');
    setModalIconUrl('');
    setModalIconBase64('');
    setModalFeatured(true);
    setShowModal(true);
  };

  // Open Modal to Edit Solution Card
  const handleOpenEditModal = (service) => {
    setEditingId(service.id);
    setModalTitle(service.title || '');
    setModalSlug(service.id || '');
    setModalDesc(service.desc || '');
    setModalIcon(service.icon || 'fa-video');
    setModalIconUrl(service.iconUrl || '');
    setModalIconBase64('');
    setModalFeatured(service.featured !== undefined ? service.featured : true);
    setShowModal(true);
  };

  // Open Inside Page Full CMS Modal (7 Sections)
  const handleOpenInsidePageModal = (service) => {
    setActiveInsideService(service);
    setInsideActiveTab('banner');

    // Section 1: Banner
    setInsidePageTitle(service.pageTitle || service.title || '');
    setInsideBannerTagline(service.bannerTagline || 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage');
    setInsideBannerBgImage(service.bannerBgImage || '');
    setInsideBannerBgBase64('');
    setInsideHeroCtaText(service.heroCtaText || `Request a Site Survey`);
    setInsideHeroCtaLink(service.heroCtaLink || '/contact-us');

    // Section 2: Overview
    setInsideOverviewBadge(service.overviewBadge || 'SERVICE OVERVIEW');
    setInsideOverviewHeading(service.overviewHeading || `COMPLETE ${service.title}`);
    setInsideDesc(service.desc || service.description || '');
    setInsideSecImage(service.secImage || '');
    setInsideSecImageBase64('');

    // Section 3: Scope
    setInsideScopeBadge(service.scopeBadge || 'Scope of Work');
    setInsideScopeHeading(service.scopeHeading || "WHAT'S INCLUDED IN OUR SERVICE");
    setInsideScopeSecImage(service.scopeSecImage || '');
    setInsideScopeSecImageBase64('');
    setInsideScopeItems(Array.isArray(service.scopeOfWork) ? service.scopeOfWork : []);

    // Section 4: Brands
    setInsideBrandsHeading(service.brandsHeading || 'KEY BRANDS & TECHNOLOGY');
    setInsideBrands(Array.isArray(service.brands) ? service.brands : []);

    // Section 5: Sectors
    setInsideSectorsBadge(service.sectorsBadge || 'Targeted Sectors');
    setInsideSectorsHeading(service.sectorsHeading || 'INDUSTRIES SERVED');
    setInsideSectorsDesc(service.sectorsDesc || '');
    setInsideTargetSectors(Array.isArray(service.targetSectors) ? service.targetSectors : []);

    // Section 6: Why Choose Us
    setInsideWhyBadge(service.whyBadge || 'WHY CHOOSE US');
    setInsideWhyHeading(service.whyHeading || 'Why UniSpark For This Service');
    setInsideWhyChooseUs(Array.isArray(service.whyChooseUs) ? service.whyChooseUs : []);

    // Section 7: Bottom CTA
    setInsideCtaHeading(service.ctaHeading || `Ready to Discuss Your ${service.title} Requirements?`);
    setInsideCtaDesc(service.ctaDesc || 'Our engineers are available for site surveys across Dubai, Abu Dhabi, Sharjah, and all UAE locations.');
    setInsideCtaBgImage(service.ctaBgImage || '');
    setInsideCtaBgBase64('');
    setInsideCtaBtn1Text(service.ctaBtn1Text || 'Request a Site Survey');
    setInsideCtaBtn1Link(service.ctaBtn1Link || '/contact-us');
    setInsideCtaBtn2Text(service.ctaBtn2Text || 'Call Our Team (+971 50 288 5874)');
    setInsideCtaBtn2Link(service.ctaBtn2Link || 'tel:+971502885874');

    setShowInsidePageModal(true);
  };

  // Save Inside Page Full CMS Data (7 Sections)
  const handleSaveInsidePageCMS = async () => {
    if (!activeInsideService) return;
    setIsSavingInsidePage(true);

    const updatedService = {
      ...activeInsideService,
      // 1. Banner
      pageTitle: insidePageTitle,
      bannerTagline: insideBannerTagline,
      bannerBgImage: insideBannerBgBase64 || insideBannerBgImage,
      heroCtaText: insideHeroCtaText,
      heroCtaLink: insideHeroCtaLink,

      // 2. Overview
      overviewBadge: insideOverviewBadge,
      overviewHeading: insideOverviewHeading,
      desc: insideDesc,
      description: insideDesc,
      secImage: insideSecImageBase64 || insideSecImage,

      // 3. Scope
      scopeBadge: insideScopeBadge,
      scopeHeading: insideScopeHeading,
      scopeSecImage: insideScopeSecImageBase64 || insideScopeSecImage,
      scopeOfWork: insideScopeItems,

      // 4. Brands
      brandsHeading: insideBrandsHeading,
      brands: insideBrands,

      // 5. Sectors
      sectorsBadge: insideSectorsBadge,
      sectorsHeading: insideSectorsHeading,
      sectorsDesc: insideSectorsDesc,
      targetSectors: insideTargetSectors,

      // 6. Why Choose Us
      whyBadge: insideWhyBadge,
      whyHeading: insideWhyHeading,
      whyChooseUs: insideWhyChooseUs,

      // 7. Bottom CTA
      ctaHeading: insideCtaHeading,
      ctaDesc: insideCtaDesc,
      ctaBgImage: insideCtaBgBase64 || insideCtaBgImage,
      ctaBtn1Text: insideCtaBtn1Text,
      ctaBtn1Link: insideCtaBtn1Link,
      ctaBtn2Text: insideCtaBtn2Text,
      ctaBtn2Link: insideCtaBtn2Link
    };

    const updatedList = services.map(s => s.id === activeInsideService.id ? updatedService : s);
    setServices(updatedList);

    const res = await updateSection3Config({
      badgeText,
      mainHeading,
      description,
      viewAllButton: { text: viewAllBtnText, link: viewAllBtnLink },
      services: updatedList
    });

    setIsSavingInsidePage(false);
    setShowInsidePageModal(false);

    if (res.success) {
      if (onShowToast) onShowToast(`Inside Page CMS for "${activeInsideService.title}" saved successfully!`);
    } else {
      if (onShowToast) onShowToast(res.message || 'Error saving Inside Page CMS.');
    }
  };

  // Delete Solution Item
  const handleDeleteService = async (idToDelete) => {
    if (!window.confirm('Are you sure you want to delete this solution?')) return;
    const updated = services.filter(s => s.id !== idToDelete);
    setServices(updated);

    const res = await updateSection3Config({
      badgeText,
      mainHeading,
      description,
      viewAllButton: { text: viewAllBtnText, link: viewAllBtnLink },
      services: updated
    });

    if (res.success) {
      if (onShowToast) onShowToast('Solution deleted successfully!');
    } else {
      if (onShowToast) onShowToast('Error saving changes after delete.');
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = async (service) => {
    const updated = services.map(s => s.id === service.id ? { ...s, featured: !s.featured } : s);
    setServices(updated);

    const res = await updateSection3Config({
      badgeText,
      mainHeading,
      description,
      viewAllButton: { text: viewAllBtnText, link: viewAllBtnLink },
      services: updated
    });

    if (res.success) {
      if (onShowToast) onShowToast(`Updated featured status for "${service.title}"`);
    }
  };

  // Save Modal (Add or Edit Solution Card)
  const handleSaveModalService = async () => {
    if (!modalTitle.trim()) {
      if (onShowToast) onShowToast('Solution Title is required');
      return;
    }

    const generatedSlug = modalSlug.trim() || modalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const iconToUse = modalIconBase64 || modalIconUrl || '';

    const newServiceObj = {
      id: editingId || generatedSlug || `service-${Date.now()}`,
      title: modalTitle.trim(),
      desc: modalDesc.trim(),
      icon: modalIcon.trim() || 'fa-shield-halved',
      iconUrl: iconToUse,
      featured: modalFeatured
    };

    let updatedList = [];
    if (editingId) {
      updatedList = services.map(s => s.id === editingId ? newServiceObj : s);
    } else {
      updatedList = [...services, newServiceObj];
    }

    setServices(updatedList);
    setShowModal(false);

    setIsSavingServices(true);
    const res = await updateSection3Config({
      badgeText,
      mainHeading,
      description,
      viewAllButton: { text: viewAllBtnText, link: viewAllBtnLink },
      services: updatedList
    });
    setIsSavingServices(false);

    if (res.success) {
      if (onShowToast) onShowToast(editingId ? 'Solution updated successfully!' : 'New Solution added successfully!');
    } else {
      if (onShowToast) onShowToast(res.message || 'Failed to save solution.');
    }
  };

  // Image Upload Helpers
  const handleImageFileSelect = (file, setDisplayUrl, setBase64) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        if (onShowToast) onShowToast('Please select a valid image file');
        return;
      }
      setDisplayUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrandImageSelect = (file, index) => {
    if (file && file.type.startsWith('image/')) {
      const displayUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInsideBrands(prev => prev.map((item, i) => i === index ? { ...item, src: reader.result, previewUrl: displayUrl } : item));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSectorImageSelect = (file, index) => {
    if (file && file.type.startsWith('image/')) {
      const displayUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInsideTargetSectors(prev => prev.map((item, i) => i === index ? { ...item, secImage: reader.result, previewUrl: displayUrl } : item));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWhyImageSelect = (file, index) => {
    if (file && file.type.startsWith('image/')) {
      const displayUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setInsideWhyChooseUs(prev => prev.map((item, i) => i === index ? { ...item, whyImage: reader.result, previewUrl: displayUrl } : item));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Solutions Cards Grid */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers className="text-primary" size={20} />
              <span>Active Solutions & Services List ({services.length})</span>
            </h3>
            <p className="card-subtitle">All physical security solution cards displayed across website and home page.</p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>+ Add New Solution</span>
          </button>
        </div>

        <div className="card-body">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading solutions from MongoDB Atlas...
            </div>
          ) : services.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No solutions found. Click <strong>"+ Add New Solution"</strong> above to create one.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {services.map((item, idx) => (
                <div
                  key={item.id || idx}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '1rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(10, 110, 171, 0.1)',
                          color: '#0a6eab',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center',
                          flexShrink: 0
                        }}
                      >
                        {item.iconUrl ? (
                          <img src={item.iconUrl} alt={item.title} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                        ) : (
                          <i className={`fa-solid ${item.icon || 'fa-shield-halved'} text-xl`}></i>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item)}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: item.featured ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-input)',
                          color: item.featured ? '#10b981' : 'var(--text-muted)'
                        }}
                      >
                        {item.featured ? '★ Featured on Home' : '☆ Standard'}
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', lineHeight: 1.3 }}>
                      {item.title}
                    </h4>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                      {item.desc || 'No description provided.'}
                    </p>
                  </div>

                  {/* Actions Bar with "Inside Page" Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenInsidePageModal(item)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: '#0073b7',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                      title={`Open Inside Page CMS for /solutions/${item.id}`}
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
                        onClick={() => handleDeleteService(item.id)}
                        style={{
                          padding: '0.35rem 0.55rem',
                          fontSize: '0.75rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: 'var(--danger)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INSIDE PAGE FULL 7-SECTION CMS MODAL (LARGE SIZE + IMAGE UPLOAD IN ALL SECTIONS) */}
      {/* ========================================================================= */}
      {showInsidePageModal && activeInsideService && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '95vw', maxWidth: '1150px', borderRadius: 'var(--radius-lg)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', height: '94vh', maxHeight: '960px' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={22} color="#0073b7" />
                  <span>Inside Page CMS — {activeInsideService.title}</span>
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#0073b7', fontWeight: 600 }}>
                  Route: {WEBSITE_BASE_URL}/solutions/{activeInsideService.id}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <a
                  href={`${WEBSITE_BASE_URL}/solutions/${activeInsideService.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', backgroundColor: '#0073b7', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <ExternalLink size={14} />
                  <span>Open Live Route</span>
                </a>
                <button onClick={() => setShowInsidePageModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal 7-Section Navigation Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', padding: '0.6rem 1.25rem', backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setInsideActiveTab('banner')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: insideActiveTab === 'banner' ? '#0073b7' : 'transparent',
                  color: insideActiveTab === 'banner' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                1. Banner
              </button>
              <button
                type="button"
                onClick={() => setInsideActiveTab('overview')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: insideActiveTab === 'overview' ? '#0073b7' : 'transparent',
                  color: insideActiveTab === 'overview' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                2. Overview
              </button>
              <button
                type="button"
                onClick={() => setInsideActiveTab('scope')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: insideActiveTab === 'scope' ? '#0073b7' : 'transparent',
                  color: insideActiveTab === 'scope' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                3. Scope ({insideScopeItems.length})
              </button>
              <button
                type="button"
                onClick={() => setInsideActiveTab('brands')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: insideActiveTab === 'brands' ? '#0073b7' : 'transparent',
                  color: insideActiveTab === 'brands' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                4. Brands ({insideBrands.length})
              </button>
              <button
                type="button"
                onClick={() => setInsideActiveTab('sectors')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: insideActiveTab === 'sectors' ? '#0073b7' : 'transparent',
                  color: insideActiveTab === 'sectors' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                5. Sectors ({insideTargetSectors.length})
              </button>
              <button
                type="button"
                onClick={() => setInsideActiveTab('why')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: insideActiveTab === 'why' ? '#0073b7' : 'transparent',
                  color: insideActiveTab === 'why' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                6. Why Choose Us ({insideWhyChooseUs.length})
              </button>
              <button
                type="button"
                onClick={() => setInsideActiveTab('cta')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: insideActiveTab === 'cta' ? '#0073b7' : 'transparent',
                  color: insideActiveTab === 'cta' ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                7. Bottom CTA
              </button>
            </div>

            {/* Modal Body Tab Contents */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', flex: 1 }}>
              
              {/* TAB 1: HEADER BANNER */}
              {insideActiveTab === 'banner' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Inner Page Banner Main Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insidePageTitle}
                      onChange={(e) => setInsidePageTitle(e.target.value)}
                      placeholder="e.g. See Everything. Miss Nothing."
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Banner Tagline / Subtitle</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insideBannerTagline}
                      onChange={(e) => setInsideBannerTagline(e.target.value)}
                      placeholder="e.g. Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage"
                    />
                  </div>

                  {/* Banner Image Upload */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ImageIcon size={16} color="#0073b7" />
                      <span>Banner Section Background Image Upload (Cloudinary)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileSelect(e.target.files[0], setInsideBannerBgImage, setInsideBannerBgBase64)}
                        className="form-control"
                        style={{ flex: 1 }}
                      />
                      {insideBannerBgImage && (
                        <img
                          src={insideBannerBgImage}
                          alt="Banner Preview"
                          style={{ width: '120px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Hero Button Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideHeroCtaText}
                        onChange={(e) => setInsideHeroCtaText(e.target.value)}
                        placeholder="e.g. Request a CCTV Site Survey"
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Hero Button Link</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideHeroCtaLink}
                        onChange={(e) => setInsideHeroCtaLink(e.target.value)}
                        placeholder="e.g. /contact-us"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW */}
              {insideActiveTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Overview Badge Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideOverviewBadge}
                        onChange={(e) => setInsideOverviewBadge(e.target.value)}
                        placeholder="e.g. SERVICE OVERVIEW"
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Overview Heading Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideOverviewHeading}
                        onChange={(e) => setInsideOverviewHeading(e.target.value)}
                        placeholder="e.g. COMPLETE CCTV & IP CAMERA SYSTEMS"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Detailed Overview Description</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={insideDesc}
                      onChange={(e) => setInsideDesc(e.target.value)}
                      placeholder="Detailed overview description text..."
                    />
                  </div>

                  {/* Overview Feature Image Upload */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ImageIcon size={16} color="#0073b7" />
                      <span>Overview Section Feature Image Upload (Cloudinary)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileSelect(e.target.files[0], setInsideSecImage, setInsideSecImageBase64)}
                        className="form-control"
                        style={{ flex: 1 }}
                      />
                      {insideSecImage && (
                        <img
                          src={insideSecImage}
                          alt="Overview Feature Preview"
                          style={{ width: '120px', height: '70px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SCOPE OF WORK */}
              {insideActiveTab === 'scope' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Scope Section Badge</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideScopeBadge}
                        onChange={(e) => setInsideScopeBadge(e.target.value)}
                        placeholder="e.g. Scope of Work"
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Scope Section Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideScopeHeading}
                        onChange={(e) => setInsideScopeHeading(e.target.value)}
                        placeholder="e.g. WHAT'S INCLUDED IN OUR SERVICE"
                      />
                    </div>
                  </div>

                  {/* Scope Feature Image Upload */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ImageIcon size={16} color="#0073b7" />
                      <span>Scope Section Feature Image Upload (Cloudinary)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileSelect(e.target.files[0], setInsideScopeSecImage, setInsideScopeSecImageBase64)}
                        className="form-control"
                        style={{ flex: 1 }}
                      />
                      {insideScopeSecImage && (
                        <img
                          src={insideScopeSecImage}
                          alt="Scope Feature Preview"
                          style={{ width: '100px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      Scope Cards List ({insideScopeItems.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setInsideScopeItems(prev => [...prev, { title: 'New Scope Title', desc: 'Scope description...', icon: 'fa-check' }])}
                      className="btn-primary"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
                    >
                      <Plus size={13} />
                      <span>Add Scope Card</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {insideScopeItems.map((scope, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <input
                          type="text"
                          className="form-control"
                          style={{ width: '200px', fontSize: '0.8rem' }}
                          value={scope.title || ''}
                          onChange={(e) => setInsideScopeItems(prev => prev.map((item, i) => i === sIdx ? { ...item, title: e.target.value } : item))}
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          className="form-control"
                          style={{ flex: 1, fontSize: '0.8rem' }}
                          value={scope.desc || ''}
                          onChange={(e) => setInsideScopeItems(prev => prev.map((item, i) => i === sIdx ? { ...item, desc: e.target.value } : item))}
                          placeholder="Description"
                        />
                        <input
                          type="text"
                          className="form-control"
                          style={{ width: '130px', fontSize: '0.8rem' }}
                          value={scope.icon || ''}
                          onChange={(e) => setInsideScopeItems(prev => prev.map((item, i) => i === sIdx ? { ...item, icon: e.target.value } : item))}
                          placeholder="Icon (fa-video)"
                        />
                        <button
                          type="button"
                          onClick={() => setInsideScopeItems(prev => prev.filter((_, i) => i !== sIdx))}
                          style={{ padding: '0.4rem 0.6rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: KEY BRANDS */}
              {insideActiveTab === 'brands' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Brands Section Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insideBrandsHeading}
                      onChange={(e) => setInsideBrandsHeading(e.target.value)}
                      placeholder="e.g. KEY BRANDS & TECHNOLOGY"
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      Brand Logos ({insideBrands.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setInsideBrands(prev => [...prev, { name: 'New Brand', src: '/images/pt1.jpg' }])}
                      className="btn-primary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>+ Add Brand Logo</span>
                    </button>
                  </div>

                  {/* Brand Grid Cards with File Upload & Live Preview */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {insideBrands.map((b, bIdx) => (
                      <div key={bIdx} style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0073b7' }}>Brand #{bIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setInsideBrands(prev => prev.filter((_, i) => i !== bIdx))}
                            style={{ padding: '0.25rem 0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                          value={b.name || b.alt || ''}
                          onChange={(e) => setInsideBrands(prev => prev.map((item, i) => i === bIdx ? { ...item, name: e.target.value, alt: e.target.value } : item))}
                          placeholder="Brand Name (e.g. Hikvision)"
                        />

                        {/* File Upload for Brand Logo */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Upload Brand Logo Image (Cloudinary)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleBrandImageSelect(e.target.files[0], bIdx)}
                            className="form-control"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          style={{ fontSize: '0.8rem' }}
                          value={b.src || b.logoUrl || ''}
                          onChange={(e) => setInsideBrands(prev => prev.map((item, i) => i === bIdx ? { ...item, src: e.target.value } : item))}
                          placeholder="OR Image URL / Path"
                        />

                        {(b.previewUrl || b.src || b.logoUrl) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <img
                              src={b.previewUrl || b.src || b.logoUrl}
                              alt="Brand Preview"
                              style={{ width: '80px', height: '40px', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '4px', padding: '4px', border: '1px solid var(--border-color)' }}
                            />
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Image Loaded</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TARGETED SECTORS */}
              {insideActiveTab === 'sectors' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Sectors Badge</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideSectorsBadge}
                        onChange={(e) => setInsideSectorsBadge(e.target.value)}
                        placeholder="e.g. Targeted Sectors"
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Sectors Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideSectorsHeading}
                        onChange={(e) => setInsideSectorsHeading(e.target.value)}
                        placeholder="e.g. INDUSTRIES SERVED"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Sectors Description</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={insideSectorsDesc}
                      onChange={(e) => setInsideSectorsDesc(e.target.value)}
                      placeholder="Sectors description text..."
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      Target Sectors Cards ({insideTargetSectors.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setInsideTargetSectors(prev => [...prev, { title: 'New Sector', icon: 'fa-building', desc: 'Sector description...' }])}
                      className="btn-primary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>+ Add Sector</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                    {insideTargetSectors.map((sec, sIdx) => (
                      <div key={sIdx} style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0073b7' }}>Sector #{sIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setInsideTargetSectors(prev => prev.filter((_, i) => i !== sIdx))}
                            style={{ padding: '0.25rem 0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                          value={sec.title || ''}
                          onChange={(e) => setInsideTargetSectors(prev => prev.map((item, i) => i === sIdx ? { ...item, title: e.target.value } : item))}
                          placeholder="Sector Title (e.g. Aviation)"
                        />
                        
                        <textarea
                          className="form-control"
                          rows={2}
                          style={{ fontSize: '0.8rem' }}
                          value={sec.desc || ''}
                          onChange={(e) => setInsideTargetSectors(prev => prev.map((item, i) => i === sIdx ? { ...item, desc: e.target.value } : item))}
                          placeholder="Sector Description"
                        />

                        {/* File Upload for Sector Image */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Upload Sector Image (Cloudinary)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSectorImageSelect(e.target.files[0], sIdx)}
                            className="form-control"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>

                        {(sec.previewUrl || sec.secImage) && (
                          <img
                            src={sec.previewUrl || sec.secImage}
                            alt="Sector Preview"
                            style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: WHY CHOOSE US */}
              {insideActiveTab === 'why' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Why Section Badge</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideWhyBadge}
                        onChange={(e) => setInsideWhyBadge(e.target.value)}
                        placeholder="e.g. WHY CHOOSE US"
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Why Section Heading</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideWhyHeading}
                        onChange={(e) => setInsideWhyHeading(e.target.value)}
                        placeholder="e.g. Why UniSpark For This Service"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                      Why Choose Us Cards ({insideWhyChooseUs.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setInsideWhyChooseUs(prev => [...prev, { title: 'Reason Title', icon: 'fa-check', desc: 'Reason description...' }])}
                      className="btn-primary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      <span>+ Add Reason Card</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                    {insideWhyChooseUs.map((w, wIdx) => (
                      <div key={wIdx} style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0073b7' }}>Reason #{wIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setInsideWhyChooseUs(prev => prev.filter((_, i) => i !== wIdx))}
                            style={{ padding: '0.25rem 0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <input
                          type="text"
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                          value={w.title || ''}
                          onChange={(e) => setInsideWhyChooseUs(prev => prev.map((item, i) => i === wIdx ? { ...item, title: e.target.value } : item))}
                          placeholder="Reason Title"
                        />
                        
                        <textarea
                          className="form-control"
                          rows={2}
                          style={{ fontSize: '0.8rem' }}
                          value={w.desc || ''}
                          onChange={(e) => setInsideWhyChooseUs(prev => prev.map((item, i) => i === wIdx ? { ...item, desc: e.target.value } : item))}
                          placeholder="Reason Description"
                        />

                        {/* File Upload for Why Image */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Upload Feature Image (Cloudinary)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleWhyImageSelect(e.target.files[0], wIdx)}
                            className="form-control"
                            style={{ fontSize: '0.75rem' }}
                          />
                        </div>

                        {(w.previewUrl || w.whyImage) && (
                          <img
                            src={w.previewUrl || w.whyImage}
                            alt="Why Preview"
                            style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: BOTTOM CTA */}
              {insideActiveTab === 'cta' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Bottom CTA Main Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      value={insideCtaHeading}
                      onChange={(e) => setInsideCtaHeading(e.target.value)}
                      placeholder="e.g. Ready to Discuss Your CCTV Requirements?"
                    />
                  </div>

                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600 }}>Bottom CTA Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={insideCtaDesc}
                      onChange={(e) => setInsideCtaDesc(e.target.value)}
                      placeholder="Our engineers are available for site surveys across Dubai..."
                    />
                  </div>

                  {/* CTA Section Background Image Upload */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <ImageIcon size={16} color="#0073b7" />
                      <span>Bottom CTA Background Image Upload (Cloudinary)</span>
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileSelect(e.target.files[0], setInsideCtaBgImage, setInsideCtaBgBase64)}
                        className="form-control"
                        style={{ flex: 1 }}
                      />
                      {insideCtaBgImage && (
                        <img
                          src={insideCtaBgImage}
                          alt="CTA Bg Preview"
                          style={{ width: '120px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Button 1 Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideCtaBtn1Text}
                        onChange={(e) => setInsideCtaBtn1Text(e.target.value)}
                        placeholder="e.g. Request a Site Survey"
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Button 1 Link</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideCtaBtn1Link}
                        onChange={(e) => setInsideCtaBtn1Link(e.target.value)}
                        placeholder="e.g. /contact-us"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Button 2 Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideCtaBtn2Text}
                        onChange={(e) => setInsideCtaBtn2Text(e.target.value)}
                        placeholder="e.g. Call Our Team (+971 50 288 5874)"
                      />
                    </div>

                    <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label className="form-label" style={{ fontWeight: 600 }}>Button 2 Link</label>
                      <input
                        type="text"
                        className="form-control"
                        value={insideCtaBtn2Link}
                        onChange={(e) => setInsideCtaBtn2Link(e.target.value)}
                        placeholder="e.g. tel:+971502885874"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.25rem 1.75rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button type="button" onClick={() => setShowInsidePageModal(false)} className="file-upload-btn" style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}>
                Cancel
              </button>
              <button type="button" onClick={handleSaveInsidePageCMS} className="btn-primary" style={{ padding: '0.6rem 2rem', fontSize: '0.875rem' }} disabled={isSavingInsidePage}>
                <Save size={18} />
                <span>{isSavingInsidePage ? 'Saving...' : 'Save Complete Inside Page CMS'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT SOLUTION CARD MODAL                                           */}
      {/* ========================================================================= */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '100%', maxWidth: '520px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                {editingId ? 'Edit Solution Card' : 'Add New Solution Card'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Solution Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalTitle}
                  onChange={(e) => {
                    setModalTitle(e.target.value);
                    if (!editingId) {
                      setModalSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. CCTV & IP Camera Systems"
                  required
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Solution Slug / ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalSlug}
                  onChange={(e) => setModalSlug(e.target.value)}
                  placeholder="e.g. cctv-and-ip-camera-systems"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>FontAwesome Icon Class</label>
                <input
                  type="text"
                  className="form-control"
                  value={modalIcon}
                  onChange={(e) => setModalIcon(e.target.value)}
                  placeholder="e.g. fa-video, fa-id-card-clip, fa-bell, fa-door-open"
                />
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                  {QUICK_ICONS.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => setModalIcon(q.class)}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: modalIcon === q.class ? 'var(--primary)' : 'var(--bg-input)',
                        color: modalIcon === q.class ? '#ffffff' : 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}
                    >
                      <i className={`fa-solid ${q.class} me-1`}></i> {q.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>OR Custom Icon Image Upload</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileSelect(e.target.files[0], setModalIconUrl, setModalIconBase64)}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  {modalIconUrl && (
                    <img src={modalIconUrl} alt="Icon Preview" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'contain' }} />
                  )}
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  placeholder="e.g. HD surveillance, remote monitoring, and smart analytics..."
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={modalFeatured}
                  onChange={(e) => setModalFeatured(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="featured-check" style={{ fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                  Featured on Home Page
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)' }}>
              <button type="button" onClick={() => setShowModal(false)} className="file-upload-btn" style={{ padding: '0.5rem 1.25rem' }}>
                Cancel
              </button>
              <button type="button" onClick={handleSaveModalService} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.875rem' }} disabled={isSavingServices}>
                {editingId ? 'Update Solution' : 'Add Solution'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
