import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';

export const Story = () => {
  return (
    <section className="py-16 bg-[#f1f9ff] border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          badge="Our Journey"
          title="The Story of UniSpark Innovation"
          subtitle="From a visionary engineering startup in 2020 to a recognized regional technology power."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-300 leading-relaxed">
          <p>
            UniSpark Innovation Private Limited was founded in New Delhi with a clear mission: to elevate physical security infrastructure and enterprise IT systems to modern digital standards. Recognizing that traditional analog installations left major gaps in threat detection and system reliability, our leadership set out to engineer intelligent, connected systems.
          </p>
          <p>
            Through rigorous engineering quality, DPIIT recognition by the Government of India, and rapid expansion into the United Arab Emirates market, UniSpark has grown into a trusted partner for commercial towers, industrial facilities, and public infrastructure projects across the region.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Story;
