import React from 'react';
import PageHero from '../../components/common/PageHero';
import CaseStudyCard from '../../components/cards/CaseStudyCard';
import CTASection from '../../components/common/CTASection';
import { CASE_STUDIES } from '../../services/caseStudyService';
import images from '../../assets/images';

export const CaseStudies = () => {
  return (
    <div>
      <PageHero
        badge="Proven Execution"
        title="Enterprise Case Studies & Success Stories"
        description="Explore how UniSpark Innovation designs and maintains critical security infrastructure across complex site environments."
        breadcrumbs={[{ label: 'Case Studies' }]}
        image={images.sol1}
      />

      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CASE_STUDIES.map((cs) => (
              <CaseStudyCard key={cs.id} caseStudy={cs} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default CaseStudies;
