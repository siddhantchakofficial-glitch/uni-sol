import express from 'express';
import Form from '../models/Form.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { logActivity } from '../services/activityLogger.js';

const router = express.Router();

let mockForms = [
  {
    _id: 'form_contact',
    id: 'form_contact',
    title: 'Executive Consultation Form',
    slug: 'contact-form',
    description: 'Schedule a security advisory call with UniSpark experts.',
    submitButtonText: 'Submit Inquiry',
    fields: [
      { id: 'f_name', label: 'Full Name', type: 'text', name: 'fullName', required: true, placeholder: 'John Doe' },
      { id: 'f_email', label: 'Work Email', type: 'email', name: 'email', required: true, placeholder: 'john@company.com' },
      { id: 'f_phone', label: 'Phone Number', type: 'phone', name: 'phone', required: true, placeholder: '+91 98765 43210' },
      { id: 'f_msg', label: 'Security Requirements', type: 'textarea', name: 'message', required: false, placeholder: 'Describe project specs...' },
    ],
  },
];

// PUBLIC: Get form by slug for frontend rendering
router.get('/public/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    if (req.app.locals.dbConnected) {
      const form = await Form.findOne({ slug: slug.toLowerCase() });
      if (!form) return res.status(404).json({ success: false, message: 'Form not found.' });
      return res.json({ success: true, form });
    }

    const form = mockForms.find((f) => f.slug === slug.toLowerCase());
    if (!form) return res.status(404).json({ success: false, message: 'Form not found.' });
    res.json({ success: true, form });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PROTECTED ADMIN ROUTES
router.use(authenticateUser);

router.get('/', async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      const forms = await Form.find().sort({ createdAt: -1 });
      return res.json({ success: true, forms });
    }
    res.json({ success: true, forms: mockForms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authorizeRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { title, slug, description, submitButtonText, fields } = req.body;
    if (!title || !slug) return res.status(400).json({ success: false, message: 'Title and slug are required.' });

    const cleanSlug = slug.toLowerCase().trim();

    if (req.app.locals.dbConnected) {
      const form = await Form.create({ title, slug: cleanSlug, description, submitButtonText, fields });
      await logActivity(req, 'FORM_CREATE', `Created custom form: ${title}`);
      return res.status(201).json({ success: true, form });
    }

    const newForm = {
      _id: `form_${Date.now()}`,
      id: `form_${Date.now()}`,
      title,
      slug: cleanSlug,
      description,
      submitButtonText: submitButtonText || 'Submit',
      fields: fields || [],
    };

    mockForms.unshift(newForm);
    await logActivity(req, 'FORM_CREATE', `Created custom form: ${title}`);
    res.status(201).json({ success: true, form: newForm });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', authorizeRole('SUPER_ADMIN', 'ADMIN', 'EDITOR'), async (req, res) => {
  try {
    const { id } = req.params;
    if (req.app.locals.dbConnected) {
      const form = await Form.findByIdAndUpdate(id, req.body, { new: true });
      await logActivity(req, 'FORM_UPDATE', `Updated custom form: ${form?.title}`);
      return res.json({ success: true, form });
    }

    const index = mockForms.findIndex((f) => f._id === id || f.id === id);
    if (index !== -1) {
      mockForms[index] = { ...mockForms[index], ...req.body };
      await logActivity(req, 'FORM_UPDATE', `Updated custom form: ${mockForms[index].title}`);
      return res.json({ success: true, form: mockForms[index] });
    }

    res.status(404).json({ success: false, message: 'Form not found.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', authorizeRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    if (req.app.locals.dbConnected) {
      await Form.findByIdAndDelete(id);
      await logActivity(req, 'FORM_DELETE', `Deleted custom form ID: ${id}`);
      return res.json({ success: true, message: 'Form deleted.' });
    }

    const index = mockForms.findIndex((f) => f._id === id || f.id === id);
    if (index !== -1) mockForms.splice(index, 1);
    await logActivity(req, 'FORM_DELETE', `Deleted custom form ID: ${id}`);
    res.json({ success: true, message: 'Form deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
