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
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <select
        id={id}
        className={clsx(
          'w-full bg-[#f1f9ff]/90 border border-slate-700/80 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer',
          error && 'border-red-500',
          className
        )}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt, idx) => (
          <option key={idx} value={typeof opt === 'object' ? opt.value : opt} className="bg-[#f1f9ff] text-slate-100">
            {typeof opt === 'object' ? opt.label : opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export default Select;
