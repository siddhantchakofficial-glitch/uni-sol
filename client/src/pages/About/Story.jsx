import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';

export const Story = ({ overview = {}, glanceCards = [] }) => {
  const badge = overview?.badge || 'Our Journey';
  const title = overview?.heading || 'The Story of UniSpark Innovation';
  const p1 = overview?.paragraph1 || 'UniSpark Innovation Private Limited was founded in New Delhi with a clear mission: to elevate physical security infrastructure and enterprise IT systems to modern digital standards. Recognizing that traditional analog installations left major gaps in threat detection and system reliability, our leadership set out to engineer intelligent, connected systems.';
  const p2 = overview?.paragraph2 || 'Through rigorous engineering quality, DPIIT recognition by the Government of India, and rapid expansion into the United Arab Emirates market, UniSpark has grown into a trusted partner for commercial towers, industrial facilities, and public infrastructure projects across the region.';

  return (
    <section className="py-16 bg-[#f1f9ff] border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          badge={badge}
          title={title}
          subtitle="From a visionary engineering startup in 2020 to a recognized regional technology power."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-300 leading-relaxed">
          <p>{p1}</p>
          <p>{p2}</p>
        </div>

        {Array.isArray(glanceCards) && glanceCards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/60">
            {glanceCards.map((card, idx) => (
              <div key={idx} className="bg-white/80 p-4 rounded-xl border border-sky-100 text-center shadow-xs">
                <span className="text-2xl sm:text-3xl font-black text-[#0470aa] block">{card.number}</span>
                <span className="text-xs text-gray-600 font-medium mt-1 block">{card.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Story;
