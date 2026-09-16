import HeroConfig from '../models/HeroConfig.js';
import { getDBStatus } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

const defaultHero = {
  title: 'Welcome to Unispark',
  heading: "UAE's Trusted Security Systems Partner",
  words: ["Design.", "Supply.", "Installation.", "Maintenance."],
  description: 'Protecting businesses, assets, and people across Dubai, Abu Dhabi, Sharjah, and the UAE — with world-class physical security infrastructure, expert engineers, and zero-compromise service.',
  button1: { text: 'Request a Free Site Survey', link: '/contact-us' },
  button2: { text: 'Call Us Now: +971 50 288 5874', link: 'tel:+971502885874' },
  videoUrl: ''
};

let inMemoryHero = { ...defaultHero };

// Helper to upload background video to Cloudinary if configured
const handleCloudinaryVideoUpload = async (videoUrl) => {
  if (!videoUrl) return '';

  // If already a remote Cloudinary or HTTP URL, return as-is
  if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
    return videoUrl;
  }

  const hasCloudinaryKeys =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinaryKeys) {
    try {
      console.log('Uploading hero background video to Cloudinary...');
      const uploadRes = await cloudinary.uploader.upload(videoUrl, {
        folder: 'hero_videos',
        resource_type: 'video'
      });
      console.log('Cloudinary video upload successful:', uploadRes.secure_url);
      return uploadRes.secure_url;
    } catch (err) {
      console.error('Cloudinary video upload failed:', err.message);
      throw new Error(`Cloudinary video upload failed: ${err.message}`);
    }
  } else {
    console.warn('Cloudinary credentials missing in backend .env');
    return videoUrl;
  }
};

// GET /api/hero - Retrieve Hero Configuration
export const getHeroConfig = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await HeroConfig.findOne();
      if (!config) {
        config = await HeroConfig.create(defaultHero);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemoryHero });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/hero - Update or Create Hero Configuration
export const updateHeroConfig = async (req, res) => {
  const { title, heading, words, description, button1, button2, videoUrl } = req.body;

  try {
    let finalVideoUrl = videoUrl;
    if (videoUrl) {
      finalVideoUrl = await handleCloudinaryVideoUpload(videoUrl);
    }

    const updateData = {
      title: title || defaultHero.title,
      heading: heading || defaultHero.heading,
      words: Array.isArray(words) && words.length > 0 ? words : defaultHero.words,
      description: description || defaultHero.description,
      button1: {
        text: button1?.text || defaultHero.button1.text,
        link: button1?.link || defaultHero.button1.link
      },
      button2: {
        text: button2?.text || defaultHero.button2.text,
        link: button2?.link || defaultHero.button2.link
      },
      videoUrl: finalVideoUrl !== undefined ? finalVideoUrl : ''
    };

    if (getDBStatus()) {
      const updated = await HeroConfig.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Hero configuration saved in MongoDB Atlas', data: updated });
    } else {
      inMemoryHero = { ...updateData };
      return res.json({ success: true, message: 'Hero configuration saved (In-Memory)', data: inMemoryHero });
    }
  } catch (error) {
    console.error('Error in updateHeroConfig:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
