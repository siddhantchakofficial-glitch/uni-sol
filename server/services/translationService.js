import crypto from 'crypto';
import TranslationCache from '../models/TranslationCache.js';

/**
 * 32 Supported Languages Dictionary
 * Master language: English ('en')
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', isMaster: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', dir: 'ltr' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', dir: 'ltr' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', dir: 'ltr' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', dir: 'ltr' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', dir: 'ltr' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', dir: 'rtl' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', dir: 'ltr' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', dir: 'ltr' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', dir: 'ltr' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', dir: 'ltr' },
];

/**
 * Hash generator for translation cache keying
 */
const hashText = (text) => {
  return crypto.createHash('sha256').update(String(text).trim()).digest('hex');
};

/**
 * Inspects whether a string should be translated.
 * STRICTLY PRESERVES:
 * - Images & assets (.png, .jpg, .svg, .webp, .mp4, etc.)
 * - URLs, paths & links (http://, https://, /about, mailto:, tel:)
 * - Numbers & stats (10M+, 100+, 24/7, 99.9%, +91...)
 * - System IDs (stat_1, hero_1, gc_1)
 * - Icons (FaBullseye, FaEye, etc.)
 * - Code, keys, and CSS colors (#fff, rgba)
 */
export const isTranslatable = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length < 2) return false;

  // Numbers, stats & metrics (e.g. 10M+, 500+, 24/7, 99.99%, 100%, +91...)
  if (/^[\d\s.,+/%$€£¥xX\-–—]+$/.test(trimmed)) return false;
  if (/^\+?\d[\d\s-]{4,}$/.test(trimmed)) return false;

  // URLs, relative routes, emails, and phone links
  if (/^(https?:\/\/|\/|mailto:|tel:|#)/i.test(trimmed)) return false;

  // Image & file extensions
  if (/\.(png|jpe?g|svg|webp|gif|ico|pdf|mp4|webm)$/i.test(trimmed)) return false;

  // React Icons names (e.g. FaBullseye, FaEye, MdSecurity, HiHome)
  if (/^(Fa|Io|Bs|Md|Fi|Ai|Ri|Bi|Ti|Vsc|Gi)[A-Z][A-Za-z0-9]+$/.test(trimmed)) return false;

  // Internal keys / IDs (e.g. stat_12345, sec_hero, gc_1, etc.)
  if (/^[a-z0-9_-]+_[0-9a-z_-]+$/i.test(trimmed) && !trimmed.includes(' ')) return false;

  // Hex colors
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) return false;

  return true;
};

/**
 * In-memory fallback dictionary for standard UI phrases and fallback translation generator
 */
const COMMON_FALLBACKS = {
  es: { 'About Us': 'Sobre Nosotros', 'Our Story': 'Nuestra Historia', 'Contact': 'Contacto' },
  fr: { 'About Us': 'À Propos de Nous', 'Our Story': 'Notre Histoire', 'Contact': 'Contact' },
  de: { 'About Us': 'Über Uns', 'Our Story': 'Unsere Geschichte', 'Contact': 'Kontakt' },
  it: { 'About Us': 'Chi Siamo', 'Our Story': 'La Nostra Storia', 'Contact': 'Contatti' },
  pt: { 'About Us': 'Sobre Nós', 'Our Story': 'Nossa História', 'Contact': 'Contato' },
  ru: { 'About Us': 'О Нас', 'Our Story': 'Наша История', 'Contact': 'Контакты' },
  zh: { 'About Us': '关于我们', 'Our Story': '我们的故事', 'Contact': '联系我们' },
  ja: { 'About Us': '会社概要', 'Our Story': '沿革', 'Contact': 'お問い合わせ' },
  ar: { 'About Us': 'من نحن', 'Our Story': 'قصتنا', 'Contact': 'اتصل بنا' },
  hi: { 'About Us': 'हमारे बारे में', 'Our Story': 'हमारी कहानी', 'Contact': 'संपर्क करें' },
  ur: { 'About Us': 'ہمارے بارے میں', 'Our Story': 'ہماری کہانی', 'Contact': 'ہم سے رابطہ کریں' },
};

/**
 * Fallback translator when Google Translation API key is not configured or in offline dev mode
 */
const fallbackTranslate = (text, targetLang) => {
  if (COMMON_FALLBACKS[targetLang]?.[text]) {
    return COMMON_FALLBACKS[targetLang][text];
  }
  // Resilient tag representation for testing without crashing
  return `[${targetLang.toUpperCase()}] ${text}`;
};

/**
 * Calls Google Cloud Translation API v2 via standard HTTP POST
 * Never exposes the key to client.
 */
const callGoogleTranslateAPI = async (strings, targetLang, apiKey) => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: strings,
      target: targetLang,
      source: 'en',
      format: 'text',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Cloud Translation API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const translations = data.data?.translations;
  if (!translations || !Array.isArray(translations)) {
    throw new Error('Malformed response from Google Cloud Translation API');
  }

  return translations.map((t) => t.translatedText);
};

/**
 * Batch translate a list of strings into a single target language
 * Checks MongoDB cache first, calls Google API for misses, then updates cache.
 */
