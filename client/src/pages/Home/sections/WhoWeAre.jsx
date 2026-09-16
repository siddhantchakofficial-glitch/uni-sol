import React from 'react';
import SectionHeader from '../../../components/common/SectionHeader';
import Badge from '../../../components/ui/Badge';
import { FaCheckCircle, FaAward, FaBuilding, FaGlobe } from 'react-icons/fa';
import images from '../../../assets/images';
import { resolveMediaUrl } from '../../../utils/mediaResolver';

export const WhoWeAre = ({ data = {} }) => {
  const badge = data?.badge || 'Who We Are';
  const title = data?.title || 'Architects of Enterprise Security & Smart Infrastructure';
  const desc1 = data?.description1 || 'UNISPARK INNOVATION PRIVATE LIMITED is a startup recognized by the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India.';
  const desc2 = data?.description2 || 'Founded in 2020 and headquartered in New Delhi with strategic operations in Dubai, UniSpark Innovation delivers comprehensive physical security systems, CCTV video intelligence, access governance, and managed IT services to commercial enterprises, infrastructure projects, and government installations.';
  const statNum = data?.statNumber || '24+';
  const statLbl = data?.statLabel || 'Years Executive Tech Leadership';

  return (
    <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image & Experience Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={resolveMediaUrl(data?.imageUrl, images.abtSec)}
                alt="UniSpark Innovation Command Center"
                className="w-full h-100 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>

            {/* Float Card Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 bg-[#f1f9ff]/95 border border-blue-500/40 p-5 rounded-2xl shadow-2xl backdrop-blur-xl max-w-xs space-y-1">
              <div className="flex items-center gap-3 text-blue-400">
                <FaAward className="w-8 h-8" />
                <span className="text-3xl font-black text-white">{statNum}</span>
              </div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {statLbl}
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              badge={badge}
              title={title}
              subtitle={desc1}
              center={false}
            />

            <p className="text-sm text-slate-300 leading-relaxed">
              {desc2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#f1f9ff]/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <FaBuilding className="w-4 h-4" /> DPIIT Startup India
                </div>
                <p className="text-xs text-slate-400">Officially certified for technological innovation and engineering capability.</p>
              </div>

              <div className="bg-[#f1f9ff]/60 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <FaGlobe className="w-4 h-4" /> Dual Region Presence
                </div>
                <p className="text-xs text-slate-400">Full operational teams providing SLA support across India & UAE.</p>
              </div>
            </div>

            <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
              {[
                'End-to-end Turnkey Delivery (Design, Supply, Install & Maintenance)',
                'SIRA & Civil Defense Regulatory Compliant Architectures',
                'Multi-Vendor System Integration (PSIM & Open API Bridges)',
                'Dedicated 24/7 SLA Technical Response Engineers',
              ].map((point, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <FaCheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
