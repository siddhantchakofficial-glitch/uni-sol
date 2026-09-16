import Section3Config from '../models/Section3Config.js';
import { getDBStatus } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

const processImageUpload = async (imgUrl, folder = 'solution_images') => {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) return imgUrl;
  if (imgUrl.startsWith('data:image/')) {
    const hasCloudinaryKeys =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;
    if (hasCloudinaryKeys) {
      try {
        const uploadRes = await cloudinary.uploader.upload(imgUrl, {
          folder: folder,
          resource_type: 'auto'
        });
        return uploadRes.secure_url;
      } catch (err) {
        console.error(`Cloudinary upload failed for ${folder}:`, err.message);
        return imgUrl;
      }
    }
  }
  return imgUrl;
};

const defaultServicesData = [
  {
    id: 'cctv-and-ip-camera-systems',
    title: 'CCTV & IP Camera Systems',
    icon: 'fa-video',
    desc: 'HD surveillance, remote monitoring, and smart analytics for complete site visibility.',
    featured: true,
    pageTitle: 'See Everything. Miss Nothing.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    bannerBgImage: '',
    heroCtaText: 'Request a CCTV Site Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE CCTV & IP CAMERA SYSTEMS',
    description: 'UniSpark delivers complete CCTV and IP camera solutions — from initial site survey and camera placement design through to installation, network configuration, remote viewing setup, and ongoing health monitoring.',
    secImage: '/images/cctv-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeSecImage: '',
    scopeOfWork: [
      { title: "Design & Survey", desc: "Site survey and camera placement design optimized for maximum visibility.", icon: "fa-map-location-dot" },
      { title: "Camera Supply & Setup", desc: "Supply and installation of IP and analog cameras.", icon: "fa-camera" },
      { title: "Storage & Config", desc: "DVR and NVR configuration and setup across all channel counts.", icon: "fa-server" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'Hikvision', src: '/images/pt1.jpg' },
      { name: 'Dahua', src: '/images/pt2.jpg' },
      { name: 'Axis', src: '/images/pt3.jpg' }
    ],
    ctaBgImage: ''
  },
  {
    id: 'access-control-systems',
    title: 'Access Control Systems',
    icon: 'fa-id-card-clip',
    desc: 'Card, biometric, and multi-factor access control for every door, gate, and perimeter.',
    featured: true,
    pageTitle: 'Control Who Enters. Protect What Matters.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    bannerBgImage: '',
    heroCtaText: 'Request an Access Control Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE ACCESS CONTROL SYSTEMS',
    description: 'UniSpark designs and installs access control systems that provide precise, auditable control over who can access which areas of your facility — and when.',
    secImage: '/images/access-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeSecImage: '',
    scopeOfWork: [
      { title: "Design & Planning", desc: "Access control system design and planning.", icon: "fa-compass" },
      { title: "Reader Installation", desc: "Card reader and biometric reader hardware deployment.", icon: "fa-id-card" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'ZKTeco', src: '/images/pt6.jpg' },
      { name: 'HID', src: '/images/pt7.jpg' }
    ],
    ctaBgImage: ''
  },
  {
    id: 'intruder-alarm-and-detection-systems',
    title: 'Intruder Alarm & Detection Systems',
    icon: 'fa-bell',
    desc: 'Motion, vibration, and perimeter detection systems connected to central monitoring.',
    featured: true,
    pageTitle: 'Detect Breaches Instantly. Neutralize Threats.',
    secImage: '/images/intruder-sec.jpg'
  },
  {
    id: 'video-intercom-and-door-entry-systems',
    title: 'Video Intercom & Door Entry Systems',
    icon: 'fa-door-open',
    desc: 'IP video door phones, multi-tenant intercoms, and remote mobile unlock solutions.',
    featured: true,
    pageTitle: 'Clear Communication. Verified Entry.',
    secImage: '/images/intercom-sec.jpg'
  },
  {
    id: 'perimeter-security-and-fencing-systems',
    title: 'Perimeter Security & Fencing Systems',
    icon: 'fa-shield-halved',
    desc: 'Infrared beams, fence sensors, bollards, and active perimeter intrusion detection.',
    featured: true,
    pageTitle: 'Impenetrable Boundaries. Active Defence.',
    secImage: '/images/perimeter-sec.jpg'
  },
  {
    id: 'fire-alarm-and-detection-systems',
    title: 'Fire Alarm & Detection Systems',
    icon: 'fa-fire-extinguisher',
    desc: 'UAE Civil Defence-compliant fire detection and alarm systems for all building types.',
    featured: true,
    pageTitle: 'Early Detection. Lifesaving Safety.',
    secImage: '/images/fire-sec.jpg'
  },
  {
    id: 'biometric-and-smart-security-systems',
    title: 'Biometric & Smart Security Systems',
    icon: 'fa-fingerprint',
    desc: 'Fingerprint, face recognition, and iris scan systems integrated with HR and payroll.',
    featured: true,
    pageTitle: 'Identity Verified. Frictionless Access.',
    secImage: '/images/biometric-sec.jpg'
  },
  {
    id: 'system-integration-and-control-room-setup',
    title: 'System Integration & Control Room Setup',
    icon: 'fa-display',
    desc: 'Unified security management platforms, SOC design, video walls, and PSIM software.',
    featured: true,
    pageTitle: 'Unified Command. Real-Time Operations.',
    secImage: '/images/system-sec.jpg'
  },
  {
    id: 'maintenance-contracts',
    title: 'Maintenance Contracts — AMC & PMC',
    icon: 'fa-screwdriver-wrench',
    desc: '24/7 SLA-governed annual maintenance, preventive health checks, and emergency repairs.',
    featured: true,
    pageTitle: 'Zero Downtime. Guaranteed SLAs.',
    secImage: '/images/maintain-sec.jpg'
  }
];

