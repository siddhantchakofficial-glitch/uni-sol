import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import TechnologyPartners from './TechnologyPartners';
import CTASection from '../../components/common/CTASection';
import images from '../../assets/images';

export const Technology = () => {
  return (
    <div>
      <PageHero
        badge="Tech Ecosystem"
        title="Hardware & Software Technology Standards"
        description="Our systems integrate leading global hardware OEMs, AI video analytics platforms, and certified Civil Defense security controllers."
        breadcrumbs={[{ label: 'Technology' }]}
        image={images.advanced}
      />

      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge="OEM Alignment"
            title="Global Strategic Technology Alliances"
            subtitle="We integrate certified hardware and software platforms from industry-leading manufacturers."
          />

          <TechnologyPartners />
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Technology;
