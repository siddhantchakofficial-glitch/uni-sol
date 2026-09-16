import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import Page from './models/Page.js';
import SiteSettings from './models/SiteSettings.js';
import Menu from './models/Menu.js';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch {
  // Ignore if restricted
}

const DEFAULT_PAGES = [
  {
    title: 'Home Page',
    slug: 'home',
    content: {
      ticker: {
        enabled: true,
        items: [
          'Next-Gen Enterprise Security & CCTV Surveillance',
          'Advanced Biometric Access Control & Mantrap Portals',
          'Unified PSIM Command & Telemetry Platforms',
          'Cross-Border HRMS & Talent Infrastructure: India & UAE',
          'Addressable Fire Suppression & Mission-Critical Telemetry',
        ],
      },
      hero: {
        badge: 'DPIIT RECOGNIZED TECH ENTERPRISE',
        heading: 'Designing Secure, Modern & Digital Enterprise Ecosystems.',
        description: 'UniSpark helps enterprises in India and the UAE unify Infrastructure, Cloud, Cybersecurity, Workplace, AI Video Intelligence and Aviation Operations into one integrated, resilient digital foundation.',
        primaryBtnText: 'Explore Capabilities',
        primaryBtnLink: '/capabilities',
        secondaryBtnText: 'Explore Industries',
        secondaryBtnLink: '/industries',
        videoUrl: '',
        imageUrl: '',
      },
      section2: {
        badge: 'Who We Are',
        title: 'Architects of Enterprise Security & Smart Infrastructure',
        description1: 'UNISPARK INNOVATION PRIVATE LIMITED is a startup recognized by the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India.',
        description2: 'Founded in 2020 and headquartered in New Delhi with strategic operations in Dubai, UniSpark Innovation delivers comprehensive physical security systems, CCTV video intelligence, access governance, and managed IT services to commercial enterprises, infrastructure projects, and government installations.',
        statNumber: '24+',
        statLabel: 'Years Executive Tech Leadership',
        statNumber2: '99.98%',
        statLabel2: 'System Uptime',
        imageUrl: '',
      },
      divisions: [
        {
          id: 'div_1',
          title: 'Electronic Security & CCTV Systems',
          description: 'AI-powered 4K surveillance, facial recognition access control, automatic number plate recognition (ANPR), and perimeter intrusion detection.',
          icon: 'FaVideo',
          imageUrl: '',
          link: '/capabilities/cctv-surveillance',
          featured: true,
          tag: 'Security & Surveillance',
        },
        {
          id: 'div_2',
          title: 'Command & Control PSIM Software',
          description: 'Unified Physical Security Information Management (PSIM) bridging multi-site telemetry, incident automation, and live IoT sensor feeds.',
          icon: 'FaShieldAlt',
          imageUrl: '',
          link: '/capabilities/system-integration',
          featured: true,
          tag: 'PSIM & Automation',
        },
        {
          id: 'div_3',
          title: 'International HR & Global Workforce',
          description: 'Cross-border workforce deployment, payroll compliance, HR advisory, and bespoke HRMS solutions across India and UAE jurisdictions.',
          icon: 'FaUsers',
          imageUrl: '',
          link: '/international/workforce',
          featured: true,
          tag: 'Global Workforce',
        },
        {
          id: 'div_4',
          title: 'Fire Detection & Suppression',
          description: 'Addressable smoke detection systems, clean agent gas suppression, and automated fire pump control integrated into BMS.',
          icon: 'FaFireExtinguisher',
          imageUrl: '',
          link: '/capabilities/fire-alarm',
          featured: true,
          tag: 'Safety Infrastructure',
        },
      ],
      industries: [
        {
          id: 'ind_1',
          title: 'Data Centers & Cloud Hubs',
          description: 'Multi-tier biometric mantrap access control, thermal server rack monitoring, and zero-trust physical perimeter defense.',
          imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
          link: '/industries/data-centers',
        },
        {
          id: 'ind_2',
          title: 'Financial & Banking Institutions',
          description: 'High-security vault access, ATM biometric telemetry, and centralized regional branch monitoring.',
          imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80',
          link: '/industries/banking-finance',
        },
        {
          id: 'ind_3',
          title: 'Manufacturing & Industrial Complexes',
          description: 'Hazardous area CCTV, automated workforce attendance, and hazardous gas detection systems.',
          imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
          link: '/industries/manufacturing',
        },
      ],
      whyUs: {
        heading: 'Why Leading Enterprises Choose UniSpark',
        subheading: 'Proven security engineering, government-recognized excellence, and end-to-end service delivery.',
        ctaBgImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
        pillars: [
          { id: 'p_1', title: '24/7 Central Monitoring', desc: 'Real-time incident response with guaranteed 15-minute SLA dispatch.' },
          { id: 'p_2', title: 'Government & DPIIT Recognized', desc: 'Compliant with national safety standards and enterprise compliance mandates.' },
          { id: 'p_3', title: 'Turnkey International Support', desc: 'Dual-headquarters deployment in New Delhi, India and Dubai, UAE.' },
          { id: 'p_4', title: 'Guaranteed SLA Uptime', desc: '24/7 dedicated Network Operations Center (NOC) support with emergency site dispatch.' },
        ],
      },
    },
  },
  {
    title: 'About Us',
    slug: 'about',
    content: {
      banner: {
        badge: 'ABOUT UNISPARK SECURITY & INNOVATION',
        title: 'Pioneering Mission-Critical Security & Global Enterprise Solutions',
        subtitle: 'Delivering end-to-end electronic security, integrated command systems, and international workforce deployment across Asia & Middle East.',
        imageUrl: '',
      },
      overview: {
        badge: 'Our Journey',
        heading: 'The Story of UniSpark Innovation',
        paragraph1: 'UniSpark Innovation Private Limited was founded in New Delhi with a clear mission: to elevate physical security infrastructure and enterprise IT systems to modern digital standards. Recognizing that traditional analog installations left major gaps in threat detection and system reliability, our leadership set out to engineer intelligent, connected systems.',
        paragraph2: 'Through rigorous engineering quality, DPIIT recognition by the Government of India, and rapid expansion into the United Arab Emirates market, UniSpark has grown into a trusted partner for commercial towers, industrial facilities, and public infrastructure projects across the region.',
      },
      glanceCards: [
        { id: 'gc_1', number: '15+', label: 'Years of Technical Excellence' },
        { id: 'gc_2', number: '500+', label: 'Enterprise Deployments' },
        { id: 'gc_3', number: '10M+', label: 'Protected Square Feet' },
        { id: 'gc_4', number: '100%', label: 'Compliance & Safety Record' },
      ],
      missionVision: {
        mission: 'To empower enterprise organizations with resilient, AI-powered security infrastructure, unified PSIM control platforms, and uncompromised SLA maintenance services that safeguard lives and critical operations.',
        vision: 'To become the premier technology systems integrator across Asia & the Middle East, recognized for technological excellence, regulatory compliance, and customer-first innovation.',
      },
      leadership: [
        {
          id: 'lead_1',
          name: 'Bhuwan Chander Upadhyay',
          role: 'Chief Executive Officer & Founder',
          bio: 'Over 24 years of executive technology leadership across enterprise cloud, cybersecurity, physical security, and infrastructure transformation.',
          image: '',
        },
        {
          id: 'lead_2',
          name: 'Krishna Baruta',
          role: 'Director of Business Operations',
          bio: 'Specialist in enterprise operations, SLA governance, and multi-country project execution across India & UAE.',
          image: '',
        },
        {
          id: 'lead_3',
          name: 'Sushma Saxena',
          role: 'Director & Board Member',
          bio: 'Drives strategic corporate growth, financial stewardship, and international partnership alignment.',
          image: '',
        },
      ],
    },
  },
  {
    title: 'Capabilities & Solutions',
    slug: 'capabilities',
    content: {
      banner: {
        badge: 'Enterprise Capabilities',
        title: 'Comprehensive Security & Technology Solutions',
        subtitle: 'Explore our specialized services spanning AI video surveillance, biometric access control, fire safety, and unified PSIM command center integration.',
        imageUrl: '',
      },
      overview: {
        badge: 'SERVICE OVERVIEW',
        heading: 'Next-Generation Security Architecture Engineered for Critical Assets',
        description: 'We deliver turnkey surveillance, biometric access, fire protection, and international HR infrastructure to global corporations, financial institutions, and data centers.',
      },
      solutionsList: [
        {
          id: 'cctv-surveillance',
          title: 'CCTV & Video Surveillance',
          slug: 'cctv-surveillance',
          badge: 'Video Intelligence',
          desc: 'HD cameras, NVRs, remote monitoring, and smart video analytics for complete site visibility and threat prevention.',
          features: ['High-definition 4K Cameras', 'AI Video Analytics & ANPR', 'Thermal Imaging Solutions', 'Cloud & On-Premise NVR Storage', '24/7 Control Room Integration'],
          imageUrl: '',
        },
        {
          id: 'access-control',
          title: 'Access Control Systems',
          slug: 'access-control',
          badge: 'Identity Governance',
          desc: 'Card, mobile, and biometric physical access control solutions that govern every critical entry and exit point.',
          features: ['Multi-Factor Authentication', 'Biometric & Facial Scanners', 'Visitor Management System', 'Elevator & Gate Integration', 'Comprehensive Audit Logs'],
          imageUrl: '',
        },
        {
          id: 'intruder-alarm',
          title: 'Intruder Alarm & Detection',
          slug: 'intruder-alarm',
          badge: 'Threat Response',
          desc: 'Perimeter and interior intrusion detection with rapid central-station alerting and automated lockdown response.',
          features: ['Motion & Glass Break Sensors', 'Dual-Tech Infrared Detectors', 'Central Monitoring Alarm Link', 'Mobile Instant Notifications', 'Fail-Safe Battery Backup'],
          imageUrl: '',
        },
        {
          id: 'fire-alarm',
          title: 'Fire Alarm & Safety Systems',
          slug: 'fire-alarm',
          badge: 'Life Safety',
          desc: 'Compliant fire detection, heat sensors, smoke alarms, and voice evacuation systems for enterprise safety.',
          features: ['Addressable Fire Alarm Panels', 'Optical & Thermal Detectors', 'Emergency Voice Evacuation', 'Automated Suppression Interface', 'UAE Civil Defence Aligned'],
          imageUrl: '',
        },
        {
          id: 'biometric-security',
          title: 'Biometric & Smart Security',
          slug: 'biometric-security',
          badge: 'Smart Authentication',
          desc: 'Fingerprint, facial recognition, and smart-card identity verification systems integrated with HR attendance.',
          features: ['Touchless Contactless Face ID', 'Fingerprint Attendance Integration', 'Anti-Spoofing AI Recognition', 'High Throughput Gate Access', 'Cloud Multi-Site Management'],
          imageUrl: '',
        },
        {
          id: 'system-integration',
          title: 'System Integration & Control',
          slug: 'system-integration',
          badge: 'Unified Command',
          desc: 'Centralized PSIM, security management software, and custom integration linking multi-vendor hardware into a unified control room.',
          features: ['PSIM Software Platforms', 'Open API Hardware SDK Bridges', 'Video Wall Command Room Integration', 'Automated Threat Workflow Rules', 'Centralized Remote Logging'],
          imageUrl: '',
        },
      ],
    },
  },
  {
    title: 'Industry Verticals',
    slug: 'industries',
    content: {
      banner: {
        badge: 'Domain Expertise',
        title: 'Industry Solutions & Sector Implementations',
        subtitle: 'Discover tailored security, access control, and IT infrastructure solutions engineered for specific domain challenges.',
        imageUrl: '',
      },
      overview: {
        badge: 'SECTOR OVERVIEW',
        heading: 'Engineered for Unique Operational & Regulatory Demands',
        paragraph1: 'Every industry faces distinct threat profiles and compliance frameworks. UniSpark designs bespoke physical security, automated visitor tracking, and life-safety architectures tailored specifically to your sector.',
        paragraph2: 'From tier-4 data centers with stringent zero-trust mantrap protocols to sprawling manufacturing facilities needing thermal perimeter surveillance, our solutions guarantee uptime and safety.',
      },
      industriesList: [
        {
          id: 'ind_1',
          title: 'Data Centers & Hyperscale Hubs',
          slug: 'data-centers',
          imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
          description: 'Multi-layer biometric mantrap entry, thermal server rack monitoring, and zero-trust perimeter defense.',
          highlights: ['Biometric Mantrap Portals', 'Thermal Rack Telemetry', 'Zero-Trust Logging'],
        },
        {
          id: 'ind_2',
          title: 'Banking & Financial Institutions',
          slug: 'banking-finance',
          imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80',
          description: 'High-security vault access, biometric ATM telemetry, and automated central branch incident dispatch.',
          highlights: ['Vault Timelock Access', 'ATM CCTV Analytics', 'Central Branch PSIM'],
        },
        {
          id: 'ind_3',
          title: 'Manufacturing & Heavy Industry',
          slug: 'manufacturing',
          imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
          description: 'Hazardous area explosion-proof CCTV, automated workforce attendance, and optical gas flare sensors.',
          highlights: ['Explosion-Proof Cameras', 'Automated Muster Logs', 'Gas Telemetry Alarms'],
        },
        {
          id: 'ind_4',
          title: 'Healthcare & Pharmaceutical Campuses',
          slug: 'healthcare',
          imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
          description: 'Pharmacy cleanroom access, infant protection RFID tags, and emergency lockdown orchestration.',
          highlights: ['Cleanroom Airlock Access', 'Infant RFID Tracking', 'Code-Red Lockdown'],
        },
      ],
    },
  },
  {
    title: 'Contact Us',
    slug: 'contact',
    content: {
      banner: {
        badge: 'Get in Touch with UniSpark',
        title: 'Schedule a Technical Consultation or Request a Solution Proposal',
        subtitle: 'Our solution architects and enterprise security specialists in New Delhi & Dubai are available 24/7.',
        imageUrl: '',
      },
      contacts: {
        email: 'info@unisparkinnovation.com',
        supportEmail: 'support@unisparkinnovation.com',
        phoneIndia: '+91 11 4567 8900',
        phoneUAE: '+971 4 321 9876',
        whatsapp: '918860077276',
      },
      offices: [
        {
          id: 'off_1',
          country: 'India (Headquarters)',
          city: 'New Delhi',
          address: 'UniSpark Innovation Pvt. Ltd., Barakhamba Road, Connaught Place, New Delhi - 110001, India',
          phone: '+91 11 4567 8900',
          email: 'india@unisparkinnovation.com',
        },
        {
          id: 'off_2',
          country: 'United Arab Emirates (Regional Hub)',
          city: 'Dubai',
          address: 'UniSpark Innovation LLC, Level 14, Prime Tower, Business Bay, Dubai, UAE',
          phone: '+971 4 321 9876',
          email: 'uae@unisparkinnovation.com',
        },
      ],
    },
  },
  {
    title: 'International Operations',
    slug: 'international',
    content: {
      banner: {
        badge: 'Global Operations',
        title: 'International Services & Workforce Consulting',
        subtitle: 'Delivering global IT technology, specialized technical workforce, HR solutions, and cross-border security deployment across India, UAE, and international markets.',
        imageUrl: '',
      },
      subservices: [
        { name: 'Technology & Security', path: '/international/technology-security', desc: 'Cross-border technology delivery and security infrastructure deployment.' },
        { name: 'Workforce Solutions', path: '/international/workforce', desc: 'Global talent sourcing, technical staffing, and specialized workforce provisioning.' },
        { name: 'Security Infrastructure', path: '/international/security-infrastructure', desc: 'Multi-site security design and compliance governance across regions.' },
        { name: 'HR Solutions', path: '/international/hr-solutions', desc: 'Comprehensive HR consulting and global employee lifecycle management.' },
        { name: 'HR Advisory Services', path: '/international/hr-advisory', desc: 'Strategic HR policy advisory, talent retention, and compensation structuring.' },
        { name: 'Payroll & Compliance', path: '/international/payroll-compliance', desc: 'Multi-country payroll processing, tax compliance, and regulatory reporting.' },
        { name: 'HRMS Platform', path: '/international/hrms', desc: 'Cloud-native Human Resource Management System for global organizations.' },
        { name: 'Workforce Deployment', path: '/international/workforce-deployment', desc: 'Rapid international workforce mobilization and visa/immigration logistics.' },
      ],
    },
  },
];

