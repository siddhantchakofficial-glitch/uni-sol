import express from 'express';
import FormSubmission from '../models/FormSubmission.js';
import Form from '../models/Form.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { logActivity } from '../services/activityLogger.js';

const router = express.Router();

let mockSubmissions = [
  {
    _id: 'sub_1',
    id: 'sub_1',
    formTitle: 'Executive Consultation Form',
    data: {
      fullName: 'Vikramaditya Rao',
      email: 'v.rao@techcorp.in',
      phone: '+91 98112 34567',
      message: 'Interested in AI video surveillance integration across 4 datacenter sites.',
    },
    status: 'unread',
    createdAt: new Date(),
  },
  {
    _id: 'sub_2',
    id: 'sub_2',
    formTitle: 'Executive Consultation Form',
    data: {
      fullName: 'Aisha Al-Mansoor',
      email: 'aisha@dubai-holding.ae',
      phone: '+971 50 123 4567',
      message: 'Requesting RFQ for Smart Building Access Control in Business Bay.',
    },
    status: 'read',
    createdAt: new Date(Date.now() - 86400000),
  },
];

// PUBLIC: Submit form response
router.post('/submit/:formId', async (req, res) => {
  try {
    const { formId } = req.params;
    const formData = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    if (req.app.locals.dbConnected) {
      let formTitle = 'Contact Form';
      let validFormId = null;

      if (formId && formId.match(/^[0-9a-fA-F]{24}$/)) {
        const form = await Form.findById(formId);
        if (form) {
          formTitle = form.title;
          validFormId = form._id;
        }
      } else if (formId) {
        const form = await Form.findOne({ slug: formId });
        if (form) {
          formTitle = form.title;
          validFormId = form._id;
        }
      }

      const submission = await FormSubmission.create({
        formId: validFormId,
        formTitle,
        data: formData,
        ipAddress,
        userAgent,
      });

      return res.status(201).json({ success: true, message: 'Form submitted successfully.', submissionId: submission._id });
    }

    const newSub = {
      _id: `sub_${Date.now()}`,
      id: `sub_${Date.now()}`,
      formTitle: 'Contact Form',
      data: formData,
      status: 'unread',
      createdAt: new Date(),
    };

    mockSubmissions.unshift(newSub);
    res.status(201).json({ success: true, message: 'Form submitted successfully.', submissionId: newSub.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PROTECTED ADMIN ROUTES
router.use(authenticateUser);

// GET /api/submissions - List all submissions
router.get('/', async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      const submissions = await FormSubmission.find().sort({ createdAt: -1 });
      return res.json({ success: true, submissions });
    }
    res.json({ success: true, submissions: mockSubmissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/submissions/:id/status - Update status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.app.locals.dbConnected) {
      const sub = await FormSubmission.findByIdAndUpdate(id, { status }, { new: true });
      return res.json({ success: true, submission: sub });
    }

    const item = mockSubmissions.find((s) => s._id === id || s.id === id);
    if (item) item.status = status;
    res.json({ success: true, submission: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/submissions/:id - Delete submission
router.delete('/:id', authorizeRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    if (req.app.locals.dbConnected) {
      await FormSubmission.findByIdAndDelete(id);
      await logActivity(req, 'SUBMISSION_DELETE', `Deleted form submission ID: ${id}`);
      return res.json({ success: true, message: 'Submission deleted.' });
    }

    const index = mockSubmissions.findIndex((s) => s._id === id || s.id === id);
    if (index !== -1) mockSubmissions.splice(index, 1);

    await logActivity(req, 'SUBMISSION_DELETE', `Deleted form submission ID: ${id}`);
    res.json({ success: true, message: 'Submission deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
