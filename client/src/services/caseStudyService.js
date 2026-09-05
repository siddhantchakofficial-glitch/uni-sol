export const CASE_STUDIES = [
  {
    id: '1',
    title: 'Enterprise Airport Security Modernization & Perimeter AI',
    client: 'International Aviation Hub',
    industry: 'Aviation & Transportation',
    slug: 'airport-security-modernization',
    summary: 'Deployed 1,200+ 4K thermal cameras, fiber optic fence sensors, and unified PSIM control room for 24/7 airfield perimeter protection.',
    metrics: ['75% Incident Reduction', '100% Coverage Uptime', 'SLA Response < 2 Mins'],
    challenge: 'Legacy analog CCTV and isolated fence alarms created security blind spots across a 15km perimeter.',
    solution: 'Integrated thermal PTZ cameras, fiber intrusion sensors, and AI facial recognition with automated barrier triggers.',
    image: '/src/assets/images/sol1.jpg',
  },
  {
    id: '2',
    title: 'Smart Building Access Control & Tenant Video Entry',
    client: 'Apex Commercial Towers',
    industry: 'Real Estate & Commercial',
    slug: 'smart-building-access-control',
    summary: 'Implemented touchless mobile & facial access control across 35 floors, serving over 10,000 daily occupants with automated visitor kiosks.',
    metrics: ['10,000+ Daily Users', 'Zero Touchless Latency', '99.99% Uptime'],
    challenge: 'High congestion during peak hours with traditional card swipe readers and manual paper sign-ins for guests.',
    solution: 'Replaced swipe readers with high-throughput facial recognition turnstiles and QR-code visitor pre-registration.',
    image: '/src/assets/images/sol2.jpg',
  },
  {
    id: '3',
    title: 'Oil & Gas Refinery Thermal Gas & Fire Safety Protection',
    client: 'National Energy Corp',
    industry: 'Oil & Gas / Energy',
    slug: 'refinery-thermal-fire-protection',
    summary: 'Installed explosion-proof hazardous thermal cameras and addressable fire detection system in high-risk processing zones.',
    metrics: ['Zero False Alarms', 'Sub-second Fire Detection', '100% Civil Defense Compliant'],
    challenge: 'Standard optical cameras failed in dense steam and flammable environment conditions.',
    solution: 'Certified ATEX explosion-proof thermal imaging cameras combined with optical flame detectors linked to suppression units.',
    image: '/src/assets/images/sol4.jpg',
  },
];

export const caseStudyService = {
  getAll: async () => {
    return CASE_STUDIES;
  },
  getBySlug: async (slug) => {
    return CASE_STUDIES.find((cs) => cs.slug === slug) || CASE_STUDIES[0];
  },
};
