import React from 'react';
import Card from '../../components/ui/Card';
import { FaBullseye, FaEye } from 'react-icons/fa';

export const MissionVision = ({ data }) => {
  const missionText =
    data?.mission ||
    'To empower enterprise organizations with resilient, AI-powered security infrastructure, unified PSIM control platforms, and uncompromised SLA maintenance services that safeguard lives and critical operations.';
  const visionText =
    data?.vision ||
    'To become the premier technology systems integrator across Asia & the Middle East, recognized for technological excellence, regulatory compliance, and customer-first innovation.';

  return (
    <section className="py-16 bg-[#f1f9ff]/40 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FaBullseye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Our Mission</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {missionText}
          </p>
        </Card>

        <Card className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FaEye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Our Vision</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {visionText}
          </p>
        </Card>
      </div>
    </section>
  );
};

export default MissionVision;
