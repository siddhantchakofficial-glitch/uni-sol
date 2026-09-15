import React from 'react';
import PageHero from '../../components/common/PageHero';
import IndustryCard from '../../components/cards/IndustryCard';
import CTASection from '../../components/common/CTASection';
import { INDUSTRIES } from '../../utils/constants';
import images from '../../assets/images';

export const Industries = () => {
  return (
    <div>
      <PageHero
        badge="Domain Expertise"
        title="Industry Solutions & Sector Implementations"
        description="Discover tailored security, access control, and IT infrastructure solutions engineered for specific domain challenges."
        breadcrumbs={[{ label: 'Industries' }]}
        image={images.industriesBg}
      />

      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INDUSTRIES.map((ind) => (
              <IndustryCard key={ind.id} industry={ind} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Industries;
