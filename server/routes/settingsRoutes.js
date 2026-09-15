import express from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { logActivity } from '../services/activityLogger.js';

const router = express.Router();

let mockSettings = {
  general: {
    siteName: 'UniSpark Innovation',
    logo: '/assets/logo.png',
    favicon: '/favicon.ico',
    contactEmail: 'info@unisparkinnovation.com',
    phone: '+91 11 4567 8900',
    address: 'Connaught Place, New Delhi, India & Business Bay, Dubai, UAE',
  },
  branding: {
    primaryColor: '#0284c7',
    secondaryColor: '#0f172a',
    accentColor: '#38bdf8',
    font: 'Inter, sans-serif',
    borderRadius: '0.75rem',
    buttonStyle: 'rounded-xl',
  },
  social: {
    instagram: 'https://instagram.com/unispark',
    facebook: 'https://facebook.com/unispark',
    linkedin: 'https://linkedin.com/company/unispark',
    youtube: 'https://youtube.com',
    x: 'https://x.com/unispark',
  },
  integrations: {
    cloudinaryCloudName: 'unispark-media',
    analyticsId: 'G-UNISPARK123',
    paymentGateway: 'Razorpay',
    emailProvider: 'SendGrid SMTP',
  },
};

// PUBLIC: Get public branding & site settings
router.get('/public', async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      let settings = await SiteSettings.findOne();
      if (!settings) settings = await SiteSettings.create(mockSettings);
      return res.json({ success: true, settings });
    }
    res.json({ success: true, settings: mockSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PROTECTED ROUTES
router.use(authenticateUser);

router.get('/', async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      let settings = await SiteSettings.findOne();
      if (!settings) settings = await SiteSettings.create(mockSettings);
      return res.json({ success: true, settings });
    }
    res.json({ success: true, settings: mockSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/', authorizeRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { general, branding, social, integrations, seo } = req.body;

    if (req.app.locals.dbConnected) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = new SiteSettings({});
      }
      if (general) settings.general = { ...settings.general, ...general };
      if (branding) settings.branding = { ...settings.branding, ...branding };
      if (social) settings.social = { ...settings.social, ...social };
      if (integrations) settings.integrations = { ...settings.integrations, ...integrations };
      if (seo) settings.seo = { ...settings.seo, ...seo };

      settings.markModified('general');
      settings.markModified('branding');
      settings.markModified('social');
      settings.markModified('integrations');
      settings.markModified('seo');

      await settings.save();
      await logActivity(req, 'SETTINGS_UPDATE', 'Updated global site settings.');
      return res.json({ success: true, settings, message: 'Settings saved successfully.' });
    }

    if (general) mockSettings.general = { ...mockSettings.general, ...general };
    if (branding) mockSettings.branding = { ...mockSettings.branding, ...branding };
    if (social) mockSettings.social = { ...mockSettings.social, ...social };
    if (integrations) mockSettings.integrations = { ...mockSettings.integrations, ...integrations };
    if (seo) mockSettings.seo = { ...mockSettings.seo, ...seo };

    await logActivity(req, 'SETTINGS_UPDATE', 'Updated global site settings.');
    res.json({ success: true, settings: mockSettings, message: 'Settings saved successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
