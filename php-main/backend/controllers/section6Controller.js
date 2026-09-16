import Section6Config from '../models/Section6Config.js';
import { getDBStatus } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

const defaultSection6 = {
  title: 'WHY CHOOSE UNISPARK',
  heading: 'Technical Authority. Trusted Delivery.',
  description: 'We combine regulatory expertise, multi-vendor technology integration, and lifecycle ownership to keep your critical assets protected.',
  button: {
    text: 'View All Services',
    link: '/solutions'
  },
  cards: [
    {
      title: 'UAE Regulatory Compliance',
      description: 'All systems designed and installed in accordance with UAE Civil Defence, NESA, and DESC standards.',
      icon: 'fa-building-shield'
    },
    {
      title: 'Multi-Brand Expertise',
      description: 'We are not tied to one manufacturer. We select the right technology from Hikvision, Dahua, Bosch, ZKTeco, HID, and more.',
      icon: 'fa-network-wired'
    }
  ]
};

let inMemorySection6 = { ...defaultSection6 };

const handleCloudinaryImageUpload = async (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // Assume it's a FontAwesome class if it doesn't start with data:image/
  if (!imageUrl.startsWith('data:image/')) {
    return imageUrl;
  }
  const hasCloudinaryKeys = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
  if (hasCloudinaryKeys) {
    try {
      console.log('Uploading Section 6 icon/image to Cloudinary...');
      const uploadRes = await cloudinary.uploader.upload(imageUrl, {
        folder: 'section6_images',
        resource_type: 'auto'
      });
      return uploadRes.secure_url;
    } catch (err) {
      console.error('Cloudinary Section 6 image upload failed:', err.message);
      return imageUrl;
    }
  }
  return imageUrl;
};

export const getSection6Config = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await Section6Config.findOne();
      if (!config) {
        config = await Section6Config.create(defaultSection6);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemorySection6 });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSection6Config = async (req, res) => {
  const { title, heading, description, button, cards } = req.body;
  try {
    let finalCards = [];
    if (Array.isArray(cards)) {
      finalCards = await Promise.all(cards.map(async (card) => {
        const finalIcon = await handleCloudinaryImageUpload(card.icon);
        return {
          title: card.title,
          description: card.description,
          icon: finalIcon
        };
      }));
    }

    const updateData = {
      title: title || defaultSection6.title,
      heading: heading || defaultSection6.heading,
      description: description || defaultSection6.description,
      button: {
        text: button?.text || defaultSection6.button.text,
        link: button?.link || defaultSection6.button.link
      },
      cards: finalCards.length > 0 ? finalCards : defaultSection6.cards
    };

    if (getDBStatus()) {
      const updated = await Section6Config.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Section 6 configuration saved', data: updated });
    } else {
      inMemorySection6 = { ...updateData };
      return res.json({ success: true, message: 'Section 6 configuration saved (In-Memory)', data: inMemorySection6 });
    }
  } catch (error) {
    console.error('Error in updateSection6Config:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
