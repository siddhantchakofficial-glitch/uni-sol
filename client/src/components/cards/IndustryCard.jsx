import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import { resolveMediaUrl } from '../../utils/mediaResolver';
import { FaPlane, FaBuilding, FaIndustry, FaHotel, FaHospital, FaShoppingCart, FaCoins, FaWarehouse, FaArrowRight } from 'react-icons/fa';

const iconMap = {
  FaPlane,
  FaBuilding,
  FaIndustry,
  FaHotel,
  FaHospital,
  FaShoppingCart,
  FaCoins,
  FaWarehouse,
};

export const IndustryCard = ({ industry }) => {
  const IconComponent = iconMap[industry.icon] || FaBuilding;

  /* Optional per-card CMS image (media library/upload URL). When absent — or
     explicitly hidden via showImage === false — the card renders exactly as
     before (icon-first layout, zero layout shift). */
  const cardImageEnabled = industry.showImage !== false && !!industry.imageUrl;
  const cardImage = cardImageEnabled ? resolveMediaUrl(industry.imageUrl) : '';

  return (
    <Card className="flex flex-col justify-between h-full group">
      {cardImage && (
        <div className="-m-6 mb-5 overflow-hidden rounded-t-2xl border-b border-[#e5e7eb]">
          <img
            src={cardImage}
            alt={industry.imageAlt || industry.title}
            loading="lazy"
            className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-xl bg-[#0470aa]/10 border border-[#0470aa]/30 flex items-center justify-center text-[#0470aa] group-hover:bg-[#0470aa] group-hover:text-white transition-all duration-300 shadow-md">
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-[#000000] group-hover:text-[#0470aa] transition-colors leading-snug">
          {industry.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
          {industry.desc || industry.description}
        </p>
      </div>

      <div className="pt-6 mt-4">
        <Link
          to={industry.link || `/industries/${industry.slug || industry.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0470aa] hover:text-[#035a88] uppercase tracking-wider group-hover:translate-x-1 transition-transform"
        >
          <span>Industry Solutions</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
};

export default IndustryCard;
