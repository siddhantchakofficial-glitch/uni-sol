import React from 'react';
import { clsx } from 'clsx';

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-[#475467]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6e6e6e]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={clsx(
            'w-full bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 text-sm text-[#262626] placeholder-[#9ca3af] focus:outline-none focus:border-[#0470aa] focus:ring-1 focus:ring-[#0470aa]/40 transition-colors',
            Icon && 'pl-10',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-400/40',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
