import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import CTASection from '../../components/common/CTASection';
import { industryService } from '../../services/industryService';
import { FaCheckCircle } from 'react-icons/fa';

export const IndustryDetails = () => {
  const { slug } = useParams();
  const [industry, setIndustry] = useState(null);

  useEffect(() => {
    industryService.getBySlug(slug).then((res) => setIndustry(res));
  }, [slug]);

  if (!industry) return null;

  return (
    <div>
      <PageHero
        badge="Industry Focus"
        title={industry.title}
        description={industry.desc}
        breadcrumbs={[
          { label: 'Industries', path: '/industries' },
          { label: industry.title },
        ]}
        image="/src/assets/images/ind-bg.jpg"
      />

      <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge="Tailored Engineering"
            title={`Security Architectures for ${industry.title}`}
            subtitle={industry.desc}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="space-y-3">
              <h4 className="text-lg font-bold text-slate-100">Key Domain Challenges</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict regulatory standards, high footfall, critical asset protection, and multi-tenant access governance.
              </p>
            </Card>

            <Card className="space-y-3">
              <h4 className="text-lg font-bold text-slate-100">UniSpark Solution</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                4K AI video analytics, biometric turnstiles, ATEX explosion-proof sensors, and 24/7 command center integration.
              </p>
            </Card>

            <Card className="space-y-3">
              <h4 className="text-lg font-bold text-slate-100">Compliance Standards</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full alignment with SIRA/SBD (UAE), Indian Civil Defense, and ISO 27001 data protection protocols.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default IndustryDetails;
