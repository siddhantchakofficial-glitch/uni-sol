import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
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

  return (
    <Card className="flex flex-col justify-between h-full group">
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300 shadow-md">
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
          {industry.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {industry.desc || industry.description}
        </p>
      </div>

      <div className="pt-6 mt-4">
        <Link
          to={industry.link || `/industries/${industry.slug || industry.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform"
        >
          <span>Industry Solutions</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
};

export default IndustryCard;
