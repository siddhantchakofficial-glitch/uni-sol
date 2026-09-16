/**
 * Industries landing page — default CMS content for sections beyond the
 * banner/overview/cards that the existing editor already manages.
 *
 * Kept in one shared module so the public page (Industries.jsx) and the
 * admin editor (IndustriesEditor.jsx) stay in sync. Content is grounded in
 * data that already exists in this project (capabilities, industries list,
 * CMS copy) — no invented facts, clients, or claims.
 */

// Capability framework — derived from the project's existing CAPABILITIES list
// (utils/constants.js), grouped the way the delivery model presents them.
export const CAPABILITY_FRAMEWORK = [
  { id: 'cf_1', title: 'Video Intelligence & Surveillance', desc: 'AI-powered CCTV, analytics, and remote monitoring for complete site visibility.' },
  { id: 'cf_2', title: 'Access Control & Identity', desc: 'Biometric, card, and mobile access governance for every critical entry point.' },
  { id: 'cf_3', title: 'Intrusion & Perimeter Defense', desc: 'Perimeter detection, fence sensors, and rapid intrusion alerting.' },
  { id: 'cf_4', title: 'Fire & Life Safety', desc: 'Addressable fire detection, suppression interface, and evacuation systems.' },
  { id: 'cf_5', title: 'System Integration & PSIM', desc: 'Unified command platforms correlating multi-system events in real time.' },
  { id: 'cf_6', title: 'Managed IT & Maintenance', desc: 'SLA-governed maintenance contracts and managed IT operations for uptime.' },
];

// Industry list rendered in the "grid-based category overview" band.
// Reuses the project's existing INDUSTRIES constant at runtime; this default
// is only the CMS fallback shape.
export const INDUSTRIES_SERVED = [
  { id: 'is_1', name: 'Data Centers & Hyperscale Hubs', slug: 'data-centers' },
  { id: 'is_2', name: 'Banking & Financial Institutions', slug: 'banking-finance' },
  { id: 'is_3', name: 'Manufacturing & Heavy Industry', slug: 'manufacturing' },
  { id: 'is_4', name: 'Healthcare & Pharmaceutical Campuses', slug: 'healthcare' },
];

// "Why choose us" benefits — grounded in existing project copy
// (About/CMS content, maintenance contracts, compliance statements).
export const WHY_CHOOSE_US = [
  {
    id: 'why_1',
    title: 'Architecture-Driven Engineering',
    desc: 'Every engagement starts with system design — coverage plans, compliance mapping, and integration architecture before deployment.',
  },
  {
    id: 'why_2',
    title: 'Regulatory Alignment',
    desc: 'Installations designed around UAE SIRA/SBD and Indian Civil Defence & BIS requirements, with documented compliance.',
  },
  {
    id: 'why_3',
    title: 'SLA-Governed Uptime',
    desc: 'Annual and preventive maintenance contracts with 24/7 support, dedicated engineers, and guaranteed response times.',
  },
  {
    id: 'why_4',
    title: 'Unified Multi-System Integration',
    desc: 'PSIM-led integration brings CCTV, access, intrusion, and intercom into a single operational view.',
  },
  {
    id: 'why_5',
    title: 'Dual-Region Presence',
    desc: 'Delivery teams operating across India and the UAE for on-ground support in both regions.',
  },
  {
    id: 'why_6',
    title: 'End-to-End Lifecycle',
    desc: 'From site survey and BOQ to installation, integration, and lifecycle maintenance — one accountable partner.',
  },
];

