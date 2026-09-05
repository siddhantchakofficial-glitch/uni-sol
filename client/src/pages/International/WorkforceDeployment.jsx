import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';

export const WorkforceDeployment = () => {
  return (
    <div>
      <PageHero
        badge="International Division"
        title="Workforce Deployment Services"
        description="Rapid international workforce mobilization, visa sponsorship, and on-site engineering team deployment."
        breadcrumbs={[
          { label: 'International', path: '/international' },
          { label: 'Workforce Deployment' },
        ]}
        image="/src/assets/images/pr7.jpg"
      />
      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-slate-300 space-y-6 text-sm leading-relaxed">
          <SectionHeader
            badge="Rapid Mobilization"
            title="Global Technical Workforce Mobilization"
            center={true}
          />
          <p>
            Deploying certified technical engineering teams for rapid project execution in India, the UAE, and regional global sites.
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default WorkforceDeployment;
