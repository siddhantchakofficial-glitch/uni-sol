import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import images from '../../assets/images';

export const HRMS = () => {
  return (
    <div>
      <PageHero
        badge="International Division"
        title="Enterprise HRMS Platform"
        description="Cloud-native Human Resource Management System for global attendance, biometric sync, and performance tracking."
        breadcrumbs={[
          { label: 'International', path: '/international' },
          { label: 'HRMS Platform' },
        ]}
        image={images.pr6}
      />
      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-slate-300 space-y-6 text-sm leading-relaxed">
          <SectionHeader
            badge="Cloud Platform"
            title="Integrated Cloud HRMS Solution"
            center={true}
          />
          <p>
            UniSpark HRMS unifies physical biometric access control with cloud time-attendance, leave management, and employee self-service.
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default HRMS;
