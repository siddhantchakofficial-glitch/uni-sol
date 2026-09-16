import mongoose from 'mongoose';

const companyLinkSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  url: { type: String, default: '' }
}, { _id: false });

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, default: '' }, // facebook, instagram, x-twitter, linkedin-in, youtube
  url: { type: String, default: '' },
  icon: { type: String, default: '' } // fa-brands fa-facebook-f
}, { _id: false });

const quickLinkSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  url: { type: String, default: '' }
}, { _id: false });

const footerConfigSchema = new mongoose.Schema({
  // Brand Info
  logoUrl: { type: String, default: '/images/logo.png' },
  companyName: { type: String, default: 'UniSpark Innovation Security Systems & Equipment Trading L.L.C' },
  companyTagline: { type: String, default: 'Next-generation enterprise protection and cyber-physical infrastructure logic designed for global digital business velocity.' },
  groupCompaniesLabel: { type: String, default: 'Group Companies:' },
  groupCompanies: [companyLinkSchema],
  socialLinks: [socialLinkSchema],

  // Solutions Column
  solutionsColumnTitle: { type: String, default: 'SOLUTIONS' },
  // (solutions list is pulled from /api/section3 live)

  // Industries Column
  industriesColumnTitle: { type: String, default: 'INDUSTRIES' },
  // (industries list is pulled from /api/section5 live)

  // Quick Links Column
  quickLinksColumnTitle: { type: String, default: 'QUICK LINKS' },
  quickLinks: [quickLinkSchema],

  // Contact Strip
  serviceAreasLabel: { type: String, default: 'Service Areas:' },
  serviceAreas: { type: String, default: 'Dubai | Abu Dhabi | Sharjah | UAE Nationwide' },
  officeLocation: { type: String, default: 'Dubai, United Arab Emirates' },
  email: { type: String, default: 'sales@unisparkinnovation.com' },
  emailLabel: { type: String, default: 'Sales' },
  phone: { type: String, default: '+971 50 288 5874' },
  phoneLabel: { type: String, default: 'Call' },
  whatsappNumber: { type: String, default: '971502885874' },

  // Copyright
  copyrightText: { type: String, default: 'UniSpark Innovation Security Systems & Equipment Trading L.L.C. All rights reserved.' },

}, { timestamps: true });

const FooterConfig = mongoose.model('FooterConfig', footerConfigSchema);
export default FooterConfig;