const defaultSection3 = {
  badgeText: 'WHAT WE DO',
  mainHeading: 'End-to-End Physical Security Solutions',
  description: 'From initial site survey and system design through to professional installation, commissioning, and long-term maintenance — UniSpark delivers complete security infrastructure for every environment.',
  viewAllButton: {
    text: 'View All Services',
    link: '/solutions'
  },
  services: defaultServicesData
};

let inMemorySection3 = { ...defaultSection3 };

// GET /api/section3 - Retrieve Section 3 Configuration
export const getSection3Config = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await Section3Config.findOne();
      if (!config) {
        config = await Section3Config.create(defaultSection3);
      } else if (Array.isArray(config.services)) {
        let updated = false;
        const existingIds = new Set(config.services.map(s => s.id));
        for (const defaultService of defaultSection3.services) {
          if (!existingIds.has(defaultService.id)) {
            config.services.push(defaultService);
            updated = true;
          }
        }
        if (updated) {
          await config.save();
        }
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemorySection3 });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/section3 - Update Section 3 Configuration
export const updateSection3Config = async (req, res) => {
  const { badgeText, mainHeading, description, viewAllButton, services } = req.body;

  try {
    let processedServices = [];
    if (Array.isArray(services)) {
      for (const item of services) {
        const finalIconUrl = await processImageUpload(item.iconUrl, 'service_icons');
        const finalSecImage = await processImageUpload(item.secImage, 'solution_overview');
        const finalBannerBgImage = await processImageUpload(item.bannerBgImage, 'solution_banners');
        const finalScopeSecImage = await processImageUpload(item.scopeSecImage, 'solution_scope');
        const finalCtaBgImage = await processImageUpload(item.ctaBgImage, 'solution_cta');

        // Process Brands Image Uploads
        let processedBrands = [];
        if (Array.isArray(item.brands)) {
          for (const brand of item.brands) {
            const brandSrc = await processImageUpload(brand.src || brand.logoUrl, 'solution_brands');
            processedBrands.push({
              name: brand.name || brand.alt || '',
              src: brandSrc
            });
          }
        }

        // Process Targeted Sectors Image Uploads
        let processedSectors = [];
        if (Array.isArray(item.targetSectors)) {
          for (const sec of item.targetSectors) {
            const sectorImg = await processImageUpload(sec.secImage || sec.iconUrl, 'solution_sectors');
            processedSectors.push({
              title: sec.title || '',
              desc: sec.desc || '',
              icon: sec.icon || 'fa-building',
              secImage: sectorImg
            });
          }
        }

        // Process Why Choose Us Image Uploads
        let processedWhy = [];
        if (Array.isArray(item.whyChooseUs)) {
          for (const why of item.whyChooseUs) {
            const whyImg = await processImageUpload(why.whyImage || why.iconUrl, 'solution_why');
            processedWhy.push({
              title: why.title || '',
              desc: why.desc || '',
              icon: why.icon || 'fa-check',
              whyImage: whyImg
            });
          }
        }

        processedServices.push({
          ...item,
          id: item.id || `service-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title: item.title,
          desc: item.desc || item.description || '',
          icon: item.icon || 'fa-shield-halved',
          iconUrl: finalIconUrl || '',
          secImage: finalSecImage || item.secImage || '',
          bannerBgImage: finalBannerBgImage || '',
          scopeSecImage: finalScopeSecImage || '',
          ctaBgImage: finalCtaBgImage || '',
          brands: processedBrands,
          targetSectors: processedSectors,
          whyChooseUs: processedWhy,
          featured: item.featured !== undefined ? !!item.featured : true
        });
      }
    } else {
      processedServices = defaultSection3.services;
    }

    const updateData = {
      badgeText: badgeText || defaultSection3.badgeText,
      mainHeading: mainHeading || defaultSection3.mainHeading,
      description: description || defaultSection3.description,
      viewAllButton: {
        text: viewAllButton?.text || defaultSection3.viewAllButton.text,
        link: viewAllButton?.link || defaultSection3.viewAllButton.link
      },
      services: processedServices
    };

    if (getDBStatus()) {
      const updated = await Section3Config.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Section 3 configuration saved in MongoDB Atlas', data: updated });
    } else {
      inMemorySection3 = { ...updateData };
      return res.json({ success: true, message: 'Section 3 configuration saved (In-Memory)', data: inMemorySection3 });
    }
  } catch (error) {
    console.error('Error in updateSection3Config:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
