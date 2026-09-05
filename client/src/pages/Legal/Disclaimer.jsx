import React from 'react';
import PageHero from '../../components/common/PageHero';

export const Disclaimer = () => {
  return (
    <div>
      <PageHero
        badge="Legal & Compliance"
        title="Website Disclaimer"
        description="General information disclaimer for UniSpark Innovation."
        breadcrumbs={[{ label: 'Disclaimer' }]}
      />
      <section className="py-16 bg-[#f1f9ff] text-slate-300 text-sm leading-relaxed max-w-4xl mx-auto px-4 space-y-6">
        <h3 className="text-xl font-bold text-white">General Disclaimer</h3>
        <p>
          The information contained on www.unisparkinnovation.com is for general informational and consulting purposes. While we attempt to maintain accurate data, project specifications are subject to customized engineering designs.
        </p>
      </section>
    </div>
  );
};

export default Disclaimer;
