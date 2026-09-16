import React from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import IndustryCard from '../../components/cards/IndustryCard';
import CTASection from '../../components/common/CTASection';
import Accordion from '../../components/ui/Accordion';
import { INDUSTRIES } from '../../utils/constants';
import images from '../../assets/images';
import useCMS from '../../hooks/useCMS';
import { resolveMediaUrl } from '../../utils/mediaResolver';
import {
  INDUSTRIES_EXTRA_DEFAULTS,
  INDUSTRIES_FAQS,
  INDUSTRIES_IMAGE_DEFAULTS,
} from '../../constants/industriesPageContent';
import {
  FaDraftingCompass,
  FaShieldAlt,
  FaExpandArrowsAlt,
  FaCheckCircle,
  FaArrowRight,
} from 'react-icons/fa';

/**
 * Industries landing page — structured after the reference architecture:
 * Hero → Mission/Introduction → Approach → Main Industry Content (cards) →
 * Capability Framework → Industry Overview grid → Why Choose Us → CTA → FAQ.
 *
 * The existing sections (banner hero, industry cards, CTA) keep their roles;
 * the overview/approach/framework/why/faq sections are new but fully
 * CMS-driven via the shared defaults in constants/industriesPageContent.js.
 */

const PRINCIPLE_ICONS = [FaDraftingCompass, FaShieldAlt, FaExpandArrowsAlt];

/**
 * @param {object}  [props.data]  Optional draft content override — lets the
 *        admin Live Preview render this exact public component with unsaved
 *        CMS edits. The public route renders it with live CMS content.
 */
