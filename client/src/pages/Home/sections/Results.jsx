import React from 'react';
import StatsSection from '../../../components/common/StatsSection';
import SectionHeader from '../../../components/common/SectionHeader';

export const Results = () => {
  return (
    <section className="py-20 bg-[#f1f9ff]/60 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Proven Track Record"
          title="Delivering Quantifiable Enterprise Results"
          subtitle="Our engineering standards deliver direct operational efficiency, cost reduction, and total risk mitigation."
        />

        <StatsSection />
      </div>
    </section>
  );
};

export default Results;
