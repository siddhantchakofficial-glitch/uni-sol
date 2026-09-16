import Section5Config from '../models/Section5Config.js';
import { getDBStatus } from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

const processImageUpload = async (imgUrl, folder = 'section5_images') => {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('data:image')) {
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;
    if (hasCloudinary) {
      try {
        console.log(`Uploading image to Cloudinary (${folder})...`);
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

const defaultIndustries = [
  {
    id: 'aviation-security',
    title: 'Aviation Security',
    subtitle: 'Airports, Airlines, MRO Facilities & Cargo Terminals',
    description: 'Airports and aviation infrastructure demand impenetrable multi-tiered physical security and automated surveillance matrixes to protect passengers, aircraft fleet, cargo hubs, and restricted airside zones.',
    icon: 'fa-plane',
    image: '/images/ind1.jpg',
    link: '/industries/aviation-security',

    pageTitle: 'Aviation & Airport Security Systems',
    bannerTagline: 'ICAO & GCAA Compliant · High-Precision Airside Protection · 24/7 Command Control',
    heroCtaText: 'Request Aviation Security Audit',
    heroCtaLink: '/contact-us',

    overviewBadge: 'SECTOR OVERVIEW',
    overviewHeading: 'MISSION-CRITICAL AVIATION INFRASTRUCTURE DEFENCE',
    overviewParagraph1: 'Aviation security demands the highest levels of precision, compliance, and operational reliability. UniSpark deploys physical security infrastructure for airports, airline facilities, MRO operations, and cargo terminals — systems that meet international aviation security standards, integrate with existing airport management platforms, and support 24/7 operational environments.',
    overviewParagraph2: 'From perimeter perimeter intrusion detection along vast runaway boundaries to automated passenger biometric access check points, our engineers deliver unified command center solutions.',
    overviewImage: '/images/ind1.jpg',

    keyChallengesBadge: 'Sector Challenges',
    keyChallengesHeading: 'CRITICAL AVIATION THREAT VECTORS',
    keyChallenges: [
      { title: 'Perimeter Breaches', desc: 'Managing and monitoring vast geographical airport boundaries across miles of fencing.', icon: 'fa-triangle-exclamation' },
      { title: 'High Passenger Volume', desc: 'Processing thousands of passengers hourly without compromising speed or screening accuracy.', icon: 'fa-users' },
      { title: 'Aviation Compliance', desc: 'Fulfilling strict international ICAO, IATA, and GCAA civil aviation mandates.', icon: 'fa-file-shield' }
    ],

    solutionsProvidedBadge: 'Tailored Solutions',
    solutionsProvidedHeading: 'ENGINEERED AIRPORT SECURITY MATRIX',
    solutionsProvided: [
      { title: 'Thermal Perimeter Cameras', desc: 'Long-range thermal sensors paired with auto-tracking PTZ cameras along airside perimeters.', icon: 'fa-eye' },
      { title: 'Biometric Access Control', desc: 'High-speed facial & fingerprint gates for restricted staff & boarding zones.', icon: 'fa-fingerprint' },
      { title: 'X-Ray & Explosive Screening', desc: 'Seamless integration with baggage scanners and trace detectors.', icon: 'fa-suitcase-rolling' },
      { title: 'Unified Command SOC', desc: 'Centralized video wall operations for terminal-wide situational awareness.', icon: 'fa-desktop' }
    ],

    scopeBadge: 'Technical Scope',
    scopeHeading: 'COMPLETE AIRPORT SYSTEM INTEGRATION',
    scopeOfWork: [
      { title: 'Perimeter Intrusion Radar', desc: 'Ground surveillance radar integrated with PTZ cameras for zero blind spots.', icon: 'fa-radar' },
      { title: 'Airside Access Turnstiles', desc: 'Anti-tailgating full-height turnstiles with biometric validation.', icon: 'fa-door-closed' },
      { title: 'Cargo Depot CCTV', desc: 'Explosion-proof 4K cameras monitoring air cargo sorting and hazardous storage.', icon: 'fa-boxes-stacked' }
    ],

    brandsHeading: 'APPROVED AVIATION BRANDS',
    brandsSubheading: 'Built using international aviation-certified surveillance hardware.',
    brands: [
      { name: 'Bosch Aviation', src: '/images/pt1.jpg' },
      { name: 'Axis Communications', src: '/images/pt2.jpg' },
      { name: 'FLIR Systems', src: '/images/pt3.jpg' },
      { name: 'Honeywell Security', src: '/images/pt4.jpg' }
    ],

    whyBadge: 'WHY UNISPARK',
    whyHeading: 'Why Civil Aviation Authorities Choose UniSpark',
    whyChooseUs: [
      { title: 'GCAA Standard Compliance', desc: 'Full compliance with UAE General Civil Aviation Authority safety standards.', icon: 'fa-certificate' },
      { title: 'Zero Downtime Architecture', desc: 'Redundant power & failover NVR clusters ensuring constant uptime.', icon: 'fa-shield-halved' }
    ]
  },
  {
    id: 'real-estate-security',
    title: 'Real Estate Security',
    subtitle: 'Commercial Towers, Residential Communities, Retail & Developers',
    description: 'Modern commercial towers, luxury residential communities, and mega shopping malls require scalable security systems that provide seamless access for residents while maintaining high-tech safety surveillance.',
    icon: 'fa-building',
    image: '/images/ind2.jpg',
    link: '/industries/real-estate-security',

    pageTitle: 'Commercial & Residential Real Estate Security',
    bannerTagline: 'SIRA Certified · ANPR Parking Barriers · Smart App Intercoms · 24/7 CCTV',
    heroCtaText: 'Request Real Estate Assessment',
    heroCtaLink: '/contact-us',

    overviewBadge: 'SECTOR OVERVIEW',
    overviewHeading: 'NEXT-GEN SECURITY FOR COMMERCIAL & RESIDENTIAL ASSETS',
    overviewParagraph1: 'UniSpark engineers comprehensive security solutions tailored for commercial high-rises, gated residential developments, shopping centers, and mixed-use real estate projects.',
    overviewParagraph2: 'We unify ANPR parking gates, tenant access turnstiles, video intercoms, and Civil Defence-approved fire alarm panels into an integrated management console.',
    overviewImage: '/images/ind2.jpg',

    keyChallengesBadge: 'Sector Challenges',
    keyChallengesHeading: 'REAL ESTATE OPERATIONAL CHALLENGES',
    keyChallenges: [
      { title: 'Peak Traffic Visitor Access', desc: 'Controlling massive visitor and employee traffic flows during morning and evening rush hours.', icon: 'fa-users-line' },
      { title: 'Multi-Tenant System Fragmentation', desc: 'Integrating disjointed parking barriers, elevator access, and intercoms into one portal.', icon: 'fa-sitemap' },
      { title: 'Civil Defence Approval', desc: 'Meeting mandatory UAE Civil Defence regulations for fire alarm and emergency evacuation.', icon: 'fa-fire-extinguisher' }
    ],

    solutionsProvidedBadge: 'Tailored Solutions',
    solutionsProvidedHeading: 'COMPLETE PROPERTY PROTECTION SUITE',
    solutionsProvided: [
      { title: 'ANPR Barrier Gates', desc: 'High-accuracy automatic number plate recognition for seamless parking entry.', icon: 'fa-car' },
      { title: 'Smart App Intercoms', desc: 'HD video door stations connected directly to resident mobile apps.', icon: 'fa-mobile-retro' },
      { title: 'High-Density NVR CCTV', desc: '4K continuous surveillance across lobbies, corridors, parking levels, and common areas.', icon: 'fa-video' },
      { title: 'Elevator Access Control', desc: 'Restricting elevator floor activation based on authorized tenant keycards or face ID.', icon: 'fa-elevator' }
    ],

    brandsHeading: 'REAL ESTATE TECHNOLOGY PARTNERS',
    brandsSubheading: 'Trusted hardware powering premium UAE developments.',
    brands: [
      { name: 'Hikvision ANPR', src: '/images/pt1.jpg' },
      { name: 'Dahua Smart Intercom', src: '/images/pt2.jpg' },
      { name: 'ZKTeco Access', src: '/images/pt3.jpg' }
    ]
  },
  {
    id: 'oil-and-gas-security',
    title: 'Oil & Gas Security',
    subtitle: 'Upstream, Downstream, Refineries & Remote Field Sites',
    description: 'Energy infrastructure faces extreme environmental exposure and critical threat profiles. UniSpark engineers explosion-proof, heavy-duty surveillance and perimeter defence tailored for hazardous zone operations.',
    icon: 'fa-industry',
    image: '/images/ind3.jpg',
    link: '/industries/oil-and-gas-security',

    pageTitle: 'Oil & Gas Extreme Security Engineering',
    bannerTagline: 'ATEX / IECEx Certified · Explosion-Proof Enclosures · K12 Crash Barriers',
    heroCtaText: 'Request Oil & Gas Security Blueprint',
    heroCtaLink: '/contact-us',

    overviewBadge: 'SECTOR OVERVIEW',
    overviewHeading: 'HAZARDOUS ATMOSPHERE & CRITICAL ASSET DEFENCE',
    overviewParagraph1: 'Energy and petrochemical facilities operate under severe environmental conditions and stringent security protocols. UniSpark delivers explosion-proof ATEX-rated cameras, long-range thermal radar, and anti-ram physical barriers built specifically for refineries and remote pipelines.',
    overviewParagraph2: 'Our solutions withstand corrosive marine offshore humidity, intense desert heat, and hazardous gas environments without operational interruption.',
    overviewImage: '/images/ind3.jpg',

    keyChallengesBadge: 'Sector Challenges',
    keyChallengesHeading: 'ENERGY INFRASTRUCTURE THREAT LANDSCAPE',
    keyChallenges: [
      { title: 'Explosion Hazard Zones', desc: 'Strict requirements for ATEX Zone 1 & 2 non-sparking electrical equipment.', icon: 'fa-burst' },
      { title: 'Harsh Desert Environment', desc: 'Extreme temperatures, sandstorms, and coastal saltwater corrosion.', icon: 'fa-sun' },
      { title: 'Remote Pipeline Corridors', desc: 'Securing hundreds of kilometers of unstaffed pipeline infrastructure.', icon: 'fa-route' }
    ],

    solutionsProvidedBadge: 'Tailored Solutions',
    solutionsProvidedHeading: 'HARDENED INDUSTRIAL PROTECTION',
    solutionsProvided: [
      { title: 'ATEX Explosion-Proof Cameras', desc: 'Heavy stainless steel housings rated for Zone 1/2 explosive environments.', icon: 'fa-shield-halved' },
      { title: 'Fiber-Optic Perimeter Sensors', desc: 'Vibration-sensing fiber cables along fencing and buried pipelines.', icon: 'fa-wave-square' },
      { title: 'K12 / PAS68 Anti-Ram Barriers', desc: 'Hydraulic bollards and crash gates protecting entry checkpoints.', icon: 'fa-road-barrier' },
      { title: 'Flame & Gas Detection', desc: 'Ultra-fast optical flame detectors integrated into emergency shutdown systems.', icon: 'fa-fire' }
    ],

    brandsHeading: 'OIL & GAS CERTIFIED PARTNERS',
    brandsSubheading: 'Global leaders in hazardous area surveillance hardware.',
    brands: [
      { name: 'FLIR Thermal', src: '/images/pt1.jpg' },
      { name: 'Pelco Ex-Proof', src: '/images/pt2.jpg' },
      { name: 'Honeywell Industrial', src: '/images/pt3.jpg' }
    ]
  },
  {
    id: 'hospitality-security',
    title: 'Hospitality Security',
    subtitle: 'Hotels, Resorts, F&B & Luxury Entertainment Venues',
    description: 'Delivering world-class guest privacy and safety without intrusive friction. Our discrete security solutions blend harmoniously into luxury hotel architecture while keeping background operations vigilant.',
    icon: 'fa-hotel',
    image: '/images/ind4.jpg',
    link: '/industries/hospitality-security',

    pageTitle: 'Hospitality & Luxury Resort Security',
    bannerTagline: 'Discrete Aesthetics · RFID Room Locks · PMS Integration · Valet & Parking Security',
    heroCtaText: 'Request Hospitality Consultation',
    heroCtaLink: '/contact-us',

    overviewBadge: 'SECTOR OVERVIEW',
    overviewHeading: 'DISCRETE LUXURY PROTECTION & GUEST REASSURANCE',
    overviewParagraph1: 'In hospitality, security must be imperceptible to guests yet total in coverage. UniSpark balances high-end aesthetic luxury with powerful background surveillance, RFID/NFC door locks, and under-vehicle inspection for hotel drop-offs.',
    overviewParagraph2: 'We integrate room access systems directly with Hotel Property Management Systems (PMS) like Opera for seamless check-in and room access.',
    overviewImage: '/images/ind4.jpg',

    keyChallengesBadge: 'Sector Challenges',
    keyChallengesHeading: 'HOSPITALITY BALANCE & SAFETY',
    keyChallenges: [
      { title: 'Unobtrusive Aesthetics', desc: 'Installing cameras and readers that blend invisibly with luxury hotel interior design.', icon: 'fa-wand-magic-sparkles' },
      { title: 'Guest Room & VIP Privacy', desc: 'Safeguarding guest floors and private event spaces against unauthorized access.', icon: 'fa-user-lock' }
    ],

    solutionsProvidedBadge: 'Tailored Solutions',
    solutionsProvidedHeading: 'DISCRETE HOTEL SECURITY SOLUTIONS',
    solutionsProvided: [
      { title: 'Discrete Dome Cameras', desc: 'Ultra-low light 4K cameras with elegant architectural trim rings.', icon: 'fa-camera' },
      { title: 'RFID & Mobile Key Card Locks', desc: 'Bluetooth & NFC door locks linked to guest smartphone apps.', icon: 'fa-key' },
      { title: 'Under-Vehicle Surveillance', desc: 'High-speed scanning cameras at hotel valet and driveway entrances.', icon: 'fa-car-side' }
    ],

    brandsHeading: 'HOSPITALITY BRAND PARTNERS',
    brandsSubheading: '5-star hotel approved access and CCTV technologies.',
    brands: [
      { name: 'SALTO Systems', src: '/images/pt1.jpg' },
      { name: 'Assa Abloy VingCard', src: '/images/pt2.jpg' },
      { name: 'Axis Communications', src: '/images/pt3.jpg' }
    ]
  },
  {
    id: 'healthcare-security',
    title: 'Healthcare Security',
    subtitle: 'Hospitals, Medical Centers, Pharmacies & Research Laboratories',
    description: 'Hospitals require delicate access partitioning to safeguard operating theaters, intensive care units, and pharmaceutical inventory while welcoming patients and emergency traffic.',
    icon: 'fa-hospital',
    image: '/images/ind5.jpg',
    link: '/industries/healthcare-security',

    pageTitle: 'Healthcare Facility Security & Compliance',
    bannerTagline: 'Touchless Access · Narcotic Vault Security · Patient Safety · SIRA Compliant',
    heroCtaText: 'Request Healthcare Security Survey',
    heroCtaLink: '/contact-us',

    overviewBadge: 'SECTOR OVERVIEW',
    overviewHeading: 'HYGIENIC, SECURE ENVIRONMENT FOR PATIENTS & STAFF',
    overviewParagraph1: 'Healthcare facilities require complex access hierarchy — allowing open public access to reception and emergency rooms while tightly restricting drug stores, infant wards, and operating rooms.',
    overviewParagraph2: 'UniSpark provides touchless wave-to-open door automation, biometric access control for drug vaults, and continuous CCTV coverage across hospital corridors.',
    overviewImage: '/images/ind5.jpg',

    keyChallengesBadge: 'Sector Challenges',
    keyChallengesHeading: 'HEALTHCARE SAFETY CHALLENGES',
    keyChallenges: [
      { title: 'Narcotic & Vault Protection', desc: 'Securing pharmaceutical inventories against theft or unrecorded access.', icon: 'fa-pills' },
      { title: 'Hygienic Touchless Needs', desc: 'Preventing cross-contamination on door handles and access readers.', icon: 'fa-hand-sparkles' }
    ],

    solutionsProvidedBadge: 'Tailored Solutions',
    solutionsProvidedHeading: 'HOSPITAL SECURITY MATRIX',
    solutionsProvided: [
      { title: 'Touchless Wave Doors', desc: 'Infrared wave-to-open sensors for sterile surgical suites.', icon: 'fa-hand' },
      { title: 'Biometric Narcotics Access', desc: 'Dual-factor facial & fingerprint readers for pharmacy vaults.', icon: 'fa-lock' },
      { title: 'Infant Protection System', desc: 'RFID wristband tags triggering immediate lock-down on maternity exits.', icon: 'fa-baby-carriage' }
    ],

    brandsHeading: 'HEALTHCARE SECURITY PARTNERS',
    brandsSubheading: 'Medical-grade hardware certified for cleanroom environments.',
    brands: [
      { name: 'HID Global', src: '/images/pt1.jpg' },
      { name: 'Bosch Healthcare', src: '/images/pt2.jpg' },
      { name: 'ZKTeco Touchless', src: '/images/pt3.jpg' }
    ]
  },
  {
    id: 'consumer-security',
    title: 'Consumer Security',
    subtitle: 'Villas, Gated Compounds, Retail Outlets, SMEs & Warehouses',
    description: 'Smart, reliable protection for private homeowners, luxury villas, boutique retail shops, and commercial warehouse units with intuitive smart phone app control.',
    icon: 'fa-shield-halved',
    image: '/images/ind6.jpg',
    link: '/industries/consumer-security',

    pageTitle: 'Villa, Retail & SME Smart Security',
    bannerTagline: 'Smart App Control · 4K Color Night Vision · Wireless Alarms · Instant Mobile Alerts',
    heroCtaText: 'Request Villa / Retail Quote',
    heroCtaLink: '/contact-us',

    overviewBadge: 'SECTOR OVERVIEW',
    overviewHeading: 'SMART PROTECTION FOR VILLAS, RETAIL & SMALL BUSINESSES',
    overviewParagraph1: 'UniSpark delivers affordable, enterprise-grade security packages tailored for private villa owners, retail store chains, and SME warehouses.',
    overviewParagraph2: 'Enjoy peace of mind with 4K color night vision cameras, smart phone app notifications, fingerprint door locks, and wireless intruder alarms.',
    overviewImage: '/images/ind6.jpg',

    keyChallengesBadge: 'Sector Challenges',
    keyChallengesHeading: 'CONSUMER & SME CHALLENGES',
    keyChallenges: [
      { title: 'Remote Mobile Control', desc: 'Enabling homeowners to monitor cameras and unlock gates remotely while traveling.', icon: 'fa-mobile' },
      { title: 'Cost-Effective Reliability', desc: 'Delivering top-tier hardware without excessive maintenance overhead.', icon: 'fa-wallet' }
    ],

    solutionsProvidedBadge: 'Tailored Solutions',
    solutionsProvidedHeading: 'CONSUMER & RETAIL SECURITY SUITE',
    solutionsProvided: [
      { title: '4K Color Night Cameras', desc: 'Ultra HD CCTV with full-color vision even in pitch dark conditions.', icon: 'fa-eye' },
      { title: 'Wireless Intruder Alarms', desc: 'Door contact & motion sensors with immediate app push alerts.', icon: 'fa-bell' },
      { title: 'Smart Video Doorbells', desc: 'Two-way audio intercoms for villa entry gates.', icon: 'fa-bell-concierge' }
    ],

    brandsHeading: 'CONSUMER BRAND PARTNERS',
    brandsSubheading: 'Leading consumer & retail smart security brands.',
    brands: [
      { name: 'Ezviz Smart Home', src: '/images/pt1.jpg' },
      { name: 'Hikvision ColorVu', src: '/images/pt2.jpg' },
      { name: 'Imou Security', src: '/images/pt3.jpg' }
    ]
  }
];

const defaultSection5 = {
  title: 'INDUSTRIES WE SERVE',
  heading: 'Security Solutions Built for Your Sector',
  description: 'Deploying custom, advanced cyber-security, monitoring, and automated safety matrices engineered for enterprise ecosystems.',
  cards: defaultIndustries
};

let inMemorySection5 = { ...defaultSection5 };

export const getSection5Config = async (req, res) => {
  try {
    if (getDBStatus()) {
      let config = await Section5Config.findOne();
      if (!config) {
        config = await Section5Config.create(defaultSection5);
      } else {
        // Ensure default cards exist if database has empty or old schema
        if (!config.cards || config.cards.length < 6 || !config.cards[0].id) {
          config.cards = defaultIndustries;
          await config.save();
        }
      }
      return res.json({ success: true, data: config });
    } else {
      return res.json({ success: true, data: inMemorySection5 });
    }
  } catch (error) {
    console.error('Error in getSection5Config:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSection5Config = async (req, res) => {
  const { title, heading, description, cards } = req.body;
  try {
    let finalCards = [];
    if (Array.isArray(cards)) {
      finalCards = await Promise.all(cards.map(async (card) => {
        // Main card image
        let cardImage = await processImageUpload(card.image, 'industry_card');
        let overviewImg = await processImageUpload(card.overviewImage, 'industry_overview');

        // Process nested array images if present
        let processedChallenges = [];
        if (Array.isArray(card.keyChallenges)) {
          processedChallenges = await Promise.all(card.keyChallenges.map(async (item) => ({
            ...item,
            image: await processImageUpload(item.image, 'industry_challenges')
          })));
        }

        let processedSolutions = [];
        if (Array.isArray(card.solutionsProvided)) {
          processedSolutions = await Promise.all(card.solutionsProvided.map(async (item) => ({
            ...item,
            image: await processImageUpload(item.image, 'industry_solutions')
          })));
        }

        let processedScope = [];
        if (Array.isArray(card.scopeOfWork)) {
          processedScope = await Promise.all(card.scopeOfWork.map(async (item) => ({
            ...item,
            image: await processImageUpload(item.image, 'industry_scope')
          })));
        }

        let processedBrands = [];
        if (Array.isArray(card.brands)) {
          processedBrands = await Promise.all(card.brands.map(async (b) => ({
            ...b,
            src: await processImageUpload(b.src, 'industry_brands')
          })));
        }

        let processedSectors = [];
        if (Array.isArray(card.targetSectors)) {
          processedSectors = await Promise.all(card.targetSectors.map(async (item) => ({
            ...item,
            image: await processImageUpload(item.image, 'industry_sectors')
          })));
        }

        let processedWhy = [];
        if (Array.isArray(card.whyChooseUs)) {
          processedWhy = await Promise.all(card.whyChooseUs.map(async (item) => ({
            ...item,
            image: await processImageUpload(item.image, 'industry_why')
          })));
        }

        return {
          ...card,
          image: cardImage,
          overviewImage: overviewImg,
          keyChallenges: processedChallenges,
          solutionsProvided: processedSolutions,
          scopeOfWork: processedScope,
          brands: processedBrands,
          targetSectors: processedSectors,
          whyChooseUs: processedWhy
        };
      }));
    }

    const updateData = {
      title: title || defaultSection5.title,
      heading: heading || defaultSection5.heading,
      description: description || defaultSection5.description,
      cards: finalCards.length > 0 ? finalCards : defaultSection5.cards
    };

    if (getDBStatus()) {
      const updated = await Section5Config.findOneAndUpdate(
        {},
        { $set: updateData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, message: 'Industries configuration saved successfully', data: updated });
    } else {
      inMemorySection5 = { ...updateData };
      return res.json({ success: true, message: 'Industries configuration saved (In-Memory)', data: inMemorySection5 });
    }
  } catch (error) {
    console.error('Error in updateSection5Config:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
