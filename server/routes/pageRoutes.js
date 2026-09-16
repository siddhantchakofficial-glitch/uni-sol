import express from 'express';
import mongoose from 'mongoose';
import Page from '../models/Page.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { logActivity } from '../services/activityLogger.js';
import { translatePageToAllLanguages } from '../services/translationService.js';

const router = express.Router();

// Mock store for offline/fallback mode
let mockPages = [
  {
    _id: 'page_home',
    id: 'page_home',
    title: 'Home Page',
    slug: 'home',
    status: 'published',
    authorName: 'Admin',
    updatedAt: new Date(),
    publishedAt: new Date(),
    draftVersion: {
      sections: [
        {
          id: 'sec_hero_1',
          type: 'hero',
          name: 'Hero Banner',
          hidden: false,
          order: 1,
          content: {
            badge: 'DPIIT Recognized Tech Enterprise',
            heading: 'Next-Generation Enterprise Security & Digital Transformation',
            description: 'UniSpark Innovation engineers AI-powered CCTV surveillance, biometric access control, fire safety systems, and unified PSIM command centers.',
            primaryBtnText: 'Explore Capabilities',
            primaryBtnLink: '/capabilities',
            secondaryBtnText: 'About UniSpark',
            secondaryBtnLink: '/about',
            videoUrl: '',
            imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
          },
          styles: { background: '#090d16', textColor: '#ffffff', paddingTop: 120, paddingBottom: 100 },
          animation: 'fade',
        },
        {
          id: 'sec_about_1',
          type: 'about',
          name: 'Who We Are',
          hidden: false,
          order: 2,
          content: {
            badge: 'Enterprise Security Excellence',
            heading: 'Engineered for Scale, Built for Reliability',
            description: 'We partner with enterprise organizations across Asia and the Middle East to deliver mission-critical infrastructure, IoT telemetry, and automated security orchestration.',
            statNumber: '10M+',
            statLabel: 'Protected Square Feet',
          },
          styles: { background: '#0b1120', textColor: '#f8fafc', paddingTop: 80, paddingBottom: 80 },
          animation: 'slide',
        },
      ],
      seo: { title: 'UniSpark Innovation - Enterprise Security', description: 'AI-Powered Security & Automation' },
    },
    publishedVersion: {
      sections: [
        {
          id: 'sec_hero_1',
          type: 'hero',
          name: 'Hero Banner',
          hidden: false,
          order: 1,
          content: {
            badge: 'DPIIT Recognized Tech Enterprise',
            heading: 'Next-Generation Enterprise Security & Digital Transformation',
            description: 'UniSpark Innovation engineers AI-powered CCTV surveillance, biometric access control, fire safety systems, and unified PSIM command centers.',
            primaryBtnText: 'Explore Capabilities',
            primaryBtnLink: '/capabilities',
            secondaryBtnText: 'About UniSpark',
            secondaryBtnLink: '/about',
            videoUrl: '',
            imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
          },
          styles: { background: '#090d16', textColor: '#ffffff', paddingTop: 120, paddingBottom: 100 },
          animation: 'fade',
        },
      ],
      seo: { title: 'UniSpark Innovation - Enterprise Security', description: 'AI-Powered Security & Automation' },
    },
  },
  {
    _id: 'page_about',
    id: 'page_about',
    title: 'About Us',
    slug: 'about',
    status: 'published',
    authorName: 'Admin',
    updatedAt: new Date(),
    publishedAt: new Date(),
    draftVersion: {
      sections: [
        {
          id: 'sec_about_hero',
          type: 'hero',
          name: 'About Hero',
          hidden: false,
          order: 1,
          content: {
            badge: 'Our Story & Legacy',
            heading: 'Building Safe, Intelligent Infrastructure Globally',
            description: 'Learn how UniSpark Innovation grew into a trusted leader in enterprise security and smart facility management.',
            primaryBtnText: 'Contact Team',
            primaryBtnLink: '/contact',
          },
          styles: { background: '#0f172a', textColor: '#ffffff', paddingTop: 100, paddingBottom: 80 },
        },
      ],
      seo: { title: 'About UniSpark Innovation', description: 'Learn about our company mission and legacy.' },
    },
    publishedVersion: {
      sections: [
        {
          id: 'sec_about_hero',
          type: 'hero',
          name: 'About Hero',
          hidden: false,
          order: 1,
          content: {
            badge: 'Our Story & Legacy',
            heading: 'Building Safe, Intelligent Infrastructure Globally',
            description: 'Learn how UniSpark Innovation grew into a trusted leader in enterprise security and smart facility management.',
            primaryBtnText: 'Contact Team',
            primaryBtnLink: '/contact',
          },
          styles: { background: '#0f172a', textColor: '#ffffff', paddingTop: 100, paddingBottom: 80 },
        },
      ],
      seo: { title: 'About UniSpark Innovation', description: 'Learn about our company mission and legacy.' },
    },
  },
];

