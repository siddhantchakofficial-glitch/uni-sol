import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';

export const SecurityInfrastructure = () => {
  return (
    <div>
      <PageHero
        badge="International Division"
        title="Security Infrastructure Services"
        description="Unified physical security architecture and multi-site compliance management for international enterprises."
        breadcrumbs={[
          { label: 'International', path: '/international' },
          { label: 'Security Infrastructure' },
        ]}
        image="/src/assets/images/pr2.jpg"
      />
      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-slate-300 space-y-6 text-sm leading-relaxed">
          <SectionHeader
            badge="Enterprise Infrastructure"
            title="Global Security Infrastructure Architecture"
            center={true}
          />
          <p>
            Designing and standardizing physical security systems, CCTV networks, and control rooms across multi-national office locations.
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default SecurityInfrastructure;
