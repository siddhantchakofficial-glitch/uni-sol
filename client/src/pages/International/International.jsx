import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import { useSiteContext } from '../../context/SiteContext';
import useCMS from '../../hooks/useCMS';
import { DEFAULT_INTERNATIONAL_DATA } from '../../constants/internationalDefaults';
import images from '../../assets/images';
import { resolveMediaUrl } from '../../utils/mediaResolver';
import {
  Section,
  Intro,
  Prose,
  NumberCards,
  DomainCard,
  SolutionCard,
  FrameworkStep,
  CategoryCard,
  ValuePillarCard,
  Insight,
  SplitImage,
  FAQAccordion,
} from './IntlBlocks';
import { FaCalendarCheck, FaArrowRight, FaPhoneAlt } from 'react-icons/fa';

/**
 * International Enterprise Operations / Advanced Enterprise Solutions page.
 * Follows the 10-tier architecture inspired by the reference:
 * - Section 01: Hero / Page Introduction
 * - Section 02: International Enterprise Operations Introduction
 * - Section 03: Operational Complexity in International Enterprise Environments
 * - Section 04: Core Operational Domains (with interactive drawer dropdowns)
 * - Section 05: Detailed Operational Solutions
 * - Section 06: Unified Capability Framework
 * - Section 07: Category & Operational Overview
 * - Section 08: Why Organizations Choose Our Operations & Executive Insight
 * - Section 09: Consultation / CTA Section
 * - Section 10: Enterprise FAQ Accordion
 */