// Helper to find page by MongoDB ID or slug
const findPageByIdOrSlug = async (identifier) => {
  if (!identifier) return null;
  const clean = identifier.toLowerCase().trim();
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const page = await Page.findById(identifier);
    if (page) return page;
  }
  return await Page.findOne({ slug: clean });
};

// PUBLIC ROUTE: Get published page by slug
// Supports ?lang=<code> query param for multilingual delivery
router.get('/public/:slug', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    const lang = req.query.lang && req.query.lang !== 'en' ? req.query.lang.toLowerCase().trim() : null;

    if (req.app.locals.dbConnected) {
      let page = await Page.findOne({ slug });
      if (!page) {
        return res.status(404).json({ success: false, message: 'Page not found.' });
      }
      const activeContent = (page.publishedVersion?.content && Object.keys(page.publishedVersion.content).length > 0)
        ? page.publishedVersion.content
        : (page.draftVersion?.content || {});
      const activeSections = (page.publishedVersion?.sections?.length > 0)
        ? page.publishedVersion.sections
        : (page.draftVersion?.sections || []);
      const activeSeo = page.publishedVersion?.seo?.title
        ? page.publishedVersion.seo
        : (page.draftVersion?.seo || {});

      // Serve translated content if lang requested and translation exists
      let servedContent = activeContent;
      let servedSeo = activeSeo;
      let translationMeta = { lang: 'en', fallback: false };

      if (lang) {
        const translation = page.translations?.[lang];
        if (translation?.content && Object.keys(translation.content).length > 0) {
          servedContent = translation.content;
          servedSeo = translation.seo || activeSeo;
          translationMeta = { lang, fallback: false, translatedAt: translation.translatedAt };
        } else {
          // Fall back to English content gracefully
          translationMeta = { lang, fallback: true, reason: 'Translation not yet available' };
        }
      }

      return res.json({
        success: true,
        page: {
          id: page._id,
          title: page.title,
          slug: page.slug,
          status: page.status,
          content: servedContent,
          sections: activeSections,
          seo: servedSeo,
          publishedAt: page.publishedAt,
          translationMeta,
        },
      });
    }

    const page = mockPages.find((p) => p.slug === slug);
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found.' });
    }

    const activeContent = (page.publishedVersion?.content && Object.keys(page.publishedVersion.content).length > 0)
      ? page.publishedVersion.content
      : (page.draftVersion?.content || {});
    const activeSections = (page.publishedVersion?.sections?.length > 0)
      ? page.publishedVersion.sections
      : (page.draftVersion?.sections || []);

    res.json({
      success: true,
      page: {
        id: page.id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        content: activeContent,
        sections: activeSections,
        seo: page.publishedVersion?.seo || page.draftVersion?.seo || {},
        publishedAt: page.publishedAt,
        translationMeta: { lang: 'en', fallback: false },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADMIN ROUTES (Protected)
router.use(authenticateUser);

// GET /api/pages - List all pages
router.get('/', async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      const pages = await Page.find().sort({ updatedAt: -1 });
      return res.json({ success: true, pages });
    }

    res.json({ success: true, pages: mockPages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/pages - Create new page
router.post('/', authorizeRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { title, slug } = req.body;
    if (!title || !slug) {
      return res.status(400).json({ success: false, message: 'Title and slug are required.' });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

    if (req.app.locals.dbConnected) {
      const existing = await Page.findOne({ slug: cleanSlug });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Page with this slug already exists.' });
      }

      const page = await Page.create({
        title,
        slug: cleanSlug,
        status: 'published',
        author: req.user._id || req.user.id,
        authorName: req.user.username || 'Admin',
        draftVersion: {
          sections: [],
          seo: { title, description: '' },
          content: {},
        },
        publishedVersion: {
          sections: [],
          seo: { title, description: '' },
          content: {},
        },
        publishedAt: new Date(),
      });

      await logActivity(req, 'PAGE_CREATE', `Created page: "${title}" (${cleanSlug})`);
      return res.status(201).json({ success: true, page });
    }

    const newPage = {
      _id: `page_${Date.now()}`,
      id: `page_${Date.now()}`,
      title,
      slug: cleanSlug,
      status: 'published',
      authorName: req.user.username || 'Admin',
      updatedAt: new Date(),
      createdAt: new Date(),
      draftVersion: { sections: [], seo: { title, description: '' }, content: {} },
      publishedVersion: { sections: [], seo: {}, content: {} },
      publishedAt: new Date(),
    };

    mockPages.unshift(newPage);
    await logActivity(req, 'PAGE_CREATE', `Created page: "${title}" (${cleanSlug})`);
    res.status(201).json({ success: true, page: newPage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/pages/:id - Get page details (supports mongo ID or slug)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (req.app.locals.dbConnected) {
      let page = await findPageByIdOrSlug(id);
      if (!page) {
        // Auto-create initial skeleton if looking up standard CMS page
        const standardPages = {
          home: 'Home Page',
          about: 'About Us',
          capabilities: 'Capabilities & Solutions',
          industries: 'Industry Verticals',
          contact: 'Contact Us',
        };
        if (standardPages[id.toLowerCase()]) {
          page = await Page.create({
            title: standardPages[id.toLowerCase()],
            slug: id.toLowerCase(),
            status: 'published',
            authorName: 'Admin',
            draftVersion: { content: {}, sections: [], seo: {} },
            publishedVersion: { content: {}, sections: [], seo: {} },
            publishedAt: new Date(),
          });
        } else {
          return res.status(404).json({ success: false, message: 'Page not found.' });
        }
      }
      return res.json({ success: true, page });
    }

    let page = mockPages.find((p) => p._id === id || p.id === id || p.slug === id.toLowerCase());
    if (!page) {
      page = {
        _id: `page_${id}`,
        id: `page_${id}`,
        title: id.toUpperCase(),
        slug: id.toLowerCase(),
        status: 'published',
        draftVersion: { content: {}, sections: [], seo: {} },
        publishedVersion: { content: {}, sections: [], seo: {} },
      };
      mockPages.push(page);
    }
    res.json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/pages/:id - Update page content (supports draft saving or immediate publishing)
// Supports autoTranslate: true flag to auto-translate into all 32 languages on publish
router.put('/:id', authorizeRole('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, draftVersion, content, sections, seo, publish, status, autoTranslate } = req.body;
    const isPublishing = publish === true || status === 'published';

    if (req.app.locals.dbConnected) {
      let page = await findPageByIdOrSlug(id);
      if (!page) {
        page = new Page({
          title: title || id,
          slug: (slug || id).toLowerCase().trim(),
          status: isPublishing ? 'published' : 'draft',
          author: req.user._id || req.user.id,
          authorName: req.user.username || 'Admin',
          draftVersion: {},
          publishedVersion: {},
        });
      }

      if (title) page.title = title;
      if (slug) page.slug = slug.toLowerCase().trim();

      // Store visual editor content directly
      const incomingContent = content || draftVersion?.content;
      if (incomingContent) {
        page.draftVersion = page.draftVersion || {};
        page.draftVersion.content = incomingContent;

        if (isPublishing) {
          page.publishedVersion = page.publishedVersion || {};
          page.publishedVersion.content = incomingContent;
        }
      }

      if (draftVersion) {
        page.draftVersion = { ...page.draftVersion, ...draftVersion };
      }
      if (sections) {
        page.draftVersion.sections = sections;
        if (isPublishing) page.publishedVersion.sections = sections;
      }
      if (seo) {
        page.draftVersion.seo = seo;
        if (isPublishing) page.publishedVersion.seo = seo;
      }

      if (isPublishing) {
        page.status = 'published';
        page.publishedAt = new Date();
      } else {
        page.status = 'draft';
      }

      page.markModified('draftVersion');
      page.markModified('publishedVersion');

      await page.save();
      const actionMsg = isPublishing
        ? `Published page: "${page.title}" (${page.slug})`
        : `Saved draft for page: "${page.title}" (${page.slug})`;
      await logActivity(req, 'PAGE_UPDATE', actionMsg);

      // Auto-translate into all 32 languages in background if requested on publish
      if (isPublishing && autoTranslate === true) {
        const contentToTranslate = content || draftVersion?.content;
        if (contentToTranslate && Object.keys(contentToTranslate).length > 0) {
          // Run in background so the publish response is not delayed
          setImmediate(async () => {
            try {
              const allTranslations = await translatePageToAllLanguages(contentToTranslate);
              await Page.findByIdAndUpdate(page._id, {
                $set: { translations: allTranslations },
              });
              console.log(`[Translation] Auto-translated "${page.title}" into ${Object.keys(allTranslations).length} languages.`);
            } catch (translErr) {
              console.error('[Translation] Auto-translate failed:', translErr.message);
            }
          });
        }
      }

      return res.json({
        success: true,
        page,
        message: isPublishing ? 'Changes published live.' : 'Draft saved successfully.',
        autoTranslating: isPublishing && autoTranslate === true,
      });
    }

    let index = mockPages.findIndex((p) => p._id === id || p.id === id || p.slug === id.toLowerCase());
    if (index === -1) {
      mockPages.push({
        _id: `page_${id}`,
        id: `page_${id}`,
        title: title || id,
        slug: (slug || id).toLowerCase(),
        status: isPublishing ? 'published' : 'draft',
        draftVersion: { content: content || {} },
        publishedVersion: isPublishing ? { content: content || {} } : { content: {} },
        updatedAt: new Date(),
      });
      index = mockPages.length - 1;
    } else {
      if (title) mockPages[index].title = title;
      if (slug) mockPages[index].slug = slug.toLowerCase().trim();
      const incomingContent = content || draftVersion?.content;
      if (incomingContent) {
        mockPages[index].draftVersion.content = incomingContent;
        if (isPublishing) {
          mockPages[index].publishedVersion.content = incomingContent;
        }
      }
      mockPages[index].status = isPublishing ? 'published' : 'draft';
      mockPages[index].updatedAt = new Date();
    }

    await logActivity(req, 'PAGE_UPDATE', `Updated page: "${mockPages[index].title}"`);
    res.json({
      success: true,
      page: mockPages[index],
      message: isPublishing ? 'Changes published live.' : 'Draft saved successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/pages/:id/publish - Publish draft version
router.post('/:id/publish', authorizeRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;

    if (req.app.locals.dbConnected) {
      const page = await findPageByIdOrSlug(id);
      if (!page) return res.status(404).json({ success: false, message: 'Page not found.' });

      page.publishedVersion = {
        content: JSON.parse(JSON.stringify(page.draftVersion?.content || {})),
        sections: JSON.parse(JSON.stringify(page.draftVersion?.sections || [])),
        seo: JSON.parse(JSON.stringify(page.draftVersion?.seo || {})),
        layoutSettings: JSON.parse(JSON.stringify(page.draftVersion?.layoutSettings || {})),
      };
      page.status = 'published';
      page.publishedAt = new Date();
      page.markModified('publishedVersion');

      await page.save();
      await logActivity(req, 'PAGE_PUBLISH', `Published page: "${page.title}" (${page.slug})`);
      return res.json({ success: true, page, message: 'Page published successfully.' });
    }

    const index = mockPages.findIndex((p) => p._id === id || p.id === id || p.slug === id.toLowerCase());
    if (index === -1) return res.status(404).json({ success: false, message: 'Page not found.' });

    mockPages[index].publishedVersion = JSON.parse(JSON.stringify(mockPages[index].draftVersion));
    mockPages[index].status = 'published';
    mockPages[index].publishedAt = new Date();
    mockPages[index].updatedAt = new Date();

    await logActivity(req, 'PAGE_PUBLISH', `Published page: "${mockPages[index].title}" (${mockPages[index].slug})`);
    res.json({ success: true, page: mockPages[index], message: 'Page published successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/pages/:id/unpublish - Unpublish page
router.post('/:id/unpublish', authorizeRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    if (req.app.locals.dbConnected) {
      const page = await Page.findById(id);
      if (!page) return res.status(404).json({ success: false, message: 'Page not found.' });
      page.status = 'draft';
      await page.save();
      await logActivity(req, 'PAGE_UNPUBLISH', `Unpublished page: "${page.title}"`);
      return res.json({ success: true, page });
    }

    const index = mockPages.findIndex((p) => p._id === id || p.id === id);
    if (index !== -1) {
      mockPages[index].status = 'draft';
      await logActivity(req, 'PAGE_UNPUBLISH', `Unpublished page: "${mockPages[index].title}"`);
    }
    res.json({ success: true, page: mockPages[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/pages/:id/duplicate - Duplicate page
router.post('/:id/duplicate', authorizeRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;

    if (req.app.locals.dbConnected) {
      const original = await Page.findById(id);
      if (!original) return res.status(404).json({ success: false, message: 'Page not found.' });

      const newTitle = `${original.title} (Copy)`;
      const newSlug = `${original.slug}-copy-${Date.now()}`;

      const duplicate = await Page.create({
        title: newTitle,
        slug: newSlug,
        status: 'draft',
        author: req.user._id || req.user.id,
        authorName: req.user.username || 'Admin',
        draftVersion: JSON.parse(JSON.stringify(original.draftVersion)),
      });

      await logActivity(req, 'PAGE_DUPLICATE', `Duplicated page "${original.title}" into "${newTitle}"`);
      return res.status(201).json({ success: true, page: duplicate });
    }

    const original = mockPages.find((p) => p._id === id || p.id === id);
    if (!original) return res.status(404).json({ success: false, message: 'Page not found.' });

    const newId = `page_${Date.now()}`;
    const duplicate = {
      _id: newId,
      id: newId,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      status: 'draft',
      authorName: req.user.username || 'Admin',
      updatedAt: new Date(),
      createdAt: new Date(),
      draftVersion: JSON.parse(JSON.stringify(original.draftVersion)),
      publishedVersion: { sections: [], seo: {} },
    };

    mockPages.unshift(duplicate);
    await logActivity(req, 'PAGE_DUPLICATE', `Duplicated page "${original.title}" into "${duplicate.title}"`);
    res.status(201).json({ success: true, page: duplicate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/pages/:id - Delete page
router.delete('/:id', authorizeRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    if (req.app.locals.dbConnected) {
      const page = await Page.findByIdAndDelete(id);
      if (!page) return res.status(404).json({ success: false, message: 'Page not found.' });
      await logActivity(req, 'PAGE_DELETE', `Deleted page: "${page.title}"`);
      return res.json({ success: true, message: 'Page deleted successfully.' });
    }

    const index = mockPages.findIndex((p) => p._id === id || p.id === id);
    if (index !== -1) {
      const deleted = mockPages.splice(index, 1)[0];
      await logActivity(req, 'PAGE_DELETE', `Deleted page: "${deleted.title}"`);
    }

    res.json({ success: true, message: 'Page deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
