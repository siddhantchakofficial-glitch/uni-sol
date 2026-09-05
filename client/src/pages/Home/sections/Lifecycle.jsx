import React from 'react';
import SectionHeader from '../../../components/common/SectionHeader';
import { FaSearch, FaDraftingCompass, FaTools, FaHeadset, FaChartLine } from 'react-icons/fa';

export const Lifecycle = () => {
  const steps = [
    {
      num: '01',
      icon: FaSearch,
      title: 'Consult & Audit',
      desc: 'In-depth site risk analysis, compliance evaluation, and coverage heat mapping.',
    },
    {
      num: '02',
      icon: FaDraftingCompass,
      title: 'Architecture & Design',
      desc: 'CAD drawings, network bandwidth planning, and bill of materials (BOM) creation.',
    },
    {
      num: '03',
      icon: FaTools,
      title: 'Supply & Commissioning',
      desc: 'SIRA/Civil Defense compliant hardware installation, cabling, and system testing.',
    },
    {
      num: '04',
      icon: FaHeadset,
      title: '24/7 Managed SLA',
      desc: 'NOC monitoring, quarterly preventive maintenance, and quick spares replacement.',
    },
    {
      num: '05',
      icon: FaChartLine,
      title: 'Continuous Optimization',
      desc: 'AI model fine-tuning, firmware updates, and expansion roadmap planning.',
    },
  ];

  return (
    <section className="py-20 bg-[#f1f9ff]/40 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Project Lifecycle"
          title="Our 5-Stage Turnkey Delivery Process"
          subtitle="A structured, SLA-driven engineering methodology that guarantees seamless execution from concept to lifecycle maintenance."
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#f1f9ff]/80 border border-slate-800/80 rounded-2xl p-6 relative flex flex-col justify-between group hover:border-blue-500/50 transition-all duration-300"
              >
                <span className="text-3xl font-black text-slate-700 group-hover:text-blue-500/40 transition-colors">
                  {step.num}
                </span>

                <div className="space-y-3 my-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Lifecycle;
