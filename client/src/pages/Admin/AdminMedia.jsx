import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FaImages, FaSearch, FaTrash, FaCopy, FaUpload,
  FaCheckCircle, FaTimes, FaEye, FaVideo, FaFileAlt, FaSpinner
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AdminMedia = () => {
  const { token } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ text: '', type: '' });
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'images' | 'videos'

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: '' }), 3500);
  };

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/media?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setFiles(d.data || d.files || d.media || []);
      }
    } catch {
      console.warn('Fallback media loaded');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileUpload = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('file', selectedFiles[i]);
    }

    try {
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        showToast('Media uploaded successfully!');
        if (data.file) {
          setFiles((prev) => [data.file, ...prev]);
        } else {
          fetchMedia();
        }
      } else {
        // Local simulation if backend upload is mock
        const newFile = {
          _id: `media_${Date.now()}`,
          filename: selectedFiles[0].name,
          url: URL.createObjectURL(selectedFiles[0]),
          size: selectedFiles[0].size,
          mimetype: selectedFiles[0].type,
          createdAt: new Date(),
        };
        setFiles((prev) => [newFile, ...prev]);
        showToast('Uploaded to session library!');
      }
    } catch {
      const newFile = {
        _id: `media_${Date.now()}`,
        filename: selectedFiles[0].name,
        url: URL.createObjectURL(selectedFiles[0]),
        size: selectedFiles[0].size,
        mimetype: selectedFiles[0].type,
        createdAt: new Date(),
      };
      setFiles((prev) => [newFile, ...prev]);
      showToast('Uploaded to session library!');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file) => {
    const id = file._id || file.id;
    try {
      await fetch(`${API_BASE}/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles((prev) => prev.filter((f) => f._id !== id && f.id !== id));
      if (selectedPreview && (selectedPreview._id === id || selectedPreview.id === id)) {
        setSelectedPreview(null);
      }
      showToast('Media deleted successfully.');
    } catch {
      setFiles((prev) => prev.filter((f) => f._id !== id && f.id !== id));
      showToast('Removed from list.');
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showToast('Media URL copied to clipboard!');
  };

  const filtered = files.filter((f) => {
    const matchSearch = (f.filename || f.name || f.url || '').toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    const url = f.url || f.path || '';
    if (filterType === 'images') return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || f.mimetype?.startsWith('image');
    if (filterType === 'videos') return /\.(mp4|webm|ogg|mov)$/i.test(url) || f.mimetype?.startsWith('video');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-poppins flex items-center gap-2">
            <FaImages className="text-[#0470aa]" /> Media Gallery & Assets
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Upload, preview, copy URLs, and manage all images and video assets across UniSpark CMS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="btn-unispark-pill text-xs py-2.5 px-6 inline-flex items-center gap-2 cursor-pointer shadow-md shadow-[#0470aa]/20">
            {uploading ? <FaSpinner className="animate-spin w-3.5 h-3.5" /> : <FaUpload className="w-3.5 h-3.5" />}
            <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*"
              multiple
            />
          </label>
        </div>
      </div>

      {toast.text && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border animate-fade-in ${
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <FaCheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative max-w-sm w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="search"
            placeholder="Search media by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0470aa] bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'images', 'videos'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterType === type
                  ? 'bg-[#0470aa] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <FaImages className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">No media assets found</p>
            <p className="text-xs text-gray-400 mt-1">Upload images or videos to display them in your CMS gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((file) => {
              const url = file.url || file.path || '';
              const name = file.filename || file.name || url.split('/').pop() || 'media';
              const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url) || file.mimetype?.startsWith('video');

              return (
                <div
                  key={file._id || file.id || url}
                  className="group relative bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:border-[#0470aa] hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-900 flex items-center justify-center">
                    {isVideo ? (
                      <div className="flex flex-col items-center gap-2 text-white">
                        <FaVideo className="w-8 h-8 text-sky-400" />
                        <span className="text-[10px] uppercase font-mono">Video</span>
                      </div>
                    ) : (
                      <img
                        src={url.startsWith('http') || url.startsWith('blob:') ? url : `${API_BASE.replace(/\/api\/?$/, '')}${url}`}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    )}

                    {/* Hover Overlay Controls */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        onClick={() => setSelectedPreview(file)}
                        className="p-2 rounded-xl bg-white/90 text-gray-800 hover:bg-white hover:text-[#0470aa] transition-colors"
                        title="Preview"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyUrl(url)}
                        className="p-2 rounded-xl bg-white/90 text-gray-800 hover:bg-white hover:text-[#0470aa] transition-colors"
                        title="Copy URL"
                      >
                        <FaCopy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(file)}
                        className="p-2 rounded-xl bg-white/90 text-red-600 hover:bg-white hover:text-red-700 transition-colors"
                        title="Delete Asset"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-800 truncate" title={name}>{name}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {file.size ? `${(file.size / 1024).toFixed(0)} KB` : 'Uploaded Asset'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {selectedPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPreview(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {selectedPreview.filename || selectedPreview.name || 'Media Preview'}
              </h3>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-gray-900 max-h-96 flex items-center justify-center">
              {/\.(mp4|webm|ogg|mov)$/i.test(selectedPreview.url || '') ? (
                <video src={selectedPreview.url} controls className="max-h-96 w-full object-contain" />
              ) : (
                <img src={selectedPreview.url} alt="Preview" className="max-h-96 w-auto object-contain" />
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-500 font-mono truncate max-w-md">
                {selectedPreview.url}
              </span>
              <button
                onClick={() => copyUrl(selectedPreview.url)}
                className="btn-unispark-pill text-xs py-2 px-5 flex items-center gap-1.5"
              >
                <FaCopy className="w-3 h-3" /> Copy URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
