import React from 'react';
import PageHero from '../../components/common/PageHero';
import SectionHeader from '../../components/common/SectionHeader';
import CTASection from '../../components/common/CTASection';
import images from '../../assets/images';

export const PayrollCompliance = () => {
  return (
    <div>
      <PageHero
        badge="International Division"
        title="Payroll & Compliance Management"
        description="Multi-currency payroll processing, statutory compliance, and international tax reporting."
        breadcrumbs={[
          { label: 'International', path: '/international' },
          { label: 'Payroll & Compliance' },
        ]}
        image={images.pr5}
      />
      <section className="py-20 bg-[#f1f9ff]">
        <div className="max-w-4xl mx-auto px-4 text-slate-300 space-y-6 text-sm leading-relaxed">
          <SectionHeader
            badge="Payroll Operations"
            title="Cross-Border Payroll & Regulatory Compliance"
            center={true}
          />
          <p>
            Ensuring accurate multi-currency payroll disbursements, tax withholdings, and statutory reporting for distributed global teams.
          </p>
        </div>
      </section>
      <CTASection />
    </div>
  );
};

export default PayrollCompliance;
