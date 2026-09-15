import { useState, useEffect, useCallback } from 'react';
import { ENV } from '../config/env';

const API_BASE = ENV.API_BASE_URL || 'http://localhost:5000/api';

/**
 * Custom hook to dynamically fetch live CMS page content with zero layout shift.
 * Instantly provides defaultData while syncing with live published MongoDB content in background.
 *
 * @param {string} slug - Unique page slug ('home', 'about', 'capabilities', 'industries', 'contact')
 * @param {object} defaultData - Fallback default schema for the page
 */
export const useCMS = (slug, defaultData = {}) => {
  const [content, setContent] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    if (!slug) return;
    try {
      const res = await fetch(`${API_BASE}/pages/public/${slug}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.page?.content && Object.keys(json.page.content).length > 0) {
          setContent((prev) => ({
            ...prev,
            ...json.page.content,
          }));
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refresh: fetchContent };
};

export default useCMS;
