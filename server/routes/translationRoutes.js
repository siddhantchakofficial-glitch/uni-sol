import express from 'express';
import Page from '../models/Page.js';
import TranslationCache from '../models/TranslationCache.js';
import {
  SUPPORTED_LANGUAGES,
  translateContent,
  translatePageToAllLanguages,
} from '../services/translationService.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { logActivity } from '../services/activityLogger.js';

const router = express.Router();

// Helper to find page by ID or slug
const findPage = async (identifier) => {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();
  const page = await Page.findOne({ $or: [{ slug: clean }, { _id: identifier.match(/^[0-9a-fA-F]{24}$/) ? identifier : null }] });
  return page;
};

/**
 * GET /api/translations/languages
 * Public endpoint to list all 32 supported languages
 */
router.get('/languages', (req, res) => {
  res.json({
    success: true,
    languages: SUPPORTED_LANGUAGES,
    masterLanguage: 'en',
    count: SUPPORTED_LANGUAGES.length,
  });
});

/**
 * GET /api/translations/status/:slug
 * Check translation status across all 32 languages for a specific page
 */
router.get('/status/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let page = null;
    if (req.app.locals.dbConnected) {
      page = await findPage(slug);
    }

    const translations = page?.translations || {};
    const statusList = SUPPORTED_LANGUAGES.map((lang) => {
      if (lang.code === 'en') {
        return {
          ...lang,
          isMaster: true,
          status: 'master',
          translated: true,
          updatedAt: page?.updatedAt || new Date(),
        };
      }
      const existing = translations[lang.code];
      return {
        ...lang,
        status: existing ? 'translated' : 'missing',
        translated: Boolean(existing),
        updatedAt: existing?.translatedAt || null,
      };
    });

    res.json({
      success: true,
      slug,
      statusList,
      totalSupported: SUPPORTED_LANGUAGES.length,
      translatedCount: statusList.filter((s) => s.translated).length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/translations/translate-page
 * Protected endpoint to trigger translation for a page into 32 languages
 */
router.post('/translate-page', authenticateUser, authorizeRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { slug, targetLanguages, content } = req.body;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Page slug is required.' });
    }

    let page = null;
    let sourceContent = content;

    if (req.app.locals.dbConnected) {
      page = await findPage(slug);
      if (!page && !content) {
        return res.status(404).json({ success: false, message: 'Page not found.' });
      }
      if (!sourceContent) {
        sourceContent = page.draftVersion?.content || page.publishedVersion?.content || {};
      }
    }

    if (!sourceContent || Object.keys(sourceContent).length === 0) {
      return res.status(400).json({ success: false, message: 'No content available to translate.' });
    }

    // Determine target languages (either all 31 non-en or specified list)
    const targets = Array.isArray(targetLanguages) && targetLanguages.length > 0
      ? SUPPORTED_LANGUAGES.filter((l) => targetLanguages.includes(l.code) && l.code !== 'en')
      : SUPPORTED_LANGUAGES.filter((l) => l.code !== 'en');

    // Run batch translations
    const newTranslations = {};
    for (const lang of targets) {
      const translatedData = await translateContent(sourceContent, lang.code);
      newTranslations[lang.code] = {
        content: translatedData,
        language: lang.code,
        languageName: lang.name,
        dir: lang.dir,
        translatedAt: new Date(),
      };
    }

    if (req.app.locals.dbConnected && page) {
      page.translations = {
        ...(page.translations || {}),
        ...newTranslations,
      };
      page.markModified('translations');
      await page.save();
      await logActivity(req, 'TRANSLATION_UPDATE', `Auto-translated "${page.title}" (${page.slug}) into ${targets.length} languages`);
    }

    res.json({
      success: true,
      message: `Successfully translated into ${targets.length} languages.`,
      translatedLanguages: targets.map((t) => t.code),
      translations: newTranslations,
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/translations/clear-cache
 * Clears cached translations (useful when doing fresh translation rebuilds)
 */
router.post('/clear-cache', authenticateUser, authorizeRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      await TranslationCache.deleteMany({});
    }
    res.json({ success: true, message: 'Translation cache cleared successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
