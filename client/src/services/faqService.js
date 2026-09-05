export const FAQS = [
  {
    question: 'What core services does UniSpark Innovation provide?',
    answer: 'UniSpark Innovation provides end-to-end enterprise IT & physical security solutions including CCTV & AI Video Analytics, Biometric Access Control, Fire & Intruder Detection, System Integration (PSIM), Managed IT Services, and Global Talent Consulting.',
  },
  {
    question: 'What regions do you operate and support in?',
    answer: 'We operate primarily across India and the United Arab Emirates (UAE), with international workforce and IT consulting capabilities extending globally.',
  },
  {
    question: 'Do you offer Annual Maintenance Contracts (AMC)?',
    answer: 'Yes! We offer SLA-governed Annual Maintenance Contracts (AMC) and Preventive Maintenance Contracts (PMC) with 24/7 technical support, dedicated on-site engineers, and guaranteed response times.',
  },
  {
    question: 'How do you ensure compliance with local security regulations?',
    answer: 'All our installations align fully with regional regulatory standards such as SIRA/SBD in the UAE and Indian Civil Defense & BIS guidelines.',
  },
  {
    question: 'Can you integrate existing legacy CCTV & access systems?',
    answer: 'Absolutely. We specialize in system integration using PSIM and open-API platforms to unify legacy analog/IP systems into a single centralized command room interface.',
  },
];

export const faqService = {
  getAll: async () => {
    return FAQS;
  },
};
