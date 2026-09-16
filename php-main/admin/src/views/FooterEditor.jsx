import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Link as LinkIcon, Globe, Phone, Mail, MapPin, Share2, LayoutPanelLeft } from 'lucide-react';
import { fetchFooterConfig, updateFooterConfig } from '../services/api';

const SOCIAL_PLATFORMS = [
  { label: 'Facebook', icon: 'fa-facebook-f' },
  { label: 'Instagram', icon: 'fa-instagram' },
  { label: 'X / Twitter', icon: 'fa-x-twitter' },
  { label: 'LinkedIn', icon: 'fa-linkedin-in' },
  { label: 'YouTube', icon: 'fa-youtube' },
  { label: 'WhatsApp', icon: 'fa-whatsapp' },
  { label: 'TikTok', icon: 'fa-tiktok' },
];

const sectionCard = {
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--bg-card)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const sectionTitle = {
  fontSize: '1rem',
  fontWeight: 700,
  margin: 0,
  color: 'var(--text-main)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const inputRow = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
};

export default function FooterEditor({ onShowToast }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('brand');

  // === Brand Info ===
  const [logoUrl, setLogoUrl] = useState('/images/logo.png');
  const [logoBase64, setLogoBase64] = useState('');
  const [companyName, setCompanyName] = useState('UniSpark Innovation Security Systems & Equipment Trading L.L.C');
  const [companyTagline, setCompanyTagline] = useState('');
  const [groupCompaniesLabel, setGroupCompaniesLabel] = useState('Group Companies:');
  const [groupCompanies, setGroupCompanies] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);

  // === Columns ===
  const [solutionsColumnTitle, setSolutionsColumnTitle] = useState('SOLUTIONS');
  const [industriesColumnTitle, setIndustriesColumnTitle] = useState('INDUSTRIES');
  const [quickLinksColumnTitle, setQuickLinksColumnTitle] = useState('QUICK LINKS');
  const [quickLinks, setQuickLinks] = useState([]);

  // === Contact Strip ===
  const [serviceAreasLabel, setServiceAreasLabel] = useState('Service Areas:');
  const [serviceAreas, setServiceAreas] = useState('Dubai | Abu Dhabi | Sharjah | UAE Nationwide');
  const [officeLocation, setOfficeLocation] = useState('Dubai, United Arab Emirates');
  const [email, setEmail] = useState('sales@unisparkinnovation.com');
  const [emailLabel, setEmailLabel] = useState('Sales');
  const [phone, setPhone] = useState('+971 50 288 5874');
  const [phoneLabel, setPhoneLabel] = useState('Call');
  const [whatsappNumber, setWhatsappNumber] = useState('971502885874');

  // === Copyright ===
  const [copyrightText, setCopyrightText] = useState('UniSpark Innovation Security Systems & Equipment Trading L.L.C. All rights reserved.');

  // ===========================
  const loadData = async () => {
    setLoading(true);
    const res = await fetchFooterConfig();
    if (res.success && res.data) {
      const d = res.data;
      setLogoUrl(d.logoUrl || '/images/logo.png');
      setCompanyName(d.companyName || '');
      setCompanyTagline(d.companyTagline || '');
      setGroupCompaniesLabel(d.groupCompaniesLabel || 'Group Companies:');
      setGroupCompanies(Array.isArray(d.groupCompanies) ? d.groupCompanies : []);
      setSocialLinks(Array.isArray(d.socialLinks) ? d.socialLinks : []);
      setSolutionsColumnTitle(d.solutionsColumnTitle || 'SOLUTIONS');
      setIndustriesColumnTitle(d.industriesColumnTitle || 'INDUSTRIES');
      setQuickLinksColumnTitle(d.quickLinksColumnTitle || 'QUICK LINKS');
      setQuickLinks(Array.isArray(d.quickLinks) ? d.quickLinks : []);
      setServiceAreasLabel(d.serviceAreasLabel || 'Service Areas:');
      setServiceAreas(d.serviceAreas || '');
      setOfficeLocation(d.officeLocation || '');
      setEmail(d.email || '');
      setEmailLabel(d.emailLabel || 'Sales');
      setPhone(d.phone || '');
      setPhoneLabel(d.phoneLabel || 'Call');
      setWhatsappNumber(d.whatsappNumber || '');
      setCopyrightText(d.copyrightText || '');
    } else {
      if (onShowToast) onShowToast('Failed to load footer data');
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // ===========================
  const handleSave = async () => {
    setSaving(true);
    const payload = {
      logoUrl: logoBase64 || logoUrl,
      companyName, companyTagline,
      groupCompaniesLabel, groupCompanies, socialLinks,
      solutionsColumnTitle, industriesColumnTitle,
      quickLinksColumnTitle, quickLinks,
      serviceAreasLabel, serviceAreas, officeLocation,
      email, emailLabel, phone, phoneLabel, whatsappNumber,
      copyrightText
    };
    const res = await updateFooterConfig(payload);
    setSaving(false);
    if (res.success) {
      setLogoBase64('');
      if (onShowToast) onShowToast('Footer configuration saved successfully!');
    } else {
      if (onShowToast) onShowToast(res.message || 'Failed to save footer.');
    }
  };

  const handleLogoSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setLogoUrl(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setLogoBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const tabBtn = (key, label, Icon) => (
    <button
      type="button"
      onClick={() => setActiveTab(key)}
      style={{
        padding: '0.5rem 1.1rem',
        fontSize: '0.82rem',
        fontWeight: 600,
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        whiteSpace: 'nowrap',
        backgroundColor: activeTab === key ? '#0073b7' : 'transparent',
        color: activeTab === key ? '#fff' : 'var(--text-muted)',
      }}
    >
      {Icon && <Icon size={14} />}
      <span>{label}</span>
    </button>
  );

  if (loading) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      Loading footer configuration from MongoDB...
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutPanelLeft className="text-primary" size={20} />
              <span>Footer CMS Editor</span>
            </h3>
            <p className="card-subtitle">Edit all footer sections — brand info, social links, quick links, contact strip, and copyright. Changes reflect live on the website.</p>
          </div>
          <button type="button" onClick={handleSave} className="btn-primary" style={{ padding: '0.55rem 1.5rem', fontSize: '0.88rem' }} disabled={saving}>
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Footer'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', padding: '0.6rem 1rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
        {tabBtn('brand', 'Brand & Logo', ImageIcon)}
        {tabBtn('social', 'Social Links', Share2)}
        {tabBtn('columns', 'Column Titles', LayoutPanelLeft)}
        {tabBtn('quicklinks', 'Quick Links', LinkIcon)}
        {tabBtn('contact', 'Contact Strip', Phone)}
        {tabBtn('copyright', 'Copyright', Globe)}
      </div>

      {/* ===== TAB: BRAND & LOGO ===== */}
      {activeTab === 'brand' && (
        <div style={sectionCard}>
          <h4 style={sectionTitle}><ImageIcon size={18} color="#0073b7" /> Brand Info & Logo</h4>

          {/* Logo Upload */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ImageIcon size={14} color="#0073b7" /> Company Logo Upload
            </label>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <input type="file" accept="image/*" className="form-control" style={{ flex: 1 }} onChange={e => handleLogoSelect(e.target.files[0])} />
              {logoUrl && (
                <div style={{ backgroundColor: '#004b78', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <img src={logoUrl} alt="Logo Preview" style={{ height: '40px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} onError={e => e.target.style.display = 'none'} />
                </div>
              )}
            </div>
            <input type="text" className="form-control" style={{ marginTop: '0.5rem', fontSize: '0.82rem' }} value={typeof logoUrl === 'string' && !logoUrl.startsWith('blob:') && !logoUrl.startsWith('data:') ? logoUrl : ''} onChange={e => { setLogoUrl(e.target.value); setLogoBase64(''); }} placeholder="OR Image URL / path (e.g. /images/logo.png)" />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Company Full Name</label>
            <input type="text" className="form-control" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="UniSpark Innovation Security Systems & Equipment Trading L.L.C" />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Company Tagline / Description</label>
            <textarea className="form-control" rows={3} value={companyTagline} onChange={e => setCompanyTagline(e.target.value)} placeholder="Next-generation enterprise protection..." />
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: '0.92rem' }}>Group Companies</h5>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subsidiary / partner companies displayed in the footer</p>
              </div>
              <button type="button" onClick={() => setGroupCompanies(prev => [...prev, { label: '', url: '' }])} className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}>
                <Plus size={13} /> <span>Add Company</span>
              </button>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Group Companies Section Label</label>
              <input type="text" className="form-control" value={groupCompaniesLabel} onChange={e => setGroupCompaniesLabel(e.target.value)} placeholder="e.g. Group Companies:" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
              {groupCompanies.map((gc, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <input type="text" className="form-control" style={{ flex: 1, fontSize: '0.85rem' }} value={gc.label} onChange={e => setGroupCompanies(prev => prev.map((c, i) => i === idx ? { ...c, label: e.target.value } : c))} placeholder="Company Name" />
                  <input type="text" className="form-control" style={{ flex: 1, fontSize: '0.85rem' }} value={gc.url} onChange={e => setGroupCompanies(prev => prev.map((c, i) => i === idx ? { ...c, url: e.target.value } : c))} placeholder="https://..." />
                  <button type="button" onClick={() => setGroupCompanies(prev => prev.filter((_, i) => i !== idx))} style={{ padding: '0.4rem 0.55rem', backgroundColor: 'rgba(239,68,68,0.12)', color: 'var(--danger)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: SOCIAL LINKS ===== */}
      {activeTab === 'social' && (
        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={sectionTitle}><Share2 size={18} color="#0073b7" /> Social Media Links</h4>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>These appear as icon buttons in the footer brand column.</p>
            </div>
            <button type="button" onClick={() => setSocialLinks(prev => [...prev, { platform: 'Facebook', icon: 'fa-facebook-f', url: '' }])} className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}>
              <Plus size={13} /> <span>Add Social</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {socialLinks.map((s, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#004b78', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                      <i className={`fa-brands ${s.icon || 'fa-globe'}`} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{s.platform}</span>
                  </div>
                  <button type="button" onClick={() => setSocialLinks(prev => prev.filter((_, i) => i !== idx))} style={{ padding: '0.2rem 0.45rem', backgroundColor: 'rgba(239,68,68,0.12)', color: 'var(--danger)', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    <Trash2 size={13} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Platform Name</label>
                    <input type="text" className="form-control" style={{ fontSize: '0.82rem' }} value={s.platform} onChange={e => setSocialLinks(prev => prev.map((x, i) => i === idx ? { ...x, platform: e.target.value } : x))} placeholder="e.g. Facebook" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>FA Icon Class</label>
                    <input type="text" className="form-control" style={{ fontSize: '0.82rem' }} value={s.icon} onChange={e => setSocialLinks(prev => prev.map((x, i) => i === idx ? { ...x, icon: e.target.value } : x))} placeholder="e.g. fa-facebook-f" />
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {SOCIAL_PLATFORMS.map(p => (
                    <button key={p.label} type="button" onClick={() => setSocialLinks(prev => prev.map((x, i) => i === idx ? { ...x, platform: p.label, icon: p.icon } : x))}
                      style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem', borderRadius: '5px', border: `1px solid ${s.icon === p.icon ? '#0073b7' : 'var(--border-color)'}`, backgroundColor: s.icon === p.icon ? 'rgba(0,115,183,0.1)' : 'var(--bg-card)', color: s.icon === p.icon ? '#0073b7' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <i className={`fa-brands ${p.icon} text-xs`} /> {p.label}
                    </button>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Profile URL</label>
                  <input type="text" className="form-control" style={{ fontSize: '0.82rem' }} value={s.url} onChange={e => setSocialLinks(prev => prev.map((x, i) => i === idx ? { ...x, url: e.target.value } : x))} placeholder="https://www.facebook.com/YourPage" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TAB: COLUMN TITLES ===== */}
      {activeTab === 'columns' && (
        <div style={sectionCard}>
          <h4 style={sectionTitle}><LayoutPanelLeft size={18} color="#0073b7" /> Footer Column Headings</h4>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            The Solutions and Industries lists are automatically populated from the respective CMS sections. Only the column titles are editable here.
          </p>
          <div style={inputRow}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Solutions Column Title</label>
              <input type="text" className="form-control" value={solutionsColumnTitle} onChange={e => setSolutionsColumnTitle(e.target.value)} placeholder="e.g. SOLUTIONS" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Industries Column Title</label>
              <input type="text" className="form-control" value={industriesColumnTitle} onChange={e => setIndustriesColumnTitle(e.target.value)} placeholder="e.g. INDUSTRIES" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Quick Links Column Title</label>
            <input type="text" className="form-control" style={{ maxWidth: '320px' }} value={quickLinksColumnTitle} onChange={e => setQuickLinksColumnTitle(e.target.value)} placeholder="e.g. QUICK LINKS" />
          </div>

          {/* Info cards */}
          {['Solutions — pulled live from /api/section3 (Solutions CMS)', 'Industries — pulled live from /api/section5 (Industries CMS)'].map((info, i) => (
            <div key={i} style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(0,115,183,0.06)', border: '1px solid rgba(0,115,183,0.15)', fontSize: '0.8rem', color: '#0073b7', fontWeight: 600 }}>
              ℹ️ {info}
            </div>
          ))}
        </div>
      )}

      {/* ===== TAB: QUICK LINKS ===== */}
      {activeTab === 'quicklinks' && (
        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={sectionTitle}><LinkIcon size={18} color="#0073b7" /> Quick Links</h4>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>Navigation links displayed in the Quick Links column of the footer.</p>
            </div>
            <button type="button" onClick={() => setQuickLinks(prev => [...prev, { label: 'New Link', url: '/' }])} className="btn-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}>
              <Plus size={13} /> <span>Add Link</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {quickLinks.map((ql, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', backgroundColor: 'var(--bg-input)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(0,115,183,0.12)', color: '#0073b7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                <input type="text" className="form-control" style={{ width: '200px', fontSize: '0.85rem' }} value={ql.label} onChange={e => setQuickLinks(prev => prev.map((l, i) => i === idx ? { ...l, label: e.target.value } : l))} placeholder="Label (e.g. Home)" />
                <input type="text" className="form-control" style={{ flex: 1, fontSize: '0.85rem' }} value={ql.url} onChange={e => setQuickLinks(prev => prev.map((l, i) => i === idx ? { ...l, url: e.target.value } : l))} placeholder="URL (e.g. / or /about-us)" />
                <button type="button" onClick={() => setQuickLinks(prev => prev.filter((_, i) => i !== idx))} style={{ padding: '0.4rem 0.55rem', backgroundColor: 'rgba(239,68,68,0.12)', color: 'var(--danger)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TAB: CONTACT STRIP ===== */}
      {activeTab === 'contact' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Service Areas */}
          <div style={sectionCard}>
            <h4 style={sectionTitle}><MapPin size={18} color="#0073b7" /> Service Areas</h4>
            <div style={inputRow}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Label</label>
                <input type="text" className="form-control" value={serviceAreasLabel} onChange={e => setServiceAreasLabel(e.target.value)} placeholder="e.g. Service Areas:" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Areas Text</label>
                <input type="text" className="form-control" value={serviceAreas} onChange={e => setServiceAreas(e.target.value)} placeholder="e.g. Dubai | Abu Dhabi | Sharjah | UAE Nationwide" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Office Location Text</label>
              <input type="text" className="form-control" value={officeLocation} onChange={e => setOfficeLocation(e.target.value)} placeholder="e.g. Dubai, United Arab Emirates" />
            </div>
          </div>

          {/* Contact Details */}
          <div style={sectionCard}>
            <h4 style={sectionTitle}><Mail size={18} color="#0073b7" /> Contact Details</h4>
            <div style={inputRow}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Email Label</label>
                <input type="text" className="form-control" value={emailLabel} onChange={e => setEmailLabel(e.target.value)} placeholder="e.g. Sales" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Email Address</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. sales@unisparkinnovation.com" />
              </div>
            </div>
            <div style={inputRow}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Phone Label</label>
                <input type="text" className="form-control" value={phoneLabel} onChange={e => setPhoneLabel(e.target.value)} placeholder="e.g. Call" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 600 }}>Phone Number (display)</label>
                <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +971 50 288 5874" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>WhatsApp Number (digits only, with country code)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="text" className="form-control" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="e.g. 971502885874" />
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#25D366', color: '#fff', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  <i className="fa-brands fa-whatsapp" /> Test Link
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: COPYRIGHT ===== */}
      {activeTab === 'copyright' && (
        <div style={sectionCard}>
          <h4 style={sectionTitle}><Globe size={18} color="#0073b7" /> Copyright & Bottom Bar</h4>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Copyright Text</label>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>The current year (©) is prepended automatically.</p>
            <input type="text" className="form-control" value={copyrightText} onChange={e => setCopyrightText(e.target.value)} placeholder="UniSpark Innovation Security Systems & Equipment Trading L.L.C. All rights reserved." />
          </div>
          <div style={{ padding: '1rem 1.25rem', borderRadius: '8px', backgroundColor: '#004b78', color: '#fff', fontSize: '0.82rem', fontStyle: 'italic' }}>
            Preview: © {new Date().getFullYear()} {copyrightText}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            ℹ️ Privacy Policy and Terms &amp; Conditions links are always shown in the footer bar and link to <code>/privacy-policy</code> and <code>/terms-and-conditions</code> respectively.
          </p>
        </div>
      )}

      {/* Sticky Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '1rem' }}>
        <button type="button" onClick={handleSave} className="btn-primary" style={{ padding: '0.65rem 2rem', fontSize: '0.92rem' }} disabled={saving}>
          <Save size={16} />
          <span>{saving ? 'Saving Footer...' : 'Save All Footer Settings'}</span>
        </button>
      </div>

    </div>
  );
}