const safeSeed = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (mongoUri && mongoUri.includes('.mongodb.net/?')) {
      mongoUri = mongoUri.replace('.mongodb.net/?', '.mongodb.net/unisol?');
    }

    console.log('[SafeSeed] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);

    for (const pageDef of DEFAULT_PAGES) {
      const existing = await Page.findOne({ slug: pageDef.slug });
      if (!existing) {
        console.log(`[SafeSeed] Creating missing page: ${pageDef.title} (${pageDef.slug})`);
        await Page.create({
          title: pageDef.title,
          slug: pageDef.slug,
          status: 'published',
          authorName: 'Admin',
          draftVersion: { content: pageDef.content, sections: [], seo: { title: pageDef.title } },
          publishedVersion: { content: pageDef.content, sections: [], seo: { title: pageDef.title } },
          publishedAt: new Date(),
        });
      } else {
        console.log(`[SafeSeed] Page ${pageDef.slug} exists. Ensuring content is populated...`);
        let modified = false;
        if (!existing.publishedVersion?.content || Object.keys(existing.publishedVersion.content).length === 0) {
          existing.publishedVersion = existing.publishedVersion || {};
          existing.publishedVersion.content = pageDef.content;
          modified = true;
        }
        if (!existing.draftVersion?.content || Object.keys(existing.draftVersion.content).length === 0) {
          existing.draftVersion = existing.draftVersion || {};
          existing.draftVersion.content = pageDef.content;
          modified = true;
        }
        if (modified) {
          existing.markModified('publishedVersion');
          existing.markModified('draftVersion');
          await existing.save();
          console.log(`[SafeSeed] Populated missing content in existing ${pageDef.slug}`);
        }
      }
    }

    console.log('[SafeSeed] All pages safe-seeded and verified successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[SafeSeed Error]:', err.message);
    process.exit(1);
  }
};

safeSeed();
