import MarqueeConfig from '../models/MarqueeConfig.js';
import { getDBStatus } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

const defaultMarquee = {
  enabled: true,
  speed: 25,
  bgColor: '#ffffff',
  textColor: '#0f172a',
  items: [
    { text: 'Licensed & UAE-Compliant', icon: 'fa-id-card-clip', link: '', badge: '', isActive: true },
    { text: 'Hikvision Authorised Partner', icon: 'fa-handshake', link: '', badge: '', isActive: true },
    { text: 'Dahua Partner', icon: 'fa-certificate', link: '', badge: '', isActive: true },
    { text: 'ZKTeco Partner', icon: 'fa-star', link: '', badge: '', isActive: true },
    { text: '10+ Years Field Experience', icon: 'fa-award', link: '', badge: '', isActive: true },
    { text: 'Dubai · Abu Dhabi · Sharjah', icon: 'fa-map-location-dot', link: '', badge: '', isActive: true },
    { text: 'B2B & B2G Specialists', icon: 'fa-building-shield', link: '', badge: '', isActive: true }
  ]
};

let inMemoryMarquee = JSON.parse(JSON.stringify(defaultMarquee));

const handleCloudinaryIconUpload = async (icon) => {
  if (!icon) return 'fa-star';
  // If it's a FontAwesome class or standard URL, return as is
  if (!icon.startsWith('data:image/')) {
    return icon;
  }
  const hasCloudinaryKeys = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
  if (hasCloudinaryKeys) {
    try {
      console.log('Uploading marquee custom icon to Cloudinary...');
      const uploadRes = await cloudinary.uploader.upload(icon, {
        folder: 'marquee_icons',
        resource_type: 'auto'
      });
      return uploadRes.secure_url;
    } catch (err) {
      console.error('Cloudinary marquee icon upload failed:', err.message);
      return icon;
    }
  }
  return icon;
};

export const getMarqueeConfig = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await MarqueeConfig.findOne();
      if (!config) {
        config = await MarqueeConfig.create(defaultMarquee);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemoryMarquee });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMarqueeConfig = async (req, res) => {
  const { enabled, speed, bgColor, textColor, items } = req.body;
  try {
    let processedItems = [];
    if (Array.isArray(items)) {
      for (const item of items) {
        const finalIcon = await handleCloudinaryIconUpload(item.icon);
        processedItems.push({
          _id: item._id,
          text: item.text || 'Security Specialist',
          icon: finalIcon || item.icon || 'fa-star',
          link: item.link || '',
          badge: item.badge || '',
          isActive: item.isActive !== undefined ? item.isActive : true
        });
      }
    }

    const updateData = {
      enabled: enabled !== undefined ? enabled : true,
      speed: Number(speed) || 25,
      bgColor: bgColor || '#ffffff',
      textColor: textColor || '#0f172a',
      items: processedItems.length > 0 ? processedItems : defaultMarquee.items
    };

    if (getDBStatus()) {
      const updated = await MarqueeConfig.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Marquee configuration saved successfully', data: updated });
    } else {
      inMemoryMarquee = { ...updateData };
      return res.json({ success: true, message: 'Marquee configuration saved (In-Memory)', data: inMemoryMarquee });
    }
  } catch (error) {
    console.error('Error in updateMarqueeConfig:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
