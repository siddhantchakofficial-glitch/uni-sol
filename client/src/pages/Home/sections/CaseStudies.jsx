import React from 'react';
import SectionHeader from '../../../components/common/SectionHeader';
import CaseStudyCard from '../../../components/cards/CaseStudyCard';
import { CASE_STUDIES } from '../../../services/caseStudyService';

export const CaseStudies = () => {
  return (
    <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Case Studies"
          title="Real-World Implementation Portfolio"
          subtitle="Explore detailed project breakdowns highlighting our technical execution and ROI outcomes."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((cs) => (
            <CaseStudyCard key={cs.id} caseStudy={cs} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
