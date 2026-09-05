import React from 'react';
import { clsx } from 'clsx';

export const Badge = ({ children, variant = 'blue', className = '' }) => {
  const variants = {
    blue: 'bg-[#e9f4fb] text-[#0470aa] border-[#b9e0f3]',
    navy: 'bg-[#0a1e3f]/10 text-[#0a1e3f] border-[#0a1e3f]/20',
    gold: 'bg-amber-50 text-amber-700 border-amber-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider',
        variants[variant] || variants.blue,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
