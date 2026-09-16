import { ENV } from '../config/env';

/**
 * Resolves any image URL to a clean, absolute or valid asset URL.
 * Handles:
 * - Vite imported bundled assets (pass through)
 * - Cloudinary and external URLs (pass through)
 * - Backend disk storage uploads (/uploads/...) -> prepends backend origin so Vercel renders it properly
 * - Empty / null fallbacks
 *
 * @param {string} url - Raw URL or path
 * @param {string} fallbackUrl - Fallback image if url is empty
 * @returns {string} Fully resolved image URL
 */
export const resolveMediaUrl = (url, fallbackUrl = '') => {
  if (!url || typeof url !== 'string') return fallbackUrl;

  const trimmed = url.trim();
  if (!trimmed) return fallbackUrl;

  // If already absolute http/https or data URL or blob URL
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // If it is a backend upload relative path e.g. /uploads/filename.jpg
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    // Strip trailing /api from API_BASE_URL to get the backend host origin
    const backendOrigin = (ENV.API_BASE_URL || 'http://localhost:5000/api')
      .replace(/\/api\/?$/, '')
      .replace(/\/+$/, '');
    return `${backendOrigin}${cleanPath}`;
  }

  // Regular frontend asset path (e.g. /assets/images/...)
  return trimmed;
};

export default resolveMediaUrl;
