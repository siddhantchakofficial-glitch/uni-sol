import React from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import TeamCard from '../../components/cards/TeamCard';
import { TEAM_MEMBERS } from '../../services/teamService';

export const Leadership = ({ data }) => {
  const members = (Array.isArray(data) && data.length > 0) ? data : TEAM_MEMBERS;

  return (
    <section className="py-20 bg-[#f1f9ff] border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Executive Leadership"
          title="Guided by Industry Visionaries"
          subtitle="Our board and executive leaders bring over two decades of experience in enterprise tech, cloud, and security transformation."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((m, idx) => (
            <TeamCard key={m.id || idx} member={m} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;
