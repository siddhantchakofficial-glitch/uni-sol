import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit3, Shield, Image, BarChart3, Settings as SettingsIcon } from 'lucide-react';

export default function GenericSectionEditor({ sectionKey, title, onShowToast }) {
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e?.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onShowToast(`${title} changes saved successfully!`);
    }, 600);
  };

  // Render specific UI based on section
  if (sectionKey === 'website-users') {
    return (
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="card-title">User Management</h2>
          <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => onShowToast('Add user dialog opened')}>
            <Plus size={14} /> Add User
          </button>
        </div>
        <div className="content-card-body" style={{ padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Email</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Sumit Kumar</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>sumit.kumar@example.com</td>
                <td style={{ padding: '0.75rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem' }}>Super Admin</span></td>
                <td style={{ padding: '0.75rem' }}><span style={{ color: 'var(--success)' }}>Active</span></td>
                <td style={{ padding: '0.75rem' }}><Edit3 size={16} style={{ cursor: 'pointer', marginRight: '0.75rem' }} /><Trash2 size={16} style={{ cursor: 'pointer', color: 'var(--danger)' }} /></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Alexander Wright</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>alex.w@example.com</td>
                <td style={{ padding: '0.75rem' }}><span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--info)', fontSize: '0.75rem' }}>Editor</span></td>
                <td style={{ padding: '0.75rem' }}><span style={{ color: 'var(--success)' }}>Active</span></td>
                <td style={{ padding: '0.75rem' }}><Edit3 size={16} style={{ cursor: 'pointer', marginRight: '0.75rem' }} /><Trash2 size={16} style={{ cursor: 'pointer', color: 'var(--danger)' }} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (sectionKey === 'media') {
    return (
      <div className="content-card">
        <div className="content-card-header">
          <h2 className="card-title"><Image size={20} color="var(--primary)" /> Media Gallery</h2>
          <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => onShowToast('Media uploaded!')}>
            <Plus size={14} /> Upload Media
          </button>
        </div>
        <div className="content-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#000', borderRadius: 'var(--radius-md)', height: '140px', overflow: 'hidden', position: 'relative' }}>
              <video src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
              <span style={{ position: 'absolute', bottom: '6px', left: '6px', fontSize: '0.7rem', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px' }}>hero-video.mp4</span>
            </div>
            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)' }}>
              <Image size={28} color="var(--text-dim)" />
            </div>
            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-color)' }}>
              <Image size={28} color="var(--text-dim)" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-card">
      <div className="content-card-header">
        <h2 className="card-title">{title} Configuration</h2>
      </div>
      <div className="content-card-body">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-row">
            <label className="form-label">{title} Heading</label>
            <input type="text" className="form-control" defaultValue={`Manage ${title} content`} />
          </div>

          <div className="form-row">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={4} defaultValue={`Configure details for ${title} section.`} />
          </div>

          <div className="form-row">
            <div></div>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
