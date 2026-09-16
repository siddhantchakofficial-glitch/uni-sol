import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    general: {
      siteName: { type: String, default: 'UniSpark Innovation' },
      logo: { type: String, default: '/assets/logo.png' },
      headerLogo: { type: String, default: '' },
      footerLogo: { type: String, default: '' },
      favicon: { type: String, default: '/favicon.ico' },
      contactEmail: { type: String, default: 'info@unisparkinnovation.com' },
      topbarEmail: { type: String, default: 'info@unisparkinnovation.com' },
      phone: { type: String, default: '+91 11 4567 8900' },
      address: { type: String, default: 'Connaught Place, New Delhi, India' },
      navCtaText: { type: String, default: 'CONTACT' },
      navCtaLink: { type: String, default: '/contact' },
      copyrightText: { type: String, default: '© {year} UniSpark Innovation Pvt. Ltd. All rights reserved.' },
      footerDescription: {
        type: String,
        default: 'UniSpark Innovation Private Limited is a DPIIT-recognized enterprise technology services company delivering CCTV video surveillance, access control, system integration, and global IT consulting across India and the UAE.',
      },
      newsletterTitle: { type: String, default: 'Subscribe to Insights' },
      newsletterText: {
        type: String,
        default: 'Stay updated with modern security tech trends, AI video analytics, and enterprise IT best practices.',
      },
      officeIndia: {
        label: { type: String, default: 'India Headquarters' },
        address: { type: String, default: 'UniSpark Innovation Pvt. Ltd., Connaught Place, New Delhi, India' },
        phone: { type: String, default: '+91 11 4567 8900' },
      },
      officeUAE: {
        label: { type: String, default: 'UAE Regional Office' },
        address: { type: String, default: 'UniSpark Innovation LLC, Business Bay, Dubai, UAE' },
        phone: { type: String, default: '+971 4 321 9876' },
      },
    },
    branding: {
      primaryColor: { type: String, default: '#0284c7' }, // Sky Blue
      secondaryColor: { type: String, default: '#0f172a' }, // Dark Slate
      accentColor: { type: String, default: '#38bdf8' },
      font: { type: String, default: 'Inter, sans-serif' },
      borderRadius: { type: String, default: '0.75rem' },
      buttonStyle: { type: String, default: 'rounded-xl' },
    },
    social: {
      instagram: { type: String, default: 'https://instagram.com' },
      facebook: { type: String, default: 'https://facebook.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      x: { type: String, default: 'https://x.com' },
    },
    integrations: {
      cloudinaryCloudName: { type: String, default: '' },
      analyticsId: { type: String, default: '' },
      paymentGateway: { type: String, default: 'Razorpay' },
      emailProvider: { type: String, default: 'SMTP' },
    },
    seo: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
