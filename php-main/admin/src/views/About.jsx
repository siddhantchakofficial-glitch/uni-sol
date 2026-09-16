import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Edit, Trash2, Plus, X, Upload } from 'lucide-react';
import { fetchAboutConfig, updateAboutConfig } from '../services/api';

export default function About({ onShowToast }) {
  // State
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Banner
  const [bannerBadge, setBannerBadge] = useState('ABOUT UNISPARK SECURITY');
  const [bannerTitle, setBannerTitle] = useState('About UniSpark Security Systems');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerBgImagePreview, setBannerBgImagePreview] = useState('');
  const [bannerBgImageBase64, setBannerBgImageBase64] = useState('');

  // Main (Who We Are)
  const [mainHeading, setMainHeading] = useState('WHO WE ARE');
  const [mainDesc, setMainDesc] = useState('');
  const [missionTitle, setMissionTitle] = useState('OUR MISSION');
  const [missionDesc, setMissionDesc] = useState('');
  const [missionIcon, setMissionIcon] = useState('Target');
  const [visionTitle, setVisionTitle] = useState('OUR VISION');
  const [visionDesc, setVisionDesc] = useState('');
  const [visionIcon, setVisionIcon] = useState('Eye');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [mainImageBase64, setMainImageBase64] = useState('');

  // Glance
  const [glanceBadge, setGlanceBadge] = useState('QUICK OVERVIEW');
  const [glanceTitle, setGlanceTitle] = useState('COMPANY AT A GLANCE');
  const [glanceCards, setGlanceCards] = useState([]);

  // Glance Modal
  const [showGlanceModal, setShowGlanceModal] = useState(false);
  const [editingGlanceId, setEditingGlanceId] = useState(null);
  const [glanceModalTitle, setGlanceModalTitle] = useState('');
  const [glanceModalDesc, setGlanceModalDesc] = useState('');
  const [glanceModalIcon, setGlanceModalIcon] = useState('');

  // 4. Our Group Structure
  const [groupBadge, setGroupBadge] = useState('CORPORATE ARCHITECTURE');
  const [groupTitle, setGroupTitle] = useState('OUR GROUP STRUCTURE');
  const [groupDesc, setGroupDesc] = useState('');
  const [groupCards, setGroupCards] = useState([]);

  // Group Modal
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [groupModalTag, setGroupModalTag] = useState('');
  const [groupModalTitle, setGroupModalTitle] = useState('');
  const [groupModalSubtitle, setGroupModalSubtitle] = useState('Core Business:');
  const [groupModalTagsStr, setGroupModalTagsStr] = useState('');
  const [groupModalIcon, setGroupModalIcon] = useState('');
  const [groupModalLink, setGroupModalLink] = useState('');
  const [groupModalDisclaimer, setGroupModalDisclaimer] = useState('');

  // 5. Key Differentiators
  const [diffBadge, setDiffBadge] = useState('WHY CHOOSE US');
  const [diffTitle, setDiffTitle] = useState('Our Key Differentiators');
  const [diffDesc, setDiffDesc] = useState('');
  const [diffCards, setDiffCards] = useState([]);

  // Diff Modal
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [editingDiffId, setEditingDiffId] = useState(null);
  const [diffModalTitle, setDiffModalTitle] = useState('');
  const [diffModalDesc, setDiffModalDesc] = useState('');
  const [diffModalIcon, setDiffModalIcon] = useState('');

  // 6. CTA / Security Requirements Section
  const [ctaBadge, setCtaBadge] = useState('NEXT-GEN INTEGRATION');
  const [ctaTitle, setCtaTitle] = useState("Let's Discuss Your Security Requirements");
  const [ctaDesc, setCtaDesc] = useState('');
  const [ctaPrimaryBtnText, setCtaPrimaryBtnText] = useState('Request a Free Site Survey');
  const [ctaPrimaryBtnLink, setCtaPrimaryBtnLink] = useState('/contact-us');
  const [ctaSecondaryBtnText, setCtaSecondaryBtnText] = useState('Download Company Profile');
  const [ctaSecondaryBtnLink, setCtaSecondaryBtnLink] = useState('/company-profile.pdf');
  const [ctaBgImagePreview, setCtaBgImagePreview] = useState('');
  const [ctaBgImageBase64, setCtaBgImageBase64] = useState('');

  const loadData = async () => {
    setLoading(true);
    const res = await fetchAboutConfig();
    if (res.success && res.data) {
      setBannerBadge(res.data.bannerBadge || 'ABOUT UNISPARK SECURITY');
      setBannerTitle(res.data.bannerTitle || 'About UniSpark Security Systems');
      setBannerDesc(res.data.bannerDesc || '');
      setBannerBgImagePreview(res.data.bannerBgImage || '');

      setMainHeading(res.data.mainHeading || 'WHO WE ARE');
      setMainDesc(res.data.mainDesc || '');
      setMissionTitle(res.data.mission?.title || 'OUR MISSION');
      setMissionDesc(res.data.mission?.description || '');
      setMissionIcon(res.data.mission?.icon || 'Target');
      setVisionTitle(res.data.vision?.title || 'OUR VISION');
      setVisionDesc(res.data.vision?.description || '');
      setVisionIcon(res.data.vision?.icon || 'Eye');
      setMainImagePreview(res.data.mainImage || '');

      setGlanceBadge(res.data.glanceBadge || 'QUICK OVERVIEW');
      setGlanceTitle(res.data.glanceTitle || 'COMPANY AT A GLANCE');
      if (Array.isArray(res.data.glanceCards)) {
        setGlanceCards(res.data.glanceCards);
      }

      setGroupBadge(res.data.groupBadge || 'CORPORATE ARCHITECTURE');
      setGroupTitle(res.data.groupTitle || 'OUR GROUP STRUCTURE');
      setGroupDesc(res.data.groupDesc || '');
      if (Array.isArray(res.data.groupCards)) {
        setGroupCards(res.data.groupCards);
      }

      setDiffBadge(res.data.diffBadge || 'WHY CHOOSE US');
      setDiffTitle(res.data.diffTitle || 'Our Key Differentiators');
      setDiffDesc(res.data.diffDesc || '');
      if (Array.isArray(res.data.diffCards)) {
        setDiffCards(res.data.diffCards);
      }

      setCtaBadge(res.data.ctaBadge || 'NEXT-GEN INTEGRATION');
      setCtaTitle(res.data.ctaTitle || "Let's Discuss Your Security Requirements");
      setCtaDesc(res.data.ctaDesc || '');
      setCtaPrimaryBtnText(res.data.ctaPrimaryBtnText || 'Request a Free Site Survey');
      setCtaPrimaryBtnLink(res.data.ctaPrimaryBtnLink || '/contact-us');
      setCtaSecondaryBtnText(res.data.ctaSecondaryBtnText || 'Download Company Profile');
      setCtaSecondaryBtnLink(res.data.ctaSecondaryBtnLink || '/company-profile.pdf');
      setCtaBgImagePreview(res.data.ctaBgImage || '');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMainImageSelect = (file) => {
    if (file) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerBgImageSelect = (file) => {
    if (file) {
      setBannerBgImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerBgImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCtaBgImageSelect = (file) => {
    if (file) {
      setCtaBgImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setCtaBgImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const payload = {
      bannerBadge,
      bannerTitle,
      bannerDesc,
      bannerBgImage: bannerBgImageBase64 || bannerBgImagePreview,
      mainHeading,
      mainDesc,
      mission: { title: missionTitle, description: missionDesc, icon: missionIcon },
      vision: { title: visionTitle, description: visionDesc, icon: visionIcon },
      mainImage: mainImageBase64 || mainImagePreview,
      glanceBadge,
      glanceTitle,
      glanceCards,
      groupBadge,
      groupTitle,
      groupDesc,
      groupCards,
      diffBadge,
      diffTitle,
      diffDesc,
      diffCards,
      ctaBadge,
      ctaTitle,
      ctaDesc,
      ctaPrimaryBtnText,
      ctaPrimaryBtnLink,
      ctaSecondaryBtnText,
      ctaSecondaryBtnLink,
      ctaBgImage: ctaBgImageBase64 || ctaBgImagePreview
    };

    const res = await updateAboutConfig(payload);
    setIsSaving(false);

    if (res.success) {
      if (onShowToast) onShowToast('About Page config saved successfully!');
    } else {
      if (onShowToast) onShowToast(`Error saving: ${res.message}`);
    }
  };

  // Glance Card Actions
  const handleOpenAddGlance = () => {
    setEditingGlanceId(null);
    setGlanceModalTitle('');
    setGlanceModalDesc('');
    setGlanceModalIcon('');
    setShowGlanceModal(true);
  };

  const handleOpenEditGlance = (card) => {
    setEditingGlanceId(card._id || card.id);
    setGlanceModalTitle(card.title);
    setGlanceModalDesc(card.desc);
    setGlanceModalIcon(card.icon);
    setShowGlanceModal(true);
  };

  const handleDeleteGlance = (id) => {
    setGlanceCards(prev => prev.filter(c => c._id !== id && c.id !== id));
  };

  const handleSaveGlanceModal = () => {
    if (!glanceModalTitle) return onShowToast && onShowToast('Title is required');
    const newObj = {
      id: editingGlanceId || `glc-${Date.now()}`,
      _id: editingGlanceId || undefined,
      title: glanceModalTitle,
      desc: glanceModalDesc,
      icon: glanceModalIcon || 'CheckCircle2'
    };
    if (editingGlanceId) {
      setGlanceCards(prev => prev.map(c => (c._id === editingGlanceId || c.id === editingGlanceId) ? newObj : c));
    } else {
      setGlanceCards(prev => [...prev, newObj]);
    }
    setShowGlanceModal(false);
  };

  // Group Card Actions
  const handleOpenAddGroup = () => {
    setEditingGroupId(null);
    setGroupModalTag('');
    setGroupModalTitle('');
    setGroupModalSubtitle('Core Business:');
    setGroupModalTagsStr('');
    setGroupModalIcon('Building2');
    setGroupModalLink('');
    setGroupModalDisclaimer('');
    setShowGroupModal(true);
  };

  const handleOpenEditGroup = (card) => {
    setEditingGroupId(card._id || card.id);
    setGroupModalTag(card.tag || '');
    setGroupModalTitle(card.title || '');
    setGroupModalSubtitle(card.subtitle || 'Core Business:');
    setGroupModalTagsStr(Array.isArray(card.tags) ? card.tags.join(', ') : '');
    setGroupModalIcon(card.icon || 'Building2');
    setGroupModalLink(card.link || '');
    setGroupModalDisclaimer(card.disclaimer || '');
    setShowGroupModal(true);
  };

  const handleDeleteGroup = (id) => {
    setGroupCards(prev => prev.filter(c => c._id !== id && c.id !== id));
  };

  const handleSaveGroupModal = () => {
    if (!groupModalTitle) return onShowToast && onShowToast('Entity Title is required');
    const tagsArr = groupModalTagsStr ? groupModalTagsStr.split(',').map(s => s.trim()).filter(Boolean) : [];
    const newObj = {
      id: editingGroupId || `grp-${Date.now()}`,
      _id: editingGroupId || undefined,
      tag: groupModalTag,
      title: groupModalTitle,
      subtitle: groupModalSubtitle,
      tags: tagsArr,
      icon: groupModalIcon || 'Building2',
      link: groupModalLink,
      disclaimer: groupModalDisclaimer
    };
    if (editingGroupId) {
      setGroupCards(prev => prev.map(c => (c._id === editingGroupId || c.id === editingGroupId) ? newObj : c));
    } else {
      setGroupCards(prev => [...prev, newObj]);
    }
    setShowGroupModal(false);
  };

  // Diff Card Actions
  const handleOpenAddDiff = () => {
    setEditingDiffId(null);
    setDiffModalTitle('');
    setDiffModalDesc('');
    setDiffModalIcon('ShieldCheck');
    setShowDiffModal(true);
  };

  const handleOpenEditDiff = (card) => {
    setEditingDiffId(card._id || card.id);
    setDiffModalTitle(card.title || '');
    setDiffModalDesc(card.desc || '');
    setDiffModalIcon(card.icon || 'ShieldCheck');
    setShowDiffModal(true);
  };

  const handleDeleteDiff = (id) => {
    setDiffCards(prev => prev.filter(c => c._id !== id && c.id !== id));
  };

  const handleSaveDiffModal = () => {
    if (!diffModalTitle) return onShowToast && onShowToast('Title is required');
    const newObj = {
      id: editingDiffId || `diff-${Date.now()}`,
      _id: editingDiffId || undefined,
      title: diffModalTitle,
      desc: diffModalDesc,
      icon: diffModalIcon || 'ShieldCheck'
    };
    if (editingDiffId) {
      setDiffCards(prev => prev.map(c => (c._id === editingDiffId || c.id === editingDiffId) ? newObj : c));
    } else {
      setDiffCards(prev => [...prev, newObj]);
    }
    setShowDiffModal(false);
  };

  if (loading) {
    return (
      <div className="content-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading About Page configurations...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%' }}>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* ======================= BANNER ======================= */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>1. Banner Section</h2>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }} disabled={isSaving}>
              <Save size={16} /> <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Banner Badge Text</label>
              <input type="text" className="form-control" value={bannerBadge} onChange={e => setBannerBadge(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Banner Title</label>
              <input type="text" className="form-control" value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Banner Description</label>
              <textarea className="form-control" rows={3} value={bannerDesc} onChange={e => setBannerDesc(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={16} /> <span>Banner Background Image (Cloudinary Sync)</span>
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBannerBgImageSelect(e.target.files[0])}
                  className="form-control"
                  style={{ flex: 1 }}
                />
                {bannerBgImagePreview && (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={bannerBgImagePreview}
                      alt="Banner BG Preview"
                      style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                    />
                    <button
                      type="button"
                      onClick={() => { setBannerBgImagePreview(''); setBannerBgImageBase64(''); }}
                      style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                Selecting a background image will automatically upload it to Cloudinary and reflect on the frontend About Banner.
              </span>
            </div>
          </div>
        </div>

        {/* ======================= WHO WE ARE ======================= */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>2. Who We Are (Mission & Vision)</h2>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="form-group">
              <label className="form-label">Main Heading</label>
              <input type="text" className="form-control" value={mainHeading} onChange={e => setMainHeading(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Main Description</label>
              <textarea className="form-control" rows={4} value={mainDesc} onChange={e => setMainDesc(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginBottom: '1rem' }}>Mission</h4>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" value={missionTitle} onChange={e => setMissionTitle(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={missionDesc} onChange={e => setMissionDesc(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Icon Name (Lucide)</label>
                  <input type="text" className="form-control" value={missionIcon} onChange={e => setMissionIcon(e.target.value)} />
                </div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginBottom: '1rem' }}>Vision</h4>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" value={visionTitle} onChange={e => setVisionTitle(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={visionDesc} onChange={e => setVisionDesc(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Icon Name (Lucide)</label>
                  <input type="text" className="form-control" value={visionIcon} onChange={e => setVisionIcon(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Main About Image</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="file" accept="image/*" onChange={(e) => handleMainImageSelect(e.target.files[0])} className="form-control" style={{ flex: 1 }} />
                {mainImagePreview && (
                  <img src={mainImagePreview} alt="Preview" style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ======================= AT A GLANCE ======================= */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>3. Company At A Glance</h2>
            <button type="button" onClick={handleOpenAddGlance} className="btn-primary" style={{ padding: '0.4rem 1rem' }}>
              <Plus size={14} /> <span>Add Card</span>
            </button>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Section Badge</label>
                <input type="text" className="form-control" value={glanceBadge} onChange={e => setGlanceBadge(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input type="text" className="form-control" value={glanceTitle} onChange={e => setGlanceTitle(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {glanceCards.map((card) => (
                <div key={card.id || card._id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>{card.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Icon: {card.icon}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{card.desc}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => handleOpenEditGlance(card)} className="file-upload-btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                    <button type="button" onClick={() => handleDeleteGlance(card.id || card._id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================= 4. OUR GROUP STRUCTURE ======================= */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>4. Our Group Structure Section</h2>
            <button type="button" onClick={handleOpenAddGroup} className="btn-primary" style={{ padding: '0.4rem 1rem' }}>
              <Plus size={14} /> <span>Add Group Entity</span>
            </button>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Section Badge</label>
                <input type="text" className="form-control" value={groupBadge} onChange={e => setGroupBadge(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input type="text" className="form-control" value={groupTitle} onChange={e => setGroupTitle(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Section Description</label>
              <textarea className="form-control" rows={3} value={groupDesc} onChange={e => setGroupDesc(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {groupCards.map((card) => (
                <div key={card.id || card._id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)' }}>{card.tag}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Icon: {card.icon}</span>
                  </div>
                  <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>{card.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Tags:</strong> {Array.isArray(card.tags) ? card.tags.join(', ') : card.tags}
                  </p>
                  {card.link && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Link: {card.link}</p>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => handleOpenEditGroup(card)} className="file-upload-btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                    <button type="button" onClick={() => handleDeleteGroup(card.id || card._id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================= 5. OUR KEY DIFFERENTIATORS ======================= */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>5. Our Key Differentiators Section</h2>
            <button type="button" onClick={handleOpenAddDiff} className="btn-primary" style={{ padding: '0.4rem 1rem' }}>
              <Plus size={14} /> <span>Add Differentiator</span>
            </button>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Section Badge</label>
                <input type="text" className="form-control" value={diffBadge} onChange={e => setDiffBadge(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input type="text" className="form-control" value={diffTitle} onChange={e => setDiffTitle(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Section Description</label>
              <textarea className="form-control" rows={3} value={diffDesc} onChange={e => setDiffDesc(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {diffCards.map((card) => (
                <div key={card.id || card._id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>{card.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Icon: {card.icon}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{card.desc}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => handleOpenEditDiff(card)} className="file-upload-btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                    <button type="button" onClick={() => handleDeleteDiff(card.id || card._id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================= 6. CTA / SECURITY REQUIREMENTS SECTION ======================= */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>6. CTA / Security Requirements Section</h2>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }} disabled={isSaving}>
              <Save size={16} /> <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">CTA Badge</label>
                <input type="text" className="form-control" value={ctaBadge} onChange={e => setCtaBadge(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">CTA Main Title</label>
                <input type="text" className="form-control" value={ctaTitle} onChange={e => setCtaTitle(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">CTA Description</label>
              <textarea className="form-control" rows={3} value={ctaDesc} onChange={e => setCtaDesc(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginBottom: '1rem' }}>Primary Action Button</h4>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Button Text</label>
                  <input type="text" className="form-control" value={ctaPrimaryBtnText} onChange={e => setCtaPrimaryBtnText(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Button Link</label>
                  <input type="text" className="form-control" value={ctaPrimaryBtnLink} onChange={e => setCtaPrimaryBtnLink(e.target.value)} />
                </div>
              </div>

              <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginBottom: '1rem' }}>Secondary Action Button</h4>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Button Text</label>
                  <input type="text" className="form-control" value={ctaSecondaryBtnText} onChange={e => setCtaSecondaryBtnText(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Button Link</label>
                  <input type="text" className="form-control" value={ctaSecondaryBtnLink} onChange={e => setCtaSecondaryBtnLink(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Cloudinary Background Image Upload */}
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={16} /> <span>CTA Background Image (Cloudinary Sync)</span>
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCtaBgImageSelect(e.target.files[0])}
                  className="form-control"
                  style={{ flex: 1 }}
                />
                {ctaBgImagePreview && (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={ctaBgImagePreview}
                      alt="CTA BG Preview"
                      style={{ width: '120px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                    />
                    <button
                      type="button"
                      onClick={() => { setCtaBgImagePreview(''); setCtaBgImageBase64(''); }}
                      style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                Selecting a file will upload it automatically to Cloudinary and store the CDN URL in the database when saved.
              </span>
            </div>

          </div>
        </div>

      </form>

      {/* Glance Card Modal */}
      {showGlanceModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '450px', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>{editingGlanceId ? 'Edit Glance Card' : 'Add Glance Card'}</h3>
              <button type="button" onClick={() => setShowGlanceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Title</label>
              <input type="text" className="form-control" value={glanceModalTitle} onChange={e => setGlanceModalTitle(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={3} value={glanceModalDesc} onChange={e => setGlanceModalDesc(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Lucide Icon Name</label>
              <input type="text" className="form-control" value={glanceModalIcon} onChange={e => setGlanceModalIcon(e.target.value)} placeholder="e.g. Building2, Target, Wrench" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="file-upload-btn" onClick={() => setShowGlanceModal(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={handleSaveGlanceModal}>Save Card</button>
            </div>
          </div>
        </div>
      )}

      {/* Group Card Modal */}
      {showGroupModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '500px', padding: '2rem', borderRadius: 'var(--radius-lg)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>{editingGroupId ? 'Edit Group Entity' : 'Add Group Entity'}</h3>
              <button type="button" onClick={() => setShowGroupModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Tag Badge (e.g. GROUP LEAD TECHNOLOGY ENTITY)</label>
              <input type="text" className="form-control" value={groupModalTag} onChange={e => setGroupModalTag(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Entity Title</label>
              <input type="text" className="form-control" value={groupModalTitle} onChange={e => setGroupModalTitle(e.target.value)} placeholder="e.g. Horizon Hive Technology L.L.C" />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Subtitle Label</label>
              <input type="text" className="form-control" value={groupModalSubtitle} onChange={e => setGroupModalSubtitle(e.target.value)} placeholder="e.g. Core Business:" />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Core Business Tags (Comma Separated)</label>
              <textarea className="form-control" rows={3} value={groupModalTagsStr} onChange={e => setGroupModalTagsStr(e.target.value)} placeholder="Managed IT, Cybersecurity, Digital Transformation" />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Icon Name (e.g. Laptop, Users, ShieldCheck)</label>
              <input type="text" className="form-control" value={groupModalIcon} onChange={e => setGroupModalIcon(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Redirect Link / URL</label>
              <input type="text" className="form-control" value={groupModalLink} onChange={e => setGroupModalLink(e.target.value)} placeholder="https://... or /solutions" />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Disclaimer Notice Text</label>
              <textarea className="form-control" rows={2} value={groupModalDisclaimer} onChange={e => setGroupModalDisclaimer(e.target.value)} placeholder="You are being redirected to..." />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="file-upload-btn" onClick={() => setShowGroupModal(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={handleSaveGroupModal}>Save Entity</button>
            </div>
          </div>
        </div>
      )}

      {/* Diff Card Modal */}
      {showDiffModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '450px', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>{editingDiffId ? 'Edit Differentiator' : 'Add Differentiator'}</h3>
              <button type="button" onClick={() => setShowDiffModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Title</label>
              <input type="text" className="form-control" value={diffModalTitle} onChange={e => setDiffModalTitle(e.target.value)} placeholder="e.g. UAE-Compliant by Design" />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={3} value={diffModalDesc} onChange={e => setDiffModalDesc(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Icon Name (e.g. ShieldCheck, Shuffle, Share2, Clock, Globe, Cpu)</label>
              <input type="text" className="form-control" value={diffModalIcon} onChange={e => setDiffModalIcon(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="file-upload-btn" onClick={() => setShowDiffModal(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={handleSaveDiffModal}>Save Differentiator</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
