import React, { useState, useEffect } from 'react';
import { Layout, Upload, Save, Mail, Facebook, Instagram, Twitter, Linkedin, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { fetchHeaderConfig, updateHeaderConfig } from '../services/api';

export default function HeaderEditor({ onShowToast }) {
  const [email, setEmail] = useState('contact@unise.com');
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com/unise',
    instagram: 'https://instagram.com/unise',
    twitter: 'https://twitter.com/unise',
    linkedin: 'https://linkedin.com/company/unise'
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load Header settings from Backend / MongoDB Atlas
  const loadConfig = async () => {
    setLoading(true);
    const res = await fetchHeaderConfig();
    if (res.success && res.data) {
      setEmail(res.data.email || 'contact@unise.com');
      if (res.data.socialLinks) {
        setSocialLinks({
          facebook: res.data.socialLinks.facebook || '',
          instagram: res.data.socialLinks.instagram || '',
          twitter: res.data.socialLinks.twitter || '',
          linkedin: res.data.socialLinks.linkedin || ''
        });
      }
      if (res.data.logoUrl) {
        setLogoPreviewUrl(res.data.logoUrl);
      } else {
        setLogoPreviewUrl('');
      }
    } else {
      onShowToast('Notice: Failed to load header settings from backend');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Convert uploaded image file to Base64 Data URL for upload to Cloudinary & MongoDB
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setLogoPreviewUrl(base64Data);
        onShowToast(`Selected logo: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialChange = (key, value) => {
    setSocialLinks(prev => ({ ...prev, [key]: value }));
  };

  // UPDATE Header Config (PUT /api/header)
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const payload = {
      email,
      socialLinks,
      logoUrl: logoPreviewUrl
    };

    const res = await updateHeaderConfig(payload);
    setIsSaving(false);

    if (res.success) {
      if (res.data && res.data.logoUrl) {
        setLogoPreviewUrl(res.data.logoUrl);
      }
      setLogoFile(null);
      onShowToast('Header data saved successfully to MongoDB!');
    } else {
      onShowToast(`Error saving header: ${res.message || 'Failed to save to backend'}`);
    }
  };

  if (loading) {
    return (
      <div className="content-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Header configuration from database...
      </div>
    );
  }

  return (
    <div className="content-card">
      <div className="content-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="card-title">
            <Layout size={20} color="var(--primary)" />
            Header Configuration
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Website &gt; Header</span>
        </div>

        {/* Action Header Button */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary"
            style={{ margin: 0, padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="content-card-body">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Email Field */}
          <div className="form-row">
            <label className="form-label" htmlFor="header-email">Email</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="header-email"
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@unise.com"
                required
              />
            </div>
          </div>

          {/* Social Links Section */}
          <div className="form-row" style={{ alignItems: 'flex-start' }}>
            <label className="form-label" style={{ paddingTop: '0.5rem' }}>Social Links</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              
              {/* Facebook Link */}
              <div className="form-group">
                <label style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Facebook size={14} color="#1877F2" /> Facebook Link
                </label>
                <input
                  type="url"
                  className="form-control"
                  value={socialLinks.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/your-page"
                />
              </div>

              {/* Instagram Link */}
              <div className="form-group">
                <label style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Instagram size={14} color="#E4405F" /> Instagram Link
                </label>
                <input
                  type="url"
                  className="form-control"
                  value={socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/your-profile"
                />
              </div>

              {/* Twitter Link */}
              <div className="form-group">
                <label style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Twitter size={14} color="#1DA1F2" /> Twitter Link
                </label>
                <input
                  type="url"
                  className="form-control"
                  value={socialLinks.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/your-handle"
                />
              </div>

              {/* Linkedin Link */}
              <div className="form-group">
                <label style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Linkedin size={14} color="#0A66C2" /> Linkedin Link
                </label>
                <input
                  type="url"
                  className="form-control"
                  value={socialLinks.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/your-company"
                />
              </div>

            </div>
          </div>

          {/* Logo Upload Field */}
          <div className="form-row" style={{ alignItems: 'flex-start' }}>
            <label className="form-label" style={{ paddingTop: '0.5rem', fontWeight: 600 }}>Logo Upload</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              
              <div className="file-upload-wrapper" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                <label htmlFor="logo-upload-input" className="file-upload-btn" style={{ padding: '0.75rem 1.5rem' }}>
                  <Upload size={18} />
                  <span>Choose Logo File</span>
                </label>
                <input
                  id="logo-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: 'none' }}
                />
                <span className="file-name" style={{ fontSize: '0.875rem' }}>
                  {logoFile ? `Selected: ${logoFile.name}` : (logoPreviewUrl ? 'Logo is active' : 'No file chosen (Click to upload)')}
                </span>
              </div>

              {/* Logo Preview Container */}
              <div style={{
                width: '100%',
                maxWidth: '440px',
                minHeight: '130px',
                border: '2px dashed var(--border-light)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-input)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                position: 'relative'
              }}>
                {logoPreviewUrl ? (
                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={logoPreviewUrl}
                      alt="Uploaded Logo Preview"
                      style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.6rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                      <CheckCircle size={14} /> Logo Upload Preview Ready
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ImageIcon size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>Upload a logo (PNG, SVG, JPG)</p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Action Buttons at Bottom */}
          <div className="form-row" style={{ marginTop: '1rem' }}>
            <div></div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.8rem 2.25rem', fontSize: '1rem', margin: 0 }}
                disabled={isSaving}
              >
                <Save size={18} />
                <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
