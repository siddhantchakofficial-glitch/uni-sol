import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: { type: String, default: 'System' },
    action: {
      type: String,
      required: true, // LOGIN, LOGOUT, PAGE_CREATE, PAGE_UPDATE, PAGE_PUBLISH, PAGE_DELETE, MEDIA_UPLOAD, SETTINGS_UPDATE, USER_CREATE, ROLE_CHANGE
    },
    details: { type: String, required: true },
    ipAddress: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
