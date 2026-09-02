import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (req, action, details, metadata = {}) => {
  try {
    const userId = req.user ? req.user._id || req.user.id : null;
    const username = req.user ? req.user.username : 'System';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    if (req.app.locals.dbConnected) {
      await ActivityLog.create({
        userId,
        username,
        action,
        details,
        ipAddress,
        metadata,
      });
    } else {
      console.log(`[Activity Log Mock]: ${username} -> ${action}: ${details}`);
    }
  } catch (err) {
    console.error('Failed to write activity log:', err.message);
  }
};