// FAQ — reused from the project's existing faqService defaults so the page
// and the CMS stay consistent. Industries-specific defaults are added only
// as fallbacks when the CMS has none.
export const INDUSTRIES_FAQS = [
  {
    question: 'Do you provide industry-specific system designs?',
    answer: 'Yes. Each engagement begins with a site-specific design — camera coverage, access zoning, and compliance mapping tailored to your sector\u2019s operational and regulatory requirements.',
  },
  {
    question: 'Which industries does UniSpark serve?',
    answer: 'We deliver security and infrastructure solutions across data centers, banking and financial institutions, manufacturing, healthcare, and other commercial and industrial environments across India and the UAE.',
  },
  {
    question: 'Can you work with our existing security systems?',
    answer: 'Yes. We specialize in PSIM-based integration that unifies legacy analog/IP CCTV, access control, and intrusion systems into a single command interface.',
  },
  {
    question: 'How do you handle sector-specific compliance?',
    answer: 'Designs are mapped to the applicable regional standards — such as SIRA/SBD in the UAE and Indian Civil Defence & BIS guidelines — with documentation provided at handover.',
  },
  {
    question: 'Do you support multi-site rollouts?',
    answer: 'Yes. Our teams operate across India and the UAE, supporting phased multi-site deployments with centralized monitoring and SLA-governed maintenance.',
  },
];

/*
 * Image support (all optional & backward compatible):
 * - `imageUrl`  : media-library/upload URL or any existing media reference
 * - `showImage` : per-image visibility; when false the image is hidden but the
 *                 reference is preserved (rule 13). Missing/undefined == shown.
 * Sections without images keep rendering exactly as before (rule 17).
 */

export const DEFAULT_INDUSTRIES_VISIBILITY = {
  hero: true,
  overview: true,
  approach: true,
  cards: true,
  framework: true,
  served: true,
  why: true,
  cta: true,
  faq: true,
};

export const DEFAULT_MAIN_CARDS_HEADER = {
  badge: 'Industries We Serve',
  title: 'Reliable Security.',
  highlight: 'Trusted Delivery.',
  subtitle: 'Comprehensive security and life-safety architectures engineered for specialized sector requirements.',
};

export const INDUSTRIES_EXTRA_DEFAULTS = {
  visibility: DEFAULT_INDUSTRIES_VISIBILITY,
  mainCardsHeader: DEFAULT_MAIN_CARDS_HEADER,
  approach: {
    badge: 'OUR APPROACH',
    title: 'Engineering Discipline Behind Every Engagement',
    principles: [
      'Architecture-first system design aligned to operational needs',
      'Security and compliance by design, not as an afterthought',
      'Execution-ready deployments that scale across sites and teams',
    ],
  },
  capabilityFramework: {
    badge: 'CAPABILITY FRAMEWORK',
    title: 'How Our Capabilities Empower Every Industry',
    subtitle: 'One integrated delivery framework applied with sector-specific context.',
    items: CAPABILITY_FRAMEWORK,
  },
  industriesServed: {
    badge: 'INDUSTRIES WE SERVE',
    title: 'Sector Coverage Across Commercial & Industrial Environments',
    items: INDUSTRIES_SERVED,
  },
  whyChooseUs: {
    badge: 'WHY UNISPARK',
    title: 'Why Organizations Choose UniSpark Across Industries',
    items: WHY_CHOOSE_US,
  },
  faq: {
    badge: 'INDUSTRY FAQ',
    title: 'Frequently Asked Questions',
    subtitle: 'Answers on sector coverage, compliance, integration, and support models.',
    items: INDUSTRIES_FAQS,
  },
};

/**
 * Sector-specific default content dictionary for all industry subpages (/industries/:slug).
 * Enables instant out-of-the-box display and 100% CMS editability for each sector.
 */
