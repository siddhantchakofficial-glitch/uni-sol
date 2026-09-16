import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import CTASection from '../../components/common/CTASection';
import { industryService } from '../../services/industryService';
import useCMS from '../../hooks/useCMS';
import { resolveMediaUrl } from '../../utils/mediaResolver';
import { FaCheckCircle } from 'react-icons/fa';
import images from '../../assets/images';
import { getIndustrySubpageDefaults } from '../../constants/industriesPageContent';

/**
 * Industry sub-page — one dynamic route (/industries/:slug) serves every
 * Industries dropdown page (aviation, real-estate, oil-gas, hospitality,
 * healthcare, retail, bfsi, manufacturing, or any custom industry).
 *
 * Fully connected to CMS:
 * - Hero: badge, title, description, breadcrumbText, image, visibility
 * - Overview: badge, heading, subtitle, paragraphs, visibility
 * - Domain Cards: title, description, image, showImage, visibility, add/delete/reorder
 * - Features / Capabilities: title, desc, visibility, add/delete/reorder
 * - Statistics: value, label, visibility, add/delete/reorder
 * - CTA: image, visibility
 *
 * Content flows through the existing `industries` CMS record
 * (draft → publish → /api/pages/public/industries), keyed per slug under
 * `industryDetails[slug]`.
 */

// Existing bundled sector imagery per slug — used as hero fallback
const INDUSTRY_HERO_FALLBACKS = {
  aviation: images.aviationSec,
  'real-estate': images.estateSec,
  'oil-gas': images.oilSec,
  hospitality: images.hospitalitySec,
  healthcare: images.healthcareSec,
  retail: images.consumerSec,
  bfsi: images.indBg,
  manufacturing: images.systemSec,
};

