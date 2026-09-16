import FooterConfig from '../models/FooterConfig.js';
import { getDBStatus } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

const processImageUpload = async (imgUrl, folder = 'footer_images') => {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('data:image')) {
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
    if (hasCloudinary) {
      try {
        const uploadRes = await cloudinary.uploader.upload(imgUrl, { folder, resource_type: 'auto' });
        return uploadRes.secure_url;
      } catch (err) {
        console.error(`Cloudinary footer upload failed:`, err.message);
        return imgUrl;
      }
    }
  }
  return imgUrl;
};

const defaultFooter = {
  logoUrl: '/images/logo.png',
  companyName: 'UniSpark Innovation Security Systems & Equipment Trading L.L.C',
  companyTagline: 'Next-generation enterprise protection and cyber-physical infrastructure logic designed for global digital business velocity.',
  groupCompaniesLabel: 'Group Companies:',
  groupCompanies: [
    { label: 'Horizon Hive Technology L.L.C', url: 'https://horizonhivetechnology.com/' },
    { label: 'UniSpark Innovations HR Consultants L.L.C', url: 'https://usihr.com/' }
  ],
  socialLinks: [
    { platform: 'Facebook', url: 'https://www.facebook.com/UnisparkInnovation/', icon: 'fa-facebook-f' },
    { platform: 'Instagram', url: 'https://www.instagram.com/unispark_innovation/', icon: 'fa-instagram' },
    { platform: 'X / Twitter', url: 'https://x.com/unispark_inn', icon: 'fa-x-twitter' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/unispark-innovation/posts/?feedView=all', icon: 'fa-linkedin-in' }
  ],
  solutionsColumnTitle: 'SOLUTIONS',
  industriesColumnTitle: 'INDUSTRIES',
  quickLinksColumnTitle: 'QUICK LINKS',
  quickLinks: [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about-us' },
    { label: 'Solutions', url: '/solutions' },
    { label: 'Industries', url: '/industries' },
    { label: 'Contact Us', url: '/contact-us' }
  ],
  serviceAreasLabel: 'Service Areas:',
  serviceAreas: 'Dubai | Abu Dhabi | Sharjah | UAE Nationwide',
  officeLocation: 'Dubai, United Arab Emirates',
  email: 'sales@unisparkinnovation.com',
  emailLabel: 'Sales',
  phone: '+971 50 288 5874',
  phoneLabel: 'Call',
  whatsappNumber: '971502885874',
  copyrightText: 'UniSpark Innovation Security Systems & Equipment Trading L.L.C. All rights reserved.'
};

let inMemoryFooter = { ...defaultFooter };

export const getFooterConfig = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await FooterConfig.findOne();
      if (!config) {
        config = await FooterConfig.create(defaultFooter);
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemoryFooter });
    }
  } catch (error) {
    console.error('Error in getFooterConfig:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFooterConfig = async (req, res) => {
  try {
    const body = req.body;

    // Process logo image upload if base64
    let logoUrl = body.logoUrl || defaultFooter.logoUrl;
    if (logoUrl && logoUrl.startsWith('data:image')) {
      logoUrl = await processImageUpload(logoUrl, 'footer_logo');
    }

    const updateData = {
      logoUrl,
      companyName: body.companyName || defaultFooter.companyName,
      companyTagline: body.companyTagline || defaultFooter.companyTagline,
      groupCompaniesLabel: body.groupCompaniesLabel || defaultFooter.groupCompaniesLabel,
      groupCompanies: Array.isArray(body.groupCompanies) ? body.groupCompanies : defaultFooter.groupCompanies,
      socialLinks: Array.isArray(body.socialLinks) ? body.socialLinks : defaultFooter.socialLinks,
      solutionsColumnTitle: body.solutionsColumnTitle || defaultFooter.solutionsColumnTitle,
      industriesColumnTitle: body.industriesColumnTitle || defaultFooter.industriesColumnTitle,
      quickLinksColumnTitle: body.quickLinksColumnTitle || defaultFooter.quickLinksColumnTitle,
      quickLinks: Array.isArray(body.quickLinks) ? body.quickLinks : defaultFooter.quickLinks,
      serviceAreasLabel: body.serviceAreasLabel || defaultFooter.serviceAreasLabel,
      serviceAreas: body.serviceAreas || defaultFooter.serviceAreas,
      officeLocation: body.officeLocation || defaultFooter.officeLocation,
      email: body.email || defaultFooter.email,
      emailLabel: body.emailLabel || defaultFooter.emailLabel,
      phone: body.phone || defaultFooter.phone,
      phoneLabel: body.phoneLabel || defaultFooter.phoneLabel,
      whatsappNumber: body.whatsappNumber || defaultFooter.whatsappNumber,
      copyrightText: body.copyrightText || defaultFooter.copyrightText
    };

    if (getDBStatus()) {
      const updated = await FooterConfig.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Footer configuration saved successfully', data: updated });
    } else {
      inMemoryFooter = { ...updateData };
      return res.json({ success: true, message: 'Footer configuration saved (In-Memory)', data: inMemoryFooter });
    }
  } catch (error) {
    console.error('Error in updateFooterConfig:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