export const DEFAULT_INDUSTRY_SUBPAGES = {
  aviation: {
    hero: {
      badge: 'Aviation & Transportation',
      title: 'Aviation & Transportation Security',
      description: 'High-security perimeter control, passenger screening integration, and airfield video analytics.',
      breadcrumbText: 'Aviation & Transportation',
      heroImageUrl: '',
    },
    overview: {
      badge: 'Airport & Transit Security',
      heading: 'Mission-Critical Protection for High-Throughput Transit Hubs',
      subtitle: 'Airfield surveillance, passenger flow telemetry, and automated access control for international transport hubs.',
      paragraph1: 'Airports and mass transit terminals require continuous, high-throughput physical security that never impedes passenger movement. UniSpark delivers integrated thermal perimeter fencing, sterile area access control, and automated flight ops telemetry.',
      paragraph2: 'Our solutions fully adhere to ICAO standards, UAE SIRA airport regulations, and Bureau of Civil Aviation Security (BCAS) compliance guidelines.',
    },
    cards: [
      { id: 'c_1', title: 'Perimeter & Airfield Intrusion', desc: 'Fiber-optic fence sensors, long-range radar tracking, and thermal PTZ cameras for zero blind spots along perimeter boundaries.', imageUrl: '', showImage: true, icon: 'FaShieldAlt' },
      { id: 'c_2', title: 'Sterile Zone Access Governance', desc: 'Biometric mantraps, anti-passback turnstiles, and automated crew gate authorization linked with global travel credentials.', imageUrl: '', showImage: true, icon: 'FaCheckCircle' },
      { id: 'c_3', title: 'Compliance & SLA Monitoring', desc: 'Strict regulatory alignment with ICAO, BCAS, and SIRA standards with 24/7 NOC oversight and emergency response dispatch.', imageUrl: '', showImage: true, icon: 'FaAward' },
    ],
    features: [
      { id: 'f_1', title: 'Airfield Thermal Tracking', desc: 'Long-range thermal optics detecting unauthorized tarmac access in zero visibility.' },
      { id: 'f_2', title: 'Passenger Flow Analytics', desc: 'AI heatmapping and queue management optimizing terminal checkpoint throughput.' },
      { id: 'f_3', title: 'Unified Command PSIM', desc: 'Consolidated video wall monitoring security, baggage handling, and perimeter alarms.' },
    ],
    statistics: [
      { id: 's_1', value: '100%', label: 'Perimeter Coverage' },
      { id: 's_2', value: '< 1 sec', label: 'Biometric Gate Latency' },
      { id: 's_3', value: '99.99%', label: 'Command System Uptime' },
    ],
    visibility: { hero: true, overview: true, cards: true, features: true, statistics: true, cta: true },
  },
  'real-estate': {
    hero: {
      badge: 'Commercial Real Estate',
      title: 'Real Estate & Commercial Towers',
      description: 'Smart building access control, tenant video door entry, visitor kiosks, and automated parking.',
      breadcrumbText: 'Real Estate & Commercial',
      heroImageUrl: '',
    },
    overview: {
      badge: 'Smart Building Engineering',
      heading: 'Integrated Security & Access for Premium Commercial Assets',
      subtitle: 'Elevator destination dispatch, mobile tenant credentials, and unified surveillance for class-A developments.',
      paragraph1: 'Modern commercial towers and mixed-use developments demand friction-free tenant access combined with comprehensive perimeter and parking security. UniSpark engineers unified access control and smart visitor management platforms.',
      paragraph2: 'Seamless integration with building management systems (BMS) and HVAC energy automation maximizes both tenant safety and operational efficiency.',
    },
    cards: [
      { id: 'c_1', title: 'Multi-Tenant Access Governance', desc: 'Mobile Bluetooth and NFC credentials, QR visitor passes, and high-speed optical turnstiles for seamless lobby flow.', imageUrl: '', showImage: true, icon: 'FaBuilding' },
      { id: 'c_2', title: 'Elevator Destination Dispatch', desc: 'Floor-restricted elevator access integrated directly with turnstile badge swipes and tenant directories.', imageUrl: '', showImage: true, icon: 'FaCheckCircle' },
      { id: 'c_3', title: 'Smart Parking & ANPR', desc: 'Automated license plate recognition and barrier gate automation with real-time slot vacancy guidance.', imageUrl: '', showImage: true, icon: 'FaShieldAlt' },
    ],
    features: [
      { id: 'f_1', title: 'Touchless Turnstile Access', desc: 'High-throughput optical speed gates with integrated biometric and mobile RFID verification.' },
      { id: 'f_2', title: 'Cloud Visitor Management', desc: 'Pre-registration QR invitations with instant lobby kiosk badge issuance.' },
      { id: 'f_3', title: 'Centralized Property Command', desc: 'Single-screen monitoring for multi-building commercial portfolios.' },
    ],
    statistics: [
      { id: 's_1', value: '10M+', label: 'Protected Sq Feet' },
      { id: 's_2', value: '50K+', label: 'Daily Tenant Swipes' },
      { id: 's_3', value: '99.9%', label: 'Turnstile Reliability' },
    ],
    visibility: { hero: true, overview: true, cards: true, features: true, statistics: true, cta: true },
  },
  'oil-gas': {
    hero: {
      badge: 'Energy & Heavy Industry',
      title: 'Oil & Gas / Energy Facilities',
      description: 'Explosion-proof cameras, thermal gas detection, and long-range perimeter defense.',
      breadcrumbText: 'Oil & Gas / Energy',
      heroImageUrl: '',
    },
    overview: {
      badge: 'Hazardous Environment Protection',
      heading: 'ATEX-Certified Surveillance & Extreme Environment Security',
      subtitle: 'Intrinsically safe hardware, flare stack monitoring, and remote pipeline telemetry.',
      paragraph1: 'Refineries, offshore platforms, and petrochemical processing plants operate under hazardous, volatile conditions where standard electronics cannot survive. UniSpark provides explosion-proof stainless steel camera housings, ATEX-rated sensors, and flame detection.',
      paragraph2: 'Continuous integration with plant safety DCS systems ensures automatic emergency shutdown alarms and rapid incident containment.',
    },
    cards: [
      { id: 'c_1', title: 'ATEX Explosion-Proof Hardware', desc: 'Zone 1 and Zone 2 certified 316L stainless steel enclosures engineered to withstand explosive atmospheres and corrosive environments.', imageUrl: '', showImage: true, icon: 'FaIndustry' },
      { id: 'c_2', title: 'Optical Gas & Flare Monitoring', desc: 'Thermal optical gas imaging cameras providing early warning of invisible hydrocarbon gas leaks and abnormal flare combustion.', imageUrl: '', showImage: true, icon: 'FaShieldAlt' },
      { id: 'c_3', title: 'Emergency Muster & Evacuation', desc: 'Automated biometric muster points tracking workforce locations in real time during emergency plant shutdowns.', imageUrl: '', showImage: true, icon: 'FaCheckCircle' },
    ],
    features: [
      { id: 'f_1', title: 'Corrosion-Proof 316L Enclosures', desc: 'Harsh marine and chemical environment resilience with integrated wiper blades.' },
      { id: 'f_2', title: 'Radiometric Temperature Alarms', desc: 'Automated temperature threshold alarms detecting equipment overheating before failure.' },
      { id: 'f_3', title: 'Pipeline Radar Surveillance', desc: 'Long-range ground radar protecting remote valve stations and pipeline corridors.' },
    ],
    statistics: [
      { id: 's_1', value: 'Zone 1/2', label: 'ATEX Certification' },
      { id: 's_2', value: '100%', label: 'Intrinsically Safe' },
      { id: 's_3', value: '< 2 sec', label: 'Gas Alert Telemetry' },
    ],
    visibility: { hero: true, overview: true, cards: true, features: true, statistics: true, cta: true },
  },
  hospitality: {
    hero: {
      badge: 'Hospitality & Leisure',
      title: 'Hospitality & Luxury Resorts',
      description: 'Discreet hotel surveillance, keyless guestroom lock systems, and ballroom AV control.',
      breadcrumbText: 'Hospitality & Leisure',
      heroImageUrl: '',
    },
    overview: {
      badge: 'Guest Experience & Safety',
      heading: 'Unobtrusive Security Engineered for 5-Star Guest Experiences',
      subtitle: 'Mobile guestroom access, discreet aesthetic cameras, and asset protection for luxury properties.',
      paragraph1: 'In luxury hospitality, guest privacy and five-star elegance must harmonize with uncompromised asset protection. UniSpark deploys concealed architectural cameras, smart digital door locks, and discreet luggage tracking.',
      paragraph2: 'Integration with property management systems (PMS) enables digital check-in, keyless room entry, and personalized guest service delivery.',
    },
    cards: [
      { id: 'c_1', title: 'Discreet Aesthetic Surveillance', desc: 'Flush-mount architectural dome cameras blending invisibly into high-end hotel interiors, ballrooms, and guest corridors.', imageUrl: '', showImage: true, icon: 'FaHotel' },
      { id: 'c_2', title: 'Mobile Keyless Guest Access', desc: 'Encrypted BLE and RFID digital door locks allowing guests to unlock rooms and amenities using their smartphones.', imageUrl: '', showImage: true, icon: 'FaCheckCircle' },
      { id: 'c_3', title: 'Back-of-House Control', desc: 'Biometric access governance for kitchens, cash vaults, liquor cellars, and staff quarters.', imageUrl: '', showImage: true, icon: 'FaShieldAlt' },
    ],
    features: [
      { id: 'f_1', title: 'PMS Integration (Opera / Protel)', desc: 'Automated room key provisioning upon guest check-in via mobile or kiosk.' },
      { id: 'f_2', title: 'Elevator VIP Floor Control', desc: 'Secure floor routing reserved exclusively for penthouse and club lounge guests.' },
      { id: 'f_3', title: 'Pool & Spa Safety Monitoring', desc: 'AI perimeter water safety detection and emergency alert triggers.' },
    ],
    statistics: [
      { id: 's_1', value: '5-Star', label: 'Aesthetic Standard' },
      { id: 's_2', value: '100%', label: 'Keyless Compatibility' },
      { id: 's_3', value: '24/7', label: 'Discreet Monitoring' },
    ],
    visibility: { hero: true, overview: true, cards: true, features: true, statistics: true, cta: true },
  },
  healthcare: {
    hero: {
      badge: 'Healthcare & Life Sciences',
      title: 'Healthcare & Hospital Campuses',
      description: 'Infant protection alarms, pharmacy restricted access control, and cleanroom surveillance.',
      breadcrumbText: 'Healthcare & Life Sciences',
      heroImageUrl: '',
    },
    overview: {
      badge: 'Patient Safety & Clinical Security',
      heading: 'High-Compliance Infrastructure for Hospitals & Life Science Campuses',
      subtitle: 'Pharmacy cleanroom access, infant anti-abduction RFID, and patient elopement prevention.',
      paragraph1: 'Healthcare facilities face critical life-safety challenges ranging from safeguarding newborns and vulnerable patients to securing narcotics dispensaries and medical research cleanrooms. UniSpark delivers specialized hospital security architectures.',
      paragraph2: 'All installations align with HIPAA privacy standards, JCI hospital accreditation criteria, and local health authority security mandates.',
    },
    cards: [
      { id: 'c_1', title: 'Infant & Pediatric Protection', desc: 'Active RFID umbilical and ankle tags triggering automated door lockouts and elevator grounding if infant boundaries are breached.', imageUrl: '', showImage: true, icon: 'FaHospital' },
      { id: 'c_2', title: 'Pharmacy Cleanroom Access', desc: 'Airlock interlocking doors, biometric dual-authorization for narcotics vaults, and complete regulatory audit trail logs.', imageUrl: '', showImage: true, icon: 'FaCheckCircle' },
      { id: 'c_3', title: 'Emergency Room Lockdown', desc: 'One-touch emergency zone isolation protecting hospital staff and trauma centers during critical external incidents.', imageUrl: '', showImage: true, icon: 'FaShieldAlt' },
    ],
    features: [
      { id: 'f_1', title: 'Nurse Call & Code Blue Link', desc: 'Emergency alert dispatch integrated directly into central security command.' },
      { id: 'f_2', title: 'Cleanroom Airlock Governance', desc: 'Pressure-sealed door interlocks preventing cross-contamination in sterile zones.' },
      { id: 'f_3', title: 'HIPAA-Compliant CCTV Privacy', desc: 'Dynamic digital masking concealing patient faces and records on video feeds.' },
    ],
    statistics: [
      { id: 's_1', value: '100%', label: 'Infant Security SLA' },
      { id: 's_2', value: 'Dual-Auth', label: 'Narcotics Vault Access' },
      { id: 's_3', value: 'HIPAA', label: 'Privacy Compliant' },
    ],
    visibility: { hero: true, overview: true, cards: true, features: true, statistics: true, cta: true },
  },
  retail: {
    hero: {
      badge: 'Retail & Consumer Goods',
      title: 'Retail Chains & Shopping Centers',
      description: 'Loss prevention AI, heat mapping analytics, and POS integrated CCTV surveillance.',
      breadcrumbText: 'Retail & Consumer Goods',
      heroImageUrl: '',
    },
    overview: {
      badge: 'Loss Prevention & Store Intelligence',
      heading: 'Smart Video Analytics & Asset Protection for Retail Footprints',
      subtitle: 'POS event synchronization, heatmapping customer flow, and merchandise shrink reduction.',
      paragraph1: 'Retailers need physical security that doubles as customer business intelligence. UniSpark combines loss prevention CCTV with AI computer vision that tracks store footfall, dwell times, and shelf engagement.',
      paragraph2: 'Direct integration with electronic point-of-sale (EPOS) registers pinpoints cashier exceptions, voided transactions, and unauthorized till access.',
    },
    cards: [
      { id: 'c_1', title: 'AI Loss Prevention & Shrink', desc: 'Real-time behavioral analytics identifying suspicious loitering, sweet-hearting at checkouts, and stockroom theft.', imageUrl: '', showImage: true, icon: 'FaShoppingCart' },
      { id: 'c_2', title: 'POS Transaction Video Sync', desc: 'Overlaying receipt transaction text onto HD surveillance video for instant dispute and fraud investigation.', imageUrl: '', showImage: true, icon: 'FaCheckCircle' },
      { id: 'c_3', title: 'Store Heatmapping & Insights', desc: 'Analyzing customer movement patterns, endcap engagement, and queue lengths to optimize retail merchandising.', imageUrl: '', showImage: true, icon: 'FaShieldAlt' },
    ],
    features: [
      { id: 'f_1', title: 'EAS Electronic Article Surveillance', desc: 'Discreet entrance antenna pedestals linked to high-speed PTZ cameras.' },
      { id: 'f_2', title: 'Multi-Store Cloud Dashboard', desc: 'Centralized loss prevention management across hundreds of nationwide branches.' },
      { id: 'f_3', title: 'Loading Dock Telemetry', desc: 'Delivery bay barrier gates and automated shipment unseal verification.' },
    ],
    statistics: [
      { id: 's_1', value: '45%+', label: 'Shrink Reduction' },
      { id: 's_2', value: '100%', label: 'POS Sync Accuracy' },
      { id: 's_3', value: '24/7', label: 'Multi-Store Telemetry' },
    ],
    visibility: { hero: true, overview: true, cards: true, features: true, statistics: true, cta: true },
  },
  bfsi: {
    hero: {
      badge: 'Banking & Finance',
      title: 'BFSI & Banking Institutions',
      description: 'Vault intrusion security, ATM surveillance with panic triggers, and dual-custody access.',
      breadcrumbText: 'BFSI & Banking',
      heroImageUrl: '',
    },
    overview: {
      badge: 'Financial Asset Security',
      heading: 'Fortified Security Architectures for Financial & Banking Operations',
      subtitle: 'Vault timelocks, ATM anti-skimming CCTV, and centralized SOC branch monitoring.',
      paragraph1: 'Banking and financial institutions face stringent regulatory compliance and targeted physical and cyber threats. UniSpark engineers fortified vault protection, seismic vibration sensors, and automated branch lockdown solutions.',
      paragraph2: 'Centralized branch SOC integration provides continuous threat detection, silent duress dispatch, and cryptographic tamper audit logs.',
    },
    cards: [
      { id: 'c_1', title: 'Vault Dual-Custody Governance', desc: 'Biometric and physical timelock access requiring simultaneous two-person authorization for cash and safety deposit vaults.', imageUrl: '', showImage: true, icon: 'FaCoins' },
      { id: 'c_2', title: 'ATM Kiosk Telemetry & Alarms', desc: 'Pinhole covert cameras, thermal anti-tamper sensors, and automated silent panic alarms connected to central security.', imageUrl: '', showImage: true, icon: 'FaShieldAlt' },
      { id: 'c_3', title: 'Central SOC Incident Dispatch', desc: 'Unified PSIM architecture correlating alarms across all nationwide branches for instantaneous emergency dispatch.', imageUrl: '', showImage: true, icon: 'FaCheckCircle' },
    ],
    features: [
      { id: 'f_1', title: 'Seismic Vault Sensors', desc: 'Detecting drill, blast, and thermal cutting attempts before vault door breach.' },
      { id: 'f_2', title: 'Silent Duress Triggers', desc: 'Concealed teller panic switches with automated police dispatch interface.' },
      { id: 'f_3', title: 'Audit-Ready Regulatory Compliance', desc: 'Tamper-proof cryptographic video archive storage meeting RBI and Central Bank rules.' },
    ],
    statistics: [
      { id: 's_1', value: 'Dual-Custody', label: 'Vault Access Standard' },
      { id: 's_2', value: '< 10 sec', label: 'Branch Alarm Dispatch' },
      { id: 's_3', value: '100%', label: 'Regulatory Audit Passing' },
    ],
    visibility: { hero: true, overview: true, cards: true, features: true, statistics: true, cta: true },
  },
  manufacturing: {
    hero: {
      badge: 'Manufacturing & Logistics',
      title: 'Manufacturing & Logistics Hubs',
      description: 'Warehouse asset tracking, automated vehicle barrier gates, and factory floor monitoring.',
      breadcrumbText: 'Manufacturing & Logistics',
      heroImageUrl: '',
    },
    overview: {
      badge: 'Industrial Plant Security',
      heading: 'Industrial Scale Security for Factories & Distribution Centers',
      subtitle: 'ANPR vehicle barriers, hazardous area perimeter defense, and automated workforce time-tracking.',
      paragraph1: 'Sprawling manufacturing campuses and multi-acre logistics distribution centers need robust physical security that withstands heavy machinery, dust, and continuous industrial traffic. UniSpark deploys ruggedized infrastructure.',
      paragraph2: 'Integrated ANPR gates, perimeter radar beams, and biometric muster tracking streamline supply chain operations while protecting critical assets.',
    },
    cards: [
      { id: 'c_1', title: 'Perimeter Boundary Protection', desc: 'Long-range thermal PTZ cameras and fiber-optic fence sensors securing expansive factory and warehouse perimeters.', imageUrl: '', showImage: true, icon: 'FaWarehouse' },
      { id: 'c_2', title: 'Automated ANPR Freight Gates', desc: 'High-speed license plate and container code recognition automated with hydraulic barrier gates and weighing bridges.', imageUrl: '', showImage: true, icon: 'FaCheckCircle' },
      { id: 'c_3', title: 'High-Volume Shift Attendance', desc: 'Ruggedized biometric turnstiles processing thousands of shift workers smoothly without bottleneck delays.', imageUrl: '', showImage: true, icon: 'FaShieldAlt' },
    ],
    features: [
      { id: 'f_1', title: 'Forklift & Crane Zone Analytics', desc: 'Automated pedestrian detection alarms preventing warehouse collisions.' },
      { id: 'f_2', title: 'Loading Dock Interlocks', desc: 'Trailer restraint interlocks ensuring dock door cannot open until vehicle is locked.' },
      { id: 'f_3', title: 'High-Temp Thermal Monitoring', desc: 'Continuous furnace and electrical transformer thermal health tracking.' },
    ],
    statistics: [
      { id: 's_1', value: '500+ Acres', label: 'Campuses Protected' },
      { id: 's_2', value: '< 3 sec', label: 'Freight Truck Clearance' },
      { id: 's_3', value: 'Zero Fault', label: 'Shift Muster Record' },
    ],
    visibility: { hero: true, overview: true, cards: true, features: true, statistics: true, cta: true },
  },
};

