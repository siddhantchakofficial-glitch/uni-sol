import React from 'react';
import PageHero from '../../components/common/PageHero';
import IndustryCard from '../../components/cards/IndustryCard';
import CTASection from '../../components/common/CTASection';
import { INDUSTRIES } from '../../utils/constants';
import images from '../../assets/images';
import useCMS from '../../hooks/useCMS';

export const Industries = () => {
  const { content } = useCMS('industries', {});
  const banner = content?.banner || {};
  const items = (Array.isArray(content?.industriesList) && content.industriesList.length > 0)
    ? content.industriesList
    : INDUSTRIES;

  return (
    <div>
      <PageHero
        badge={banner.badge || "Domain Expertise"}
        title={banner.title || "Industry Solutions & Sector Implementations"}
        description={banner.subtitle || "Discover tailored security, access control, and IT infrastructure solutions engineered for specific domain challenges."}
        breadcrumbs={[{ label: 'Industries' }]}
        image={banner.imageUrl || images.industriesBg}
      />

      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((ind) => (
              <IndustryCard key={ind.id || ind.slug} industry={ind} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Industries;
