import images from '../assets/images';

export const DEFAULT_ABOUT_DATA = {
  visibility: {
    hero: true,
    journey: true,
    statistics: true,
    missionVision: true,
    values: true,
    globalFocus: true,
    frameworks: true,
    clientsAwards: true,
    leadership: true,
    faq: true,
    cta: true,
  },
  banner: {
    badge: 'ABOUT UNISPARK SECURITY & INNOVATION',
    title: 'Pioneering Mission-Critical Security & Global Enterprise Solutions',
    description:
      'Delivering end-to-end electronic security, integrated command systems, and international workforce deployment across Asia & Middle East.',
    imageUrl: images.abtSec,
    overlayOpacity: 65,
    breadcrumbText: 'About Us',
  },
  overview: {
    badge: 'OUR JOURNEY',
    heading: 'The Story of UniSpark Innovation',
    subtitle: 'From a visionary engineering startup in 2020 to a recognized regional technology power.',
    paragraph1:
      'UniSpark Innovation Private Limited was founded in New Delhi with a clear mission: to elevate physical security infrastructure and enterprise IT systems to modern digital standards. Recognizing that traditional analog installations left major gaps in threat detection and system reliability, our leadership set out to engineer intelligent, connected systems.',
    paragraph2:
      'Through rigorous engineering quality, DPIIT recognition by the Government of India, and rapid expansion into the United Arab Emirates market, UniSpark has grown into a trusted partner for commercial towers, industrial facilities, and public infrastructure projects across the region.',
  },
  glanceCards: [
    { id: 'stat_1', number: '15+', label: 'Years of Technical Excellence' },
    { id: 'stat_2', number: '500+', label: 'Enterprise Deployments' },
    { id: 'stat_3', number: '10M+', label: 'Protected Square Feet' },
    { id: 'stat_4', number: '100%', label: 'Compliance & Safety Record' },
  ],
  missionVision: {
    missionIcon: 'FaBullseye',
    missionTitle: 'Our Mission',
    missionDesc:
      'To empower enterprise organizations with resilient, AI-powered security infrastructure, unified PSIM control platforms, and uncompromised SLA maintenance services that safeguard lives and critical operations.',
    visionIcon: 'FaEye',
    visionTitle: 'Our Vision',
    visionDesc:
      'To become the premier technology systems integrator across Asia & the Middle East, recognized for technological excellence, regulatory compliance, and customer-first innovation.',
  },
  values: {
    badge: 'OUR PRINCIPLES',
    heading: 'Engineering Discipline, Trust & Measurable Outcomes',
    subtitle: 'The core values that guide our engineering rigor, client partnerships, and technological delivery across every engagement.',
    items: [
      {
        id: 'val_1',
        icon: 'FaShieldAlt',
        title: 'Engineering Integrity',
        description: 'We adhere to uncompromising technical rigor, transparent architecture blueprints, and zero-compromise security protocols.',
      },
      {
        id: 'val_2',
        icon: 'FaChartLine',
        title: 'Measurable Outcomes',
        description: 'Every deployment is tied to explicit operational SLAs, verifiable uptime metrics, and tangible enterprise impact.',
      },
      {
        id: 'val_3',
        icon: 'FaHandshake',
        title: 'Long-Term Partnership',
        description: 'We build durable client alliances through proactive maintenance, lifecycle support, and trusted technical advisory.',
      },
      {
        id: 'val_4',
        icon: 'FaLightbulb',
        title: 'Continuous Innovation',
        description: 'Pioneering AI-driven automation, unified PSIM platforms, and next-generation cloud architecture for forward-looking enterprises.',
      },
    ],
  },
  globalFocus: {
    badge: 'GLOBAL DELIVERY MODEL',
    heading: 'Dual-Shore Delivery & GCC-Ready Engineering Model',
    subtitle: 'Uniting world-class engineering hubs in India with on-the-ground operational governance in the UAE for seamless regional execution.',
    description: 'Our dual-shore architecture enables cross-border collaboration, 24/7 technical oversight, and rapid on-site deployment across APAC and Middle East enterprise hubs.',
    features: [
      {
        id: 'gf_1',
        title: 'India Engineering Center',
        subtitle: 'Core R&D & Engineering Hub',
        description: 'Centralized architecture design, 24/7 Network Operations Center (NOC), software integration, and certified systems staging.',
      },
      {
        id: 'gf_2',
        title: 'UAE Regional Operations',
        subtitle: 'GCC On-Site Execution & Compliance',
        description: 'Local regulatory alignment (SIRA/SBD), direct client engagement, on-ground field engineers, and critical SLA response.',
      },
      {
        id: 'gf_3',
        title: 'Cross-Border Talent Deployment',
        subtitle: 'Global Technical Mobilization',
        description: 'Specialized enterprise workforce mobility, international project governance, and frictionless multi-region resource scaling.',
      },
    ],
  },
  frameworks: {
    badge: 'CREDENTIALS & COMPLIANCE',
    heading: 'Enterprise Governance & Industry Frameworks',
    subtitle: 'Proven methodologies and international standards that ensure security, operational resilience, and architectural excellence.',
    items: [
      {
        id: 'fw_1',
        icon: 'FaShieldAlt',
        title: 'Security-by-Design',
        description: 'Full alignment with Zero-Trust principles, encrypted telemetry, and strict access control boundaries across all systems.',
      },
      {
        id: 'fw_2',
        icon: 'FaAward',
        title: 'Standards Compliance',
        description: 'Adherence to ISO quality management, BIS standards, and regional civil defense & security agency certifications.',
      },
      {
        id: 'fw_3',
        icon: 'FaServer',
        title: 'Architecture Frameworks',
        description: 'TOGAF and ITIL-aligned service management frameworks driving standardized lifecycle implementation and governance.',
      },
      {
        id: 'fw_4',
        icon: 'FaCogs',
        title: 'Dual-Shore SLA Governance',
        description: 'Guaranteed response times, structured escalation pathways, and round-the-clock remote monitoring capabilities.',
      },
    ],
  },
  clientsAwards: {
    badge: 'ACHIEVEMENTS & TRUST',
    heading: 'Recognized by Industry, Trusted by Enterprises',
    subtitle: 'Our commitment to innovation and engineering quality has earned government recognitions and the trust of leading organizations.',
    awards: [
      {
        id: 'aw_1',
        title: 'DPIIT Recognized Startup',
        issuer: 'Government of India',
        year: 'Certified',
        description: 'Recognized for technological innovation and engineering excellence under the Startup India initiative.',
      },
      {
        id: 'aw_2',
        title: 'MSME Excellence in Enterprise Security',
        issuer: 'Industry Recognition',
        year: '2025',
        description: 'Honored for delivering transformative electronic security and integrated IT infrastructure across critical sites.',
      },
    ],
    clients: [
      { id: 'cl_1', name: 'Northern Arc' },
      { id: 'cl_2', name: 'Global Education' },
      { id: 'cl_3', name: 'ProcDNA' },
      { id: 'cl_4', name: 'Sanjay Ghodawat Group' },
      { id: 'cl_5', name: 'Awfis' },
      { id: 'cl_6', name: 'Birlasoft' },
      { id: 'cl_7', name: 'IndiGo' },
    ],
  },
  /*
   * CMS Logo Marquee — scrolls under the existing "Trusted by Leading
   * Enterprise Brands" heading of the Clients & Awards section.
   * Defaults use the project's own brand logo assets from
   * client/public/assets/images/ (no external URLs). Every logo can be
   * replaced/removed/reordered/enabled per item from the About CMS.
   */
  logoMarquee: {
    enabled: true,
    speedSeconds: 35,
    heading: 'Trusted by Leading Enterprise Brands',
    logos: [
      { id: 'lm_1', name: 'Hanwha', imageUrl: '/assets/images/hanwha.jpg', enabled: true },
      { id: 'lm_2', name: 'Siemens', imageUrl: '/assets/images/siemens.jpg', enabled: true },
      { id: 'lm_3', name: 'Gallagher', imageUrl: '/assets/images/gallagher.jpg', enabled: true },
      { id: 'lm_4', name: 'Hochiki', imageUrl: '/assets/images/hochiki.jpg', enabled: true },
      { id: 'lm_5', name: 'LenelS2', imageUrl: '/assets/images/lenel.jpg', enabled: true },
      { id: 'lm_6', name: '2N', imageUrl: '/assets/images/2n.jpg', enabled: true },
      { id: 'lm_7', name: 'CP Plus', imageUrl: '/assets/images/cpplus.jpg', enabled: true },
      { id: 'lm_8', name: 'Uniview', imageUrl: '/assets/images/uniview.jpg', enabled: true },
    ],
  },
  leadership: [],
  faq: {
    badge: 'ENTERPRISE FAQ',
    heading: 'Frequently Asked Questions',
    subtitle: 'Explore answers to common questions about our capabilities, delivery models, compliance, and enterprise partnerships.',
    items: [
      {
        id: 'faq_1',
        question: 'What core services does UniSpark Innovation provide?',
        answer: 'UniSpark Innovation provides end-to-end enterprise IT & physical security solutions including CCTV & AI Video Analytics, Biometric Access Control, Fire & Intruder Detection, System Integration (PSIM), Managed IT Services, and Global Talent Consulting.',
      },
      {
        id: 'faq_2',
        question: 'What regions do you operate and support in?',
        answer: 'We operate primarily across India and the United Arab Emirates (UAE), with international workforce and IT consulting capabilities extending globally.',
      },
      {
        id: 'faq_3',
        question: 'Do you offer Annual Maintenance Contracts (AMC)?',
        answer: 'Yes! We offer SLA-governed Annual Maintenance Contracts (AMC) and Preventive Maintenance Contracts (PMC) with 24/7 technical support, dedicated on-site engineers, and guaranteed response times.',
      },
      {
        id: 'faq_4',
        question: 'How do you ensure compliance with local security regulations?',
        answer: 'All our installations align fully with regional regulatory standards such as SIRA/SBD in the UAE and Indian Civil Defense & BIS guidelines.',
      },
      {
        id: 'faq_5',
        question: 'Can you integrate existing legacy CCTV & access systems?',
        answer: 'Absolutely. We specialize in system integration using PSIM and open-API platforms to unify legacy analog/IP systems into a single centralized command room interface.',
      },
    ],
  },
};

export default DEFAULT_ABOUT_DATA;

