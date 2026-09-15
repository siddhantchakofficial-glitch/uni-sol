import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import images from '../../assets/images';

export const HRAdvisory = () => {
  return (
    <div>
      <PageHero
        badge="International Division"
        title="HR Advisory Services"
        description="Strategic policy design, organizational structuring, and international labor compliance advisory."
        breadcrumbs={[
          { label: 'International', path: '/international' },
          { label: 'HR Advisory' },
        ]}
        image={images.pr4}
      />
      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-slate-300 space-y-6 text-sm leading-relaxed">
          <SectionHeader
            badge="Strategic Consulting"
            title="Executive HR Strategy & Advisory"
            center={true}
          />
          <p>
            Advising global enterprises on talent retention strategies, competitive benefit structuring, and labor law compliance across jurisdictions.
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default HRAdvisory;
