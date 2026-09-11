import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import User from './models/User.js';
import Page from './models/Page.js';
import Menu from './models/Menu.js';
import Form from './models/Form.js';
import SiteSettings from './models/SiteSettings.js';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore if restricted
}

const seedData = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uni-sol-cms';
    if (mongoUri.includes('.mongodb.net/?')) {
      mongoUri = mongoUri.replace('.mongodb.net/?', '.mongodb.net/unisol?');
    }
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing CMS collections...');
    await User.deleteMany({});
    await Page.deleteMany({});
    await Menu.deleteMany({});
    await Form.deleteMany({});
    await SiteSettings.deleteMany({});

    console.log('Seeding Super Admin User...');
    const admin = await User.create({
      username: 'admin',
      email: 'admin@unispark.com',
      passwordHash: 'Admin@123456',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    });

    console.log('Seeding Default Site Settings...');
    await SiteSettings.create({
      general: {
        siteName: 'UniSpark Innovation',
        logo: '/assets/logo.png',
        favicon: '/favicon.ico',
        contactEmail: 'info@unisparkinnovation.com',
        phone: '+91 11 4567 8900',
        address: 'Connaught Place, New Delhi, India & Business Bay, Dubai, UAE',
      },
      branding: {
        primaryColor: '#0284c7',
        secondaryColor: '#0f172a',
        accentColor: '#38bdf8',
        font: 'Inter, sans-serif',
        borderRadius: '0.75rem',
        buttonStyle: 'rounded-xl',
      },
      social: {
        instagram: 'https://instagram.com/unispark',
        facebook: 'https://facebook.com/unispark',
        linkedin: 'https://linkedin.com/company/unispark',
        youtube: 'https://youtube.com',
        x: 'https://x.com/unispark',
      },
    });

    console.log('Seeding Navigation Menus...');
    await Menu.create([
      {
        name: 'header',
        title: 'Main Navigation Header',
        items: [
          { id: 'm1', label: 'Home', url: '/' },
          { id: 'm2', label: 'About', url: '/about' },
          { id: 'm3', label: 'Capabilities', url: '/capabilities' },
          { id: 'm4', label: 'Industries', url: '/industries' },
          { id: 'm5', label: 'International', url: '/international' },
          { id: 'm6', label: 'Contact', url: '/contact' },
        ],
      },
      {
        name: 'footer',
        title: 'Footer Quick Links',
        items: [
          { id: 'f1', label: 'Privacy Policy', url: '/privacy-policy' },
          { id: 'f2', label: 'Terms of Service', url: '/terms' },
          { id: 'f3', label: 'Cookie Policy', url: '/cookie-policy' },
          { id: 'f4', label: 'Disclaimer', url: '/disclaimer' },
        ],
      },
    ]);

    console.log('Seeding Forms...');
    await Form.create({
      title: 'Executive Security Inquiry Form',
      slug: 'contact-form',
      description: 'Schedule a security advisory session with UniSpark specialists.',
      submitButtonText: 'Submit Inquiry',
      fields: [
        { id: 'f_name', label: 'Full Name', type: 'text', name: 'fullName', required: true, placeholder: 'John Doe' },
        { id: 'f_email', label: 'Work Email', type: 'email', name: 'email', required: true, placeholder: 'john@company.com' },
        { id: 'f_phone', label: 'Phone Number', type: 'phone', name: 'phone', required: true, placeholder: '+91 98765 43210' },
        { id: 'f_msg', label: 'Security Requirements', type: 'textarea', name: 'message', required: false, placeholder: 'Describe project specs...' },
      ],
    });

    console.log('Seeding Default Pages...');
    await Page.create({
      title: 'Home Page',
      slug: 'home',
      status: 'published',
      author: admin._id,
      authorName: 'Admin',
      publishedAt: new Date(),
      draftVersion: {
        sections: [
          {
            id: 'sec_hero_1',
            type: 'hero',
            name: 'Hero Banner',
            hidden: false,
            order: 1,
            content: {
              badge: 'DPIIT Recognized Tech Enterprise',
              heading: 'Next-Generation Enterprise Security & Digital Transformation',
              description: 'UniSpark Innovation engineers AI-powered CCTV surveillance, biometric access control, fire safety systems, and unified PSIM command centers.',
              primaryBtnText: 'Explore Capabilities',
              primaryBtnLink: '/capabilities',
              secondaryBtnText: 'About UniSpark',
              secondaryBtnLink: '/about',
              imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
            },
            styles: { background: '#090d16', textColor: '#ffffff', paddingTop: 120, paddingBottom: 100 },
            animation: 'fade',
          },
          {
            id: 'sec_features_1',
            type: 'features',
            name: 'Key Features Grid',
            hidden: false,
            order: 2,
            content: {
              title: 'Enterprise Security Solutions',
              subtitle: 'Tailored for Mission-Critical Infrastructure',
              featuresList: [
                { icon: 'Shield', title: 'AI CCTV & Analytics', description: 'Real-time facial detection, intrusion alerts, and perimeter monitoring.' },
                { icon: 'Lock', title: 'Biometric Access', description: 'Multi-factor RFID, biometric scanners, and turnstile gates.' },
                { icon: 'Activity', title: 'PSIM Command Centers', description: 'Unified telemetry dashboard for cross-facility command.' },
                { icon: 'Zap', title: 'Fire & Safety Automation', description: 'Early smoke sensing, automated alerts, and suppression response.' },
              ],
            },
            styles: { background: '#0f172a', textColor: '#f8fafc', paddingTop: 80, paddingBottom: 80 },
            animation: 'slide',
          },
          {
            id: 'sec_cta_1',
            type: 'cta',
            name: 'Bottom Call-To-Action',
            hidden: false,
            order: 3,
            content: {
              heading: 'Ready to Upgrade Your Enterprise Security Infrastructure?',
              description: 'Talk to our security architects for a comprehensive facility audit.',
              buttonText: 'Request Security Audit',
              buttonLink: '/contact',
            },
            styles: { background: '#0284c7', textColor: '#ffffff', paddingTop: 80, paddingBottom: 80 },
            animation: 'scale',
          },
        ],
        seo: { title: 'UniSpark Innovation - Enterprise Security Solutions', description: 'AI-Powered Security & Automation' },
      },
      publishedVersion: {
        sections: [
          {
            id: 'sec_hero_1',
            type: 'hero',
            name: 'Hero Banner',
            hidden: false,
            order: 1,
            content: {
              badge: 'DPIIT Recognized Tech Enterprise',
              heading: 'Next-Generation Enterprise Security & Digital Transformation',
              description: 'UniSpark Innovation engineers AI-powered CCTV surveillance, biometric access control, fire safety systems, and unified PSIM command centers.',
              primaryBtnText: 'Explore Capabilities',
              primaryBtnLink: '/capabilities',
              secondaryBtnText: 'About UniSpark',
              secondaryBtnLink: '/about',
              imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
            },
            styles: { background: '#090d16', textColor: '#ffffff', paddingTop: 120, paddingBottom: 100 },
            animation: 'fade',
          },
        ],
        seo: { title: 'UniSpark Innovation - Enterprise Security Solutions', description: 'AI-Powered Security & Automation' },
      },
    });

    console.log('Seeding complete! Database ready.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
