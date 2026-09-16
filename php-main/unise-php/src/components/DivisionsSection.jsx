import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DivisionsSection({ onOpenEnquiry }) {
  const { t, i18n } = useTranslation();
  const [sec4Config, setSec4Config] = useState({
    title: 'Our Two Divisions',
    heading: 'One Partner. Two Specialist Divisions.',
    cards: [
      {
        id: 'div-1',
        title: 'Installation & Maintenance',
        description: 'Professional design, supply, installation, commissioning, and AMC/PMC services across all physical security systems. SLA-governed, UAE-wide coverage.',
        icon: 'fa-screwdriver-wrench',
        buttonText: 'Explore Installation Services',
        buttonLink: '/solutions'
      },
      {
        id: 'div-2',
        title: 'Security Equipment Trading',
        description: 'Supply of globally-recognised security hardware — cameras, recorders, access control, alarm panels, biometric devices, cabling — with UAE stock for fast delivery.',
        icon: 'fa-truck-ramp-box',
        buttonText: 'Request a Survey',
        buttonLink: '/contact-us'
      }
    ]
  });

  const loadSection4FromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/section4`);
      const data = await res.json();
      if (data.success && data.data) {
        setSec4Config({
          title: data.data.title || 'Our Two Divisions',
          heading: data.data.heading || 'One Partner. Two Specialist Divisions.',
          cards: Array.isArray(data.data.cards) && data.data.cards.length > 0
            ? data.data.cards
            : sec4Config.cards
        });
      }
    } catch (err) {
      console.warn('unise-php DivisionsSection: Error fetching section4 config from backend:', err);
    }
  };

  useEffect(() => {
    loadSection4FromBackend();

    const handleFocus = () => loadSection4FromBackend();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadSection4FromBackend();
    }, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative py-20 bg-[#edf2f0] text-blue-500 overflow-hidden">
      <div className="max-w-100xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-white/20 text-blue text-xs font-semibold uppercase tracking-wider">
            <i className="fa-solid fa-screwdriver-wrench text-xs"></i>
            <span>{i18n.language === 'hi' ? t('divisions.badge') : sec4Config.title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black">
            {i18n.language === 'hi' ? t('divisions.title') : sec4Config.heading.split('. ').map((part, index, arr) => (
              <React.Fragment key={index}>
                {index === arr.length - 1 ? <span className="text-blue-500">{part}</span> : <>{part}. <br /></>}
              </React.Fragment>
            ))}
          </h2>
        </div>

        {/* Division Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {sec4Config.cards.map((card, idx) => (
            <div key={card.id || card._id} className="p-8 rounded-2xl bg-white border border-white/10 hover:border-cyan-400/50 transition duration-300 flex flex-col justify-between shadow-xl group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 text-cyan-300 flex items-center justify-center">
                  <i className={`fa-solid ${card.icon || 'fa-screwdriver-wrench'} text-xl`}></i>
                </div>
                <h3 className="text-2xl font-bold text-black ">
                  {i18n.language === 'hi' ? t(`divisions.division${idx + 1}Title`) : card.title}
                </h3>
                <p className="text-sm text-black leading-relaxed font-light">
                  {i18n.language === 'hi' ? t(`divisions.division${idx + 1}Desc`) : card.description}
                </p>
              </div>

              <div className="pt-8">
                {card.buttonLink?.startsWith('/') ? (
                  <Link
                    to={card.buttonLink}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 hover:border-white bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition"
                  >
                    <span>{i18n.language === 'hi' ? t('divisions.enquireDivision') : card.buttonText || 'Explore'}</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </Link>
                ) : (
                  <a
                    href={card.buttonLink}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 hover:border-white bg-white/5 text-white font-bold text-xs uppercase tracking-wider transition"
                  >
                    <span>{i18n.language === 'hi' ? t('divisions.enquireDivision') : card.buttonText || 'Explore'}</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </a>
                )}
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
