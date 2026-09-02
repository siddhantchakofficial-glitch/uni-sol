import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { logActivity } from '../services/activityLogger.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || 'unispark_cms_super_secret_jwt_key_2026_secure',
    { expiresIn: '7d' }
  );
};

// Seed / Setup Admin if no admin exists
router.post('/setup-admin', async (req, res) => {
  try {
    if (req.app.locals.dbConnected) {
      const existingUser = await User.findOne({ email: 'admin@unispark.com' });
      if (existingUser) {
        return res.json({ success: true, message: 'Admin account already exists.' });
      }

      const admin = await User.create({
        username: 'admin',
        email: 'admin@unispark.com',
        passwordHash: 'Admin@123456',
        role: 'SUPER_ADMIN',
      });

      return res.status(201).json({
        success: true,
        message: 'Super admin account created successfully.',
        user: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
      });
    }

    return res.json({ success: true, message: 'Running in local fallback mode.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    let user;
    if (req.app.locals.dbConnected) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      user.lastLogin = new Date();
      await user.save();
    } else {
      // Local fallback mode credentials
      if (email === 'admin@unispark.com' && password === 'Admin@123456') {
        user = {
          _id: 'mock_admin_id',
          username: 'admin',
          email: 'admin@unispark.com',
          role: 'SUPER_ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        };
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials (Use admin@unispark.com / Admin@123456).' });
      }
    }

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    req.user = user;
    await logActivity(req, 'LOGIN', `User ${user.username} logged in successfully.`);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Logout
router.post('/logout', authenticateUser, async (req, res) => {
  await logActivity(req, 'LOGOUT', `User ${req.user.username} logged out.`);
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Get current user profile
router.get('/me', authenticateUser, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id || req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  });
});

export default router;
