import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/ui/Card';
import {
  FaShieldAlt, FaAward, FaServer, FaCogs,
  FaCheckCircle, FaFileContract, FaCertificate, FaLock
} from 'react-icons/fa';

const ICON_MAP = {
  FaShieldAlt,
  FaAward,
  FaServer,
  FaCogs,
  FaCheckCircle,
  FaFileContract,
  FaCertificate,
  FaLock,
};

export const Frameworks = ({ data = {} }) => {
  const badge = data?.badge || 'CREDENTIALS & COMPLIANCE';
  const heading = data?.heading || 'Enterprise Governance & Industry Frameworks';
  const subtitle = data?.subtitle || 'Proven methodologies and international standards that ensure security, operational resilience, and architectural excellence.';
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
              <Card key={item.id || idx} hover={true} className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
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

export default Frameworks;
