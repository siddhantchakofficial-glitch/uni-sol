import React from 'react';
import { clsx } from 'clsx';

export const Textarea = ({
  label,
  error,
  className = '',
  id,
  rows = 4,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-[#475467]">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={clsx(
          'w-full bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 text-sm text-[#262626] placeholder-[#9ca3af] focus:outline-none focus:border-[#0470aa] focus:ring-1 focus:ring-[#0470aa]/40 transition-colors resize-none',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-400/40',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Textarea;
