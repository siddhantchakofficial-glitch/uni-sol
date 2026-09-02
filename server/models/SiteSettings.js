import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    general: {
      siteName: { type: String, default: 'UniSpark Innovation' },
      logo: { type: String, default: '/assets/logo.png' },
      favicon: { type: String, default: '/favicon.ico' },
      contactEmail: { type: String, default: 'info@unisparkinnovation.com' },
      phone: { type: String, default: '+91 11 4567 8900' },
      address: { type: String, default: 'Connaught Place, New Delhi, India' },
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
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
