import React from 'react';
import { clsx } from 'clsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0470aa] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-[#0470aa] hover:bg-[#035a88] text-white rounded-full font-bold shadow-md shadow-[#0470aa]/20 hover:shadow-lg hover:shadow-[#0470aa]/30 uppercase tracking-wider',
    secondary: 'bg-[#f4f8fb] hover:bg-[#e2edf4] text-[#0a1e3f] rounded-full border border-[#cfe3ee]',
    outline: 'border-1.5 border-[#0470aa] text-[#0470aa] hover:bg-[#0470aa] hover:text-white rounded-full font-semibold',
    'white-outline': 'border-1.5 border-white/80 text-white hover:bg-white hover:text-[#0a1e3f] rounded-full font-medium',
    ghost: 'text-[#262626] hover:bg-[#f4f8fb] hover:text-[#0470aa] rounded-full',
    gold: 'bg-amber-500 hover:bg-amber-400 text-[#0a1e3f] font-bold rounded-full shadow-md',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs gap-1.5',
    md: 'px-6 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3 text-sm sm:text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {Icon && <Icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
    </button>
  );
};

export default Button;
