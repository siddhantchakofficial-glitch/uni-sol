import React from 'react';
import PageHero from '../../components/common/PageHero';
import CTASection from '../../components/common/CTASection';
import images from '../../assets/images';
import useCMS from '../../hooks/useCMS';
import { resolveMediaUrl } from '../../utils/mediaResolver';
import {
  DEFAULT_INTERNATIONAL_DATA,
  getInternationalSubpageDefaults,
  INTERNATIONAL_SUBPAGES_LIST,
} from '../../constants/internationalDefaults';
import {
  Section,
  Intro,
  Prose,
  CheckList,
  NumberCards,
  ServiceGroup,
  Insight,
  SplitImage,
} from './IntlBlocks';

// Default bundled image mapping per slug so subpages have beautiful imagery out of the box
const SUBPAGE_HERO_FALLBACKS = {
  'technology-security': images.prBg,
  'cybersecurity-risk-governance': images.systemBg,
  'managed-it-services': images.pr1,
  'it-ites-operations': images.pr2,
  'gcc-operations': images.pr3,
  'workforce': images.pr4,
  'hr-advisory': images.pr5,
  'payroll-compliance': images.pr6,
  'hrms': images.pr7,
  'workforce-deployment': images.pr8,
  'skilled-workforce': images.pr9,
  'hr-solutions': images.pr10,
  'security-infrastructure': images.pr2,
  'security-installation-maintenance': images.maintainSec,
  'security-equipment-access-control': images.cctvSec,
};

/**
 * Reusable dynamic renderer for all International Sub-Pages (/international/*).
 * Follows the proven architecture of IndustryDetailsContent / AboutContent:
 * - Direct CMS data flow (draft -> publish -> MongoDB).
 * - Accepts `data` prop for real-time 0ms Live Preview rendering.
 * - Supports Hero, Intro, Challenges, Services, Checklist, Insight, and CTA.
 * - Full image support (upload, select, replace, hide/show).
 * - Full section visibility toggles.
 */
export const IntlSubpageContent = ({ slug, data: dataProp }) => {
  const { content: fetchedContent } = useCMS('international', DEFAULT_INTERNATIONAL_DATA);
  const content = dataProp || fetchedContent;

  const fallbackMeta = INTERNATIONAL_SUBPAGES_LIST.find((it) => it.slug === slug);
  const defaults = getInternationalSubpageDefaults(slug, fallbackMeta);
  const custom = content?.subpages?.[slug] || {};

  // Merged subpage data
  const hero = { ...defaults.hero, ...(custom.hero || {}) };
  const intro = { ...defaults.intro, ...(custom.intro || {}) };
  const challenges = { ...defaults.challenges, ...(custom.challenges || {}) };
  const services = { ...defaults.services, ...(custom.services || {}) };
  const checklist = { ...defaults.checklist, ...(custom.checklist || {}) };
  const insight = { ...defaults.insight, ...(custom.insight || {}) };
  const cta = { ...defaults.cta, ...(custom.cta || {}) };
  const visibility = { ...defaults.visibility, ...(custom.visibility || {}) };

  const heroFallback = SUBPAGE_HERO_FALLBACKS[slug] || images.prBg;
  const heroImage = hero.imageUrl
    ? resolveMediaUrl(hero.imageUrl, heroFallback)
    : heroFallback;

  return (
    <div>
      {/* ── 1. HERO SECTION ── */}
      {visibility.hero !== false && (
        <PageHero
          badge={hero.badge || 'International Enterprise Operations'}
          title={hero.title}
          description={hero.description}
          breadcrumbs={[
            { label: 'International', path: '/international' },
            { label: hero.breadcrumbText || hero.title },
          ]}
          image={heroImage}
        />
      )}

      {/* ── 2. INTRO / OVERVIEW SECTION ── */}
      {visibility.intro !== false && (
        <Section tone="white">
          {intro.imageUrl && intro.showImage !== false ? (
            <SplitImage
              badge={intro.badge || 'Domain Overview'}
              title={intro.title}
              paragraphs={intro.paragraphs || []}
              image={resolveMediaUrl(intro.imageUrl, images.solBg)}
            />
          ) : (
            <div className="space-y-6 text-center max-w-4xl mx-auto">
              <Intro
                badge={intro.badge || 'Domain Overview'}
                title={intro.title}
                subtitle={intro.subtitle}
              />
              {intro.paragraphs && intro.paragraphs.length > 0 && (
                <Prose className="max-w-3xl mx-auto text-left" paragraphs={intro.paragraphs} />
              )}
            </div>
          )}
        </Section>
      )}

      {/* ── 3. OPERATIONAL CHALLENGES / SCALE SECTION ── */}
      {visibility.challenges !== false && challenges.items && challenges.items.length > 0 && (
        <Section tone="tint">
          <Intro
            badge={challenges.badge || 'Scale Factor'}
            title={challenges.title}
            subtitle={challenges.subtitle}
          />
          <NumberCards items={challenges.items} columns={challenges.items.length > 3 ? 4 : 3} />
        </Section>
      )}

      {/* ── 4. SERVICES / CAPABILITIES SECTION ── */}
      {visibility.services !== false && services.items && services.items.length > 0 && (
        <Section tone="white">
          <Intro
            badge={services.badge || 'Core Capabilities'}
            title={services.title}
            subtitle={services.subtitle}
          />
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(services.items.length, 2)} gap-6 items-stretch`}>
            {services.items.map((svc, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs hover:border-[#0470aa]/40 hover:shadow-lg hover:shadow-[#0470aa]/10 hover:-translate-y-0.5 transition-all duration-300"
              >
                {svc.imageUrl && svc.showImage !== false && (
                  <div className="-m-6 sm:-m-8 mb-4 overflow-hidden rounded-t-2xl border-b border-[#e5e7eb] h-44">
                    <img
                      src={resolveMediaUrl(svc.imageUrl)}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#000000]">{svc.title}</h3>
                <p className="text-sm text-[#475467] leading-relaxed">{svc.desc}</p>
                {svc.bullets && svc.bullets.length > 0 && (
                  <div className="pt-2">
                    <CheckList items={svc.bullets} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── 5. CHECKLIST / STANDARDS SECTION ── */}
      {visibility.checklist !== false && checklist.items && checklist.items.length > 0 && (
        <Section tone="tint">
          <Intro
            badge={checklist.badge || 'Governance Standards'}
            title={checklist.title}
            subtitle={checklist.subtitle}
          />
          <div className="max-w-4xl mx-auto">
            <CheckList items={checklist.items} columns={checklist.items.length > 4 ? 2 : 1} />
          </div>
        </Section>
      )}

      {/* ── 6. EXECUTIVE INSIGHT SECTION ── */}
      {visibility.insight !== false && insight.quote && (
        <Section tone="white">
          <Insight>
            {insight.quote}
          </Insight>
        </Section>
      )}

      {/* ── 7. CTA SECTION ── */}
      {visibility.cta !== false && (
        <CTASection
          title={cta.title}
          subtitle={cta.subtitle}
          backgroundImage={
            cta.imageUrl && cta.showImage !== false
              ? resolveMediaUrl(cta.imageUrl)
              : undefined
          }
        />
      )}
    </div>
  );
};

export default IntlSubpageContent;
