/**
 * Default CMS data for the International Enterprise Operations & Advanced Enterprise Solutions page.
 * Uses only existing project content, services, domains, and verified capabilities.
 */

export const DEFAULT_INTERNATIONAL_DATA = {
  banner: {
    badge: 'International Enterprise Operations',
    title: 'Why Organisations Operating in the Gulf Require Structured IT, Cybersecurity & HR Services',
    description:
      'Organisations operating across international regions encounter complex operational environments. As businesses expand across jurisdictions, technology systems, cybersecurity governance, and workforce operations must function consistently across distributed environments.',
    primaryBtnText: 'Explore Operational Domains',
    primaryBtnLink: '#operational-domains',
    secondaryBtnText: 'Schedule Consultation',
    secondaryBtnLink: '#consultation',
    imageUrl: '/assets/images/pr-bg.jpg',
  },

  intro: {
    badge: 'Operating Model',
    title: 'Architecting Resilient Enterprise Foundations Across Regions',
    subtitle:
      'Operating across borders requires harmonizing infrastructure, personnel, and compliance into a coherent operational fabric.',
    description1:
      'International expansion into the Gulf and South Asia introduces multi-jurisdictional compliance mandates, diverse network perimeters, and distributed workforce expectations that cannot be governed in silos.',
    description2:
      'UniSpark structures each operational domain so governance, compliance, and visibility hold across every territory your organization operates in—enabling scalable enterprise agility without compromising regulatory control.',
    imageUrl: '/assets/images/sol-bg.jpg',
  },

  complexity: {
    badge: 'Operating Pressures',
    title: 'Operational Complexity in International Enterprise Environments',
    subtitle:
      'The regional operating model introduces operational pressures that organisations often underestimate at entry or early scale:',
    challenges: [
      {
        num: '01',
        title: 'Distributed Technology Infrastructure',
        desc: 'Managing heterogeneous cloud, on-premises, and branch-office networks across multiple sovereign data boundaries.',
      },
      {
        num: '02',
        title: 'Cybersecurity & Exposure Risks',
        desc: 'Securing interconnected enterprise endpoints, identities, and supply chain telemetry against multi-vector threats.',
      },
      {
        num: '03',
        title: 'Multi-Jurisdictional Workforce Governance',
        desc: 'Navigating diverse labor laws, visa mobilization frameworks, and local employment statutory requirements.',
      },
      {
        num: '04',
        title: 'Payroll & Regulatory Coordination',
        desc: 'Ensuring absolute integrity in cross-border payroll processing, tax compliance, and automated auditable documentation.',
      },
      {
        num: '05',
        title: 'Unified Operational Visibility',
        desc: 'Eliminating siloed reporting to deliver single-pane-of-glass telemetry across IT, physical security, and HR systems.',
      },
    ],
    summaryProse: [
      'These conditions do not automatically demand a single, rigid operating model.',
      'They do, however, create clear functional requirements that must be addressed deliberately through architecture-first engineering.',
    ],
  },

  domains: [
    {
      id: 'tech-sec',
      name: 'Technology & Security Operations',
      path: '/international/technology-security',
      iconName: 'FaShieldAlt',
      badge: 'Core Domain 01',
      blurb:
        'Enterprise technology environments must remain stable and secure across distributed infrastructure, enterprise platforms, and operational networks.',
      drawer: [
        {
          name: 'Cybersecurity & Risk Governance',
          path: '/international/cybersecurity-risk-governance',
          desc: 'Zero Trust identity governance, SOC enablement, and compliance readiness aligned to ISO 27001, GDPR, and SOC 2.',
        },
        {
          name: 'Managed IT Services & Infrastructure',
          path: '/international/managed-it-services',
          desc: 'Structured IT infrastructure management supporting resilient, continuously monitored enterprise environments.',
        },
        {
          name: 'IT & ITeS Operations',
          path: '/international/it-ites-operations',
          desc: 'Shared-services and technology operations frameworks that keep enterprise platforms stable at scale.',
        },
        {
          name: 'GCC Technology & Workforce Operations',
          path: '/international/gcc-operations',
          desc: 'Enterprise-grade enablement for Global Capability Centers — digital workplace, access governance, delivery stability.',
        },
      ],
    },
    {
      id: 'workforce-ops',
      name: 'Workforce & Business Operations',
      path: '/international/workforce',
      iconName: 'FaUsers',
      badge: 'Core Domain 02',
      blurb:
        'Organizations must manage workforce governance, payroll compliance, HR systems, and workforce deployment models aligned with operational environments.',
      drawer: [
        {
          name: 'HR Advisory & Consultancy',
          path: '/international/hr-advisory',
          desc: 'Workforce governance design, HR policy development, and compliance advisory for enterprise operations.',
        },
        {
          name: 'Payroll & Compliance Operations',
          path: '/international/payroll-compliance',
          desc: 'Structured payroll processing, regulatory alignment, and workforce documentation integrity.',
        },
        {
          name: 'HRMS & Workforce Systems',
          path: '/international/hrms',
          desc: 'Digital HR platforms enabling lifecycle management, HR automation, and workforce analytics.',
        },
        {
          name: 'Workforce Deployment & Augmentation',
          path: '/international/workforce-deployment',
          desc: 'Project staffing, specialist engagement, and operational workforce scaling with governance built in.',
        },
        {
          name: 'Skilled Workforce Solutions',
          path: '/international/skilled-workforce',
          desc: 'Industry-trained technical personnel and readiness programs for specialized operational environments.',
        },
      ],
    },
    {
      id: 'sec-infra',
      name: 'Security Infrastructure',
      path: '/international/security-infrastructure',
      iconName: 'FaLock',
      badge: 'Core Domain 03',
      blurb:
        'Operational facilities require integrated surveillance systems, access control technologies, and security infrastructure that support safe and secure environments.',
      drawer: [
        {
          name: 'Security Systems Installation & Maintenance',
          path: '/international/security-installation-maintenance',
          desc: 'Professional deployment, integration, testing, and lifecycle maintenance of enterprise security systems.',
        },
        {
          name: 'Enterprise Security Equipment & Access Control',
          path: '/international/security-equipment-access-control',
          desc: 'Biometric authentication, facility access management, and integrated physical security infrastructure.',
        },
      ],
    },
  ],

  detailedSolutions: [
    {
      id: 'sol_cyber',
      domain: 'Technology & Security',
      title: 'Cybersecurity & Risk Governance',
      path: '/international/cybersecurity-risk-governance',
      desc: 'Zero Trust architecture, continuous threat hunting, and compliance readiness designed for high-assurance enterprise perimeters.',
      features: [
        'Zero Trust Identity & Access Architecture',
        'SOC Operations & Real-Time Incident Orchestration',
        'ISO 27001, SOC 2, and UAE IA Compliance Alignment',
      ],
    },
    {
      id: 'sol_managed_it',
      domain: 'Technology & Security',
      title: 'Managed IT Services & Infrastructure',
      path: '/international/managed-it-services',
      desc: 'Round-the-clock proactive monitoring, hybrid cloud orchestration, and multi-tier support guaranteeing enterprise SLA continuity.',
      features: [
        '24/7/365 NOC & Infrastructure Monitoring',
        'Hybrid Cloud & Multi-Region Network Architecture',
        'Structured Tier 1–3 SLA Incident Response',
      ],
    },
    {
      id: 'sol_ites',
      domain: 'Technology & Security',
      title: 'IT & ITeS Operations',
      path: '/international/it-ites-operations',
      desc: 'Shared service platforms, process workflow automation, and enterprise application stability across distributed delivery hubs.',
      features: [
        'Shared-Services Platform Standardization',
        'Service Desk & ITSM Workflow Automation',
        'Mission-Critical Enterprise SLA Governance',
      ],
    },
    {
      id: 'sol_gcc',
      domain: 'Technology & Security',
      title: 'GCC Technology & Workforce Operations',
      path: '/international/gcc-operations',
      desc: 'Turnkey operating models enabling Global Capability Centers with secure digital workplaces, governance, and technical talent.',
      features: [
        'GCC Setup & Digital Workplace Architecture',
        'Cross-Border Access Governance & Asset Protection',
        'High-Performance Technical Team Mobilization',
      ],
    },
    {
      id: 'sol_hr_adv',
      domain: 'Workforce & Business',
      title: 'HR Advisory & Consultancy',
      path: '/international/hr-advisory',
      desc: 'Strategic organizational design, employment policy frameworks, and regulatory advisory tailored to regional labor environments.',
      features: [
        'Cross-Border Labor Policy & Contract Formulation',
        'Executive Compensation & Incentive Structuring',
        'Statutory Labor Law Alignment in India & UAE',
      ],
    },
    {
      id: 'sol_payroll',
      domain: 'Workforce & Business',
      title: 'Payroll & Compliance Operations',
      path: '/international/payroll-compliance',
      desc: 'Accurate, auditable multi-country payroll execution integrated with statutory deductions, WPS, and employee self-service.',
      features: [
        'Multi-Currency & UAE WPS Compliance Engine',
        'Automated Tax Deduction & Statutory Filing',
        'Full Audit Trail & Regulatory Reporting',
      ],
    },
    {
      id: 'sol_hrms',
      domain: 'Workforce & Business',
      title: 'HRMS & Workforce Systems',
      path: '/international/hrms',
      desc: 'Cloud-native digital HR platforms enabling automated onboarding, lifecycle analytics, and time-and-attendance synchronization.',
      features: [
        'End-to-End Digital Onboarding & Asset Tracking',
        'Biometric Attendance & Leave Workflow Sync',
        'Executive Workforce Analytics & Dashboards',
      ],
    },
    {
      id: 'sol_deploy',
      domain: 'Workforce & Business',
      title: 'Workforce Deployment & Augmentation',
      path: '/international/workforce-deployment',
      desc: 'Rapid scaling of specialized engineering and technical personnel with full visa logistics, onboarding, and compliance management.',
      features: [
        'On-Demand Technical Specialist Mobilization',
        'International Visa, Relocation & Compliance Handling',
        'Flexible Engagement & Managed Capacity Models',
      ],
    },
    {
      id: 'sol_sec_inst',
      domain: 'Security Infrastructure',
      title: 'Security Systems Installation & Maintenance',
      path: '/international/security-installation-maintenance',
      desc: 'End-to-end design, civil engineering installation, SIRA compliance, and preventive AMC support for mission-critical facilities.',
      features: [
        'Turnkey CCTV, Intrusion & Fire System Deployment',
        'SIRA & Local Civil Defense Regulatory Certification',
        'Preventive Maintenance & 2-Hour Emergency Dispatch',
      ],
    },
    {
      id: 'sol_sec_eqp',
      domain: 'Security Infrastructure',
      title: 'Enterprise Security Equipment & Access Control',
      path: '/international/security-equipment-access-control',
      desc: 'High-throughput biometric turnstiles, mantrap portals, smart card readers, and unified physical access control management.',
      features: [
        'AI Facial Recognition & Contactless Authentication',
        'Mantrap Interlocking & Multi-Tier Facility Zones',
        'Unified PSIM Command Center Integration',
      ],
    },
  ],

  framework: {
    badge: 'Capability Framework',
    title: 'Unified Enterprise Delivery Architecture',
    subtitle:
      'How our enterprise capabilities interlock to provide seamless governance, technology stability, and workforce agility across regions.',
    steps: [
      {
        step: '01',
        title: 'Technology & Security Architecture',
        desc: 'Core digital backbone, cloud networking, Zero Trust perimeter defense, and continuous threat monitoring.',
      },
      {
        step: '02',
        title: 'Workforce & Business Operations',
        desc: 'Cross-border organizational governance, employee lifecycle management, and operational workflows.',
      },
      {
        step: '03',
        title: 'Physical Security & Life Safety',
        desc: 'SIRA-certified CCTV video surveillance, biometric facility access, and intelligent alarm telemetry.',
      },
      {
        step: '04',
        title: 'Enterprise HRMS & Systems Integration',
        desc: 'Digital HR automation, automated timekeeping, biometric gate synchronization, and workforce analytics.',
      },
      {
        step: '05',
        title: 'Cross-Border Payroll & Regulatory Compliance',
        desc: 'WPS compliant execution, statutory tax auditing, and structured regional governance.',
      },
      {
        step: '06',
        title: 'Deployment & Managed SLA Operations',
        desc: '24/7 ongoing NOC support, preventive equipment maintenance, and flexible capacity scaling.',
      },
    ],
  },

  categories: [
    {
      title: 'Technology & Infrastructure',
      desc: 'High-availability server infrastructure, hybrid cloud architecture, and structured cabling.',
      path: '/international/managed-it-services',
      tag: 'Infrastructure',
    },
    {
      title: 'Cybersecurity & Zero Trust',
      desc: 'Security operations center, penetration testing, and identity governance frameworks.',
      path: '/international/cybersecurity-risk-governance',
      tag: 'Security',
    },
    {
      title: 'Global Workforce Governance',
      desc: 'HR advisory, contract governance, labor compliance, and talent deployment.',
      path: '/international/workforce',
      tag: 'Workforce',
    },
    {
      title: 'Automated HRMS Platforms',
      desc: 'Cloud-native HR lifecycle systems, self-service portals, and attendance automation.',
      path: '/international/hrms',
      tag: 'Systems',
    },
    {
      title: 'Video Intelligence & CCTV',
      desc: '4K AI analytics, facial recognition monitoring, and centralized security video walls.',
      path: '/international/security-infrastructure',
      tag: 'Surveillance',
    },
    {
      title: 'Turnkey AMC Maintenance',
      desc: 'Guaranteed 99.98% system uptime with 24/7 on-call engineering response teams.',
      path: '/international/security-installation-maintenance',
      tag: 'Maintenance',
    },
  ],

  whyChooseUs: {
    badge: 'Why Partner With Us',
    title: 'Why Leading Organizations Rely on Our Enterprise Operations',
    subtitle:
      'We combine architecture-driven technology engineering, deep regulatory understanding, and dual-region operational presence.',
    pillars: [
      {
        title: 'Dual-Shore Operational Presence',
        desc: 'Full operational leadership and technical deployment capabilities across India and the United Arab Emirates.',
      },
      {
        title: 'Architecture-First Engineering',
        desc: 'Systems designed comprehensively upfront with identity, security, and scalability embedded from day one.',
      },
      {
        title: 'Regulatory & Compliance Assurance',
        desc: 'Full alignment with SIRA, UAE Civil Defense, DPDP, GDPR, and ISO standards for total audit confidence.',
      },
      {
        title: 'Single-System Governance',
        desc: 'Technology, workforce, and security managed as one integrated ecosystem rather than disconnected vendors.',
      },
      {
        title: 'Guaranteed SLA & Rapid Dispatch',
        desc: '24/7 dedicated Network Operations Center monitoring with sub-2-hour emergency site support.',
      },
      {
        title: 'End-to-End Lifecycle Accountability',
        desc: 'Turnkey execution from initial risk survey and system design to commissioning and multi-year AMC support.',
      },
    ],
    insightQuote:
      'International enterprise operations succeed when technology, workforce, and security functions are governed as one system. UniSpark structures each operational domain so governance, compliance, and visibility hold across every region an organisation operates in.',
  },

  cta: {
    badge: 'Enterprise Advisory',
    title: 'Looking for Technology & Workforce Solutions Aligned to Your Operational Reality?',
    subtitle:
      'Explore how UniSpark structures each operational domain so governance, compliance, and visibility hold across every region your enterprise operates in.',
    primaryBtnText: 'Schedule Confidential Consultation',
    secondaryBtnText: 'Contact Our Solutions Team',
    secondaryBtnLink: '/contact',
  },

  faqs: [
    {
      question: 'What happens after the initial consultation for international operations?',
      answer:
        'Engagement begins with understanding your operational context, regional risk posture, and technical challenges across territories. We then formulate a structured capability roadmap focused on long-term architectural stability, compliance alignment, and lifecycle value.',
    },
    {
      question: 'How do you ensure multi-jurisdictional compliance across India and the UAE?',
      answer:
        'Our regional operating teams are structured around local statutory mandates, including SIRA regulations and UAE Civil Defense in the Gulf, alongside DPIIT standards and statutory compliance frameworks in India. All technical architectures and workforce documentation are built audit-ready.',
    },
    {
      question: 'Can operational domains be engaged modularly or must they be deployed together?',
      answer:
        'Every operational domain—Technology & Security, Workforce & Business, and Security Infrastructure—is modular and can be engaged independently. However, our architectures are unified, meaning any deployed capability easily integrates with future domains as your enterprise scales.',
    },
    {
      question: 'How does UniSpark maintain real-time visibility across distributed infrastructure?',
      answer:
        'We deploy unified operational telemetry and PSIM dashboards that aggregate metrics from cloud infrastructure, cybersecurity endpoints, physical access turnstiles, and workforce systems into a single executive interface, eliminating operational blind spots.',
    },
    {
      question: 'What level of ongoing SLA support and maintenance is provided?',
      answer:
        'We offer SLA-governed 24/7 Network Operations Center (NOC) monitoring, scheduled quarterly preventive maintenance, and guaranteed on-site emergency dispatch with dedicated regional engineering response teams.',
    },
    {
      question: 'How do you handle rapid workforce mobilization and cross-border deployments?',
      answer:
        'Our international workforce division handles end-to-end mobilization including specialized technical vetting, visa and regulatory sponsorship logistics, compliance documentation, and integrated digital onboarding through our HRMS platform.',
    },
  ],
};

