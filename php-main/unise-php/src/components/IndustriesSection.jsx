import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { industriesData } from '../data/industriesData'; // Fallback if API fails

export default function IndustriesSection() {
  const { t, i18n } = useTranslation();
  const [sec5Config, setSec5Config] = useState({
    title: 'INDUSTRIES WE SERVE',
    heading: 'Security Solutions Built for Your Sector',
    description: 'Deploying custom, advanced cyber-security, monitoring, and automated safety matrices engineered for enterprise ecosystems.',
    cards: [] // If empty, we use industriesData as fallback
  });

  const loadSection5FromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/section5`);
      const data = await res.json();
      if (data.success && data.data) {
        setSec5Config({
          title: data.data.title || 'INDUSTRIES WE SERVE',
          heading: data.data.heading || 'Security Solutions Built for Your Sector',
          description: data.data.description || 'Deploying custom, advanced cyber-security, monitoring, and automated safety matrices engineered for enterprise ecosystems.',
          cards: Array.isArray(data.data.cards) && data.data.cards.length > 0
            ? data.data.cards
            : sec5Config.cards
        });
      }
    } catch (err) {
      console.warn('unise-php IndustriesSection: Error fetching section5 config from backend:', err);
    }
  };

  useEffect(() => {
    loadSection5FromBackend();

    const handleFocus = () => loadSection5FromBackend();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadSection5FromBackend();
    }, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const displayCards = sec5Config.cards.length > 0 ? sec5Config.cards : industriesData;

  return (
    <section className="relative py-20 bg-white text-slate-900 overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
            {i18n.language === 'hi' ? t('industries.badge') : sec5Config.title}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {i18n.language === 'hi' ? t('industries.title') : sec5Config.heading}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {i18n.language === 'hi' ? t('industries.subtitle') : sec5Config.description}
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {displayCards.map((ind, index) => (
            <div
              key={ind.id || ind._id || index}
              className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 overflow-hidden transition duration-300 flex flex-col justify-between"
            >
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img
                  src={ind.image}
                  alt={ind.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0073b7] transition">
                    {ind.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {ind.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {ind.link?.startsWith('/') || ind.id ? (
                    <Link
                      to={ind.link || `/industries/${ind.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0073b7] hover:text-[#005a96] transition"
                    >
                      <span>{i18n.language === 'hi' ? t('industries.viewIndustry') : 'Explore'}</span>
                      <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                    </Link>
                  ) : (
                    <a
                      href={ind.link || '#'}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0073b7] hover:text-[#005a96] transition"
                    >
                      <span>{i18n.language === 'hi' ? t('industries.viewIndustry') : 'Explore'}</span>
                      <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
