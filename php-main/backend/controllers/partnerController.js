import PartnerConfig from '../models/PartnerConfig.js';
import { getDBStatus } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

const defaultPartners = {
  badgeText: 'GLOBAL ALLIANCE',
  headingText: 'Powered by the World\'s Leading Security Brands',
  isVisible: true,
  bgColor: '#ffffff',
  speed: 25,
  partnersList: [
    { name: 'Genetec', logoUrl: '/images/pt1.jpg', link: '' },
    { name: 'Hikvision', logoUrl: '/images/pt2.jpg', link: '' },
    { name: 'Dahua', logoUrl: '/images/pt3.jpg', link: '' },
    { name: 'Axis', logoUrl: '/images/pt4.jpg', link: '' },
    { name: 'Bosch', logoUrl: '/images/pt5.jpg', link: '' },
    { name: 'ZKTeco', logoUrl: '/images/pt6.jpg', link: '' },
    { name: 'HID', logoUrl: '/images/pt7.jpg', link: '' }
  ]
};

let inMemoryPartners = { ...defaultPartners };

const handleCloudinaryLogoUpload = async (logoUrl) => {
  if (!logoUrl) return '';
  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://') || logoUrl.startsWith('/')) {
    return logoUrl;
  }
  if (!logoUrl.startsWith('data:image/')) {
    return logoUrl;
  }
  const hasCloudinaryKeys = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
  if (hasCloudinaryKeys) {
    try {
      console.log('Uploading partner logo to Cloudinary...');
      const uploadRes = await cloudinary.uploader.upload(logoUrl, {
        folder: 'partner_logos',
        resource_type: 'auto'
      });
      return uploadRes.secure_url;
    } catch (err) {
      console.error('Cloudinary partner logo upload failed:', err.message);
      return logoUrl;
    }
  }
  return logoUrl;
};

export const getPartnerConfig = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await PartnerConfig.findOne();
      if (!config) {
        config = await PartnerConfig.create(defaultPartners);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemoryPartners });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePartnerConfig = async (req, res) => {
  const { badgeText, headingText, isVisible, bgColor, speed, partnersList } = req.body;
  try {
    let processedPartners = [];
    if (Array.isArray(partnersList)) {
      for (const p of partnersList) {
        const finalLogo = await handleCloudinaryLogoUpload(p.logoUrl);
        processedPartners.push({
          name: p.name,
          logoUrl: finalLogo || p.logoUrl,
          link: p.link || ''
        });
      }
    }

    const updateData = {
      badgeText: badgeText || defaultPartners.badgeText,
      headingText: headingText || defaultPartners.headingText,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : defaultPartners.isVisible,
      bgColor: bgColor || defaultPartners.bgColor,
      speed: speed !== undefined && speed !== null ? Number(speed) : defaultPartners.speed,
      partnersList: processedPartners.length > 0 ? processedPartners : defaultPartners.partnersList
    };

    if (getDBStatus()) {
      const updated = await PartnerConfig.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Partners configuration saved', data: updated });
    } else {
      inMemoryPartners = { ...updateData };
      return res.json({ success: true, message: 'Partners configuration saved (In-Memory)', data: inMemoryPartners });
    }
  } catch (error) {
    console.error('Error in updatePartnerConfig:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
