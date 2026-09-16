import React, { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MapPin, RefreshCw, ExternalLink, Instagram, Linkedin, Facebook, Youtube, Twitter } from 'lucide-react';
import { fetchSettings, updateSettings, WEBSITE_BASE_URL, API_BASE_URL, checkApiHealth } from '../services/api';

export default function SettingsView({ onShowToast }) {
  // Mirrors the server's nested SiteSettings structure
  const [general, setGeneral] = useState({
    siteName: 'UniSol',
    contactEmail: '',
    phone: '',
    address: '',
  });
  const [social, setSocial] = useState({
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    x: '',
  });
  const [integrations, setIntegrations] = useState({
    analyticsId: '',
    facebookPixelId: '',
    customHeadCode: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiStatus, setApiStatus] = useState(null); // 'online' | 'offline' | null

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [settRes, healthRes] = await Promise.all([
        fetchSettings(),
        checkApiHealth(),
      ]);
      if (settRes.success && settRes.settings) {
        const s = settRes.settings;
        if (s.general) setGeneral((p) => ({ ...p, ...s.general }));
        if (s.social) setSocial((p) => ({ ...p, ...s.social }));
        if (s.integrations) setIntegrations((p) => ({ ...p, ...s.integrations }));
      }
      setApiStatus(healthRes.status === 'online' ? 'online' : 'offline');
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    const res = await updateSettings({ general, social, integrations });
    setSaving(false);
    if (res.success) {
      onShowToast('✅ Settings saved successfully!');
    } else {
      onShowToast(`⚠️ Save failed: ${res.message}`);
    }
  };

  if (loading) {
    return (
      <div className="content-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', marginBottom: '0.5rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading settings…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* API Status Banner */}
      <div className="content-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-block',
            width: '10px', height: '10px',
            borderRadius: '50%',
            background: apiStatus === 'online' ? 'var(--success)' : 'var(--danger)',
            boxShadow: apiStatus === 'online' ? '0 0 0 3px rgba(16,185,129,0.2)' : '0 0 0 3px rgba(239,68,68,0.2)',
          }} />
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            Backend API: {apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Offline' : 'Checking…'}
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>{API_BASE_URL}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href={WEBSITE_BASE_URL}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}
          >
            <ExternalLink size={13} /> View Live Website
          </a>
        </div>
      </div>

      {/* General Settings */}
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="card-title"><Globe size={18} color="var(--primary)" /> General Settings</h2>
        </div>
        <div className="content-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-row">
            <label className="form-label">Site Name</label>
            <input type="text" className="form-control" value={general.siteName} onChange={(e) => setGeneral((p) => ({ ...p, siteName: e.target.value }))} placeholder="UniSol" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-row">
              <label className="form-label"><Mail size={13} /> Contact Email</label>
              <input type="email" className="form-control" value={general.contactEmail} onChange={(e) => setGeneral((p) => ({ ...p, contactEmail: e.target.value }))} placeholder="info@unisol.com" />
            </div>
            <div className="form-row">
              <label className="form-label"><Phone size={13} /> Contact Phone</label>
              <input type="text" className="form-control" value={general.phone} onChange={(e) => setGeneral((p) => ({ ...p, phone: e.target.value }))} placeholder="+971 50 288 5874" />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label"><MapPin size={13} /> Office Address</label>
            <input type="text" className="form-control" value={general.address} onChange={(e) => setGeneral((p) => ({ ...p, address: e.target.value }))} placeholder="Dubai, UAE" />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="card-title">Social Media Links</h2>
        </div>
        <div className="content-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
            { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
            { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
            { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
            { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="form-row">
              <label className="form-label">{label}</label>
              <input type="url" className="form-control" value={social[key] || ''} onChange={(e) => setSocial((p) => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
            </div>
          ))}
        </div>
      </div>

      {/* Analytics */}
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="card-title">Analytics &amp; Tracking</h2>
        </div>
        <div className="content-card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-row">
            <label className="form-label">Google Analytics ID</label>
            <input type="text" className="form-control" value={integrations.analyticsId || ''} onChange={(e) => setIntegrations((p) => ({ ...p, analyticsId: e.target.value }))} placeholder="G-XXXXXXXXXX" />
          </div>
          <div className="form-row">
            <label className="form-label">Facebook Pixel ID</label>
            <input type="text" className="form-control" value={integrations.facebookPixelId || ''} onChange={(e) => setIntegrations((p) => ({ ...p, facebookPixelId: e.target.value }))} placeholder="123456789012345" />
          </div>
        </div>
        <div className="content-card-body" style={{ paddingTop: 0 }}>
          <div className="form-row">
            <label className="form-label">Custom &lt;head&gt; HTML</label>
            <textarea className="form-control" rows={4} value={integrations.customHeadCode || ''} onChange={(e) => setIntegrations((p) => ({ ...p, customHeadCode: e.target.value }))} placeholder="<!-- e.g. verification tags -->" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }} />
          </div>
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '0.6rem 1.5rem' }}>
          {saving ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
