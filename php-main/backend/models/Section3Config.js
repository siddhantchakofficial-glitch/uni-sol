import mongoose from 'mongoose';

const scopeSchema = new mongoose.Schema({
  title: String,
  desc: String,
  icon: String
});

const brandSchema = new mongoose.Schema({
  name: String,
  src: String
});

const sectorSchema = new mongoose.Schema({
  title: String,
  icon: String,
  desc: String
});

const whySchema = new mongoose.Schema({
  title: String,
  icon: String,
  desc: String
});

const serviceSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  desc: { type: String, default: '' },
  icon: { type: String, default: 'fa-shield-halved' },
  iconUrl: { type: String, default: '' },
  featured: { type: Boolean, default: true },

  // FULL INSIDE PAGE CMS FIELDS
  pageTitle: { type: String, default: '' },
  bannerTagline: { type: String, default: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage' },
  heroCtaText: { type: String, default: 'Request a Site Survey' },
  heroCtaLink: { type: String, default: '/contact-us' },

  overviewBadge: { type: String, default: 'SERVICE OVERVIEW' },
  overviewHeading: { type: String, default: '' },
  description: { type: String, default: '' },
  secImage: { type: String, default: '' },

  scopeBadge: { type: String, default: 'Scope of Work' },
  scopeHeading: { type: String, default: "WHAT'S INCLUDED IN OUR SERVICE" },
  scopeOfWork: [scopeSchema],

  brandsHeading: { type: String, default: 'KEY BRANDS & TECHNOLOGY' },
  brands: [brandSchema],

  sectorsBadge: { type: String, default: 'Targeted Sectors' },
  sectorsHeading: { type: String, default: 'INDUSTRIES SERVED' },
  sectorsDesc: { type: String, default: '' },
  targetSectors: [sectorSchema],

  whyBadge: { type: String, default: 'WHY CHOOSE US' },
  whyHeading: { type: String, default: 'Why UniSpark For This Service' },
  whyChooseUs: [whySchema],

  ctaHeading: { type: String, default: '' },
  ctaDesc: { type: String, default: 'Our engineers are available for site surveys across Dubai, Abu Dhabi, Sharjah, and all UAE locations.' },
  ctaBtn1Text: { type: String, default: 'Request a Site Survey' },
  ctaBtn1Link: { type: String, default: '/contact-us' },
  ctaBtn2Text: { type: String, default: 'Call Our Team (+971 50 288 5874)' },
  ctaBtn2Link: { type: String, default: 'tel:+971502885874' }
}, { strict: false });

