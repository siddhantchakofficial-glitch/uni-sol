import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function WhyUsSection() {
  const { t, i18n } = useTranslation();
  const [sec6Config, setSec6Config] = useState({
    title: 'WHY CHOOSE UNISPARK',
    heading: 'Technical Authority. Trusted Delivery.',
    description: 'We combine regulatory expertise, multi-vendor technology integration, and lifecycle ownership to keep your critical assets protected.',
    button: {
      text: 'View All Services',
      link: '/solutions'
    },
    cards: [
      {
        id: 'why-1',
        title: 'UAE Regulatory Compliance',
        desc: 'All systems designed and installed in accordance with UAE Civil Defence, NESA, and DESC standards.',
        icon: 'fa-building-shield'
      },
      {
        id: 'why-2',
        title: 'Multi-Brand Expertise',
        desc: 'We are not tied to one manufacturer. We select the right technology from Hikvision, Dahua, Bosch, ZKTeco, HID, and more.',
        icon: 'fa-network-wired'
      },
      {
        id: 'why-3',
        title: 'End-To-End Ownership',
        desc: 'From site survey and design to installation, commissioning, handover, and annual maintenance. One partner, full accountability.',
        icon: 'fa-handshake-angle'
      },
      {
        id: 'why-4',
        title: 'Rapid Response SLA',
        desc: 'SLA-governed emergency response, remote health monitoring, and preventive maintenance across all contracted sites.',
        icon: 'fa-user-clock'
      }
    ]
  });

  const loadSection6FromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/section6`);
      const data = await res.json();
      if (data.success && data.data) {
        setSec6Config({
          title: data.data.title || 'WHY CHOOSE UNISPARK',
          heading: data.data.heading || 'Technical Authority. Trusted Delivery.',
          description: data.data.description || 'We combine regulatory expertise, multi-vendor technology integration, and lifecycle ownership to keep your critical assets protected.',
          button: {
            text: data.data.button?.text || 'View All Services',
            link: data.data.button?.link || '/solutions'
          },
          cards: Array.isArray(data.data.cards) && data.data.cards.length > 0
            ? data.data.cards.map(c => ({
                id: c._id || c.id,
                title: c.title,
                desc: c.description,
                icon: c.icon
              }))
            : sec6Config.cards
        });
      }
    } catch (err) {
      console.warn('unise-php WhyUsSection: Error fetching section6 config from backend:', err);
    }
  };

  useEffect(() => {
    loadSection6FromBackend();

    const handleFocus = () => loadSection6FromBackend();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadSection6FromBackend();
    }, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative py-20 bg-[#f1f5f9] text-slate-900 overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
            <i className="fa-solid fa-award text-xs"></i>
            <span>{i18n.language === 'hi' ? t('whyUs.badge') : sec6Config.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {i18n.language === 'hi' ? t('whyUs.title') : sec6Config.heading}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {i18n.language === 'hi' ? t('whyUs.subtitle') : sec6Config.description}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sec6Config.cards.map((p, idx) => (
            <div
              key={p.id || idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {p.icon && (p.icon.startsWith('http') || p.icon.startsWith('data:image/')) ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                    <img src={p.icon} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center">
                    <i className={`fa-solid ${p.icon || 'fa-award'} text-lg`}></i>
                  </div>
                )}
                
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {i18n.language === 'hi' && idx < 4 ? t(`whyUs.point${idx + 1}Title`) : p.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {i18n.language === 'hi' && idx < 4 ? t(`whyUs.point${idx + 1}Desc`) : p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          {sec6Config.button.link?.startsWith('/') ? (
            <Link
              to={sec6Config.button.link}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-md transition"
            >
              <span>{sec6Config.button.text}</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          ) : (
            <a
              href={sec6Config.button.link}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-md transition"
            >
              <span>{sec6Config.button.text}</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </a>
          )}
        </div>

      </div>
    </section>
  );
}
