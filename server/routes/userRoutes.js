import express from 'express';
import User from '../models/User.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { logActivity } from '../services/activityLogger.js';

const router = express.Router();

let mockUsers = [
  {
    _id: 'user_admin',
    id: 'user_admin',
    username: 'admin',
    email: 'admin@unispark.com',
    role: 'SUPER_ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date(),
  },
  {
    _id: 'user_editor',
    id: 'user_editor',
    username: 'sarah_editor',
    email: 'sarah@unispark.com',
    role: 'EDITOR',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date(),
  },
];

router.use(authenticateUser);

// GET /api/users - List users
router.get('/', authorizeRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      return res.json({ success: true, users });
    }
    res.json({ success: true, users: mockUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/users - Create new team user
router.post('/', authorizeRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email and password required.' });
    }

    if (req.app.locals.dbConnected) {
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Username or email already in use.' });
      }

      const user = await User.create({
        username,
        email,
        passwordHash: password,
        role: role || 'EDITOR',
      });

      await logActivity(req, 'USER_CREATE', `Created team user "${username}" (${role})`);
      return res.status(201).json({
        success: true,
        user: { id: user._id, username: user.username, email: user.email, role: user.role, avatar: user.avatar },
      });
    }

    const newUser = {
      _id: `user_${Date.now()}`,
      id: `user_${Date.now()}`,
      username,
      email,
      role: role || 'EDITOR',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      createdAt: new Date(),
    };

    mockUsers.unshift(newUser);
    await logActivity(req, 'USER_CREATE', `Created team user "${username}" (${role})`);
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/users/:id - Update user role
router.put('/:id', authorizeRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (req.app.locals.dbConnected) {
      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
      await logActivity(req, 'ROLE_CHANGE', `Updated user role for "${user?.username}" to ${role}`);
      return res.json({ success: true, user });
    }

    const u = mockUsers.find((x) => x._id === id || x.id === id);
    if (u) u.role = role;
    await logActivity(req, 'ROLE_CHANGE', `Updated user role for "${u?.username}" to ${role}`);
    res.json({ success: true, user: u });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', authorizeRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    if (req.app.locals.dbConnected) {
      const u = await User.findByIdAndDelete(id);
      await logActivity(req, 'USER_DELETE', `Deleted user account "${u?.username}"`);
      return res.json({ success: true, message: 'User deleted.' });
    }

    const idx = mockUsers.findIndex((x) => x._id === id || x.id === id);
    if (idx !== -1) {
      const deleted = mockUsers.splice(idx, 1)[0];
      await logActivity(req, 'USER_DELETE', `Deleted user account "${deleted.username}"`);
    }

    res.json({ success: true, message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
