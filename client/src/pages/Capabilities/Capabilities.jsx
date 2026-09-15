import React from 'react';
import PageHero from '../../components/common/PageHero';
import CapabilityCard from '../../components/cards/CapabilityCard';
import CTASection from '../../components/common/CTASection';
import { CAPABILITIES } from '../../utils/constants';
import images from '../../assets/images';

export const Capabilities = () => {
  return (
    <div>
      <PageHero
        badge="Enterprise Capabilities"
        title="Comprehensive Security & Technology Solutions"
        description="Explore our specialized services spanning AI video surveillance, biometric access control, fire safety, and unified PSIM command center integration."
        breadcrumbs={[{ label: 'Capabilities' }]}
        image={images.solBg}
      />

      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAPABILITIES.map((cap) => (
              <CapabilityCard key={cap.id} capability={cap} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Capabilities;
