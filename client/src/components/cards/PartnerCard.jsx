import React from 'react';
import Card from '../ui/Card';

export const PartnerCard = ({ partner }) => {
  return (
    <Card hover={true} className="flex items-center justify-between p-4 bg-[#f1f9ff]/40">
      <div>
        <h4 className="text-sm font-bold text-slate-100">{partner.name}</h4>
        <span className="text-xs text-slate-400">{partner.category}</span>
      </div>
      <div className="w-2.5 h-2.5 rounded-full bg-blue-500/80 shadow-sm shadow-blue-500" />
    </Card>
  );
};

export default PartnerCard;