export const DEFAULT_INTERNATIONAL_VISIBILITY = {
  banner: true,
  intro: true,
  complexity: true,
  domains: true,
  detailedSolutions: true,
  framework: true,
  categories: true,
  whyChooseUs: true,
  cta: true,
  faqs: true,
};

export const INTERNATIONAL_SUBPAGES_LIST = [
  { slug: 'technology-security', title: 'Technology & Security Operations', domain: 'Technology & Security' },
  { slug: 'cybersecurity-risk-governance', title: 'Cybersecurity & Risk Governance', domain: 'Technology & Security' },
  { slug: 'managed-it-services', title: 'Managed IT Services & Infrastructure', domain: 'Technology & Security' },
  { slug: 'it-ites-operations', title: 'IT & ITeS Operations', domain: 'Technology & Security' },
  { slug: 'gcc-operations', title: 'GCC Technology & Workforce Operations', domain: 'Technology & Security' },
  { slug: 'workforce', title: 'Workforce & Business Operations', domain: 'Workforce & Business' },
  { slug: 'hr-advisory', title: 'HR Advisory & Consultancy', domain: 'Workforce & Business' },
  { slug: 'payroll-compliance', title: 'Payroll & Compliance Operations', domain: 'Workforce & Business' },
  { slug: 'hrms', title: 'HRMS & Workforce Systems', domain: 'Workforce & Business' },
  { slug: 'workforce-deployment', title: 'Workforce Deployment & Augmentation', domain: 'Workforce & Business' },
  { slug: 'skilled-workforce', title: 'Skilled Workforce Solutions', domain: 'Workforce & Business' },
  { slug: 'hr-solutions', title: 'HR Solutions & Operations', domain: 'Workforce & Business' },
  { slug: 'security-infrastructure', title: 'Security Systems & Infrastructure', domain: 'Security Infrastructure' },
  { slug: 'security-installation-maintenance', title: 'Security Installation & AMC Maintenance', domain: 'Security Infrastructure' },
  { slug: 'security-equipment-access-control', title: 'Security Equipment & Access Control', domain: 'Security Infrastructure' },
];

