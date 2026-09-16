import React from 'react';
import StatsSection from '../../../components/common/StatsSection';
import SectionHeader from '../../../components/common/SectionHeader';

export const Results = ({ data }) => {
  const badge = data?.badge || 'Proven Track Record';
  const title = data?.title || 'Delivering Quantifiable Enterprise Results';
  const subtitle = data?.subtitle || 'Our engineering standards deliver direct operational efficiency, cost reduction, and total risk mitigation.';

  return (
    <section className="py-20 bg-[#f1f9ff]/60 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge={badge}
          title={title}
          subtitle={subtitle}
        />

        <StatsSection stats={data?.stats} />
      </div>
    </section>
  );
};

export default Results;