export const translateBatch = async (strings, targetLang) => {
  if (!strings || strings.length === 0) return {};
  if (targetLang === 'en') {
    const identical = {};
    strings.forEach((s) => { identical[s] = s; });
    return identical;
  }

  const resultMap = {};
  const uncachedStrings = [];
  const hashMap = {};

  // 1. Check MongoDB cache
  for (const text of strings) {
    const h = hashText(text);
    hashMap[text] = h;
    try {
      const cached = await TranslationCache.findOne({ hash: h, targetLang });
      if (cached && cached.translatedText) {
        resultMap[text] = cached.translatedText;
      } else {
        uncachedStrings.push(text);
      }
    } catch {
      uncachedStrings.push(text);
    }
  }

  // 2. Fetch uncached strings from Google Cloud Translation API
  if (uncachedStrings.length > 0) {
    const apiKey = process.env.GOOGLE_TRANSLATION_API_KEY;

    if (apiKey && apiKey.trim()) {
      try {
        // Batch in chunks of 50 to stay within request boundaries
        const chunkSize = 50;
        for (let i = 0; i < uncachedStrings.length; i += chunkSize) {
          const chunk = uncachedStrings.slice(i, i + chunkSize);
          const translatedList = await callGoogleTranslateAPI(chunk, targetLang, apiKey);

          for (let j = 0; j < chunk.length; j++) {
            const original = chunk[j];
            const translated = translatedList[j] || original;
            resultMap[original] = translated;

            // Save to cache in background
            TranslationCache.updateOne(
              { hash: hashMap[original], targetLang },
              {
                hash: hashMap[original],
                sourceText: original,
                targetLang,
                translatedText: translated,
                service: 'google',
              },
              { upsert: true }
            ).catch(() => {});
          }
        }
      } catch (apiErr) {
        console.warn(`[Google Translation API Warning]: ${apiErr.message}. Utilizing fallback.`);
        // Fallback for failed strings
        for (const str of uncachedStrings) {
          if (!resultMap[str]) {
            resultMap[str] = fallbackTranslate(str, targetLang);
          }
        }
      }
    } else {
      // Fallback translation when API key is not supplied
      for (const str of uncachedStrings) {
        resultMap[str] = fallbackTranslate(str, targetLang);
      }
    }
  }

  return resultMap;
};

/**
 * Extracts all translatable strings from an arbitrary nested object/array
 */
const collectTranslatableStrings = (node, acc = new Set()) => {
  if (node === null || node === undefined) return acc;

  if (typeof node === 'string') {
    if (isTranslatable(node)) {
      acc.add(node);
    }
  } else if (Array.isArray(node)) {
    for (const item of node) {
      collectTranslatableStrings(item, acc);
    }
  } else if (typeof node === 'object') {
    for (const [key, val] of Object.entries(node)) {
      // Skip certain administrative keys
      if (['id', '_id', 'icon', 'url', 'link', 'path', 'href', 'imageUrl', 'videoUrl'].includes(key)) {
        continue;
      }
      collectTranslatableStrings(val, acc);
    }
  }

  return acc;
};

/**
 * Replaces translatable strings in an arbitrary nested object/array using translation map
 */
const replaceTranslatableStrings = (node, translationMap) => {
  if (node === null || node === undefined) return node;

  if (typeof node === 'string') {
    if (isTranslatable(node) && translationMap[node]) {
      return translationMap[node];
    }
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((item) => replaceTranslatableStrings(item, translationMap));
  }

  if (typeof node === 'object') {
    const clone = {};
    for (const [key, val] of Object.entries(node)) {
      if (['id', '_id', 'icon', 'url', 'link', 'path', 'href', 'imageUrl', 'videoUrl'].includes(key)) {
        clone[key] = val;
      } else {
        clone[key] = replaceTranslatableStrings(val, translationMap);
      }
    }
    return clone;
  }

  return node;
};

/**
 * Translates a complete content schema into a specific target language
 */
export const translateContent = async (content, targetLang) => {
  if (!content || typeof content !== 'object') return content;
  if (targetLang === 'en') return content;

  // 1. Collect all translatable strings
  const stringSet = collectTranslatableStrings(content);
  const strings = Array.from(stringSet);

  if (strings.length === 0) {
    return JSON.parse(JSON.stringify(content));
  }

  // 2. Batch translate strings
  const translationMap = await translateBatch(strings, targetLang);

  // 3. Rebuild deep cloned object
  return replaceTranslatableStrings(content, translationMap);
};

/**
 * Translates page content into all 32 supported languages (excluding master 'en')
 * Returns a translations map: { [langCode]: { content, translatedAt } }
 */
export const translatePageToAllLanguages = async (content, onProgress = null) => {
  const translations = {};
  const targetLanguages = SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en');

  // Pre-collect all translatable strings from the English content once
  const stringSet = collectTranslatableStrings(content);
  const strings = Array.from(stringSet);

  let completedCount = 0;

  for (const lang of targetLanguages) {
    try {
      const translationMap = await translateBatch(strings, lang.code);
      const translatedContent = replaceTranslatableStrings(content, translationMap);

      translations[lang.code] = {
        content: translatedContent,
        language: lang.code,
        languageName: lang.name,
        dir: lang.dir,
        translatedAt: new Date(),
      };

      completedCount++;
      if (typeof onProgress === 'function') {
        onProgress({
          total: targetLanguages.length,
          completed: completedCount,
          currentLang: lang.code,
          name: lang.name,
        });
      }
    } catch (err) {
      console.error(`Failed to translate into ${lang.code}:`, err.message);
    }
  }

  return translations;
};

export default {
  SUPPORTED_LANGUAGES,
  isTranslatable,
  translateBatch,
  translateContent,
  translatePageToAllLanguages,
};