export const DEFAULT_INTERNATIONAL_SUBPAGES = {
  'technology-security': {
    hero: {
      badge: 'International Enterprise Operations',
      title: 'Technology & Security Operations',
      description: 'Enterprise Technology Infrastructure & Cybersecurity Operations — keeping distributed environments stable, secure, and continuously monitored.',
      breadcrumbText: 'Technology & Security Operations',
      imageUrl: '',
    },
    intro: {
      badge: 'Domain Overview',
      title: 'Enterprise Technology Infrastructure & Cybersecurity Operations',
      subtitle: 'Keeping distributed environments stable, secure, and continuously monitored.',
      paragraphs: [
        'Modern enterprises depend on stable and secure technology environments to maintain operational continuity. As organizations operate across distributed networks, enterprise platforms, and cloud environments, technology infrastructure and cybersecurity operations must function together.',
        'Technology & Security Operations combine enterprise IT infrastructure management, cybersecurity governance, and operational monitoring systems that support resilient enterprise environments.',
      ],
      imageUrl: '',
      showImage: true,
    },
    challenges: {
      badge: 'Scale Factor',
      title: 'Why Technology Complexity Increases at Scale',
      subtitle: 'Operational friction increases exponentially with distributed infrastructure.',
      items: [
        { title: 'Distributed Infrastructure', desc: 'Technology estates spread across regions, platforms, and cloud environments multiply operational complexity.' },
        { title: 'Cybersecurity Exposure', desc: 'Interconnected systems widen the attack surface across infrastructure, applications, and identities.' },
        { title: 'Operational Visibility', desc: 'Enterprises require continuous monitoring and oversight across every operational environment.' },
      ],
    },
    services: {
      badge: 'Core Capabilities',
      title: 'Operational Services & Capabilities',
      items: [
        {
          title: 'Cybersecurity & Risk Governance',
          desc: 'Enterprise technology environments must maintain strong cybersecurity governance to protect infrastructure, applications, and data.',
          bullets: ['Cyber risk assessment and governance frameworks', 'Security monitoring and threat detection', 'Identity and access management controls', 'Security architecture aligned with operations'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'CIO / CTO / CISO as a Service',
          desc: 'Strategic technology and security leadership without permanent executive hiring overhead.',
          bullets: ['Strategic IT and security leadership', 'Technology governance and roadmap guidance', 'Oversight across infrastructure and cyber posture'],
          imageUrl: '',
          showImage: true,
        },
      ],
    },
    checklist: {
      badge: 'Integrated Governance',
      title: 'Designed to Align with Cybersecurity and HR Operations',
      items: [
        'Single architectural baseline across IT and security infrastructure',
        'Direct alignment with HR and workforce onboarding workflows',
        'Coordinated incident response and business continuity planning',
      ],
    },
    insight: {
      badge: 'Executive Insight',
      quote: 'Technology infrastructure cannot be secured in isolation. High-performing international operations integrate physical security, cyber risk, and workforce governance into a single accountable operating model.',
      author: 'UniSpark Global Technology Practice',
    },
    cta: {
      title: 'Ready to Strengthen Your International Technology Infrastructure?',
      subtitle: 'Consult with our senior technology architects on distributed infrastructure, Zero Trust security, and managed IT operations.',
      imageUrl: '',
      showImage: false,
    },
    visibility: { hero: true, intro: true, challenges: true, services: true, checklist: true, insight: true, cta: true },
  },
  'cybersecurity-risk-governance': {
    hero: {
      badge: 'International Enterprise Operations',
      title: 'Cybersecurity & Risk Governance',
      description: 'Secure Digital Operations & Risk Governance aligned to ISO 27001, GDPR, SOC 2 and industry-specific regulatory requirements.',
      breadcrumbText: 'Cybersecurity & Risk Governance',
      imageUrl: '',
    },
    intro: {
      badge: 'Capability Overview',
      title: 'Secure Digital Operations with Proactive Risk, Identity, and Threat Governance',
      subtitle: 'Zero Trust architecture and proactive posture management for multi-jurisdictional enterprises.',
      paragraphs: [
        'As enterprises expand their digital footprint across cloud, remote work, and integrated ecosystems, cybersecurity is no longer a backend IT function — it is a business risk discipline. Threats today are persistent, identity-driven, AI-based, and often invisible until damage is done.',
        'As enterprises adopt AI across workflows and decision systems, UniSpark embeds AI risk governance to ensure models, data, and automated outcomes remain secure, explainable, and compliant.',
        'UniSpark helps organizations design and operate holistic cybersecurity and risk governance frameworks that protect digital assets, ensure compliance, and enable secure growth.',
      ],
      imageUrl: '',
      showImage: true,
    },
    challenges: {
      badge: 'Why It Matters',
      title: 'Why Cybersecurity & Risk Governance Matters Today',
      subtitle: "Today's security challenges are shaped by these emerging operational realities:",
      items: [
        { title: 'Identity Is the New Perimeter', desc: 'Identity and credentials have become the primary attack surface across hybrid environments.' },
        { title: 'Automated & AI Threats', desc: 'Threat actors leverage automated, persistent, and AI-driven intrusion vectors.' },
        { title: 'Compliance Consequences', desc: 'Cross-border compliance failures carry severe financial, legal, and operational penalties.' },
        { title: 'Fragmented Tooling', desc: 'Disjointed security point products produce dangerous blind spots and alert fatigue.' },
      ],
    },
    services: {
      badge: 'Core Strengths',
      title: 'Specialized Cybersecurity Capabilities',
      items: [
        {
          title: 'Security Strategy & Risk Assessment',
          desc: 'Structured vulnerability and gap assessments prioritizing cyber investments based on actual business risk.',
          bullets: ['Threat modeling & vulnerability scans', 'Architecture review & gap analysis', 'Executive risk dashboarding'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'Identity & Access Governance (Zero Trust)',
          desc: 'Role-based access, least-privilege models, and conditional access enforcing continuous verification.',
          bullets: ['Privileged Access Management (PAM)', 'Multi-Factor Authentication (MFA)', 'Identity lifecycle automation'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'Threat Detection & Incident Response',
          desc: '24/7 Security Operations Center (SOC) monitoring, automated SIEM correlation, and rapid containment.',
          bullets: ['24/7 continuous SOC monitoring', 'Managed Detection & Response (MDR)', 'Automated incident playbook dispatch'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'Regulatory & Compliance Readiness',
          desc: 'Audit readiness frameworks mapped directly to ISO 27001, GDPR, UAE NESA, and SOC 2 Type II.',
          bullets: ['Statutory audit readiness', 'Data privacy compliance mapping', 'Continuous policy enforcement'],
          imageUrl: '',
          showImage: true,
        },
      ],
    },
    checklist: {
      badge: 'Compliance Framework',
      title: 'Standards & Regulatory Alignment',
      items: [
        'ISO/IEC 27001:2022 Information Security Management',
        'General Data Protection Regulation (GDPR) and DPDP India',
        'SOC 2 Type II Security & Confidentiality Trust Principles',
        'UAE National Electronic Security Authority (NESA) compliance',
      ],
    },
    insight: {
      badge: 'CISO Advisory',
      quote: 'Effective cybersecurity is an enabler of business velocity, not a bottleneck. When controls are embedded cleanly into architecture, compliance becomes continuous and audit-ready.',
      author: 'UniSpark Cybersecurity Practice',
    },
    cta: {
      title: 'Elevate Your Enterprise Cybersecurity & Compliance Posture',
      subtitle: 'Schedule a confidential assessment with our certified CISO advisory and security operations team.',
      imageUrl: '',
      showImage: false,
    },
    visibility: { hero: true, intro: true, challenges: true, services: true, checklist: true, insight: true, cta: true },
  },
  'workforce': {
    hero: {
      badge: 'International Enterprise Operations',
      title: 'Workforce & Business Operations',
      description: 'Enterprise workforce governance, HR advisory, payroll compliance, and workforce deployment models engineered for international operations.',
      breadcrumbText: 'Workforce & Business Operations',
      imageUrl: '',
    },
    intro: {
      badge: 'Workforce Operating Model',
      title: 'Structured Workforce Management Across Regional Jurisdictions',
      subtitle: 'Aligning HR governance, regulatory payroll, and workforce mobility across regions.',
      paragraphs: [
        'International enterprises operating across borders require agile workforce deployment combined with strict local statutory compliance. Navigating multi-jurisdiction labor regulations, employment documentation, and cross-border payroll is critical to operational continuity.',
        'UniSpark delivers end-to-end workforce and business operations solutions that integrate strategic HR advisory, compliant payroll processing, automated HRMS infrastructure, and turnkey workforce mobilization.',
      ],
      imageUrl: '',
      showImage: true,
    },
    challenges: {
      badge: 'Operational Pressures',
      title: 'Workforce Pressures in Cross-Border Environments',
      subtitle: 'Key friction points organizations encounter when scaling regional workforces:',
      items: [
        { title: 'Statutory Labor Complexities', desc: 'Different labor codes, end-of-service gratuity calculations, and local sponsorship mandates.' },
        { title: 'Cross-Border Payroll Integrity', desc: 'Wage Protection System (WPS) adherence, currency remittances, and multi-state tax reporting.' },
        { title: 'Rapid Talent Mobilization', desc: 'Mobilizing vetted engineering and operational personnel under strict timeline and visa constraints.' },
      ],
    },
    services: {
      badge: 'Domain Services',
      title: 'Workforce & Business Operations Practices',
      items: [
        {
          title: 'HR Advisory & Consultancy',
          desc: 'Workforce governance frameworks, HR policy development, and employment compliance advisory.',
          bullets: ['HR policy manuals & handbooks', 'Statutory compliance auditing', 'Organizational restructuring'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'Payroll & Compliance Operations',
          desc: 'Structured, error-free payroll processing supporting automated WPS compliance and statutory tax filings.',
          bullets: ['Automated WPS salary execution', 'Gratuity & benefits calculation', 'Tax and statutory reporting'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'HRMS & Digital Workforce Systems',
          desc: 'Cloud HRMS platforms unifying employee master data, attendance tracking, and self-service portals.',
          bullets: ['Biometric gate attendance integration', 'Automated leave management', 'Digital document repositories'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'Workforce Deployment & Augmentation',
          desc: 'Scalable deployment models for engineering, security operations, and project-based staffing.',
          bullets: ['Specialist engineering mobilization', 'Rapid on-site deployment', 'Fully compliant workforce sponsorship'],
          imageUrl: '',
          showImage: true,
        },
      ],
    },
    checklist: {
      badge: 'Governance Standards',
      title: 'Statutory Workforce Compliance Guarantees',
      items: [
        'Full alignment with UAE Ministry of Human Resources & Emiratisation (MOHRE)',
        '100% Wage Protection System (WPS) salary execution compliance',
        'Indian Statutory Acts: EPF, ESIC, Gratuity, and Professional Tax alignment',
        'ISO 9001 quality-certified workforce deployment processes',
      ],
    },
    insight: {
      badge: 'Workforce Leadership',
      quote: 'Workforce operations in the Gulf and South Asia demand absolute statutory precision. When HR, payroll, and digital timekeeping operate as one cohesive system, legal risk drops to zero while employee satisfaction surges.',
      author: 'UniSpark Global Workforce Operations',
    },
    cta: {
      title: 'Looking for Compliant Workforce & Payroll Infrastructure?',
      subtitle: 'Connect with our regional workforce advisory team to optimize cross-border deployment and payroll integrity.',
      imageUrl: '',
      showImage: false,
    },
    visibility: { hero: true, intro: true, challenges: true, services: true, checklist: true, insight: true, cta: true },
  },
  'security-infrastructure': {
    hero: {
      badge: 'International Enterprise Operations',
      title: 'Security Systems & Infrastructure',
      description: 'Enterprise security systems including surveillance infrastructure, access control solutions, and security equipment deployment supporting secure operational environments.',
      breadcrumbText: 'Security Systems & Infrastructure',
      imageUrl: '',
    },
    intro: {
      badge: 'Physical Security Architecture',
      title: 'Security Infrastructure for Modern Enterprise Environments',
      subtitle: 'Integrated surveillance, access control, and life-safety systems for multi-site commercial and industrial assets.',
      paragraphs: [
        'Security infrastructure has become an essential component of modern enterprise operations. Organizations operating across facilities, logistics networks, airports, manufacturing environments, and enterprise campuses must maintain secure physical environments that protect assets, personnel, and operational continuity.',
        'Security systems today extend beyond traditional surveillance equipment. Enterprises require integrated security infrastructures that combine surveillance systems, access control technologies, monitoring platforms, and operational security management.',
        'UniSpark supports organizations in implementing structured security environments that integrate surveillance systems, security hardware, monitoring platforms, and operational oversight frameworks.',
      ],
      imageUrl: '',
      showImage: true,
    },
    challenges: {
      badge: 'Infrastructure Pressures',
      title: 'Security Infrastructure Challenges in Enterprise Environments',
      subtitle: 'Critical physical security complexities faced by facility leaders:',
      items: [
        { title: 'Facility Scale & Distribution', desc: 'Large distributed sites require synchronized physical security architectures with zero blind spots.' },
        { title: 'System Disconnection', desc: 'Analog cameras, biometric turnstiles, and fire alarms operating as isolated, uncoordinated silos.' },
        { title: 'Strict SIRA/Civil Defense Mandates', desc: 'Non-negotiable compliance standards requiring certified hardware, retention rates, and NOC reporting.' },
      ],
    },
    services: {
      badge: 'Integrated Solutions',
      title: 'Core Infrastructure Capabilities',
      items: [
        {
          title: 'AI Surveillance & Video Analytics',
          desc: 'High-definition 4K surveillance, facial recognition, perimeter analytics, and centralized video walls.',
          bullets: ['Thermal perimeter tracking', 'AI automatic number plate recognition (ANPR)', 'Cloud and on-premises NVR storage'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'Biometric Access Governance',
          desc: 'High-speed optical speed gates, biometric turnstiles, and mobile RFID credentials.',
          bullets: ['Anti-passback access gates', 'Visitor management kiosks', 'Destination dispatch elevator control'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'Turnkey AMC & Maintenance',
          desc: 'SLA-governed preventive maintenance contracts guaranteeing 99.98% hardware uptime and emergency support.',
          bullets: ['24/7 dedicated Network Operations Center', 'Sub-2-hour on-site emergency dispatch', 'Preventive firmware patching'],
          imageUrl: '',
          showImage: true,
        },
      ],
    },
    checklist: {
      badge: 'Certification & Compliance',
      title: 'Regulatory Engineering Standards',
      items: [
        'Certified compliance with UAE SIRA (Security Industry Regulatory Agency)',
        'Alignment with Indian Civil Defense and Bureau of Indian Standards (BIS)',
        'NFPA life-safety and emergency evacuation integration standards',
      ],
    },
    insight: {
      badge: 'Engineering Perspective',
      quote: 'Physical security infrastructure is only as effective as its integration. A single unified PSIM platform correlating CCTV, access, and alarms delivers the situational awareness enterprise leaders require.',
      author: 'UniSpark Security Infrastructure Practice',
    },
    cta: {
      title: 'Engineer Your Facility Security Infrastructure',
      subtitle: 'Schedule an on-site security survey and architecture consultation with our certified physical security engineers.',
      imageUrl: '',
      showImage: false,
    },
    visibility: { hero: true, intro: true, challenges: true, services: true, checklist: true, insight: true, cta: true },
  },
};

/**
 * Generate fallback defaults for any subpage slug
 */
export const getInternationalSubpageDefaults = (slug, fallbackMeta) => {
  if (DEFAULT_INTERNATIONAL_SUBPAGES[slug]) {
    return DEFAULT_INTERNATIONAL_SUBPAGES[slug];
  }

  const meta = fallbackMeta || INTERNATIONAL_SUBPAGES_LIST.find((it) => it.slug === slug);
  const title = meta?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const domain = meta?.domain || 'International Enterprise Operations';

  return {
    hero: {
      badge: domain,
      title,
      description: `Structured enterprise operations, compliance governance, and mission-critical engineering services for ${title}.`,
      breadcrumbText: title,
      imageUrl: '',
    },
    intro: {
      badge: 'Capability Overview',
      title: `Strategic Frameworks for ${title}`,
      subtitle: 'Architecture-first engineering and operational excellence across distributed enterprise environments.',
      paragraphs: [
        `UniSpark delivers comprehensive operational architectures tailored specifically to the unique compliance, technical, and regulatory requirements of ${title}.`,
        'Our cross-border delivery teams provide seamless coordination, robust SLA governance, and end-to-end operational accountability.',
      ],
      imageUrl: '',
      showImage: true,
    },
    challenges: {
      badge: 'Operating Pressures',
      title: `Operational Complexities in ${title}`,
      subtitle: 'Critical operational friction points addressed by our structured delivery model:',
      items: [
        { title: 'Regulatory Alignment', desc: 'Meeting statutory local and regional compliance standards across operating jurisdictions.' },
        { title: 'Operational Resilience', desc: 'Ensuring continuous infrastructure stability, data integrity, and multi-site coordination.' },
        { title: 'Scalable Governance', desc: 'Deploying standardized operational frameworks that scale seamlessly across enterprise teams.' },
      ],
    },
    services: {
      badge: 'Core Services',
      title: 'Enterprise Solutions & Capabilities',
      items: [
        {
          title: `${title} Architecture`,
          desc: 'End-to-end design, implementation, and lifecycle governance tailored to enterprise operational realities.',
          bullets: ['Architecture-first system design', 'Standardized operational procedures', 'Audit-ready compliance mapping'],
          imageUrl: '',
          showImage: true,
        },
        {
          title: 'Managed SLA Operations',
          desc: 'Round-the-clock operational oversight, preventive maintenance, and rapid incident response.',
          bullets: ['24/7 dedicated support teams', 'Strict SLA performance guarantees', 'Continuous optimization & telemetry'],
          imageUrl: '',
          showImage: true,
        },
      ],
    },
    checklist: {
      badge: 'Quality & Governance',
      title: 'Standardized Operating Guarantees',
      items: [
        'Full alignment with regional statutory standards across India and the UAE',
        'ISO-aligned documentation, quality assurance, and change management',
        'Continuous performance reporting and SLA governance audits',
      ],
    },
    insight: {
      badge: 'Executive Insight',
      quote: `Operating across borders demands a single accountable partner. When ${title} operates with standardized governance, organizations achieve scalable growth without compliance friction.`,
      author: 'UniSpark International Practice',
    },
    cta: {
      title: `Ready to Scale Your ${title} Capabilities?`,
      subtitle: 'Schedule a confidential technical consultation with our senior solutions architects today.',
      imageUrl: '',
      showImage: false,
    },
    visibility: { hero: true, intro: true, challenges: true, services: true, checklist: true, insight: true, cta: true },
  };
};

DEFAULT_INTERNATIONAL_DATA.visibility = DEFAULT_INTERNATIONAL_VISIBILITY;
DEFAULT_INTERNATIONAL_DATA.subpages = DEFAULT_INTERNATIONAL_SUBPAGES;

export default DEFAULT_INTERNATIONAL_DATA;

