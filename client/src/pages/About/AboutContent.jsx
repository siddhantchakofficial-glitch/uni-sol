import React from 'react';
import PageHero from '../../components/common/PageHero';
import Story from './Story';
import MissionVision from './Mission';
import Values from './Values';
import GlobalFocus from './GlobalFocus';
import Frameworks from './Frameworks';
import ClientsAndAwards from './ClientsAndAwards';
import Leadership from './Leadership';
import AboutFAQ from './AboutFAQ';
import CTASection from '../../components/common/CTASection';
import LogoMarquee from '../../components/common/LogoMarquee';
import images from '../../assets/images';
import { DEFAULT_ABOUT_DATA } from '../../constants/aboutDefaults';

export const AboutContent = ({ data = {}, isPreview = false }) => {
  const content = {
    ...DEFAULT_ABOUT_DATA,
    ...data,
    visibility: { ...DEFAULT_ABOUT_DATA.visibility, ...(data?.visibility || {}) },
    banner: { ...DEFAULT_ABOUT_DATA.banner, ...(data?.banner || {}) },
    overview: { ...DEFAULT_ABOUT_DATA.overview, ...(data?.overview || {}) },
    missionVision: { ...DEFAULT_ABOUT_DATA.missionVision, ...(data?.missionVision || {}) },
    glanceCards: Array.isArray(data?.glanceCards) ? data.glanceCards : DEFAULT_ABOUT_DATA.glanceCards,
    values: { ...DEFAULT_ABOUT_DATA.values, ...(data?.values || {}) },
    globalFocus: { ...DEFAULT_ABOUT_DATA.globalFocus, ...(data?.globalFocus || {}) },
    frameworks: { ...DEFAULT_ABOUT_DATA.frameworks, ...(data?.frameworks || {}) },
    clientsAwards: { ...DEFAULT_ABOUT_DATA.clientsAwards, ...(data?.clientsAwards || {}) },
    logoMarquee: { ...DEFAULT_ABOUT_DATA.logoMarquee, ...(data?.logoMarquee || {}) },
    faq: { ...DEFAULT_ABOUT_DATA.faq, ...(data?.faq || {}) },
  };

  const {
    visibility,
    banner,
    overview,
    glanceCards,
    missionVision,
    values,
    globalFocus,
    frameworks,
    clientsAwards,
    logoMarquee,
    leadership,
    faq,
  } = content;

  const breadcrumbs = [
    { label: banner.breadcrumbText || 'About Us' },
  ];

  // Marquee renders only when enabled (marquee switch + section visibility
  // manager both respected) AND at least one enabled logo exists — otherwise
  // the original text-badge layout shows, exactly as before.
  const enabledLogos = (Array.isArray(logoMarquee?.logos) ? logoMarquee.logos : [])
    .filter((l) => l && l.enabled !== false && l.imageUrl);
  const logoMarqueeActive =
    logoMarquee?.enabled !== false &&
    visibility.logoMarquee !== false &&
    enabledLogos.length > 0;

  return (
    <div className={`about-page-content ${isPreview ? 'cms-preview-mode' : ''}`}>
      {/* 1. Hero Section */}
      {visibility.hero !== false && (
        <PageHero
          badge={banner.badge}
          title={banner.title}
          description={banner.description || banner.subtitle}
          breadcrumbs={breadcrumbs}
          image={banner.imageUrl || banner.image || images.abtSec}
          overlayOpacity={banner.overlayOpacity}
        />
      )}

      {/* 2. Journey & Story Section (includes statistics cards) */}
      {visibility.journey !== false && (
        <Story
          overview={overview}
          glanceCards={glanceCards}
          showStatistics={visibility.statistics !== false}
        />
      )}

      {/* 3. Mission & Vision Section */}
      {visibility.missionVision !== false && (
        <MissionVision data={missionVision} />
      )}

      {/* 4. Core Values Section */}
      {visibility.values !== false && (
        <Values data={values} />
      )}

      {/* 5. Global Delivery & GCC Model Section */}
      {visibility.globalFocus !== false && (
        <GlobalFocus data={globalFocus} />
      )}

      {/* 6. Credentials & Frameworks Section */}
      {visibility.frameworks !== false && (
        <Frameworks data={frameworks} />
      )}

      {/* 7. Clients & Achievements / Awards Section (+ CMS logo marquee
          rendered directly under the "Trusted by Leading Enterprise Brands"
          heading inside this section when enabled) */}
      {visibility.clientsAwards !== false && (
        <ClientsAndAwards data={clientsAwards} marqueeActive={logoMarqueeActive} />
      )}

      {/* 7b. CMS Logo Marquee — same component for public page and Live
          Preview; fully driven by the About CMS (logos, order, visibility). */}
      {visibility.clientsAwards !== false && logoMarqueeActive && (
        <div className="relative">
          <LogoMarquee data={logoMarquee} />
        </div>
      )}

      {/* 8. Leadership Section */}
      {visibility.leadership !== false && (
        <Leadership data={leadership} />
      )}

      {/* 9. Frequently Asked Questions (FAQ) Section */}
      {visibility.faq !== false && (
        <AboutFAQ data={faq} />
      )}

      {/* 10. CTA Section */}
      {visibility.cta !== false && (
        <CTASection />
      )}
    </div>
  );
};

export default AboutContent;