/** Optional image strip rendered at the top of a domain card. */
const CardImage = ({ section, fallback = '' }) => {
  if (!section || section.showImage === false || !section.imageUrl) return null;
  return (
    <div className="-m-6 mb-4 overflow-hidden rounded-t-2xl border-b border-[#e5e7eb]">
      <img
        src={resolveMediaUrl(section.imageUrl, fallback)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="w-full h-36 object-cover"
      />
    </div>
  );
};

/**
 * Shared page body — receives fully-resolved props so the CMS Live Preview
 * can render the exact same component tree as the public page.
 */
export const IndustryDetailsContent = ({ industry, details = {}, ctaImage }) => {
  const defaults = getIndustrySubpageDefaults(industry?.slug, industry);

  // Hero data resolution
  const heroData = { ...defaults.hero, ...(details.hero || {}) };
  const heroFallback = INDUSTRY_HERO_FALLBACKS[industry?.slug] || images.indBg;
  const heroImgProp = details.heroImageUrl || heroData.heroImageUrl;
  const heroImage = heroImgProp
    ? resolveMediaUrl(heroImgProp, heroFallback)
    : heroFallback;

  // Overview data resolution
  const overviewData = { ...defaults.overview, ...(details.overview || {}) };

  // Cards resolution (handles both array and legacy object)
  let cardsList = defaults.cards || [];
  if (Array.isArray(details.cards)) {
    cardsList = details.cards;
  } else if (details.cards && typeof details.cards === 'object') {
    cardsList = [
      {
        id: 'c_1',
        title: details.cards.challenges?.title || 'Key Domain Challenges',
        desc: details.cards.challenges?.desc || details.cards.challenges?.description || 'Strict regulatory standards, high footfall, critical asset protection, and multi-tenant access governance.',
        imageUrl: details.cards.challenges?.imageUrl || '',
        showImage: details.cards.challenges?.showImage ?? true,
      },
      {
        id: 'c_2',
        title: details.cards.solution?.title || 'UniSpark Solution',
        desc: details.cards.solution?.desc || details.cards.solution?.description || '4K AI video analytics, biometric turnstiles, ATEX explosion-proof sensors, and 24/7 command center integration.',
        imageUrl: details.cards.solution?.imageUrl || '',
        showImage: details.cards.solution?.showImage ?? true,
      },
      {
        id: 'c_3',
        title: details.cards.compliance?.title || 'Compliance Standards',
        desc: details.cards.compliance?.desc || details.cards.compliance?.description || 'Full alignment with SIRA/SBD (UAE), Indian Civil Defense, and ISO 27001 data protection protocols.',
        imageUrl: details.cards.compliance?.imageUrl || '',
        showImage: details.cards.compliance?.showImage ?? true,
      },
    ];
  }

  // Features & Statistics
  const featuresList = Array.isArray(details.features) ? details.features : (defaults.features || []);
  const statisticsList = Array.isArray(details.statistics) ? details.statistics : (defaults.statistics || []);

  // Section visibility
  const visibility = { ...defaults.visibility, ...(details.visibility || {}) };

  return (
    <div>
      {/* 1. HERO SECTION */}
      {visibility.hero !== false && (
        <PageHero
          badge={heroData.badge || 'Industry Focus'}
          title={heroData.title || industry?.title}
          description={heroData.description || industry?.desc}
          breadcrumbs={[
            { label: 'Industries', path: '/industries' },
            { label: heroData.breadcrumbText || heroData.title || industry?.title },
          ]}
          image={heroImage}
        />
      )}

      {/* 2. OVERVIEW & CARDS SECTION */}
      {(visibility.overview !== false || visibility.cards !== false) && (
        <section className="py-20 bg-[#f1f9ff] border-b border-sky-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {visibility.overview !== false && (
              <div className="space-y-6">
                <SectionHeader
                  badge={overviewData.badge || 'Tailored Engineering'}
                  title={overviewData.heading || `Security Architectures for ${industry?.title}`}
                  subtitle={overviewData.subtitle || industry?.desc}
                />
                {(overviewData.paragraph1 || overviewData.paragraph2) && (
                  <div className="max-w-4xl mx-auto text-center space-y-4 -mt-4 mb-8">
                    {overviewData.paragraph1 && (
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {overviewData.paragraph1}
                      </p>
                    )}
                    {overviewData.paragraph2 && (
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {overviewData.paragraph2}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* DOMAIN CARDS GRID */}
            {visibility.cards !== false && cardsList.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cardsList.map((card, idx) => (
                  <Card key={card.id || `card-${idx}`} className="space-y-3">
                    <CardImage section={card} />
                    <h4 className="text-lg font-bold text-[#000000]">{card.title}</h4>
                    <p className="text-xs text-[#475467] leading-relaxed">
                      {card.desc || card.description}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. STATISTICS SECTION */}
      {visibility.statistics !== false && statisticsList.length > 0 && (
        <section className="py-14 bg-white border-b border-sky-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {statisticsList.map((stat, idx) => (
                <div
                  key={stat.id || `stat-${idx}`}
                  className="text-center p-6 bg-[#f8fbff] rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl lg:text-4xl font-extrabold text-[#0470aa]">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-600 font-semibold mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. FEATURES & ARCHITECTURE CAPABILITIES */}
      {visibility.features !== false && featuresList.length > 0 && (
        <section className="py-16 bg-[#f1f9ff] border-b border-sky-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 bg-sky-100 text-[#0470aa] text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                Capabilities & Solutions
              </span>
              <h3 className="text-2xl font-bold text-slate-900">
                Core Engineering Capabilities
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuresList.map((feat, idx) => (
                <div
                  key={feat.id || `feat-${idx}`}
                  className="p-6 bg-white rounded-2xl border border-sky-100 shadow-sm space-y-2 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#0470aa] shrink-0" />
                    <h4 className="font-bold text-slate-900 text-base">{feat.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {feat.desc || feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CTA SECTION */}
      {visibility.cta !== false && (
        <CTASection
          title={ctaImage.title}
          subtitle={ctaImage.subtitle}
          backgroundImage={
            ctaImage && ctaImage.showImage !== false && ctaImage.imageUrl
              ? resolveMediaUrl(ctaImage.imageUrl)
              : undefined
          }
        />
      )}
    </div>
  );
};

export const IndustryDetails = () => {
  const { slug } = useParams();
  const [industry, setIndustry] = useState(null);

  // Same `industries` CMS record as the landing page — per-slug config
  // lives under `industryDetails[slug]`, following the existing draft/publish flow.
  const { content } = useCMS('industries', {});
  const slugDetails = content?.industryDetails?.[slug] || {};
  const ctaImage = content?.cta || {};

  useEffect(() => {
    industryService.getBySlug(slug).then((res) => setIndustry(res));
  }, [slug]);

  if (!industry) return null;

  return (
    <IndustryDetailsContent
      industry={industry}
      details={slugDetails}
      ctaImage={ctaImage}
    />
  );
};

export default IndustryDetails;
