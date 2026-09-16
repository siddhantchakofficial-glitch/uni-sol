import React, { useState, useEffect } from 'react';

export default function PartnersSection() {
  const [partnerConfig, setPartnerConfig] = useState({
    badgeText: 'GLOBAL ALLIANCE',
    headingText: 'Powered by the World\'s Leading Security Brands',
    isVisible: true,
    bgColor: '#ffffff',
    speed: 25,
    partnersList: [
      { name: 'Genetec', logoUrl: '/images/pt1.jpg', link: '' },
      { name: 'Hikvision', logoUrl: '/images/pt2.jpg', link: '' },
      { name: 'Dahua', logoUrl: '/images/pt3.jpg', link: '' },
      { name: 'Axis', logoUrl: '/images/pt4.jpg', link: '' },
      { name: 'Bosch', logoUrl: '/images/pt5.jpg', link: '' },
      { name: 'ZKTeco', logoUrl: '/images/pt6.jpg', link: '' },
      { name: 'HID', logoUrl: '/images/pt7.jpg', link: '' }
    ]
  });

  const getApiBase = () => {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return 'http://localhost:5000/api';
    }
    return import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
  };

  const loadPartnersFromBackend = async () => {
    try {
      const apiBase = getApiBase();
      const res = await fetch(`${apiBase}/partners`);
      const data = await res.json();
      if (data.success && data.data) {
        setPartnerConfig(prev => ({
          badgeText: data.data.badgeText || 'GLOBAL ALLIANCE',
          headingText: data.data.headingText || 'Powered by the World\'s Leading Security Brands',
          isVisible: data.data.isVisible !== undefined ? data.data.isVisible : true,
          bgColor: data.data.bgColor || '#ffffff',
          speed: Number(data.data.speed) || 25,
          partnersList: Array.isArray(data.data.partnersList) && data.data.partnersList.length > 0 ? data.data.partnersList : prev.partnersList
        }));
      }
    } catch (err) {
      console.warn('Error fetching partner config:', err);
    }
  };

  useEffect(() => {
    loadPartnersFromBackend();

    const handleFocus = () => loadPartnersFromBackend();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(loadPartnersFromBackend, 3000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  if (!partnerConfig.isVisible) {
    return null;
  }

  const partners = partnerConfig.partnersList || [];
  if (partners.length === 0) {
    return null;
  }

  // Duplicate partner list for continuous seamless infinite loop from right to left
  const tickerPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section
      className="relative py-14 sm:py-16 text-slate-900 overflow-hidden border-t border-slate-200/80 transition-colors duration-300"
      style={{ backgroundColor: partnerConfig.bgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 mb-8 sm:mb-10 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0080c6] text-xs font-bold uppercase tracking-wider">
          <i className="fa-solid fa-handshake-angle text-xs"></i>
          <span>{partnerConfig.badgeText}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          {partnerConfig.headingText.includes('Security Brands') ? (
            <>
              {partnerConfig.headingText.split('Security Brands')[0]}
              <span className="text-[#0080c6]">Security Brands</span>
              {partnerConfig.headingText.split('Security Brands')[1]}
            </>
          ) : (
            partnerConfig.headingText
          )}
        </h2>
      </div>

      {/* Marquee Wrapper with dynamic side gradient overlays */}
      <div className="relative max-w-full overflow-hidden py-2">
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none transition-all duration-300"
          style={{ background: `linear-gradient(to right, ${partnerConfig.bgColor}, transparent)` }}
        ></div>
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none transition-all duration-300"
          style={{ background: `linear-gradient(to left, ${partnerConfig.bgColor}, transparent)` }}
        ></div>

        {/* Dynamic Right-to-Left Scrolling Track */}
        <div
          key={`partner-marquee-${partnerConfig.speed}-${partnerConfig.bgColor}-${partners.length}`}
          className="flex w-max items-center gap-5 sm:gap-6 animate-marquee hover:[animation-play-state:paused] cursor-pointer select-none"
          style={{ animationDuration: `${partnerConfig.speed}s` }}
        >
          {tickerPartners.map((partner, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 flex items-center justify-center h-20 sm:h-24 w-44 sm:w-52 shrink-0 group"
            >
              {partner.link ? (
                <a href={partner.link} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full h-full">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-h-12 max-w-[85%] object-contain transition duration-300 group-hover:scale-105"
                  />
                </a>
              ) : (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-12 max-w-[85%] object-contain transition duration-300 group-hover:scale-105"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