export const Industries = ({ data: dataProp } = {}) => {
  const { content: fetchedContent } = useCMS('industries', INDUSTRIES_EXTRA_DEFAULTS);
  const content = dataProp || fetchedContent;
  const visibility = { ...INDUSTRIES_EXTRA_DEFAULTS.visibility, ...(content?.visibility || {}) };
  const mainCardsHeader = { ...INDUSTRIES_EXTRA_DEFAULTS.mainCardsHeader, ...(content?.mainCardsHeader || {}) };
  const banner = content?.banner || {};
  const overview = { ...INDUSTRIES_EXTRA_DEFAULTS.overview, ...INDUSTRIES_IMAGE_DEFAULTS.overview, ...(content?.overview || {}) };
  const approach = { ...INDUSTRIES_EXTRA_DEFAULTS.approach, ...INDUSTRIES_IMAGE_DEFAULTS.approach, ...(content?.approach || {}) };
  const framework = { ...INDUSTRIES_EXTRA_DEFAULTS.capabilityFramework, ...INDUSTRIES_IMAGE_DEFAULTS.capabilityFramework, ...(content?.capabilityFramework || {}) };
  const served = { ...INDUSTRIES_EXTRA_DEFAULTS.industriesServed, ...INDUSTRIES_IMAGE_DEFAULTS.industriesServed, ...(content?.industriesServed || {}) };
  const why = { ...INDUSTRIES_EXTRA_DEFAULTS.whyChooseUs, ...INDUSTRIES_IMAGE_DEFAULTS.whyChooseUs, ...(content?.whyChooseUs || {}) };
  const faq = { ...INDUSTRIES_EXTRA_DEFAULTS.faq, ...(content?.faq || {}) };
  const ctaImage = { ...INDUSTRIES_IMAGE_DEFAULTS.cta, ...(content?.cta || {}) };

  /*
   * CMS-controlled image helpers. Every image is optional: when no image is
   * configured (or visibility is off) each section renders EXACTLY as before
   * — identical layout, spacing, and components.
   */
  const showImg = (section) => section?.showImage !== false && !!section?.imageUrl;
  const imgSrc = (section, fallback = '') =>
    showImg(section) ? resolveMediaUrl(section.imageUrl, fallback) : '';

  // Side image used by the two-column sections (overview / approach /
  // framework / why) — inherits each band's existing rounded/shadow language.
  const SectionSideImage = ({ section, fallback, className = '' }) => {
    const src = imgSrc(section, fallback);
    if (!src) return null;
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className={`w-full h-56 sm:h-64 lg:h-full min-h-[14rem] object-cover rounded-2xl shadow-lg ${className}`}
      />
    );
  };

  const items = (Array.isArray(content?.industriesList) && content.industriesList.length > 0)
    ? content.industriesList
    : INDUSTRIES;
  const faqItems = (Array.isArray(faq.items) && faq.items.length > 0)
    ? faq.items
    : INDUSTRIES_FAQS;

  return (
    <div>
      {/* 1. HERO — existing banner */}
      {visibility.hero !== false && (
        <PageHero
          badge={banner.badge || "Domain Expertise"}
          title={banner.title || "Industry Solutions & Sector Implementations"}
          description={banner.subtitle || "Discover tailored security, access control, and IT infrastructure solutions engineered for specific domain challenges."}
          breadcrumbs={[{ label: banner.breadcrumbText || 'Industries' }]}
          image={banner.imageUrl || images.industriesBg}
        />
      )}

      {/* 2. MISSION / INTRODUCTION — existing CMS "overview" fields */}
      {visibility.overview !== false && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="space-y-5">
                <SectionHeader
                  badge={overview.badge}
                  title={overview.heading}
                  center={false}
                />
                <p className="text-sm sm:text-base text-[#475467] leading-relaxed">
                  {overview.paragraph1}
                </p>
                <p className="text-sm sm:text-base text-[#475467] leading-relaxed">
                  {overview.paragraph2}
                </p>
              </div>
              <div className="relative">
                <img
                  src={resolveMediaUrl(
                    showImg(overview) ? overview.imageUrl : '',
                    images.industriesBg
                  )}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute -bottom-4 -left-4 hidden sm:block w-24 h-24 rounded-2xl bg-[#0470aa]/10 border border-[#0470aa]/20" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. APPROACH — numbered principles band */}
      {visibility.approach !== false && (
        <section className="py-16 sm:py-20 bg-[#f1f9ff] border-y border-sky-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeader badge={approach.badge} title={approach.title} />
            {showImg(approach) && (
              <SectionSideImage section={approach} fallback={images.industriesBg} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(approach.principles || []).map((p, i) => {
                const Icon = PRINCIPLE_ICONS[i % PRINCIPLE_ICONS.length];
                return (
                  <div
                    key={i}
                    className="bg-white border border-[#e5e7eb] rounded-2xl p-7 space-y-4 shadow-xs hover:border-[#0470aa]/40 hover:shadow-lg hover:shadow-[#0470aa]/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#0470aa]/10 border border-[#0470aa]/30 flex items-center justify-center text-[#0470aa]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-3xl font-black text-[#0470aa]/15 select-none">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-[#262626] font-semibold leading-relaxed">
                      {p}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. MAIN INDUSTRY CONTENT — cards */}
      {visibility.cards !== false && (
        <section className="py-20 bg-[#f1f9ff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge={mainCardsHeader.badge || "Industries We Serve"}
              title={mainCardsHeader.title || "Reliable Security."}
              highlight={mainCardsHeader.highlight || "Trusted Delivery."}
              subtitle={mainCardsHeader.subtitle}
              className="mb-14"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((ind) => (
                <IndustryCard key={ind.id || ind.slug} industry={ind} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CAPABILITY FRAMEWORK — structured numbered grid */}
      {visibility.framework !== false && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeader
              badge={framework.badge}
              title={framework.title}
              subtitle={framework.subtitle}
            />
            {showImg(framework) && (
              <SectionSideImage section={framework} fallback={images.industriesBg} />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(framework.items || []).map((item, i) => (
                <div
                  key={item.id || i}
                  className="bg-[#f8fafc] border border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-3 hover:border-[#0470aa]/40 hover:shadow-lg hover:shadow-[#0470aa]/5 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#0470aa]/10 text-[#0470aa] text-xs font-black">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-bold text-[#000000] leading-snug">{item.title}</h3>
                  <p className="text-sm text-[#475467] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. INDUSTRY OVERVIEW — grid-based category band */}
      {visibility.served !== false && (
        <section className="py-16 sm:py-20 bg-[#0a1e3f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeader
              badge={served.badge}
              title={served.title}
              className="[&_h2]:text-white [&_p]:text-white/70 [&_.unispark-accent-bar-center]:bg-white/70"
            />
            {showImg(served) && (
              <SectionSideImage
                section={served}
                fallback={images.industriesBg}
                className="shadow-2xl ring-1 ring-white/10"
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(served.items || []).map((item) => (
                <Link
                  key={item.id || item.slug}
                  to={`/industries/${item.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white hover:bg-white/10 hover:border-[#0470aa]/60 transition-all duration-300"
                >
                  <span>{item.name}</span>
                  <FaArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#0470aa] group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. WHY CHOOSE US — benefits grid */}
      {visibility.why !== false && (
        <section className="py-16 sm:py-20 bg-[#f1f9ff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeader badge={why.badge} title={why.title} />
            {showImg(why) && (
              <SectionSideImage section={why} fallback={images.industriesBg} />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(why.items || []).map((item, i) => (
                <div
                  key={item.id || i}
                  className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-3 hover:border-[#0470aa]/40 hover:shadow-lg hover:shadow-[#0470aa]/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <FaCheckCircle className="w-5 h-5 text-[#0470aa]" />
                  <h3 className="text-base font-bold text-[#000000] leading-snug">{item.title}</h3>
                  <p className="text-sm text-[#475467] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. CTA — consultation strip */}
      {visibility.cta !== false && (
        <CTASection
          title={ctaImage.title}
          subtitle={ctaImage.subtitle}
          backgroundImage={
            showImg(ctaImage) ? resolveMediaUrl(ctaImage.imageUrl) : undefined
          }
        />
      )}

      {/* 9. FAQ — accordion */}
      {visibility.faq !== false && (
        <section className="py-16 sm:py-20 bg-white border-t border-sky-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeader
              badge={faq.badge}
              title={faq.title}
              subtitle={faq.subtitle}
            />
            <Accordion items={faqItems} />
          </div>
        </section>
      )}
    </div>
  );
};

export default Industries;