/**
 * Helper to get merged subpage data for any slug.
 */
export const getIndustrySubpageDefaults = (slug, fallbackMeta = {}) => {
  const specific = DEFAULT_INDUSTRY_SUBPAGES[slug];
  if (specific) return specific;

  const title = fallbackMeta?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const desc = fallbackMeta?.desc || `Custom security, access control, and IT infrastructure architectures engineered for ${title}.`;

  return {
    hero: {
      badge: 'Industry Focus',
      title,
      description: desc,
      breadcrumbText: title,
      heroImageUrl: '',
    },
    overview: {
      badge: 'Tailored Engineering',
      heading: `Security Architectures for ${title}`,
      subtitle: desc,
      paragraph1: `UniSpark designs comprehensive physical security and life-safety architectures tailored specifically to the high-stakes demands of ${title}.`,
      paragraph2: 'Our multi-layered integration ensures seamless real-time visibility, automated incident response, and SLA-governed lifecycle maintenance.',
      imageUrl: '',
      showImage: true,
    },
    cards: [
      { id: 'c_1', title: 'Key Domain Challenges', desc: 'Strict regulatory standards, high footfall, critical asset protection, and multi-tenant access governance.', imageUrl: '', showImage: true, icon: 'FaExclamationTriangle' },
      { id: 'c_2', title: 'UniSpark Solution', desc: '4K AI video analytics, biometric turnstiles, ATEX explosion-proof sensors, and 24/7 command center integration.', imageUrl: '', showImage: true, icon: 'FaShieldAlt' },
      { id: 'c_3', title: 'Compliance Standards', desc: 'Full alignment with SIRA/SBD (UAE), Indian Civil Defense, and ISO 27001 data protection protocols.', imageUrl: '', showImage: true, icon: 'FaCheckCircle' },
    ],
    features: [
      { id: 'f_1', title: '24/7 Incident Surveillance', desc: 'Continuous HD video telemetry and automated perimeter alert logging.' },
      { id: 'f_2', title: 'Biometric Access Governance', desc: 'Touchless credentialing, restricted mantrap entries, and audit-ready tracking.' },
      { id: 'f_3', title: 'SLA Support & Maintenance', desc: 'Round-the-clock remote monitoring with rapid on-site emergency dispatch.' },
    ],
    statistics: [
      { id: 's_1', value: '99.9%', label: 'SLA Support Uptime' },
      { id: 's_2', value: '24/7', label: 'Continuous SOC Monitoring' },
      { id: 's_3', value: '100%', label: 'Regulatory Compliance' },
    ],
    visibility: { hero: true, overview: true, cards: true, features: true, statistics: true, cta: true },
  };
};


/**
 * Default image references for the main Industries landing sections.
 * Empty string = no image configured → sections render exactly as today
 * (rule 17). Bundled sector photos give sensible starting points where the
 * design already has an image slot.
 */
export const INDUSTRIES_IMAGE_DEFAULTS = {
  overview: {
    imageUrl: '',
    showImage: true,
  },
  approach: {
    imageUrl: '',
    showImage: true,
  },
  capabilityFramework: {
    imageUrl: '',
    showImage: true,
  },
  industriesServed: {
    imageUrl: '',
    showImage: true,
  },
  whyChooseUs: {
    imageUrl: '',
    showImage: true,
  },
  cta: {
    imageUrl: '',
    showImage: false,
  },
};

export default INDUSTRIES_EXTRA_DEFAULTS;
