import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import Accordion from '../../components/ui/Accordion';

export const AboutFAQ = ({ data = {} }) => {
  const badge = data?.badge || 'ENTERPRISE FAQ';
  const heading = data?.heading || 'Frequently Asked Questions';
  const subtitle = data?.subtitle || 'Explore answers to common questions about our capabilities, delivery models, compliance, and enterprise partnerships.';
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <section className="py-20 bg-[#f1f9ff]/40 border-b border-slate-800/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge={badge}
          title={heading}
          subtitle={subtitle}
        />

        <Accordion items={items} />
      </div>
    </section>
  );
};

export default AboutFAQ;
