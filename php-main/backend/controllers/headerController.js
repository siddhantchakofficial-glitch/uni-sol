import HeaderConfig from '../models/HeaderConfig.js';
import { getDBStatus } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

const defaultHeader = {
  email: 'contact@unise.com',
  socialLinks: {
    facebook: 'https://facebook.com/unise',
    instagram: 'https://instagram.com/unise',
    twitter: 'https://twitter.com/unise',
    linkedin: 'https://linkedin.com/company/unise'
  },
  logoUrl: ''
};

let inMemoryHeader = { ...defaultHeader };

// Helper to upload base64/data URI image to Cloudinary if configured
const handleCloudinaryUpload = async (logoUrl) => {
  if (!logoUrl) return '';

  // If already a remote Cloudinary or HTTP URL, don't re-upload
  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
    return logoUrl;
  }

  // Check if Cloudinary credentials exist in process.env
  const hasCloudinaryKeys =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinaryKeys) {
    try {
      console.log('Uploading logo image to Cloudinary...');
      const uploadRes = await cloudinary.uploader.upload(logoUrl, {
        folder: 'header_logos',
        resource_type: 'auto'
      });
      console.log('Cloudinary upload successful:', uploadRes.secure_url);
      return uploadRes.secure_url;
    } catch (err) {
      console.error('Cloudinary upload failed:', err.message);
      throw new Error(`Cloudinary upload failed: ${err.message}`);
    }
  } else {
    console.warn('Cloudinary credentials missing in backend .env. Storing raw image URL.');
    return logoUrl;
  }
};

// GET /api/header - Retrieve Header Configuration
export const getHeaderConfig = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await HeaderConfig.findOne();
      if (!config) {
        config = await HeaderConfig.create(defaultHeader);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemoryHeader });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/header - Create or Update Header Configuration
export const createHeaderConfig = async (req, res) => {
  return updateHeaderConfig(req, res);
};

// PUT /api/header - Update or Upsert Header Configuration & Upload Logo to Cloudinary
export const updateHeaderConfig = async (req, res) => {
  const { email, socialLinks, logoUrl } = req.body;

  try {
    let finalLogoUrl = logoUrl;
    if (logoUrl) {
      finalLogoUrl = await handleCloudinaryUpload(logoUrl);
    }

    const updateData = {
      email: email || defaultHeader.email,
      socialLinks: {
        facebook: socialLinks?.facebook ?? defaultHeader.socialLinks.facebook,
        instagram: socialLinks?.instagram ?? defaultHeader.socialLinks.instagram,
        twitter: socialLinks?.twitter ?? defaultHeader.socialLinks.twitter,
        linkedin: socialLinks?.linkedin ?? defaultHeader.socialLinks.linkedin
      },
      logoUrl: finalLogoUrl !== undefined ? finalLogoUrl : ''
    };

    if (getDBStatus()) {
      // Upsert: Creates a new document if records were deleted manually, or updates existing
      const updated = await HeaderConfig.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Header configuration saved in MongoDB Atlas', data: updated });
    } else {
      inMemoryHeader = { ...updateData };
      return res.json({ success: true, message: 'Header configuration saved (In-Memory)', data: inMemoryHeader });
    }
  } catch (error) {
    console.error('Error in updateHeaderConfig:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/header - Reset / Delete Header Configuration
export const deleteHeaderConfig = async (req, res) => {
  try {
    if (getDBStatus()) {
      await HeaderConfig.deleteMany({});
      const resetConfig = await HeaderConfig.create(defaultHeader);
      return res.json({ success: true, message: 'Header content reset to defaults in MongoDB Atlas', data: resetConfig });
    } else {
      inMemoryHeader = { ...defaultHeader };
      return res.json({ success: true, message: 'Header content reset to defaults', data: inMemoryHeader });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