const defaultServicesData = [
  {
    id: 'cctv-and-ip-camera-systems',
    title: 'CCTV & IP Camera Systems',
    icon: 'fa-video',
    desc: 'HD surveillance, remote monitoring, and smart analytics for complete site visibility.',
    featured: true,
    pageTitle: 'See Everything. Miss Nothing.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: 'Request a CCTV Site Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE CCTV & IP CAMERA SYSTEMS',
    description: 'UniSpark delivers complete CCTV and IP camera solutions — from initial site survey and camera placement design through to installation, network configuration, remote viewing setup, and ongoing health monitoring. We supply and install systems from the world\'s leading brands, tailored to the exact requirements of your site.',
    secImage: '/images/cctv-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork: [
      { title: "Design & Survey", desc: "Site survey and camera placement design optimized for maximum visibility.", icon: "fa-map-location-dot" },
      { title: "Camera Supply & Setup", desc: "Supply and installation of IP and analog cameras (fixed, PTZ, dome, bullet, fisheye, thermal, 4K).", icon: "fa-camera" },
      { title: "Storage & Config", desc: "DVR and NVR configuration and setup across all channel counts.", icon: "fa-server" },
      { title: "Infrastructure", desc: "Network switch provisioning and robust structured cabling infrastructure.", icon: "fa-network-wired" },
      { title: "Remote Control", desc: "Remote viewing setup featuring streamlined mobile and PC access interfaces.", icon: "fa-mobile-screen-button" },
      { title: "PTZ Programming", desc: "Advanced PTZ camera programming alongside custom auto-tracking configurations.", icon: "fa-sliders" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'Hikvision', src: '/images/pt1.jpg' },
      { name: 'Dahua', src: '/images/pt2.jpg' },
      { name: 'Axis', src: '/images/pt3.jpg' },
      { name: 'Bosch', src: '/images/pt4.jpg' }
    ]
  },
  {
    id: 'access-control-systems',
    title: 'Access Control Systems',
    icon: 'fa-id-card-clip',
    desc: 'Card, biometric, and multi-factor access control for every door, gate, and perimeter.',
    featured: true,
    pageTitle: 'Control Who Enters. Protect What Matters.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: 'Request an Access Control Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE ACCESS CONTROL SYSTEMS',
    description: 'UniSpark designs and installs access control systems that provide precise, auditable control over who can access which areas of your facility — and when.',
    secImage: '/images/access-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork: [
      { title: "Design & Planning", desc: "Access control system design and planning tailored for optimal facility security mapping.", icon: "fa-compass" },
      { title: "Reader Installation", desc: "Card reader (RFID, Mifare, HID) and advanced biometric reader hardware deployment.", icon: "fa-id-card" },
      { title: "Locking Hardware", desc: "Magnetic lock and heavy-duty electric strike hardware installation.", icon: "fa-lock" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'ZKTeco', src: '/images/pt6.jpg' },
      { name: 'HID', src: '/images/pt7.jpg' },
      { name: 'Lenel', src: '/images/lenel.jpg' }
    ]
  },
  {
    id: 'intruder-alarm-and-detection-systems',
    title: 'Intruder Alarm & Detection Systems',
    icon: 'fa-bell',
    desc: 'Motion, vibration, and perimeter detection systems connected to central monitoring.',
    featured: true,
    pageTitle: 'Detect Breaches Instantly. Neutralize Threats.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: 'Request an Intruder Alarm Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE INTRUDER ALARM & DETECTION SYSTEMS',
    description: 'Protect your commercial and residential premises against unauthorized entry, burglary, and perimeter intrusion.',
    secImage: '/images/intruder-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork: [
      { title: "Perimeter Motion Sensing", desc: "Dual-tech PIR and microwave motion detectors for indoor and outdoor coverage.", icon: "fa-bell" },
      { title: "Control Panel Setup", desc: "Hybrid wired/wireless main intruder alarm panel programming and setup.", icon: "fa-sliders" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'Honeywell Galaxy', src: '/images/galaxy.jpg' },
      { name: 'Pyronix', src: '/images/pyronix.jpg' }
    ]
  },
  {
    id: 'video-intercom-and-door-entry-systems',
    title: 'Video Intercom & Door Entry Systems',
    icon: 'fa-door-open',
    desc: 'IP video door phones, multi-tenant intercoms, and remote mobile unlock solutions.',
    featured: true,
    pageTitle: 'Clear Communication. Verified Entry.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: 'Request a Video Intercom Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE VIDEO INTERCOM SYSTEMS',
    description: 'Enhance access convenience and entry security with UniSpark\'s video intercom and door entry systems.',
    secImage: '/images/intercom-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork: [
      { title: "IP Outdoor Door Panels", desc: "Vandal-resistant stainless steel video door stations with HD camera lens.", icon: "fa-door-open" },
      { title: "Touchscreen Indoor Units", desc: "High-resolution indoor monitor stations with 2-way audio and door release.", icon: "fa-tv" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'Comelit', src: '/images/comelit.jpg' },
      { name: 'Fermax', src: '/images/fermax.jpg' }
    ]
  },
  {
    id: 'perimeter-security-and-fencing-systems',
    title: 'Perimeter Security & Fencing Systems',
    icon: 'fa-shield-halved',
    desc: 'Infrared beams, fence sensors, bollards, and active perimeter intrusion detection.',
    featured: true,
    pageTitle: 'Impenetrable Boundaries. Active Defence.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: 'Request a Perimeter Security Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE PERIMETER SECURITY SYSTEMS',
    description: 'UniSpark deploys high-grade physical and electronic perimeter security solutions designed to protect critical infrastructure.',
    secImage: '/images/perimeter-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork: [
      { title: "Anti-Climb Security Fencing", desc: "High-security welded mesh 358 anti-climb and anti-cut fencing panels.", icon: "fa-border-top-left" },
      { title: "Fiber-Optic Fence Sensors", desc: "Fiber-optic vibration sensing cable mounted along fence perimeters.", icon: "fa-wave-square" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'Southwest Microwave', src: '/images/southwest-microwave.jpg' },
      { name: 'Gallagher Perimeter', src: '/images/gallagher.jpg' }
    ]
  },
  {
    id: 'fire-alarm-and-detection-systems',
    title: 'Fire Alarm & Detection Systems',
    icon: 'fa-fire-extinguisher',
    desc: 'UAE Civil Defence-compliant fire detection and alarm systems for all building types.',
    featured: true,
    pageTitle: 'Early Detection. Lifesaving Safety.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: 'Request a Fire Alarm Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE FIRE ALARM & DETECTION SYSTEMS',
    description: 'UniSpark provides certified fire detection, smoke extraction, and life safety matrices engineered in strict compliance with UAE Civil Defence standards.',
    secImage: '/images/fire-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork: [
      { title: "Addressable Panels", desc: "Main addressable fire alarm control panel installation and zone loop wiring.", icon: "fa-fire-extinguisher" },
      { title: "Optical Smoke Detectors", desc: "High-sensitivity photoelectric smoke and heat thermal detector deployment.", icon: "fa-bullseye" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'Hochiki', src: '/images/hochiki.jpg' },
      { name: 'Edwards', src: '/images/edwards.jpg' }
    ]
  },
  {
    id: 'biometric-and-smart-security-systems',
    title: 'Biometric & Smart Security Systems',
    icon: 'fa-fingerprint',
    desc: 'Fingerprint, face recognition, and iris scan systems integrated with HR and payroll.',
    featured: true,
    pageTitle: 'Identity Verified. Frictionless Access.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: 'Request a Biometrics Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE BIOMETRIC SECURITY SYSTEMS',
    description: 'Leverage AI-driven biometric identification for uncompromised access authentication. Touchless face recognition, palm vein scanners, and iris readers.',
    secImage: '/images/biometric-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork: [
      { title: "Touchless Face Terminals", desc: "AI-powered facial recognition terminals with temperature detection.", icon: "fa-user-check" },
      { title: "Fingerprint Readers", desc: "Optical and capacitive fingerprint scanners for doors and attendance.", icon: "fa-fingerprint" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'ZKTeco', src: '/images/pt6.jpg' },
      { name: 'Innovatrics', src: '/images/innovatrics.jpg' }
    ]
  },
  {
    id: 'system-integration-and-control-room-setup',
    title: 'System Integration & Control Room Setup',
    icon: 'fa-display',
    desc: 'Unified security management platforms, SOC design, video walls, and PSIM software.',
    featured: true,
    pageTitle: 'Unified Command. Real-Time Operations.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: 'Request a Control Room Survey',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE CONTROL ROOM & SYSTEM INTEGRATION',
    description: 'Unify disparate security subsystems into a cohesive, single-pane command center.',
    secImage: '/images/system-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork: [
      { title: "Video Wall Matrix", desc: "Ultra-narrow bezel LED/LCD video wall display installation and video processors.", icon: "fa-display" },
      { title: "PSIM Software Platform", desc: "Physical Security Information Management platform connecting CCTV, Access & Alarms.", icon: "fa-laptop-code" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'PSIM Management', src: '/images/psim.jpg' },
      { name: 'IndigoVision', src: '/images/indigovision.jpg' }
    ]
  },
  {
    id: 'maintenance-contracts',
    title: 'Maintenance Contracts — AMC & PMC',
    icon: 'fa-screwdriver-wrench',
    desc: '24/7 SLA-governed annual maintenance, preventive health checks, and emergency repairs.',
    featured: true,
    pageTitle: 'Zero Downtime. Guaranteed SLAs.',
    bannerTagline: 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: 'Request an AMC Maintenance Proposal',
    heroCtaLink: '/contact-us',
    overviewBadge: 'SERVICE OVERVIEW',
    overviewHeading: 'COMPLETE MAINTENANCE CONTRACTS (AMC & PMC)',
    description: 'Ensure 100% uptime for your critical safety and security infrastructure.',
    secImage: '/images/maintain-sec.jpg',
    scopeBadge: 'Scope of Work',
    scopeHeading: "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork: [
      { title: "24/7 Emergency Dispatch", desc: "Dedicated round-the-clock technical helpline with rapid engineer dispatch.", icon: "fa-headset" },
      { title: "Guaranteed SLA Times", desc: "Contractually committed 2-hour on-site emergency response SLA across UAE.", icon: "fa-clock" }
    ],
    brandsHeading: 'KEY BRANDS & TECHNOLOGY',
    brands: [
      { name: 'Hikvision AMC', src: '/images/pt1.jpg' },
      { name: 'Dahua AMC', src: '/images/pt2.jpg' }
    ]
  }
];

const section3ConfigSchema = new mongoose.Schema({
  badgeText: {
    type: String,
    default: 'WHAT WE DO'
  },
  mainHeading: {
    type: String,
    default: 'End-to-End Physical Security Solutions'
  },
  description: {
    type: String,
    default: 'From initial site survey and system design through to professional installation, commissioning, and long-term maintenance — UniSpark delivers complete security infrastructure for every environment.'
  },
  viewAllButton: {
    text: { type: String, default: 'View All Services' },
    link: { type: String, default: '/solutions' }
  },
  services: {
    type: [serviceSchema],
    default: defaultServicesData
  }
}, {
  timestamps: true
});

const Section3Config = mongoose.model('Section3Config', section3ConfigSchema);
export default Section3Config;
