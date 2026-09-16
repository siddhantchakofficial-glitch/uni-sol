import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Users, ShieldCheck, Building2, Network, Cpu } from 'lucide-react';

const IconMap = {
  Laptop,
  Users,
  ShieldCheck,
  Building2,
  Network,
  Cpu
};

export default function OurGroupSection({ data: propData }) {
  const [internalData, setInternalData] = useState(null);

  useEffect(() => {
    if (!propData) {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      fetch(`${apiBase}/about`)
        .then(res => res.json())
        .then(d => {
          if (d.success && d.data) setInternalData(d.data);
        })
        .catch(err => console.warn('Error fetching group section data:', err));
    }
  }, [propData]);

  const data = propData || internalData;

  const badge = data?.groupBadge || 'CORPORATE ARCHITECTURE';
  const title = data?.groupTitle || 'OUR GROUP STRUCTURE';
  const desc = data?.groupDesc || 'UniSpark Security is part of the UniSpark Innovations Group — a UAE-registered group of companies delivering technology, human resource, and physical security solutions.';
  const cards = Array.isArray(data?.groupCards) && data.groupCards.length > 0 ? data.groupCards : [
    {
      tag: 'GROUP LEAD TECHNOLOGY ENTITY',
      title: 'Horizon Hive Technology L.L.C',
      subtitle: 'Core Business:',
      tags: ['Managed IT', 'Cybersecurity', 'Digital Transformation', 'Aviation IT', 'AI/ML Surveillance', 'Network Infrastructure'],
      icon: 'Laptop',
      link: 'https://www.horizonhivetechnology.com/',
      disclaimer: 'You are being redirected to Horizon Hive Technology L.L.C, a sister entity of UniSpark Security Systems & Equipment Trading L.L.C.'
    },
    {
      tag: 'SISTER ENTITY – HR DIVISION',
      title: 'UniSpark Innovations HR Consultants L.L.C',
      subtitle: 'Core Business:',
      tags: ['HR Consultancy', 'Payroll', 'HRMS', 'Staff Augmentation', 'Skilled Manpower'],
      icon: 'Users',
      link: 'https://usihr.com/',
      disclaimer: 'You are being redirected to UniSpark Innovations HR Consultants L.L.C, a sister entity of UniSpark Security Systems & Equipment Trading L.L.C.'
    },
    {
      tag: 'SISTER ENTITY – PHYSICAL SECURITY DIVISION',
      title: 'UniSpark Security Systems & Equipment Trading (This Entity)',
      subtitle: 'Core Business:',
      tags: ['Security Equipment Installation & Maintenance', 'Security Systems & Equipment Trading'],
      icon: 'ShieldCheck',
      link: '/solutions',
      disclaimer: ''
    }
  ];

  return (
    <section className="relative py-20 bg-[#f8fafc] text-slate-900 overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-[#0073b7]" />
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {title.includes('STRUCTURE') ? (
              <>
                {title.split('STRUCTURE')[0]}
                <span className="text-[#0073b7]">STRUCTURE</span>
                {title.split('STRUCTURE')[1]}
              </>
            ) : title.includes('Vision') ? (
              <>
                {title.split('Vision')[0]}
                <span className="text-[#0073b7]">Vision</span>
                {title.split('Vision')[1]}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Group Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {cards.map((item, idx) => {
            const IconComp = IconMap[item.icon] || Building2;
            const isExternal = item.link && (item.link.startsWith('http://') || item.link.startsWith('https://'));

            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Tag & Icon */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {item.tag && (
                      <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        {item.tag}
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  
                  {item.subtitle && (
                    <p className="text-xs text-slate-500 font-medium mt-3 mb-2">
                      {item.subtitle}
                    </p>
                  )}

                  {/* Tags Pill List */}
                  {Array.isArray(item.tags) && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      {item.tags.map((t, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-8 space-y-3">
                  {item.disclaimer && (
                    <p className="text-[11px] text-slate-400 italic leading-snug">
                      {item.disclaimer}
                    </p>
                  )}
                  {item.link && (
                    isExternal ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold uppercase tracking-wider text-[#0073b7] hover:text-[#005a96] flex items-center gap-1 transition"
                      >
                        <span>VISIT WEBSITE →</span>
                      </a>
                    ) : (
                      <Link
                        to={item.link}
                        className="text-xs font-bold uppercase tracking-wider text-[#0073b7] hover:text-[#005a96] flex items-center gap-1 transition"
                      >
                        <span>EXPLORE SOLUTIONS →</span>
                      </Link>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
