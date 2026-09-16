import React from 'react';
import { ShieldCheck, Shuffle, Share2, Clock, Globe, Cpu, Award, CheckCircle2 } from 'lucide-react';

const IconMap = {
  ShieldCheck,
  Shuffle,
  Share2,
  Clock,
  Globe,
  Cpu,
  Award,
  CheckCircle2
};

export default function KeyDifferentiatorsSection({ data }) {
  const badge = data?.diffBadge || 'WHY CHOOSE US';
  const title = data?.diffTitle || 'Our Key Differentiators';
  const desc = data?.diffDesc || 'UniSpark combines regulatory excellence, technical expertise, and a vendor-neutral approach to deliver reliable, end-to-end security infrastructure tailored to your needs.';
  const cards = Array.isArray(data?.diffCards) && data.diffCards.length > 0 ? data.diffCards : [
    {
      title: 'UAE-Compliant by Design',
      desc: 'Every installation follows UAE Civil Defence, NESA, and DESC standards. We handle compliance documentation so you don\'t have to.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Multi-Brand Vendor Independence',
      desc: 'We source from Hikvision, Dahua, Bosch, ZKTeco, HID, Honeywell, and more — selecting the right technology, not the most convenient one.',
      icon: 'Shuffle'
    },
    {
      title: 'One Partner, Full Lifecycle',
      desc: 'Site survey, design, supply, installation, testing, commissioning, handover, and AMC. You deal with one team across the full project lifecycle.',
      icon: 'Share2'
    },
    {
      title: 'SLA-Governed Service',
      desc: 'Emergency response, preventive maintenance, remote health monitoring, and spare parts supply — all governed by formal SLA agreements.',
      icon: 'Clock'
    },
    {
      title: 'Cross-Sector Experience',
      desc: 'From international airports to residential compounds, from oil field installations to hotel lobbies, we have deployed security systems across every major UAE sector.',
      icon: 'Globe'
    },
    {
      title: 'Backed by Technology Expertise',
      desc: 'Through our sister company Horizon Hive Technology, we integrate physical security with AI/ML surveillance, cybersecurity, and digital transformation capabilities.',
      icon: 'Cpu'
    }
  ];

  return (
    <section className="relative py-20 bg-[#f4f8fc] text-slate-900 overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#0073b7]" />
            <span>{badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {title.includes('Differentiators') ? (
              <>
                {title.split('Differentiators')[0]}
                <span className="text-[#0073b7]">Differentiators</span>
                {title.split('Differentiators')[1]}
              </>
            ) : (
              title
            )}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((item, idx) => {
            const IconComp = IconMap[item.icon] || ShieldCheck;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#0073b7] flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
