import React, { useState, useEffect, useRef } from 'react';
import {
  Upload, Image as ImageIcon, Film, Trash2, Copy, Check, Search,
  FolderOpen, RefreshCw, X, ExternalLink, Grid, List, Plus, AlertCircle
} from 'lucide-react';
import { fetchMedia, uploadMedia, deleteMedia } from '../services/api';

const FOLDERS = ['general', 'heroes', 'logos', 'sections', 'icons', 'team', 'partners'];

const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function MediaLibrary({ onShowToast }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeFolder, setActiveFolder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef();
  const dropZoneRef = useRef();

  const loadMedia = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (activeFolder) params.folder = activeFolder;
      if (searchQuery) params.search = searchQuery;
      const res = await fetchMedia(params);
      if (res.success) {
        setMedia(res.media || []);
      } else {
        setError(res.message || 'Failed to load media.');
      }
    } catch {
      setError('Could not connect to media API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFolder]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadMedia();
  };

  const doUpload = async (files) => {
    if (!files || !files.length) return;
    setUploading(true);
    setUploadProgress(0);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(Math.round(((i) / files.length) * 100));
      const res = await uploadMedia(file, activeFolder || 'general', file.name);
      if (res.success) {
        successCount++;
      } else {
        onShowToast(`⚠️ Failed: ${file.name} — ${res.message}`);
      }
    }
    setUploadProgress(100);
    setUploading(false);
    if (successCount > 0) {
      onShowToast(`✅ ${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully!`);
      loadMedia();
    }
  };

  const handleFileChange = (e) => doUpload(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) doUpload(files);
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      onShowToast('URL copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = async (item) => {
    const res = await deleteMedia(item._id || item.id);
    setDeleteConfirm(null);
    if (res.success) {
      setMedia((prev) => prev.filter((m) => (m._id || m.id) !== (item._id || item.id)));
      if (selectedMedia && (selectedMedia._id || selectedMedia.id) === (item._id || item.id)) {
        setSelectedMedia(null);
      }
      onShowToast('Media deleted.');
    } else {
      onShowToast(`Delete failed: ${res.message}`);
    }
  };

  const isImage = (m) => m.mimeType?.startsWith('image/');
  const isVideo = (m) => m.mimeType?.startsWith('video/');

  const filtered = media.filter((m) =>
    searchQuery
      ? (m.originalName || m.filename || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div style={{ display: 'flex', gap: '1.25rem', height: '100%' }}>
      {/* ── Left Panel ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>

        {/* Upload Zone */}
        <div
          ref={dropZoneRef}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="content-card"
          style={{
            border: `2px dashed ${isDragging ? 'var(--primary)' : 'var(--border-light)'}`,
            background: isDragging ? 'var(--primary-light)' : 'var(--bg-input)',
            cursor: uploading ? 'wait' : 'pointer',
            padding: '1.5rem',
            textAlign: 'center',
            transition: 'var(--transition)',
            flexShrink: 0,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {uploading ? (
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Uploading… {uploadProgress}%
              </div>
              <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--primary)', transition: 'width 0.3s ease', borderRadius: 'var(--radius-full)' }} />
              </div>
            </div>
          ) : (
            <div>
              <Upload size={28} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                {isDragging ? 'Drop files here' : 'Click or drag to upload'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Images &amp; videos up to 20MB each
              </p>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="content-card" style={{ padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, minWidth: '180px', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by filename…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2rem', margin: 0 }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ padding: '0.5rem 0.9rem', margin: 0 }}>
                Search
              </button>
            </form>

            {/* Folder Filter */}
            <select
              className="form-control"
              value={activeFolder}
              onChange={(e) => setActiveFolder(e.target.value)}
              style={{ width: 'auto', margin: 0 }}
            >
              <option value="">All Folders</option>
              {FOLDERS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            {/* View Mode */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                className={`header-icon-btn ${viewMode === 'grid' ? 'active' : ''}`}
                style={{ background: viewMode === 'grid' ? 'var(--primary-light)' : 'transparent', color: viewMode === 'grid' ? 'var(--primary)' : undefined }}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                className={`header-icon-btn ${viewMode === 'list' ? 'active' : ''}`}
                style={{ background: viewMode === 'list' ? 'var(--primary-light)' : 'transparent', color: viewMode === 'list' ? 'var(--primary)' : undefined }}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <List size={16} />
              </button>
            </div>

            <button className="header-icon-btn" onClick={loadMedia} title="Refresh" disabled={loading}>
              <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.875rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Media Grid / List */}
        <div className="content-card" style={{ flex: 1, overflow: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem', color: 'var(--primary)' }} />
              <p>Loading media…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <FolderOpen size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>No media found</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Upload files using the panel above</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', padding: '1rem' }}>
              {filtered.map((item) => {
                const id = item._id || item.id;
                const isSelected = selectedMedia && (selectedMedia._id || selectedMedia.id) === id;
                return (
                  <div
                    key={id}
                    onClick={() => setSelectedMedia(isSelected ? null : item)}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                      background: 'var(--bg-input)',
                      transition: 'var(--transition)',
                      position: 'relative',
                    }}
                  >
                    <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {isImage(item) ? (
                        <img src={item.url} alt={item.altText || item.originalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      ) : isVideo(item) ? (
                        <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                      ) : (
                        <ImageIcon size={32} color="var(--text-dim)" />
                      )}
                    </div>
                    <div style={{ padding: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.15rem' }}>
                        {item.originalName || item.filename}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{formatFileSize(item.size)}</p>
                    </div>
                    {/* Action buttons on hover */}
                    <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopyUrl(item.url, id); }}
                        style={{ padding: '4px', background: 'rgba(0,0,0,0.7)', borderRadius: '6px', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
                        title="Copy URL"
                      >
                        {copiedId === id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(item); }}
                        style={{ padding: '4px', background: 'rgba(239,68,68,0.8)', borderRadius: '6px', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600 }}>Preview</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Filename</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Folder</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Size</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const id = item._id || item.id;
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid var(--border-color)' }}
                      onClick={() => setSelectedMedia(item)}
                    >
                      <td style={{ padding: '0.5rem 1rem' }}>
                        <div style={{ width: '48px', height: '36px', borderRadius: '6px', overflow: 'hidden', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isImage(item) ? (
                            <img src={item.url} alt={item.altText} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : isVideo(item) ? (
                            <Film size={18} color="var(--text-dim)" />
                          ) : (
                            <ImageIcon size={18} color="var(--text-dim)" />
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem', fontWeight: 500 }}>
                        {item.originalName || item.filename}
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>
                        {item.folder || '—'}
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>
                        {formatFileSize(item.size)}
                      </td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={(e) => { e.stopPropagation(); handleCopyUrl(item.url, id); }} className="header-icon-btn" title="Copy URL">
                            {copiedId === id ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                          </button>
                          <a href={item.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="header-icon-btn" title="Open in new tab">
                            <ExternalLink size={14} />
                          </a>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(item); }} className="header-icon-btn" style={{ color: 'var(--danger)' }} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Right Panel: Selected Item Detail ── */}
      {selectedMedia && (
        <div className="content-card" style={{ width: '260px', flexShrink: 0, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>File Details</h3>
            <button onClick={() => setSelectedMedia(null)} className="header-icon-btn"><X size={15} /></button>
          </div>

          {/* Preview */}
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-input)', border: '1px solid var(--border-color)', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isImage(selectedMedia) ? (
              <img src={selectedMedia.url} alt={selectedMedia.altText} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : isVideo(selectedMedia) ? (
              <video src={selectedMedia.url} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
            ) : (
              <ImageIcon size={36} color="var(--text-dim)" />
            )}
          </div>

          {/* Info */}
          {[
            { label: 'Filename', value: selectedMedia.originalName || selectedMedia.filename },
            { label: 'Type', value: selectedMedia.mimeType || '—' },
            { label: 'Size', value: formatFileSize(selectedMedia.size) },
            { label: 'Folder', value: selectedMedia.folder || '—' },
            { label: 'Alt Text', value: selectedMedia.altText || '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>{label}</p>
              <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{value}</p>
            </div>
          ))}

          {/* URL with Copy */}
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>URL</p>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                className="form-control"
                value={selectedMedia.url}
                readOnly
                style={{ fontSize: '0.7rem', padding: '0.3rem 0.5rem', margin: 0 }}
              />
              <button
                onClick={() => handleCopyUrl(selectedMedia.url, selectedMedia._id || selectedMedia.id)}
                className="btn-primary"
                style={{ padding: '0.3rem 0.6rem', margin: 0, flexShrink: 0 }}
                title="Copy URL"
              >
                {copiedId === (selectedMedia._id || selectedMedia.id) ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <a href={selectedMedia.url} target="_blank" rel="noreferrer" className="file-upload-btn" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
              <ExternalLink size={14} /> Open
            </a>
            <button onClick={() => setDeleteConfirm(selectedMedia)} className="file-upload-btn" style={{ flex: 1, color: 'var(--danger)', borderColor: 'var(--danger)' }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="content-card" style={{ width: '360px', maxWidth: '90vw', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Delete Media?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Are you sure you want to permanently delete <strong>{deleteConfirm.originalName || deleteConfirm.filename}</strong>? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="file-upload-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button
                className="btn-primary"
                style={{ background: 'var(--danger)', margin: 0, padding: '0.5rem 1rem' }}
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
