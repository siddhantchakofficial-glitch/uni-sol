import { useState, useEffect, useCallback } from 'react';
import { ENV } from '../config/env';

const API_BASE = ENV.API_BASE_URL || 'http://localhost:5000/api';

/**
 * Custom hook to dynamically fetch live CMS page content with zero layout shift.
 * Instantly provides defaultData while syncing with live published MongoDB content in background.
 *
 * Implements rapid production updates without manual code changes or redeployments:
 * - Query parameter cache busting (?_t=...) and cache: 'no-cache'
 * - Auto-revalidation on window focus
 * - Auto-revalidation on BroadcastChannel / localStorage 'unisol_cms_published' message
 * - Periodic background revalidation every 60s when the page is active
 *
 * @param {string} slug - Unique page slug ('home', 'about', 'capabilities', 'industries', 'contact', etc.)
 * @param {object} defaultData - Fallback default schema for the page
 */
export const useCMS = (slug, defaultData = {}) => {
  const [content, setContent] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async (isBackground = false) => {
    if (!slug) return;
    try {
      const res = await fetch(`${API_BASE}/pages/public/${slug}?_t=${Date.now()}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.page?.content && Object.keys(json.page.content).length > 0) {
          setContent((prev) => ({
            ...prev,
            ...json.page.content,
          }));
          setError(null);
        }
      }
    } catch (err) {
      if (!isBackground) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // Initial fetch
    fetchContent();

    // Revalidate on tab focus
    const handleFocus = () => {
      fetchContent(true);
    };
    window.addEventListener('focus', handleFocus);

    // Cross-tab real-time revalidation using BroadcastChannel or Storage event
    let channel;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel('unisol_cms_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'PUBLISH' && (!event.data.slug || event.data.slug === slug)) {
            fetchContent(true);
          }
        };
      }
    } catch {
      // Fallback
    }

    const handleStorage = (e) => {
      if (e.key === 'unisol_cms_update') {
        fetchContent(true);
      }
    };
    window.addEventListener('storage', handleStorage);

    // Periodic gentle revalidation when page is visible (every 60s)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchContent(true);
      }
    }, 60000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
      if (channel) {
        channel.close();
      }
    };
  }, [fetchContent, slug]);

  return { content, loading, error, refresh: () => fetchContent(false) };
};

/**
 * Utility function to broadcast publish events to all listening tabs
 */
export const notifyCMSPublish = (slug) => {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('unisol_cms_channel');
      channel.postMessage({ type: 'PUBLISH', slug, timestamp: Date.now() });
      channel.close();
    }
    localStorage.setItem('unisol_cms_update', String(Date.now()));
  } catch {
    // Ignore if restricted in iframe
  }
};

export default useCMS;
