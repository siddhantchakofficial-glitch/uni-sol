import React from 'react';
import PageHero from '../../components/common/PageHero';
import CapabilityCard from '../../components/cards/CapabilityCard';
import CTASection from '../../components/common/CTASection';
import { CAPABILITIES } from '../../utils/constants';
import images from '../../assets/images';
import useCMS from '../../hooks/useCMS';

export const Capabilities = () => {
  const { content } = useCMS('capabilities', {});
  const banner = content?.banner || {};
  const items = (Array.isArray(content?.solutionsList) && content.solutionsList.length > 0)
    ? content.solutionsList
    : CAPABILITIES;

  return (
    <div>
      <PageHero
        badge={banner.badge || "Enterprise Capabilities"}
        title={banner.title || "Comprehensive Security & Technology Solutions"}
        description={banner.subtitle || "Explore our specialized services spanning AI video surveillance, biometric access control, fire safety, and unified PSIM command center integration."}
        breadcrumbs={[{ label: 'Capabilities' }]}
        image={banner.imageUrl || images.solBg}
      />

      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((cap) => (
              <CapabilityCard key={cap.id || cap.slug} capability={cap} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Capabilities;
