import React, { useState, useRef } from 'react';
import { FaUpload, FaImage, FaTrash, FaSpinner, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { resolveMediaUrl } from '../../utils/mediaResolver';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * ImagePickerField provides:
 * 1. Direct file upload to backend /api/media
 * 2. Manual URL input (for Cloudinary / Unsplash / external CDN)
 * 3. Live thumbnail preview with error handling
 * 4. Clear / Reset actions
 */
export const ImagePickerField = ({
  label = 'Image / Photo',
  value = '',
  onChange,
  folder = 'content',
  placeholder = 'https://... or click Upload',
  helpText = 'Supports direct file upload (JPG, PNG, WebP) or custom image URL.',
}) => {
  const { token } = useAuth();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [copied, setCopied] = useState(false);

  const resolvedUrl = resolveMediaUrl(value);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch(`${API_BASE}/media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed (${res.statusText})`);
      }

      const json = await res.json();
      const newUrl = json.media?.url || json.url || '';
      if (newUrl) {
        onChange(newUrl);
      } else {
        throw new Error('No media URL returned by server');
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadError('');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Thumbnail Preview */}
        <div className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative group">
          {resolvedUrl ? (
            <img
              src={resolvedUrl}
              alt="Thumbnail preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <FaImage className="w-6 h-6 text-gray-300" />
          )}

          {resolvedUrl && (
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
              title="Open full size"
            >
              <FaExternalLinkAlt className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Input & Buttons */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0470aa] focus:border-transparent bg-white text-gray-800"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#0470aa] text-white hover:bg-[#035a88] transition-colors shrink-0 disabled:opacity-50"
              title="Upload image file to server"
            >
              {uploading ? (
                <>
                  <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FaUpload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </>
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-xl text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors shrink-0"
                title="Remove image"
              >
                <FaTrash className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {uploadError && (
            <p className="text-xs text-red-500 font-medium">{uploadError}</p>
          )}

          {helpText && !uploadError && (
            <p className="text-[11px] text-gray-400">{helpText}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePickerField;
