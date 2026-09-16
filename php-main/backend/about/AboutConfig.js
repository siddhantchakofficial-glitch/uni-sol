import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  title: { type: String, default: 'OUR MISSION' },
  description: { type: String, default: 'To be the UAEs most reliable security systems partner...' },
  icon: { type: String, default: 'Target' } // Lucide icon name
});

const visionSchema = new mongoose.Schema({
  title: { type: String, default: 'OUR VISION' },
  description: { type: String, default: 'To become a leading UAE security brand...' },
  icon: { type: String, default: 'Eye' } // Lucide icon name
});

const glanceCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String, required: true } // Lucide icon name
});

const groupCardSchema = new mongoose.Schema({
  tag: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: 'Core Business:' },
  tags: [{ type: String }],
  icon: { type: String, default: 'Building2' },
  link: { type: String, default: '' },
  disclaimer: { type: String, default: '' }
});

const diffCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String, default: 'ShieldCheck' }
});

const aboutConfigSchema = new mongoose.Schema({
  bannerBadge: { type: String, default: 'ABOUT UNISPARK SECURITY' },
  bannerTitle: { type: String, default: 'About UniSpark Security Systems' },
  bannerDesc: { type: String, default: 'UniSpark Innovation Security Systems & Equipment Trading L.L.C is a Dubai-registered company specializing in end-to-end physical security solutions — from design and supply to professional installation, commissioning, and long-term AMC maintenance. We serve enterprises, real estate developers, aviation facilities, oil & gas installations, hospitality groups, healthcare institutions, and consumer properties across the UAE.' },
  bannerBgImage: { type: String, default: '' },
  
  mainHeading: { type: String, default: 'WHO WE ARE' },
  mainDesc: { type: String, default: 'We are a physical security company built on technical credibility, regulatory compliance, and a deep understanding of the UAE market. Our engineers have hands-on experience across every system category we offer — CCTV, access control, intruder alarms, fire detection, biometrics, perimeter security, and integrated control room design.' },
  mission: missionSchema,
  vision: visionSchema,
  mainImage: { type: String, default: '/images/abt-sec.jpg' },
  
  glanceBadge: { type: String, default: 'QUICK OVERVIEW' },
  glanceTitle: { type: String, default: 'COMPANY AT A GLANCE' },
  glanceCards: [glanceCardSchema],

  groupBadge: { type: String, default: 'CORPORATE ARCHITECTURE' },
  groupTitle: { type: String, default: 'OUR GROUP STRUCTURE' },
  groupDesc: { type: String, default: 'UniSpark Security is part of the UniSpark Innovations Group — a UAE-registered group of companies delivering technology, human resource, and physical security solutions.' },
  groupCards: [groupCardSchema],

  diffBadge: { type: String, default: 'WHY CHOOSE US' },
  diffTitle: { type: String, default: 'Our Key Differentiators' },
  diffDesc: { type: String, default: 'UniSpark combines regulatory excellence, technical expertise, and a vendor-neutral approach to deliver reliable, end-to-end security infrastructure tailored to your needs.' },
  diffCards: [diffCardSchema],

  ctaBadge: { type: String, default: 'NEXT-GEN INTEGRATION' },
  ctaTitle: { type: String, default: "Let's Discuss Your Security Requirements" },
  ctaDesc: { type: String, default: 'Whether you need a single CCTV installation or a full-site security infrastructure project, our team is ready to assess, design, and deliver.' },
  ctaPrimaryBtnText: { type: String, default: 'Request a Free Site Survey' },
  ctaPrimaryBtnLink: { type: String, default: '/contact-us' },
  ctaSecondaryBtnText: { type: String, default: 'Download Company Profile' },
  ctaSecondaryBtnLink: { type: String, default: '/company-profile.pdf' },
  ctaBgImage: { type: String, default: '' }
}, { timestamps: true });

const AboutConfig = mongoose.model('AboutConfig', aboutConfigSchema);

export default AboutConfig;
