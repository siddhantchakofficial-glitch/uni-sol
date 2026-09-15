import React from 'react';
import SectionHeader from '../../../components/common/SectionHeader';
import CapabilityCard from '../../../components/cards/CapabilityCard';
import { CAPABILITIES } from '../../../utils/constants';

export const Capabilities = ({ data }) => {
  const items = (Array.isArray(data) && data.length > 0) ? data : CAPABILITIES;

  return (
    <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Core Capabilities"
          title="Comprehensive Enterprise Security Solutions"
          subtitle="From AI video analytics to multi-site access control and life safety fire alarms, discover our end-to-end capabilities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((capability) => (
            <CapabilityCard key={capability.id || capability._id} capability={capability} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
