import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'unispark_cms_super_secret_jwt_key_2026_secure');

    // In Mongo fallback or live mode
    if (req.app.locals.dbConnected) {
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User account not found.' });
      }
      req.user = user;
    } else {
      // Fallback mock user if DB is in local in-memory fallback
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        username: decoded.username || 'admin',
        email: decoded.email || 'admin@unispark.com',
        role: decoded.role || 'SUPER_ADMIN',
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}].`,
      });
    }

    next();
  };
};
