import React from 'react';
import Card from '../ui/Card';

export const TeamCard = ({ member }) => {
  return (
    <Card className="p-0 overflow-hidden group">
      <div className="h-64 overflow-hidden relative">
        <img
          src={member.image || '/src/assets/images/abt-sec.jpg'}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />
      </div>
      <div className="p-6 space-y-2">
        <h3 className="text-xl font-bold text-slate-100">{member.name}</h3>
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
          {member.role}
        </span>
        <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60">
          {member.bio}
        </p>
      </div>
    </Card>
  );
};

export default TeamCard;
