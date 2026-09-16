import Section2Config from '../models/Section2Config.js';
import { getDBStatus } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

const defaultSection2 = {
  title: 'Pioneering the Future of Secured Intelligence',
  heading: 'Next-Gen Architecture',
  description: 'UniSpark Innovation architectures orchestrate friction-free continuous analysis across critical enterprise vectors, neutralizing vulnerabilities before they cross your network perimeter.',
  card1: {
    title: 'Cognitive Shielding',
    description: 'Self-learning neural vectors adapt instantly to network threats.'
  },
  card2: {
    title: 'Microsecond Latency',
    description: 'Sub-atomic detection layers processing continuous data streams.'
  },
  ecosystemButton: {
    text: 'Our Ecosystem',
    link: '/about-us'
  },
  imageUrl: '/images/about-vision.jpg',
  imageButton: {
    text: '99.99% Threat Isolation',
    link: '/solutions'
  }
};

let inMemorySection2 = { ...defaultSection2 };

// Helper to upload Section 2 image to Cloudinary if base64/new image
const handleCloudinaryImageUpload = async (imageUrl) => {
  if (!imageUrl) return '';

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  const hasCloudinaryKeys =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinaryKeys) {
    try {
      console.log('Uploading Section 2 image to Cloudinary...');
      const uploadRes = await cloudinary.uploader.upload(imageUrl, {
        folder: 'section2_images',
        resource_type: 'auto'
      });
      console.log('Cloudinary Section 2 image upload successful:', uploadRes.secure_url);
      return uploadRes.secure_url;
    } catch (err) {
      console.error('Cloudinary image upload failed:', err.message);
      throw new Error(`Cloudinary image upload failed: ${err.message}`);
    }
  } else {
    console.warn('Cloudinary credentials missing in backend .env');
    return imageUrl;
  }
};

// GET /api/section2 - Retrieve Section 2 Configuration
export const getSection2Config = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await Section2Config.findOne();
      if (!config) {
        config = await Section2Config.create(defaultSection2);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemorySection2 });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/section2 - Update Section 2 Configuration & Upload Image to Cloudinary
export const updateSection2Config = async (req, res) => {
  const {
    title,
    heading,
    description,
    card1,
    card2,
    ecosystemButton,
    imageUrl,
    imageButton
  } = req.body;

  try {
    let finalImageUrl = imageUrl;
    if (imageUrl) {
      finalImageUrl = await handleCloudinaryImageUpload(imageUrl);
    }

    const updateData = {
      title: title || defaultSection2.title,
      heading: heading || defaultSection2.heading,
      description: description || defaultSection2.description,
      card1: {
        title: card1?.title || defaultSection2.card1.title,
        description: card1?.description || defaultSection2.card1.description
      },
      card2: {
        title: card2?.title || defaultSection2.card2.title,
        description: card2?.description || defaultSection2.card2.description
      },
      ecosystemButton: {
        text: ecosystemButton?.text || defaultSection2.ecosystemButton.text,
        link: ecosystemButton?.link || defaultSection2.ecosystemButton.link
      },
      imageUrl: finalImageUrl !== undefined ? finalImageUrl : defaultSection2.imageUrl,
      imageButton: {
        text: imageButton?.text || defaultSection2.imageButton.text,
        link: imageButton?.link || defaultSection2.imageButton.link
      }
    };

    if (getDBStatus()) {
      const updated = await Section2Config.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Section 2 configuration saved in MongoDB Atlas', data: updated });
    } else {
      inMemorySection2 = { ...updateData };
      return res.json({ success: true, message: 'Section 2 configuration saved (In-Memory)', data: inMemorySection2 });
    }
  } catch (error) {
    console.error('Error in updateSection2Config:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
