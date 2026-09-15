import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import images from '../../assets/images';

export const TechnologySecurity = () => {
  return (
    <div>
      <PageHero
        badge="International Division"
        title="Technology & Security Solutions"
        description="Cross-border security infrastructure design, technology export, and multi-country compliance management."
        breadcrumbs={[
          { label: 'International', path: '/international' },
          { label: 'Technology & Security' },
        ]}
        image={images.prBg}
      />
      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-slate-300 space-y-6 text-sm leading-relaxed">
          <SectionHeader
            badge="Global Delivery"
            title="Cross-Border Enterprise Technology Integration"
            center={true}
          />
          <p>
            UniSpark Innovation provides multinational corporations with uniform technology & physical security frameworks across their facilities in India, the Middle East, and worldwide. Our cross-border delivery team coordinates local regulatory approvals, procurement logistics, and centralized NOC monitoring.
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default TechnologySecurity;
