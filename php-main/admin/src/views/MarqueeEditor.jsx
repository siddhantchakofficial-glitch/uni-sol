import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Link as LinkIcon,
  Tag,
  Smile
} from 'lucide-react';
import { fetchMarqueeConfig, updateMarqueeConfig } from '../services/api';

const POPULAR_ICONS = [
  { label: 'License / ID', value: 'fa-id-card-clip' },
  { label: 'Handshake / Partner', value: 'fa-handshake' },
  { label: 'Certificate / Medal', value: 'fa-certificate' },
  { label: 'Star', value: 'fa-star' },
  { label: 'Award', value: 'fa-award' },
  { label: 'Map Location', value: 'fa-map-location-dot' },
  { label: 'Building / Shield', value: 'fa-building-shield' },
  { label: 'Check Circle', value: 'fa-circle-check' },
  { label: 'Lock / Security', value: 'fa-lock' },
  { label: 'Camera / CCTV', value: 'fa-video' },
  { label: 'User Shield', value: 'fa-user-shield' },
  { label: 'Phone', value: 'fa-phone' },
  { label: 'Globe', value: 'fa-globe' }
];

export default function MarqueeEditor({ onShowToast }) {
  const [enabled, setEnabled] = useState(true);
  const [speed, setSpeed] = useState(25);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#0f172a');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Item Modal / Form state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemText, setItemText] = useState('');
  const [itemIcon, setItemIcon] = useState('fa-star');
  const [customIconInput, setCustomIconInput] = useState('');
  const [itemLink, setItemLink] = useState('');
  const [itemBadge, setItemBadge] = useState('');
  const [itemActive, setItemActive] = useState(true);

  const loadConfig = async () => {
    setLoading(true);
    const res = await fetchMarqueeConfig();
    if (res.success && res.data) {
      setEnabled(res.data.enabled !== undefined ? res.data.enabled : true);
      setSpeed(res.data.speed || 25);
      setBgColor(res.data.bgColor || '#ffffff');
      setTextColor(res.data.textColor || '#0f172a');
      setItems(Array.isArray(res.data.items) ? res.data.items : []);
    } else {
      onShowToast('Notice: Loaded fallback Marquee data');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleOpenAddModal = () => {
    setEditingIndex(null);
    setItemText('');
    setItemIcon('fa-id-card-clip');
    setCustomIconInput('');
    setItemLink('');
    setItemBadge('');
    setItemActive(true);
    setShowItemModal(true);
  };

  const handleOpenEditModal = (index) => {
    const item = items[index];
    setEditingIndex(index);
    setItemText(item.text || '');
    if (POPULAR_ICONS.some(i => i.value === item.icon)) {
      setItemIcon(item.icon);
      setCustomIconInput('');
    } else {
      setItemIcon('custom');
      setCustomIconInput(item.icon || '');
    }
    setItemLink(item.link || '');
    setItemBadge(item.badge || '');
    setItemActive(item.isActive !== undefined ? item.isActive : true);
    setShowItemModal(true);
  };

  const handleSaveItemModal = (e) => {
    e.preventDefault();
    if (!itemText.trim()) {
      onShowToast('Please enter item text');
      return;
    }

    const finalIcon = itemIcon === 'custom' ? (customIconInput.trim() || 'fa-star') : itemIcon;

    const newItemObj = {
      text: itemText.trim(),
      icon: finalIcon,
      link: itemLink.trim(),
      badge: itemBadge.trim(),
      isActive: itemActive
    };

    if (editingIndex !== null) {
      // Edit existing item
      const updated = [...items];
      updated[editingIndex] = { ...updated[editingIndex], ...newItemObj };
      setItems(updated);
      onShowToast('Updated item in list (Click Save Changes to commit)');
    } else {
      // Add new item
      setItems([...items, newItemObj]);
      onShowToast('Added new item to list (Click Save Changes to commit)');
    }

    setShowItemModal(false);
  };

  const handleDeleteItem = (index) => {
    if (window.confirm(`Are you sure you want to delete "${items[index].text}"?`)) {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      onShowToast('Item removed from list');
    }
  };

  const handleToggleItemActive = (index) => {
    const updated = [...items];
    updated[index].isActive = !updated[index].isActive;
    setItems(updated);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setItems(updated);
  };

  const handleMoveDown = (index) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setItems(updated);
  };

  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const payload = {
      enabled,
      speed: Number(speed),
      bgColor,
      textColor,
      items
    };

    const res = await updateMarqueeConfig(payload);
    setIsSaving(false);

    if (res.success) {
      if (res.data) {
        setEnabled(res.data.enabled !== undefined ? res.data.enabled : true);
        setSpeed(res.data.speed || 25);
        setBgColor(res.data.bgColor || '#ffffff');
        setTextColor(res.data.textColor || '#0f172a');
        if (res.data.items) setItems(res.data.items);
      }
      onShowToast('Marquee settings & items saved successfully to backend!');
    } else {
      onShowToast(`Error saving marquee: ${res.message || 'Server error'}`);
    }
  };

  if (loading) {
    return (
      <div className="content-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading Marquee configuration from database...
      </div>
    );
  }

  const activeItems = items.filter(i => i.isActive !== false);

  return (
    <div className="content-card">
      {/* Header Bar */}
      <div className="content-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="card-title">
            <SlidersHorizontal size={20} color="var(--primary)" />
            Marquee Ticker Configuration
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Home Tab &gt; Section 1 &amp; Section 2 Marquee Ticker
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleSaveAll}
            className="btn-primary"
            style={{ margin: 0, padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
            disabled={isSaving}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="content-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Global Settings Box */}
        <div style={{
          backgroundColor: 'var(--bg-input)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--primary)" />
            Global Ticker Settings
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {/* Enable/Disable Toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</label>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-light)',
                  backgroundColor: enabled ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: enabled ? '#16a34a' : '#dc2626',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: 'fit-content'
                }}
              >
                {enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                <span>{enabled ? 'Visible / Active' : 'Hidden / Disabled'}</span>
              </button>
            </div>

            {/* Scroll Speed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Loop Speed ({speed} seconds)
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>

            {/* Background Color */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Background Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: '38px', height: '38px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  className="form-control"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Text Color */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Text Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: '38px', height: '38px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  className="form-control"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="#0f172a"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Box */}
        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Live Ticker Preview (Home Tab - Section 1 &amp; Section 2)
          </h3>
          <div style={{
            backgroundColor: bgColor,
            color: textColor,
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            position: 'relative'
          }}>
            {enabled ? (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {activeItems.length > 0 ? (
                  <div
                    key={`admin-preview-${speed}-${bgColor}-${textColor}-${activeItems.length}`}
                    style={{
                      display: 'inline-flex',
                      gap: '2.5rem',
                      whiteSpace: 'nowrap',
                      animation: `marquee ${speed}s linear infinite`
                    }}
                  >
                    {[...activeItems, ...activeItems, ...activeItems].map((item, idx) => (
                      <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
                        <i
                          className={`fa-solid ${item.icon}`}
                          style={{
                            color: textColor === '#ffffff' || textColor.toLowerCase() === '#fff' ? '#38bdf8' : '#0073b7',
                            fontSize: '0.9rem'
                          }}
                        ></i>
                        <span style={{ color: textColor }}>{item.text}</span>
                        {item.badge && (
                          <span style={{
                            fontSize: '0.65rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(0, 115, 183, 0.15)',
                            color: '#0073b7',
                            fontWeight: 800
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.85rem', fontStyle: 'italic', opacity: 0.7 }}>No active items selected</span>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', opacity: 0.6, fontSize: '0.85rem', fontStyle: 'italic' }}>
                Marquee is currently disabled / hidden from website
              </div>
            )}
          </div>
        </div>

        {/* Items List Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
              Marquee Items ({items.length})
            </h3>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="btn-primary"
              style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={16} />
              <span>Add New Item</span>
            </button>
          </div>

          {/* Table / List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1.25rem',
                  backgroundColor: item.isActive !== false ? 'var(--bg-card)' : 'var(--bg-input)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  opacity: item.isActive !== false ? 1 : 0.6,
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Info Left */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '220px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 115, 183, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0073b7',
                    fontWeight: 700,
                    shrink: 0
                  }}>
                    <i className={`fa-solid ${item.icon}`} style={{ fontSize: '1rem' }}></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>
                      {item.text}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Icon: {item.icon} {item.link ? ` | Link: ${item.link}` : ''}
                    </span>
                  </div>
                </div>

                {/* Actions Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Reorder Buttons */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    style={{ padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--border-light)', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === items.length - 1}
                    style={{ padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--border-light)', cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === items.length - 1 ? 0.3 : 1 }}
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>

                  {/* Active Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleItemActive(idx)}
                    style={{
                      padding: '0.35rem 0.6rem',
                      fontSize: '0.75rem',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: item.isActive !== false ? 'rgba(34, 197, 94, 0.15)' : 'rgba(156, 163, 175, 0.2)',
                      color: item.isActive !== false ? '#15803d' : '#4b5563',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {item.isActive !== false ? 'Active' : 'Disabled'}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(idx)}
                    style={{ padding: '0.35rem', borderRadius: '4px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', cursor: 'pointer' }}
                    title="Edit Item"
                  >
                    <Edit2 size={14} color="var(--primary)" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(idx)}
                    style={{ padding: '0.35rem', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', cursor: 'pointer' }}
                    title="Delete Item"
                  >
                    <Trash2 size={14} color="#dc2626" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save All Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={handleSaveAll}
            className="btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
            disabled={isSaving}
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>

      </div>

      {/* Item Edit/Add Modal */}
      {showItemModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="content-card" style={{ width: '480px', maxWidth: '90vw', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>
              {editingIndex !== null ? 'Edit Marquee Item' : 'Add New Marquee Item'}
            </h3>

            <form onSubmit={handleSaveItemModal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Item Text */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Item Text *</label>
                <input
                  type="text"
                  className="form-control"
                  value={itemText}
                  onChange={(e) => setItemText(e.target.value)}
                  placeholder="e.g., Licensed & UAE-Compliant"
                  required
                />
              </div>

              {/* Icon Select */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Select Icon</label>
                <select
                  className="form-control"
                  value={itemIcon}
                  onChange={(e) => setItemIcon(e.target.value)}
                >
                  {POPULAR_ICONS.map((ic, i) => (
                    <option key={i} value={ic.value}>{ic.label} ({ic.value})</option>
                  ))}
                  <option value="custom">Custom FontAwesome Class or Image URL</option>
                </select>
              </div>

              {/* Custom Icon Field */}
              {itemIcon === 'custom' && (
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Custom Icon Class / URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customIconInput}
                    onChange={(e) => setCustomIconInput(e.target.value)}
                    placeholder="e.g., fa-shield-halved or https://..."
                  />
                </div>
              )}

              {/* Optional Link */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Link URL (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={itemLink}
                  onChange={(e) => setItemLink(e.target.value)}
                  placeholder="e.g., /contact-us or https://..."
                />
              </div>

              {/* Active Switch */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="checkbox"
                  id="item-active-check"
                  checked={itemActive}
                  onChange={(e) => setItemActive(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="item-active-check" style={{ fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>
                  Item is Active / Visible
                </label>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="file-upload-btn"
                  onClick={() => setShowItemModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ margin: 0, padding: '0.5rem 1.25rem' }}
                >
                  {editingIndex !== null ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
