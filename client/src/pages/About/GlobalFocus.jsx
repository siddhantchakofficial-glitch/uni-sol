import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import { FaGlobeAmericas, FaCity, FaPlaneDeparture, FaCheckCircle } from 'react-icons/fa';

export const GlobalFocus = ({ data = {} }) => {
  const badge = data?.badge || 'GLOBAL DELIVERY MODEL';
  const heading = data?.heading || 'Dual-Shore Delivery & GCC-Ready Engineering Model';
  const subtitle = data?.subtitle || 'Uniting world-class engineering hubs in India with on-the-ground operational governance in the UAE.';
  const description = data?.description || 'Our dual-shore architecture enables cross-border collaboration, 24/7 technical oversight, and rapid on-site deployment across APAC and Middle East enterprise hubs.';
  const features = Array.isArray(data?.features) ? data.features : [];

  const icons = [FaCity, FaGlobeAmericas, FaPlaneDeparture];

  return (
    <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge={badge}
          title={heading}
          subtitle={subtitle}
        />

        {description && (
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = icons[idx % icons.length] || FaGlobeAmericas;
            return (
              <Card key={feature.id || idx} hover={true} className="p-6 space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                      {feature.subtitle || 'Regional Pillar'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100">{feature.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{feature.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400">
                  <FaCheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Aligned with local regulatory standards & SLAs</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GlobalFocus;
