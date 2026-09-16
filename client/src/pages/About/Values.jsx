import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import {
  FaShieldAlt, FaChartLine, FaHandshake, FaLightbulb,
  FaBullseye, FaEye, FaAward, FaRocket, FaGlobe, FaCogs, FaServer, FaCheckCircle
} from 'react-icons/fa';

const ICON_MAP = {
  FaShieldAlt,
  FaChartLine,
  FaHandshake,
  FaLightbulb,
  FaBullseye,
  FaEye,
  FaAward,
  FaRocket,
  FaGlobe,
  FaCogs,
  FaServer,
  FaCheckCircle,
};

export const Values = ({ data = {} }) => {
  const badge = data?.badge || 'OUR PRINCIPLES';
  const heading = data?.heading || 'Engineering Discipline, Trust & Measurable Outcomes';
  const subtitle = data?.subtitle || 'The core values that guide our engineering rigor, client partnerships, and technological delivery.';
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <section className="py-20 bg-[#f1f9ff]/50 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge={badge}
          title={heading}
          subtitle={subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const IconComponent = ICON_MAP[item.icon] || FaShieldAlt;
            return (
              <Card key={item.id || idx} hover={true} className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Values;
