import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: String,
  desc: String,
  icon: String,
  image: String
}, { _id: false });

const brandSchema = new mongoose.Schema({
  name: String,
  src: String,
  category: String
}, { _id: false });

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  icon: { type: String, default: 'fa-building' },
  image: { type: String },
  link: { type: String },

  // INSIDE PAGE CMS FIELDS
  pageTitle: { type: String, default: '' },
  bannerTagline: { type: String, default: 'SIRA Compliant · 24/7 Monitoring · Rapid Deployment Across UAE' },
  heroCtaText: { type: String, default: 'Request Sector Assessment' },
  heroCtaLink: { type: String, default: '/contact-us' },

  overviewBadge: { type: String, default: 'SECTOR OVERVIEW' },
  overviewHeading: { type: String, default: '' },
  overviewParagraph1: { type: String, default: '' },
  overviewParagraph2: { type: String, default: '' },
  overviewImage: { type: String, default: '' },

  keyChallengesBadge: { type: String, default: 'Key Sector Security Challenges' },
  keyChallengesHeading: { type: String, default: 'CRITICAL SECURITY THREATS & COMPLIANCE DEMANDS' },
  keyChallenges: [itemSchema],

  solutionsProvidedBadge: { type: String, default: 'Tailored Security Solutions Implemented' },
  solutionsProvidedHeading: { type: String, default: 'ENGINEERED PHYSICAL & CYBER PROTECTION MATRIX' },
  solutionsProvided: [itemSchema],

  scopeBadge: { type: String, default: 'Technical Scope' },
  scopeHeading: { type: String, default: 'DEPLOYS & HARDWARE INTEGRATION' },
  scopeOfWork: [itemSchema],

  brandsHeading: { type: String, default: 'APPROVED ECOSYSTEM BRANDS' },
  brandsSubheading: { type: String, default: 'Enterprise-grade equipment from global security leaders.' },
  brands: [brandSchema],

  sectorsBadge: { type: String, default: 'Sub-Sectors' },
  sectorsHeading: { type: String, default: 'SPECIALIZED VERTICALS SERVED' },
  sectorsDesc: { type: String, default: '' },
  targetSectors: [itemSchema],

  whyBadge: { type: String, default: 'WHY UNISPARK' },
  whyHeading: { type: String, default: 'Why Leading Enterprises Trust UniSpark' },
  whyChooseUs: [itemSchema],

  ctaHeading: { type: String, default: 'Ready to Fortify Your Sector Operations?' },
  ctaDesc: { type: String, default: 'Our sector security specialists provide SIRA-compliant site surveys and custom system designs across all UAE emirates.' },
  ctaBtn1Text: { type: String, default: 'Request Sector Assessment' },
  ctaBtn1Link: { type: String, default: '/contact-us' },
  ctaBtn2Text: { type: String, default: 'Call Sector Engineers (+971 50 288 5874)' },
  ctaBtn2Link: { type: String, default: 'tel:+971502885874' }
}, { strict: false });

const section5ConfigSchema = new mongoose.Schema({
  title: { type: String, default: 'INDUSTRIES WE SERVE' },
  heading: { type: String, default: 'Security Solutions Built for Your Sector' },
  description: { type: String, default: 'Deploying custom, advanced cyber-security, monitoring, and automated safety matrices engineered for enterprise ecosystems.' },
  cards: [cardSchema]
}, { timestamps: true });

const Section5Config = mongoose.model('Section5Config', section5ConfigSchema);

export default Section5Config;
