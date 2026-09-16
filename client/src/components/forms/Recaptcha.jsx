import React, { useEffect, useRef, useState } from 'react';

/**
 * Google reCAPTCHA v2 checkbox widget.
 *
 * - Renders Google's "I'm not a robot" checkbox into a themed container.
 * - onChange(v) fires with the response token when the user completes it,
 *   and with ''/undefined when it resets or expires.
 * - The container class (notranslate) keeps Google's own markup out of the
 *   website translator pipeline.
 *
 * Site key comes from VITE_RECAPTCHA_SITE_KEY. When it is not configured the
 * component renders nothing and the form falls back to server-side
 * honeypot/rate-limit protection (see submissionRoutes).
 */
export const Recaptcha = ({ onChange, className = '' }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== 'undefined' && !!window.grecaptcha
  );
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

  // Load the reCAPTCHA script once (page-level singleton).
  useEffect(() => {
    if (!siteKey || scriptReady) return;
    if (document.querySelector('script[data-recaptcha="true"]')) {
      // Script tag exists but may still be loading — wait for grecaptcha.
      const timer = setInterval(() => {
        if (window.grecaptcha) {
          clearInterval(timer);
          setScriptReady(true);
        }
      }, 200);
      return () => clearInterval(timer);
    }
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'true';
    script.onload = () => setScriptReady(true);
    document.head.appendChild(script);
  }, [siteKey, scriptReady]);

  // Render the widget once the script is ready.
  useEffect(() => {
    if (!siteKey || !scriptReady || !containerRef.current) return;
    if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') return;

    // Avoid double-render (React 18 StrictMode double-invokes effects).
    if (widgetIdRef.current !== null) return;

    try {
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        callback: (token) => onChange && onChange(token || ''),
        'expired-callback': () => onChange && onChange(''),
        'error-callback': () => onChange && onChange(''),
      });
    } catch {
      // Render race (already rendered) — ignore.
    }
  }, [siteKey, scriptReady, onChange]);

  // Cleanup on unmount.
  useEffect(() => () => {
    if (
      widgetIdRef.current !== null &&
      window.grecaptcha &&
      typeof window.grecaptcha.reset === 'function'
    ) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch {
        // Widget already gone (page navigation) — ignore.
      }
    }
  }, []);

  if (!siteKey) return null;

  return (
    <div className={`flex justify-center sm:justify-start ${className}`}>
      <div ref={containerRef} className="notranslate min-h-[78px]" />
    </div>
  );
};

export default Recaptcha;
