import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';

export const HRSolutions = () => {
  return (
    <div>
      <PageHero
        badge="International Division"
        title="International HR Solutions"
        description="End-to-end human resource management, international talent acquisition, and employee lifecycle management."
        breadcrumbs={[
          { label: 'International', path: '/international' },
          { label: 'HR Solutions' },
        ]}
        image="/src/assets/images/pr3.jpg"
      />
      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-slate-300 space-y-6 text-sm leading-relaxed">
          <SectionHeader
            badge="HR Management"
            title="Global Human Resource Consulting"
            center={true}
          />
          <p>
            Streamlining global employee onboarding, benefits administration, and compliance management for growing global organizations.
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default HRSolutions;
