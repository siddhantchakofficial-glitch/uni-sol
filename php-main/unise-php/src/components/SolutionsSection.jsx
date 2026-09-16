import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function SolutionsSection() {
  const { t, i18n } = useTranslation();
  const [sec3Config, setSec3Config] = useState({
    badgeText: 'WHAT WE DO',
    mainHeading: 'End-to-End Physical Security Solutions',
    description: 'From initial site survey and system design through to professional installation, commissioning, and long-term maintenance — UniSpark delivers complete security infrastructure for every environment.',
    viewAllButton: {
      text: 'View All Services',
      link: '/solutions'
    },
    services: [
      {
        id: "cctv-and-ip-camera-systems",
        title: "CCTV & IP Camera Systems",
        icon: "fa-video",
        desc: "HD surveillance, remote monitoring, and smart analytics for complete site visibility."
      },
      {
        id: "access-control-systems",
        title: "Access Control Systems",
        icon: "fa-id-card-clip",
        desc: "Card, biometric, and multi-factor access control for every door, gate, and perimeter."
      },
      {
        id: "intruder-alarm-and-detection-systems",
        title: "Intruder Alarm & Detection",
        icon: "fa-bell",
        desc: "Motion, vibration, and perimeter detection systems connected to central monitoring."
      },
      {
        id: "fire-alarm-and-detection-systems",
        title: "Fire Alarm & Detection",
        icon: "fa-fire-extinguisher",
        desc: "UAE Civil Defence-compliant fire detection and alarm systems for all building types."
      },
      {
        id: "biometric-and-smart-security-systems",
        title: "Biometric & Smart Security",
        icon: "fa-fingerprint",
        desc: "Fingerprint, face recognition, and iris scan systems integrated with HR and payroll."
      },
      {
        id: "system-integration-and-control-room-setup",
        title: "System Integration & Control Room Setup",
        icon: "fa-display",
        desc: "Unified security management platforms, SOC design, and video walls."
      }
    ]
  });

  const loadSection3FromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/section3`);
      const data = await res.json();
      if (data.success && data.data) {
        setSec3Config({
          badgeText: data.data.badgeText || 'WHAT WE DO',
          mainHeading: data.data.mainHeading || 'End-to-End Physical Security Solutions',
          description: data.data.description || 'From initial site survey and system design...',
          viewAllButton: {
            text: data.data.viewAllButton?.text || 'View All Services',
            link: data.data.viewAllButton?.link || '/solutions'
          },
          services: Array.isArray(data.data.services) && data.data.services.length > 0
            ? data.data.services
            : sec3Config.services
        });
      }
    } catch (err) {
      console.warn('unise-php SolutionsSection: Error fetching section3 config from backend:', err);
    }
  };

  useEffect(() => {
    loadSection3FromBackend();

    const handleFocus = () => loadSection3FromBackend();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadSection3FromBackend();
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
            <i className="fa-solid fa-shield-halved text-xs"></i>
            <span>{i18n.language === 'hi' ? t('solutions.badge') : sec3Config.badgeText}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {i18n.language === 'hi' ? t('solutions.title') : sec3Config.mainHeading}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {i18n.language === 'hi' ? t('solutions.subtitle') : sec3Config.description}
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sec3Config.services.map((item) => (
            <Link
              key={item.id}
              to={`/solutions/${item.id}`}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center group-hover:bg-[#0073b7] group-hover:text-white transition overflow-hidden">
                  {item.iconUrl ? (
                    <img src={item.iconUrl} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <i className={`fa-solid ${item.icon || 'fa-shield-halved'} text-lg`}></i>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0073b7] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Dynamic View All Services Button */}
        {sec3Config.viewAllButton?.text && (
          <div className="mt-12 text-center">
            {sec3Config.viewAllButton.link.startsWith('/') ? (
              <Link
                to={sec3Config.viewAllButton.link}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-md transition"
              >
                <span>{i18n.language === 'hi' ? t('solutions.exploreAll') : sec3Config.viewAllButton.text}</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </Link>
            ) : (
              <a
                href={sec3Config.viewAllButton.link}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-md transition"
              >
                <span>{i18n.language === 'hi' ? t('solutions.exploreAll') : sec3Config.viewAllButton.text}</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </a>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
