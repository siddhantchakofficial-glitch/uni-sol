/**
 * Google Website Translator integration helpers (Method 1 — Website Element).
 *
 * How it works:
 *  1. index.html loads //translate.google.com/translate_a/element.js with a
 *     hidden container. The default (non-SIMPLE) layout renders a hidden
 *     <select class="goog-te-combo"> we can drive programmatically.
 *  2. changeGoogleTranslate() drives the hidden .goog-te-combo select with a
 *     change event — Google then translates the whole DOM, watching for
 *     future mutations (SPA route changes included).
 *  3. restoreGoogleTranslate() re-applies the stored language on page load,
 *     covering hard reloads.
 *
 * Persistence: the selected language is kept in localStorage under
 * 'site_language' (see LanguageContext). The googtrans cookie is only ever
 * written AFTER the widget has initialized (combo present) and is cleared
 * again before element.js loads (index.html) — a cookie present at widget
 * init puts Google's engine into a pre-restored state that never translates
 * and ignores later combo changes.
 */

export const PAGE_LANGUAGE = 'en';
const STORAGE_KEY = 'site_language';
const COOKIE_NAME = 'googtrans';

const getStoredLanguage = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || PAGE_LANGUAGE;
  } catch {
    return PAGE_LANGUAGE;
  }
};

/** True when Google Translate is currently active (non-English). */
export const isTranslationActive = () =>
  typeof document !== 'undefined' &&
  document.documentElement.classList.contains('translated-ltr') &&
  getStoredLanguage() !== PAGE_LANGUAGE;

/** Currently active target language (from localStorage, or 'en'). */
export const getActiveLanguage = () => getStoredLanguage();

const setCookie = (value) => {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  document.cookie = `${COOKIE_NAME}=${value}; path=/;`;
  if (hostname) {
    document.cookie = `${COOKIE_NAME}=${value}; domain=.${hostname}; path=/;`;
  }
};

const clearCookie = () => {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  const expired = `=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${COOKIE_NAME}${expired}`;
  if (hostname) {
    document.cookie = `${COOKIE_NAME}${expired}; domain=.${hostname}`;
  }
};

/**
 * Google wraps translated text nodes in <font style="vertical-align: ...">
 * elements. Their presence is the definitive signal that the engine actually
 * processed the page (the translated-ltr class alone is NOT enough — the
 * engine sets it even when it swallows a change event).
 */
const hasTranslatedContent = () =>
  typeof document !== 'undefined' &&
  document.querySelectorAll('font[style*="vertical-align"]').length > 0;

/** Supersedes in-flight switch loops when the user changes language rapidly. */
let activeSwitchSeq = 0;

/**
 * Programmatically switch Google Translate's target language.
 *
 * Switching TO a language: drive the hidden .goog-te-combo select. The
 * engine's change-handler is attached *after* the combo renders, so a single
 * dispatch can be swallowed — we re-dispatch at intervals until Google
 * actually wraps content in <font> tags (see hasTranslatedContent).
 *
 * Switching BACK to English: Google's widget offers no supported un-translate
 * (its combo has no empty option). We clear the cookie and reload — the fresh
 * engine initializes untranslated, and restoreGoogleTranslate() no-ops for
 * 'en', so that reload cannot loop.
 *
 * If the combo never appears for a target-language switch (Google tears its
 * gadget down after SPA route changes), a reload re-initializes everything.
 *
 * @param {string} langCode  Target language (e.g. 'es'), or 'en' to restore.
 * @param {{ reloadOnFail?: boolean, maxAttempts?: number }} [options]
 */
export const changeGoogleTranslate = (langCode, options = {}) => {
  const { reloadOnFail = true, maxAttempts = 20 } = options;
  if (typeof window === 'undefined') return;

  const isEn = !langCode || langCode === PAGE_LANGUAGE;
  const seq = ++activeSwitchSeq;

  if (isEn) {
    // Fresh page, no cookie, no restore → pristine English.
    clearCookie();
    window.location.reload();
    return;
  }

  const target = langCode;

  // Start from a clean slate so any widget created afterwards is pristine.
  clearCookie();

  const attempt = () => {
    // A later user switch superseded this loop — stop.
    if (seq !== activeSwitchSeq) return true;
    const select = document.querySelector('.goog-te-combo');
    if (!select) return false;

    // Persist the cookie only once the widget is confirmed initialized:
    // a cookie existing at element.js init triggers Google's pre-restored
    // dead state (engine active but never translates).
    setCookie(`/en/${target}`);
    select.value = target;
    select.dispatchEvent(new Event('change'));

    // Success = the engine actually processed the page (<font> wrappers).
    return hasTranslatedContent();
  };

  if (attempt()) return;

  let attempts = 0;
  const timer = setInterval(() => {
    if (attempt()) {
      clearInterval(timer);
      return;
    }
    if (++attempts >= maxAttempts) {
      clearInterval(timer);
      if (reloadOnFail) window.location.reload();
    }
  }, 250);
};

/**
 * Re-apply the stored language on first page load so translation survives
 * reloads. Must run after element.js has rendered the combo — index.html
 * clears the googtrans cookie before the engine initializes, so the gadget
 * starts clean and an explicit combo dispatch reliably triggers translation.
 * No reload on failure (e.g. translate.google.com blocked): site stays English.
 */
export const restoreGoogleTranslate = () => {
  const active = getStoredLanguage();
  if (active !== PAGE_LANGUAGE) {
    changeGoogleTranslate(active, { reloadOnFail: false, maxAttempts: 60 });
  }
};
