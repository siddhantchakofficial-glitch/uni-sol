import React from 'react';
import { STATS } from '../../utils/constants';

export const StatsSection = ({ stats }) => {
  const displayStats = (Array.isArray(stats) && stats.length > 0) ? stats : STATS;
  return (
    <section className="py-12 bg-[#f1f9ff]/40 border-y border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {displayStats.map((stat, idx) => (
            <div
              key={stat.id || idx}
              className="flex flex-col items-center justify-center p-4 text-center border-r border-slate-800/60 last:border-none"
            >
              <span className="text-3xl sm:text-4xl font-extrabold text-gradient-blue tracking-tight">
                {stat.value || stat.number}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