export const International = ({ data: dataProp } = {}) => {
  const { setConsultationModalOpen } = useSiteContext();
  const { content: fetchedContent } = useCMS('international', DEFAULT_INTERNATIONAL_DATA);
  const content = dataProp || fetchedContent;

  // Active drawer state for Section 04
  const [openDrawer, setOpenDrawer] = useState(null);

  // Active filter tab for Section 05 Detailed Solutions
  const [activeTab, setActiveTab] = useState('All');

  // Extract content sections with safe fallback defaults
  const visibility = { ...DEFAULT_INTERNATIONAL_DATA.visibility, ...(content?.visibility || {}) };
  const banner = content?.banner || DEFAULT_INTERNATIONAL_DATA.banner;
  const intro = content?.intro || DEFAULT_INTERNATIONAL_DATA.intro;
  const complexity = content?.complexity || DEFAULT_INTERNATIONAL_DATA.complexity;
  const domains = Array.isArray(content?.domains) && content.domains.length > 0
    ? content.domains
    : DEFAULT_INTERNATIONAL_DATA.domains;
  const detailedSolutions = Array.isArray(content?.detailedSolutions) && content.detailedSolutions.length > 0
    ? content.detailedSolutions
    : DEFAULT_INTERNATIONAL_DATA.detailedSolutions;
  const framework = content?.framework || DEFAULT_INTERNATIONAL_DATA.framework;
  const categories = Array.isArray(content?.categories) && content.categories.length > 0
    ? content.categories
    : DEFAULT_INTERNATIONAL_DATA.categories;
  const whyChooseUs = content?.whyChooseUs || DEFAULT_INTERNATIONAL_DATA.whyChooseUs;
  const cta = content?.cta || DEFAULT_INTERNATIONAL_DATA.cta;
  const faqs = Array.isArray(content?.faqs) && content.faqs.length > 0
    ? content.faqs
    : DEFAULT_INTERNATIONAL_DATA.faqs;

  // Filter solutions by selected domain tab
  const filteredSolutions = activeTab === 'All'
    ? detailedSolutions
    : detailedSolutions.filter((sol) => sol.domain?.toLowerCase().includes(activeTab.toLowerCase()));

  const solutionTabs = ['All', 'Technology & Security', 'Workforce & Business', 'Security Infrastructure'];

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* ── SECTION 01: Hero / Page Introduction ── */}
      {visibility.banner !== false && (
        <PageHero
          badge={banner.badge || 'International Enterprise Operations'}
          title={banner.title || DEFAULT_INTERNATIONAL_DATA.banner.title}
          description={banner.description || DEFAULT_INTERNATIONAL_DATA.banner.description}
          breadcrumbs={[
            { label: 'International', path: '/international' },
            { label: 'Enterprise Operations' },
          ]}
          image={banner.imageUrl ? resolveMediaUrl(banner.imageUrl) : images.prBg}
        />
      )}

      {/* ── SECTION 02: International Enterprise Operations Introduction ── */}
      <Section tone="white" id="operating-model">
        <SplitImage
          badge={intro.badge || 'Operating Model'}
          title={intro.title || DEFAULT_INTERNATIONAL_DATA.intro.title}
          paragraphs={[
            intro.description1 || DEFAULT_INTERNATIONAL_DATA.intro.description1,
            intro.description2 || DEFAULT_INTERNATIONAL_DATA.intro.description2,
          ]}
          image={resolveMediaUrl(intro.imageUrl, images.solBg || '/assets/images/sol-bg.jpg')}
        />
      </Section>

      {/* ── SECTION 03: Operational Complexity / Challenges ── */}
      <Section tone="tint" id="complexity">
        <Intro
          badge={complexity.badge || 'Operating Pressures'}
          title={complexity.title || DEFAULT_INTERNATIONAL_DATA.complexity.title}
          subtitle={complexity.subtitle || DEFAULT_INTERNATIONAL_DATA.complexity.subtitle}
        />

        <NumberCards items={complexity.challenges || DEFAULT_INTERNATIONAL_DATA.complexity.challenges} columns={5} />

        {complexity.summaryProse && (
          <Prose
            className="max-w-3xl mx-auto text-center pt-4"
            paragraphs={complexity.summaryProse}
          />
        )}
      </Section>

      {/* ── SECTION 04: Core Operational Domains ── */}
      <Section tone="white" id="operational-domains">
        <Intro
          badge="Explore the Relevant Operational Domains"
          title="Core Operational Domains"
          subtitle="International enterprise environments typically rely on three core operational domains that enable reliable business operations across regions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {domains.map((domain) => (
            <DomainCard
              key={domain.id || domain.name}
              domain={domain}
              isOpen={openDrawer === domain.name}
              onOpen={(name) => setOpenDrawer(name)}
            />
          ))}
        </div>
      </Section>

      {/* ── SECTION 05: Detailed Operational Solutions ── */}
      <Section tone="tint" id="detailed-solutions">
        <Intro
          badge="Operational Capabilities"
          title="Detailed Enterprise Operational Solutions"
          subtitle="Structured service offerings engineered for cross-border reliability, regulatory audit readiness, and seamless operational delivery."
        />

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
          {solutionTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-[#0470aa] text-white shadow-md shadow-[#0470aa]/20'
                  : 'bg-white text-slate-600 hover:text-[#0470aa] border border-slate-200/80 hover:border-[#0470aa]/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredSolutions.map((sol) => (
            <SolutionCard key={sol.id || sol.title} solution={sol} />
          ))}
        </div>
      </Section>

      {/* ── SECTION 06: Unified Capability Framework ── */}
      <Section tone="white" id="capability-framework">
        <Intro
          badge={framework.badge || 'Capability Framework'}
          title={framework.title || DEFAULT_INTERNATIONAL_DATA.framework.title}
          subtitle={framework.subtitle || DEFAULT_INTERNATIONAL_DATA.framework.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(framework.steps || DEFAULT_INTERNATIONAL_DATA.framework.steps).map((stepItem, idx) => (
            <FrameworkStep
              key={idx}
              step={stepItem.step}
              title={stepItem.title}
              desc={stepItem.desc}
              idx={idx}
            />
          ))}
        </div>
      </Section>

      {/* ── SECTION 07: Operational Areas / Categories Overview ── */}
      <Section tone="slate" id="solution-categories">
        <Intro
          badge="Operational Overview"
          title="Enterprise Solution Categories at a Glance"
          subtitle="A consolidated view of technology, workforce, and security competencies available for international deployment."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} category={cat} />
          ))}
        </div>
      </Section>

      {/* ── SECTION 08: Why Organizations Choose Us & Insight ── */}
      <Section tone="white" id="why-choose-us">
        <Intro
          badge={whyChooseUs.badge || 'Why Partner With Us'}
          title={whyChooseUs.title || DEFAULT_INTERNATIONAL_DATA.whyChooseUs.title}
          subtitle={whyChooseUs.subtitle || DEFAULT_INTERNATIONAL_DATA.whyChooseUs.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(whyChooseUs.pillars || DEFAULT_INTERNATIONAL_DATA.whyChooseUs.pillars).map((pillar, idx) => (
            <ValuePillarCard
              key={idx}
              title={pillar.title}
              desc={pillar.desc}
              idx={idx}
            />
          ))}
        </div>

        {/* Executive Insight Callout */}
        <div className="pt-6">
          <Insight>
            {whyChooseUs.insightQuote || DEFAULT_INTERNATIONAL_DATA.whyChooseUs.insightQuote}
          </Insight>
        </div>
      </Section>

      {/* ── SECTION 09: Consultation / Bottom CTA Section ── */}
      <section id="consultation" className="py-20 relative overflow-hidden bg-gradient-to-br from-[#071326] via-[#091a33] to-[#0470aa]/40 text-white">
        <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="inline-block px-3.5 py-1 text-xs font-bold tracking-wider text-sky-400 uppercase bg-sky-950/80 border border-sky-800/80 rounded-full">
              {cta.badge || 'Enterprise Advisory'}
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {cta.title || DEFAULT_INTERNATIONAL_DATA.cta.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
              {cta.subtitle || DEFAULT_INTERNATIONAL_DATA.cta.subtitle}
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setConsultationModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-[#0470aa] hover:bg-[#035a88] text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-[#0470aa]/25 transition duration-300 flex items-center justify-center gap-2.5"
              >
                <FaCalendarCheck className="w-4 h-4" />
                <span>{cta.primaryBtnText || 'Schedule Consultation'}</span>
              </button>

              <Link
                to={cta.secondaryBtnLink || '/contact'}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition duration-300 flex items-center justify-center gap-2"
              >
                <span>{cta.secondaryBtnText || 'Contact Solutions Team'}</span>
                <FaArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pt-2">
              <a
                href="tel:+971502885874"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <FaPhoneAlt className="w-3 h-3 text-sky-400" />
                <span>Direct UAE / International Line: +971 50 288 5874</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 10: Enterprise FAQ Accordion ── */}
      <Section tone="tint" id="faqs">
        <Intro
          badge="FAQ's"
          title="Frequently Asked Questions"
          subtitle="Diverse solutions tailored to your operational realities across international jurisdictions."
        />

        <FAQAccordion faqs={faqs} />
      </Section>
    </div>
  );
};

export default International;
