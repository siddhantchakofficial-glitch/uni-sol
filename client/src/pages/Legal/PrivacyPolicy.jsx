import React from 'react';
import PageHero from '../../components/common/PageHero';

export const PrivacyPolicy = () => {
  return (
    <div>
      <PageHero
        badge="Legal & Compliance"
        title="Privacy Policy"
        description="How UniSpark Innovation protects and governs personal and corporate data."
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />
      <section className="py-16 bg-[#f1f9ff] text-slate-300 text-sm leading-relaxed max-w-4xl mx-auto px-4 space-y-6">
        <h3 className="text-xl font-bold text-white">1. Data Collection</h3>
        <p>
          UniSpark Innovation Private Limited collects personal identification information (Name, Email, Phone, Company) solely for responding to service inquiries and facilitating project consultations.
        </p>

        <h3 className="text-xl font-bold text-white">2. Data Security & Storage</h3>
        <p>
          We employ industry-standard encryption protocols and zero-trust data storage. No information collected through our website is sold or shared with unauthorized third parties.
        </p>

        <h3 className="text-xl font-bold text-white">3. Contact for Data Requests</h3>
        <p>
          For privacy inquiries or data removal requests, please email info@unisparkinnovation.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
