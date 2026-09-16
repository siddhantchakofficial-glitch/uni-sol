import React, { useState, useEffect } from 'react';
import { Save, Plus, X, Trash2, Edit } from 'lucide-react';
import { fetchContactConfig, updateContactConfig } from '../services/api';
import CountrySelect from '../components/CountrySelect';
import { COUNTRIES, detectCountryFromPhone } from '../data/countries';

export default function ContactEditor({ onShowToast }) {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [countryCode, setCountryCode] = useState('+971');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [coverage, setCoverage] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  
  // Enquiry Form CMS
  const [formBadge, setFormBadge] = useState('ENQUIRY FORM');
  const [formTitle, setFormTitle] = useState('Send us a message!');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formSuccessTitle, setFormSuccessTitle] = useState('Enquiry Dispatched!');
  const [formSuccessDesc, setFormSuccessDesc] = useState('');
  
  const [partnerLinks, setPartnerLinks] = useState([]);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalLabel, setModalLabel] = useState('');
  const [modalUrl, setModalUrl] = useState('');

  const loadData = async () => {
    setLoading(true);
    const res = await fetchContactConfig();
    if (res.success && res.data) {
      setBannerTitle(res.data.bannerTitle || '');
      setBannerDesc(res.data.bannerDesc || '');
      setCountry(res.data.country || 'United Arab Emirates');
      setCountryCode(res.data.countryCode || '+971');
      setPhone(res.data.phone || '');
      setWhatsapp(res.data.whatsapp || '');
      setEmail(res.data.email || '');
      setAddress(res.data.address || '');
      setCoverage(res.data.coverage || '');
      setWorkingHours(res.data.workingHours || '');
      setMapEmbedUrl(res.data.mapEmbedUrl || '');
      
      // Enquiry Form CMS
      setFormBadge(res.data.formBadge || 'ENQUIRY FORM');
      setFormTitle(res.data.formTitle || 'Send us a message!');
      setFormSubtitle(res.data.formSubtitle || '');
      setFormSuccessTitle(res.data.formSuccessTitle || 'Enquiry Dispatched!');
      setFormSuccessDesc(res.data.formSuccessDesc || '');

      if (Array.isArray(res.data.partnerLinks)) {
        setPartnerLinks(res.data.partnerLinks);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePhoneChange = (val) => {
    setPhone(val);
    const detected = detectCountryFromPhone(val);
    if (detected) {
      setCountry(detected.country.name);
      setCountryCode(detected.dialCode);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      bannerTitle,
      bannerDesc,
      country,
      countryCode,
      phone,
      whatsapp,
      email,
      address,
      coverage,
      workingHours,
      mapEmbedUrl,
      formBadge,
      formTitle,
      formSubtitle,
      formSuccessTitle,
      formSuccessDesc,
      partnerLinks
    };

    const res = await updateContactConfig(payload);
    setIsSaving(false);

    if (res.success) {
      if (onShowToast) onShowToast('Contact Page config saved successfully!');
    } else {
      if (onShowToast) onShowToast(`Error saving: ${res.message}`);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setModalTitle('');
    setModalLabel('');
    setModalUrl('');
    setShowModal(true);
  };

  const handleOpenEdit = (link, index) => {
    setEditingId(link._id || index.toString());
    setModalTitle(link.title);
    setModalLabel(link.label);
    setModalUrl(link.url);
    setShowModal(true);
  };

  const handleDelete = (idOrIndex) => {
    setPartnerLinks(prev => prev.filter((l, idx) => (l._id || idx.toString()) !== idOrIndex));
  };

  const handleSaveModal = () => {
    const newObj = {
      title: modalTitle,
      label: modalLabel,
      url: modalUrl
    };
    if (editingId !== null) {
      setPartnerLinks(prev => prev.map((l, idx) => (l._id || idx.toString()) === editingId ? { ...l, ...newObj } : l));
    } else {
      setPartnerLinks(prev => [...prev, newObj]);
    }
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="content-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Contact Page configurations...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%' }}>
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Banner Section */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>1. Header Section</h2>
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }} disabled={isSaving}>
              <Save size={16} /> <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Banner Title</label>
              <input type="text" className="form-control" value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Banner Description</label>
              <textarea className="form-control" rows={3} value={bannerDesc} onChange={e => setBannerDesc(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>2. Contact Details</h2>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <CountrySelect
                  value={country}
                  onChange={(selected) => {
                    setCountry(selected.name);
                    setCountryCode(selected.dialCode);
                  }}
                  label="Headquarters / Default Country"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (Display)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <CountrySelect
                    variant="dialCodeOnly"
                    value={countryCode}
                    onChange={(selected) => {
                      setCountry(selected.name);
                      setCountryCode(selected.dialCode);
                    }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    value={phone}
                    onChange={e => handlePhoneChange(e.target.value)}
                    placeholder="e.g. +971 50 288 5874"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">WhatsApp Number (Direct Link Format)</label>
                <input
                  type="text"
                  className="form-control"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="971502885874"
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>International format without '+' (e.g. 971502885874)</p>
              </div>

              <div className="form-group">
                <label className="form-label">Sales Email</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@unisparkinnovation.com" />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Company Address</label>
              <input type="text" className="form-control" value={address} onChange={e => setAddress(e.target.value)} placeholder="Dubai, United Arab Emirates" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Coverage Areas</label>
              <input type="text" className="form-control" value={coverage} onChange={e => setCoverage(e.target.value)} placeholder="Dubai · Abu Dhabi · Sharjah" />
            </div>

            <div className="form-group">
              <label className="form-label">Working Hours</label>
              <input type="text" className="form-control" value={workingHours} onChange={e => setWorkingHours(e.target.value)} placeholder="Sunday – Thursday, 8:00 AM – 6:00 PM (UAE)" />
            </div>
          </div>
        </div>

        {/* Enquiry Form Section (CMS) */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>3. Enquiry Form Section (Headers & Success Screen)</h2>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Form Badge / Tagline (e.g. ENQUIRY FORM)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formBadge}
                  onChange={e => setFormBadge(e.target.value)}
                  placeholder="ENQUIRY FORM"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Form Main Heading (e.g. Send us a message!)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Send us a message!"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Form Subtitle / Instructions (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={formSubtitle}
                onChange={e => setFormSubtitle(e.target.value)}
                placeholder="Fill in the details below and our technical engineering team will get back to you promptly."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Success Screen Heading</label>
                <input
                  type="text"
                  className="form-control"
                  value={formSuccessTitle}
                  onChange={e => setFormSuccessTitle(e.target.value)}
                  placeholder="Enquiry Dispatched!"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Success Screen Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={formSuccessDesc}
                  onChange={e => setFormSuccessDesc(e.target.value)}
                  placeholder="Thank you for contacting UniSpark Innovation. Our technical engineering division will respond quickly within 2 business hours."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Map Section */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>4. Location Map</h2>
          </div>
          <div className="content-card-body" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Google Maps Embed URL (`src` attribute)</label>
              <textarea className="form-control" rows={3} value={mapEmbedUrl} onChange={e => setMapEmbedUrl(e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Extract the URL from the `src="..."` part of the embed code provided by Google Maps.</p>
            </div>
          </div>
        </div>

        {/* Partner Links Section */}
        <div className="content-card" style={{ width: '100%' }}>
          <div className="content-card-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>5. Partner Links (Bottom Banner)</h2>
            <button type="button" onClick={handleOpenAdd} className="btn-primary" style={{ padding: '0.4rem 1rem' }}>
              <Plus size={14} /> <span>Add Link</span>
            </button>
          </div>
          <div className="content-card-body" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {partnerLinks.map((link, idx) => (
                <div key={link._id || idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontWeight: 700 }}>{link.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>{link.label}</p>
                  <a href={link.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}>{link.url}</a>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => handleOpenEdit(link, idx)} className="file-upload-btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Edit</button>
                    <button type="button" onClick={() => handleDelete(link._id || idx.toString())} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </form>

      {/* Partner Link Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--bg-card)', width: '400px', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3>{editingId !== null ? 'Edit Partner Link' : 'Add Partner Link'}</h3>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20}/></button>
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Question Text (e.g. Looking for IT Services?)</label>
              <input type="text" className="form-control" value={modalTitle} onChange={e => setModalTitle(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Link Label (e.g. Visit Horizon Hive)</label>
              <input type="text" className="form-control" value={modalLabel} onChange={e => setModalLabel(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">URL (e.g. https://domain.com)</label>
              <input type="text" className="form-control" value={modalUrl} onChange={e => setModalUrl(e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" className="file-upload-btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="button" className="btn-primary" onClick={handleSaveModal}>Save Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
