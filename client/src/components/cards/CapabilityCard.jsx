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
          <div className="w-12 h-12 rounded-xl bg-[#0470aa]/10 border border-[#0470aa]/30 flex items-center justify-center text-[#0470aa] group-hover:bg-[#0470aa] group-hover:text-white transition-all duration-300 shadow-md">
            <IconComponent className="w-6 h-6" />
          </div>
          {capability.badge && <Badge variant="blue">{capability.badge}</Badge>}
        </div>

        <h3 className="text-xl font-bold text-[#000000] group-hover:text-[#0470aa] transition-colors leading-snug">
          {capability.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
          {capability.desc || capability.description}
        </p>

        {capability.features && capability.features.length > 0 && (
          <ul className="space-y-1.5 pt-2 border-t border-[#e5e7eb]">
            {capability.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="text-xs text-[#262626] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0470aa]" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-6 mt-4">
        <Link
          to={capability.link || `/capabilities/${capability.slug || capability.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0470aa] hover:text-[#035a88] uppercase tracking-wider group-hover:translate-x-1 transition-transform"
        >
          <span>Explore Capability</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
};

export default CapabilityCard;
