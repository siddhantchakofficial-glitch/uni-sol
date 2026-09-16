import React from 'react';
import SectionHeader from '../../../components/common/SectionHeader';
import Accordion from '../../../components/ui/Accordion';
import { FAQS } from '../../../services/faqService';

export const FAQ = ({ data }) => {
  const items = (Array.isArray(data) && data.length > 0) ? data : FAQS;

  return (
    <section className="py-20 bg-[#f1f9ff]/40 border-b border-slate-800/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Enterprise FAQ"
          title="Frequently Asked Questions"
          subtitle="Clear answers regarding our services, SLA support models, and regulatory compliance."
        />

        <Accordion items={items} />
      </div>
    </section>
  );
};

export default FAQ;
