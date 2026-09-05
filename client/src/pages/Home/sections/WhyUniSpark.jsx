import React from 'react';
import SectionHeader from '../../../components/common/SectionHeader';
import Card from '../../../components/ui/Card';
import { FaShieldAlt, FaServer, FaChartLine, FaCogs } from 'react-icons/fa';

export const WhyUniSpark = () => {
  const pillars = [
    {
      icon: FaShieldAlt,
      title: 'Security-First Engineering',
      desc: 'Zero-trust architectures, ATEX explosion-proof hardware, and encrypted protocol bridges for critical sites.',
    },
    {
      icon: FaServer,
      title: 'Enterprise-Grade Scale',
      desc: 'Proven capability to handle thousands of 4K IP cameras and multi-building access control setups simultaneously.',
    },
    {
      icon: FaCogs,
      title: 'Seamless Integration',
      desc: 'Unifying CCTV, fire alarms, intruder detection, and gate barriers under a single intuitive PSIM video wall.',
    },
    {
      icon: FaChartLine,
      title: 'Guaranteed SLA Uptime',
      desc: '24/7 dedicated Network Operations Center (NOC) support with sub-2-hour emergency site dispatch.',
    },
  ];

  return (
    <section className="py-20 bg-[#f1f9ff]/50 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Why UniSpark"
          title="Engineered for Uncompromising Reliability"
          subtitle="Why leading commercial real estate, aviation hubs, and energy corporations trust UniSpark Innovation for their critical assets."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUniSpark;
