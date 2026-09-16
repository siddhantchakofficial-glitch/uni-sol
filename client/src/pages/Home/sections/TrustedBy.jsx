import React from 'react';
import SectionHeader from '../../../components/common/SectionHeader';
import Card from '../../../components/ui/Card';
import { TESTIMONIALS } from '../../../utils/constants';
import { FaQuoteLeft } from 'react-icons/fa';

export const TrustedBy = ({ data }) => {
  const items = (Array.isArray(data) && data.length > 0) ? data : TESTIMONIALS;

  return (
    <section className="py-20 bg-[#f1f9ff]/40 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Client Testimonials"
          title="Trusted by Chief Operating Officers & Security Directors"
          subtitle="Read how our solutions empower enterprise clients to safeguard critical operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((t, idx) => (
            <Card key={idx} className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <FaQuoteLeft className="w-8 h-8 text-blue-500/40" />
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{t.quote || t.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60">
                <span className="font-bold text-slate-100 block text-sm">{t.author || t.name}</span>
                <span className="text-xs text-blue-400 font-semibold block">{t.title || t.role}</span>
                <span className="text-xs text-slate-500 block">{t.company || t.organization}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
