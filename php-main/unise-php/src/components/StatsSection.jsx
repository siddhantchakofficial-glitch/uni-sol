import React, { useState, useEffect } from 'react';
import { MapPin, Building2, Network, FileText, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const IconMap = {
  MapPin,
  Building2,
  Network,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Award
};

export default function StatsSection() {
  const { t, i18n } = useTranslation();
  const [statsConfig, setStatsConfig] = useState({
    statsList: [
      {
        title: "500+",
        subtitle: "PROJECTS DELIVERED",
        caption: "Across UAE & India",
        icon: "Building2"
      },
      {
        title: "50+",
        subtitle: "CERTIFIED ENGINEERS",
        caption: "OEM Certified Specialists",
        icon: "Award"
      },
      {
        title: "99.4%",
        subtitle: "CLIENT SATISFACTION",
        caption: "SLA Retention Rate",
        icon: "ShieldCheck"
      },
      {
        title: "24/7",
        subtitle: "SUPPORT SLA",
        caption: "Guaranteed Emergency Response",
        icon: "CheckCircle2"
      }
    ]
  });

  const loadStatsFromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/stats`);
      const data = await res.json();
      if (data.success && data.data) {
        setStatsConfig({
          statsList: Array.isArray(data.data.statsList) && data.data.statsList.length > 0 ? data.data.statsList : statsConfig.statsList
        });
      }
    } catch (err) {
      console.warn('Error fetching stats config:', err);
    }
  };

  useEffect(() => {
    loadStatsFromBackend();

    const handleFocus = () => loadStatsFromBackend();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(loadStatsFromBackend, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative py-16 bg-[#0073b7] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.statsList.map((item, idx) => {
            const IconComponent = IconMap[item.icon] || MapPin;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white text-slate-900 shadow-xl border border-white/20 hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-[#0073b7] flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#0073b7] mb-1">
                    {i18n.language === 'hi' && idx < 4 ? t(`stats.stat${idx + 1}Val`) : item.title}
                  </h3>
                  <div className="text-xs font-bold text-slate-800 tracking-wide uppercase mb-1">
                    {i18n.language === 'hi' && idx < 4 ? t(`stats.stat${idx + 1}Text`) : item.subtitle}
                  </div>
                  <p className="text-xs text-slate-500">
                    {item.caption}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
