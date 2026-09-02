import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

let mockActivities = [
  {
    _id: 'act_1',
    id: 'act_1',
    username: 'admin',
    action: 'PAGE_PUBLISH',
    details: 'Published page: "Home Page" (home)',
    createdAt: new Date(),
  },
  {
    _id: 'act_2',
    id: 'act_2',
    username: 'admin',
    action: 'MEDIA_UPLOAD',
    details: 'Uploaded media file: cctv-surveillance.jpg',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    _id: 'act_3',
    id: 'act_3',
    username: 'admin',
    action: 'LOGIN',
    details: 'User admin logged in successfully.',
    createdAt: new Date(Date.now() - 7200000),
  },
];

router.use(authenticateUser);

router.get('/', async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
      return res.json({ success: true, activities: logs });
    }

    res.json({ success: true, activities: mockActivities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
