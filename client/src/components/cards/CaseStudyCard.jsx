import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { FaArrowRight } from 'react-icons/fa';

export const CaseStudyCard = ({ caseStudy }) => {
  return (
    <Card className="flex flex-col justify-between h-full group p-0 overflow-hidden">
      <div>
        <div className="relative h-48 overflow-hidden">
          <img
            src={caseStudy.image || '/src/assets/images/sol1.jpg'}
            alt={caseStudy.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          <div className="absolute top-4 left-4">
            <Badge variant="blue">{caseStudy.industry}</Badge>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
            {caseStudy.client}
          </span>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors leading-snug">
            {caseStudy.title}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
            {caseStudy.summary}
          </p>

          {caseStudy.metrics && (
            <div className="flex flex-wrap gap-2 pt-2">
              {caseStudy.metrics.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-slate-800/80 text-slate-200 text-[10px] font-medium px-2.5 py-1 rounded-md border border-slate-700/60"
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link
          to={`/case-studies/${caseStudy.slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform"
        >
          <span>Read Full Case Study</span>
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </Card>
  );
};

export default CaseStudyCard;
