import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import images from '../../assets/images';

export const TechnologyDetails = () => {
  return (
    <div>
      <PageHero
        badge="Technology Stack"
        title="Enterprise Tech Stack Details"
        description="Exploring hardware controllers, IP camera optics, AI analytics engines, and PSIM software integration bridges."
        breadcrumbs={[
          { label: 'Technology', path: '/technology' },
          { label: 'Tech Stack' },
        ]}
        image={images.sol1}
      />
      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-slate-300 space-y-6 text-sm leading-relaxed">
          <SectionHeader
            badge="Architecture"
            title="High Performance Security Architecture"
            center={true}
          />
          <p>
            UniSpark Innovation utilizes open-architecture standards (ONVIF, SIP, BACnet) to deliver seamless integration between legacy security hardware and modern cloud management software.
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default TechnologyDetails;
