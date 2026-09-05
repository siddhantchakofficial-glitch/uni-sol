import React from 'react';
import SectionHeader from '../../../components/common/SectionHeader';
import PartnerCard from '../../../components/cards/PartnerCard';
import { PARTNERS } from '../../../utils/constants';

export const TechnologyEcosystem = () => {
  return (
    <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Technology Ecosystem"
          title="World-Class Technology Partners & OEM Alignment"
          subtitle="We partner with global leaders in CCTV hardware, access controllers, and life safety sensors."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PARTNERS.map((partner, idx) => (
            <PartnerCard key={idx} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologyEcosystem;
