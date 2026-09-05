import React from 'react';
import { clsx } from 'clsx';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white border border-[#e5e7eb] rounded-2xl p-6 transition-all duration-300 relative overflow-hidden shadow-xs text-[#262626]',
        hover && 'hover:border-[#0470aa]/50 hover:shadow-xl hover:shadow-[#0470aa]/10 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
