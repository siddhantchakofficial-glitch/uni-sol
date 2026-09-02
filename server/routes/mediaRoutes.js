import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import Media from '../models/Media.js';
import { authenticateUser, authorizeRole } from '../middleware/authMiddleware.js';
import { logActivity } from '../services/activityLogger.js';

const router = express.Router();

// Ensure local uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disk storage for multer fallback
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

let mockMedia = [
  {
    _id: 'media_1',
    id: 'media_1',
    filename: 'hero.jpg',
    originalName: 'hero.jpg',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
    mimeType: 'image/jpeg',
    size: 245000,
    folder: 'heroes',
    altText: 'Enterprise Security Operations Center',
    createdAt: new Date(),
  },
  {
    _id: 'media_2',
    id: 'media_2',
    filename: 'cctv-surveillance.jpg',
    originalName: 'cctv-surveillance.jpg',
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1000&q=80',
    mimeType: 'image/jpeg',
    size: 189000,
    folder: 'products',
    altText: 'AI CCTV Camera System',
    createdAt: new Date(),
  },
];

router.use(authenticateUser);

// GET /api/media - Get list of media items
router.get('/', async (req, res) => {
  try {
    const { folder, search } = req.query;

    if (req.app.locals.dbConnected) {
      const query = {};
      if (folder) query.folder = folder;
      if (search) query.originalName = { $regex: search, $options: 'i' };

      const media = await Media.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, media });
    }

    let filtered = [...mockMedia];
    if (folder) filtered = filtered.filter((m) => m.folder === folder);
    if (search) filtered = filtered.filter((m) => m.originalName.toLowerCase().includes(search.toLowerCase()));

    res.json({ success: true, media: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/media - Upload file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    let fileUrl = `/uploads/${req.file.filename}`;
    let publicId = '';

    // Check Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: req.body.folder || 'unispark-cms',
      });
      fileUrl = result.secure_url;
      publicId = result.public_id;
    }

    const folderName = req.body.folder || 'general';
    const altText = req.body.altText || req.file.originalname;

    if (req.app.locals.dbConnected) {
      const mediaItem = await Media.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: fileUrl,
        publicId,
        mimeType: req.file.mimetype,
        size: req.file.size,
        folder: folderName,
        altText,
        uploadedBy: req.user._id || req.user.id,
      });

      await logActivity(req, 'MEDIA_UPLOAD', `Uploaded media file: ${req.file.originalname}`);
      return res.status(201).json({ success: true, media: mediaItem });
    }

    const newMedia = {
      _id: `media_${Date.now()}`,
      id: `media_${Date.now()}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl,
      publicId,
      mimeType: req.file.mimetype,
      size: req.file.size,
      folder: folderName,
      altText,
      createdAt: new Date(),
    };

    mockMedia.unshift(newMedia);
    await logActivity(req, 'MEDIA_UPLOAD', `Uploaded media file: ${req.file.originalname}`);
    res.status(201).json({ success: true, media: newMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/media/:id - Delete media
router.delete('/:id', authorizeRole('SUPER_ADMIN', 'ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    if (req.app.locals.dbConnected) {
      const item = await Media.findById(id);
      if (!item) return res.status(404).json({ success: false, message: 'Media not found.' });

      if (item.publicId && process.env.CLOUDINARY_CLOUD_NAME) {
        await cloudinary.uploader.destroy(item.publicId);
      }

      await Media.findByIdAndDelete(id);
      await logActivity(req, 'MEDIA_DELETE', `Deleted media file: ${item.originalName}`);
      return res.json({ success: true, message: 'Media item deleted.' });
    }

    const index = mockMedia.findIndex((m) => m._id === id || m.id === id);
    if (index !== -1) {
      const deleted = mockMedia.splice(index, 1)[0];
      await logActivity(req, 'MEDIA_DELETE', `Deleted media file: ${deleted.originalName}`);
    }

    res.json({ success: true, message: 'Media item deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
