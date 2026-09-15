import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import images from '../../assets/images';

export const Workforce = () => {
  return (
    <div>
      <PageHero
        badge="International Division"
        title="Global Workforce Solutions"
        description="Providing specialized technical talent, software engineers, and security project managers worldwide."
        breadcrumbs={[
          { label: 'International', path: '/international' },
          { label: 'Workforce Solutions' },
        ]}
        image={images.pr1}
      />
      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-slate-300 space-y-6 text-sm leading-relaxed">
          <SectionHeader
            badge="Talent Sourcing"
            title="Specialized IT & Technical Talent Consulting"
            center={true}
          />
          <p>
            We help enterprise organizations build scalable technical teams by matching pre-vetted engineers, system integrators, and security operations personnel across global geographies.
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default Workforce;
