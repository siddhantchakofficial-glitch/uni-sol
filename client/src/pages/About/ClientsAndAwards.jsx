import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import { FaAward, FaBuilding, FaCheckCircle, FaStar } from 'react-icons/fa';

export const ClientsAndAwards = ({ data = {}, marqueeActive = false }) => {
  const badge = data?.badge || 'ACHIEVEMENTS & TRUST';
  const heading = data?.heading || 'Recognized by Industry, Trusted by Enterprises';
  const subtitle = data?.subtitle || 'Our commitment to innovation and engineering quality has earned industry recognitions and the trust of leading organizations.';
  const awards = Array.isArray(data?.awards) ? data.awards : [];
  const clients = Array.isArray(data?.clients) ? data.clients : [];

  return (
    <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge={badge}
          title={heading}
          subtitle={subtitle}
        />

        {/* Awards Grid */}
        {awards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {awards.map((award, idx) => (
              <Card key={award.id || idx} hover={true} className="p-6 flex flex-col justify-between space-y-4 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <FaAward className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {award.year || 'Award'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{award.issuer}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{award.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">{award.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Trusted By Client Badges — falls back to the text badges when the
            CMS logo marquee is disabled or has no logos configured. */}
        {clients.length > 0 && !marqueeActive && (
          <div className="pt-8 border-t border-slate-800/60 space-y-6">
            <div className="text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Trusted by Leading Enterprise Brands
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {clients.map((client, idx) => (
                <div
                  key={client.id || idx}
                  className="px-5 py-3 rounded-xl bg-[#0b1329]/60 border border-slate-700/60 text-slate-200 font-semibold text-sm hover:border-sky-500/40 hover:text-white transition-all shadow-xs"
                >
                  {client.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientsAndAwards;
