import React from 'react';
import Card from '../../components/ui/Card';
import {
  FaBullseye, FaEye, FaShieldAlt, FaRocket,
  FaAward, FaGlobe, FaLightbulb, FaHandshake
} from 'react-icons/fa';

const ICON_MAP = {
  FaBullseye,
  FaEye,
  FaShieldAlt,
  FaRocket,
  FaAward,
  FaGlobe,
  FaLightbulb,
  FaHandshake,
};

export const MissionVision = ({ data }) => {
  const missionTitle = data?.missionTitle || 'Our Mission';
  const missionText =
    data?.missionDesc ||
    data?.mission ||
    'To empower enterprise organizations with resilient, AI-powered security infrastructure, unified PSIM control platforms, and uncompromised SLA maintenance services that safeguard lives and critical operations.';
  const MissionIcon = ICON_MAP[data?.missionIcon] || FaBullseye;

  const visionTitle = data?.visionTitle || 'Our Vision';
  const visionText =
    data?.visionDesc ||
    data?.vision ||
    'To become the premier technology systems integrator across Asia & the Middle East, recognized for technological excellence, regulatory compliance, and customer-first innovation.';
  const VisionIcon = ICON_MAP[data?.visionIcon] || FaEye;

  return (
    <section className="py-16 bg-[#f1f9ff]/40 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <MissionIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">{missionTitle}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {missionText}
          </p>
        </Card>

        <Card className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <VisionIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">{visionTitle}</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {visionText}
          </p>
        </Card>
      </div>
    </section>
  );
};

export default MissionVision;
