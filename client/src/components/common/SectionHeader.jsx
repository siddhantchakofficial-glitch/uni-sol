import React from 'react';
import Badge from '../ui/Badge';

export const SectionHeader = ({
  badge,
  title,
  subtitle,
  center = true,
  className = '',
  showAccentBar = true,
}) => {
  return (
    <div className={`space-y-3 max-w-3xl ${center ? 'mx-auto text-center' : ''} ${className}`}>
      {badge && (
        <div className="mb-2">
          <Badge variant="blue">{badge}</Badge>
        </div>
      )}

      {showAccentBar && (
        <div className={center ? 'unispark-accent-bar-center' : 'unispark-accent-bar'} />
      )}

      {title && (
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000000] tracking-tight leading-tight">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="text-sm sm:text-base text-[#475467] leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
