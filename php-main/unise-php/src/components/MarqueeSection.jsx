import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const defaultTrustItems = [
  { text: 'Licensed & UAE-Compliant', icon: 'fa-id-card-clip', link: '', badge: '', isActive: true },
  { text: 'Hikvision Authorised Partner', icon: 'fa-handshake', link: '', badge: '', isActive: true },
  { text: 'Dahua Partner', icon: 'fa-certificate', link: '', badge: '', isActive: true },
  { text: 'ZKTeco Partner', icon: 'fa-star', link: '', badge: '', isActive: true },
  { text: '10+ Years Field Experience', icon: 'fa-award', link: '', badge: '', isActive: true },
  { text: 'Dubai · Abu Dhabi · Sharjah', icon: 'fa-map-location-dot', link: '', badge: '', isActive: true },
  { text: 'B2B & B2G Specialists', icon: 'fa-building-shield', link: '', badge: '', isActive: true }
];

export default function MarqueeSection() {
  const [config, setConfig] = useState({
    enabled: true,
    speed: 25,
    bgColor: '#ffffff',
    textColor: '#0f172a',
    items: defaultTrustItems
  });

  const getApiBase = () => {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return 'http://localhost:5000/api';
    }
    return import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
  };

  const loadMarqueeData = async () => {
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/marquee`);
      const data = await res.json();
      if (data.success && data.data) {
        setConfig({
          enabled: data.data.enabled !== undefined ? data.data.enabled : true,
          speed: Number(data.data.speed) || 25,
          bgColor: data.data.bgColor || '#ffffff',
          textColor: data.data.textColor || '#0f172a',
          items: Array.isArray(data.data.items) && data.data.items.length > 0 ? data.data.items : defaultTrustItems
        });
      }
    } catch (err) {
      console.warn('unise-php Marquee: Error fetching marquee config from backend:', err);
    }
  };

  useEffect(() => {
    loadMarqueeData();

    const handleFocus = () => loadMarqueeData();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(loadMarqueeData, 3000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  if (!config.enabled) {
    return null;
  }

  const activeItems = config.items.filter(item => item.isActive !== false);

  if (activeItems.length === 0) {
    return null;
  }

  // Duplicate list to guarantee seamless infinite loop without gaps
  const tickerItems = [...activeItems, ...activeItems, ...activeItems, ...activeItems];

  const iconColorStyle = config.textColor === '#ffffff' || config.textColor.toLowerCase() === '#fff' ? '#38bdf8' : '#0073b7';

  return (
    <section
      className="relative z-20 w-full shadow-sm border-y border-slate-200/80 overflow-hidden py-3.5 transition-colors duration-300"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      <div className="max-w-full mx-auto relative overflow-hidden">
        {/* Dynamic Left & Right Gradient Fades matching background color */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none transition-all duration-300"
          style={{ background: `linear-gradient(to right, ${config.bgColor}, transparent)` }}
        ></div>
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 pointer-events-none transition-all duration-300"
          style={{ background: `linear-gradient(to left, ${config.bgColor}, transparent)` }}
        ></div>

        {/* Scrolling Ticker Track with dynamic speed key */}
        <div
          key={`marquee-track-${config.speed}-${config.bgColor}-${config.textColor}-${activeItems.length}`}
          className="flex w-max items-center gap-8 sm:gap-12 animate-marquee hover:[animation-play-state:paused] cursor-pointer select-none"
          style={{ animationDuration: `${config.speed}s` }}
        >
          {tickerItems.map((item, idx) => {
            const content = (
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap shrink-0 transition-transform duration-200 hover:scale-105">
                {item.icon ? (
                  item.icon.startsWith('http://') || item.icon.startsWith('https://') || item.icon.startsWith('data:') ? (
                    <img src={item.icon} alt="" className="w-5 h-5 object-contain" />
                  ) : (
                    <i className={`fa-solid ${item.icon} text-base shrink-0`} style={{ color: iconColorStyle }}></i>
                  )
                ) : (
                  <i className="fa-solid fa-circle-check text-base shrink-0" style={{ color: iconColorStyle }}></i>
                )}

                <span style={{ color: config.textColor }}>{item.text}</span>

                {item.badge && (
                  <span
                    className="ml-1 text-[10px] px-2 py-0.5 rounded-full uppercase font-extrabold tracking-wider"
                    style={{ backgroundColor: `${iconColorStyle}20`, color: iconColorStyle }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            );

            if (item.link) {
              if (item.link.startsWith('/')) {
                return (
                  <Link key={idx} to={item.link} className="no-underline hover:opacity-80 transition">
                    {content}
                  </Link>
                );
              }
              return (
                <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="no-underline hover:opacity-80 transition">
                  {content}
                </a>
              );
            }

            return <div key={idx}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
