import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { FaArrowRight, FaVideo, FaFingerprint, FaExclamationTriangle, FaFireExtinguisher, FaIdCard, FaPhoneVolume, FaShieldAlt, FaWrench, FaProjectDiagram } from 'react-icons/fa';

const iconMap = {
  FaVideo,
  FaFingerprint,
  FaExclamationTriangle,
  FaFireExtinguisher,
  FaIdCard,
  FaPhoneVolume,
  FaShieldAlt,
  FaWrench,
  FaProjectDiagram,
};

export const CapabilityCard = ({ capability }) => {
  const IconComponent = iconMap[capability.icon] || FaShieldAlt;

  return (
    <Card className="flex flex-col justify-between h-full group">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md">
            <IconComponent className="w-6 h-6" />
          </div>
          {capability.badge && <Badge variant="blue">{capability.badge}</Badge>}
        </div>

        <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
          {capability.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {capability.desc}
        </p>

        {capability.features && capability.features.length > 0 && (
          <ul className="space-y-1.5 pt-2 border-t border-slate-800/60">
            {capability.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-6 mt-4">
        <Link
          to={`/capabilities/${capability.slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform"
        >
          <span>Explore Capability</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
};

export default CapabilityCard;
