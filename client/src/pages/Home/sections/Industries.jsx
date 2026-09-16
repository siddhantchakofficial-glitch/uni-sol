import React from 'react';
import SectionHeader from '../../../components/common/SectionHeader';
import IndustryCard from '../../../components/cards/IndustryCard';
import { INDUSTRIES } from '../../../utils/constants';

export const Industries = ({ data }) => {
  const items = (Array.isArray(data) && data.length > 0) ? data : INDUSTRIES;

  return (
    <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Sectors We Serve"
          title="Tailored Solutions Across Critical Industries"
          subtitle="Discover how UniSpark Innovation addresses specific regulatory and operational requirements for diverse domain sectors."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((industry) => (
            <IndustryCard key={industry.id || industry.slug} industry={industry} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
