import React from 'react';
import { clsx } from 'clsx';

export const Select = ({
  label,
  options = [],
  error,
  className = '',
  id,
  placeholder = 'Select an option',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-[#475467]">
          {label}
        </label>
      )}
      <select
        id={id}
        className={clsx(
          'w-full bg-white border border-[#e5e7eb] rounded-lg px-4 py-2.5 text-sm text-[#262626] focus:outline-none focus:border-[#0470aa] focus:ring-1 focus:ring-[#0470aa]/40 transition-colors cursor-pointer',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={typeof opt === 'object' ? opt.value : opt} className="bg-white text-[#262626]">
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
