import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import CTASection from '../../components/common/CTASection';
import { caseStudyService } from '../../services/caseStudyService';
import { FaCheckCircle } from 'react-icons/fa';
import images from '../../assets/images';

export const CaseStudyDetails = () => {
  const { slug } = useParams();
  const [cs, setCs] = useState(null);

  useEffect(() => {
    caseStudyService.getBySlug(slug).then((res) => setCs(res));
  }, [slug]);

  if (!cs) return null;

  return (
    <div>
      <PageHero
        badge={cs.client}
        title={cs.title}
        description={cs.summary}
        breadcrumbs={[
          { label: 'Case Studies', path: '/case-studies' },
          { label: cs.title },
        ]}
        image={cs.image || images.sol1}
      />

      <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cs.metrics?.map((m, idx) => (
              <Card key={idx} className="text-center p-4 bg-[#f1f9ff]/60 border-blue-500/30">
                <span className="text-lg font-extrabold text-blue-400 block">{m}</span>
              </Card>
            ))}
          </div>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <SectionHeader badge="Challenge" title="Project Context & Problem Statement" center={false} />
            <p>{cs.challenge}</p>

            <SectionHeader badge="Solution" title="UniSpark Technical Implementation" center={false} />
            <p>{cs.solution}</p>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default CaseStudyDetails;
