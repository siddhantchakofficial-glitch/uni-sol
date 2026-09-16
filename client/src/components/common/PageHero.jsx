import React from 'react';
import Badge from '../ui/Badge';
import Breadcrumb from './Breadcrumb';
import images from '../../assets/images';
import { resolveMediaUrl } from '../../utils/mediaResolver';

export const PageHero = ({
  badge,
  title,
  description,
  breadcrumbs = [],
  image,
}) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#f1f9ff] border-b border-slate-800/60">
      {/* Full-width banner image, consistent with the Home hero treatment. */}
      <img
        src={resolveMediaUrl(image, images.hero)}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-slate-950/65" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} className="mb-6" />}

        <div className="max-w-2xl space-y-4">
          {badge && <Badge variant="blue">{badge}</Badge>}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
