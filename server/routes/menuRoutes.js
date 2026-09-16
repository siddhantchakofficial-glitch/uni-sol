import express from 'express';
import Menu from '../models/Menu.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { logActivity } from '../services/activityLogger.js';

const router = express.Router();

let mockMenus = [
  {
    _id: 'menu_header',
    id: 'menu_header',
    name: 'header',
    title: 'Main Navigation Header',
    items: [
      { id: 'm1', label: 'Home', url: '/' },
      { id: 'm2', label: 'About', url: '/about' },
      { id: 'm3', label: 'Capabilities', url: '/capabilities' },
      { id: 'm4', label: 'Industries', url: '/industries' },
      { id: 'm5', label: 'International', url: '/international' },
    ],
  },
  {
    _id: 'menu_footer',
    id: 'menu_footer',
    name: 'footer',
    title: 'Footer Quick Links',
    items: [
      { id: 'f1', label: 'Privacy Policy', url: '/privacy-policy' },
      { id: 'f2', label: 'Terms of Service', url: '/terms' },
      { id: 'f3', label: 'Cookie Policy', url: '/cookie-policy' },
      { id: 'f4', label: 'Disclaimer', url: '/disclaimer' },
    ],
  },
];

// PUBLIC: Get menus for website header/footer
router.get('/public', async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      const menus = await Menu.find();
      return res.json({ success: true, menus });
    }
    res.json({ success: true, menus: mockMenus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PROTECTED ROUTES
router.use(authenticateUser);

router.get('/', async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      const menus = await Menu.find();
      return res.json({ success: true, menus });
    }
    res.json({ success: true, menus: mockMenus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:name', authorizeRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { name } = req.params;
    const { items, title } = req.body;

    if (req.app.locals.dbConnected) {
      const menu = await Menu.findOneAndUpdate({ name }, { items, title }, { new: true, upsert: true });
      await logActivity(req, 'NAVIGATION_UPDATE', `Updated navigation menu: ${name}`);
      return res.json({ success: true, menu, message: 'Navigation menu saved.' });
    }

    const index = mockMenus.findIndex((m) => m.name === name);
    if (index !== -1) {
      if (items) mockMenus[index].items = items;
      if (title) mockMenus[index].title = title;
    } else {
      mockMenus.push({ _id: `menu_${Date.now()}`, id: `menu_${Date.now()}`, name, title: title || name, items: items || [] });
    }

    await logActivity(req, 'NAVIGATION_UPDATE', `Updated navigation menu: ${name}`);
    res.json({ success: true, menu: mockMenus.find((m) => m.name === name), message: 'Navigation menu saved.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
