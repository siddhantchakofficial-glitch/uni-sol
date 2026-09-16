import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { solutionsData as staticSolutionsData } from '../data/solutionsData';
import CtaSection from '../components/CtaSection';

export default function SolutionsPage({ onOpenEnquiry }) {
  const { t, i18n } = useTranslation();
  const [solutions, setSolutions] = useState(staticSolutionsData);

  const loadSolutionsFromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/section3`);
      const data = await res.json();
      if (data.success && data.data && Array.isArray(data.data.services) && data.data.services.length > 0) {
        // Merge backend live data with static images fallback
        const merged = data.data.services.map((item) => {
          const staticMatch = staticSolutionsData.find(
            (s) => s.id === item.id || (item.id === 'maintenance-contracts' && s.id.startsWith('maintenance-contracts'))
          );
          return {
            ...staticMatch,
            ...item,
            title: item.title,
            description: item.desc || item.description || staticMatch?.description || '',
            secImage: item.secImage || staticMatch?.secImage || '/images/cctv-sec.jpg'
          };
        });
        setSolutions(merged);
      }
    } catch (err) {
      console.warn('Error loading solutions page data from backend:', err);
    }
  };

  useEffect(() => {
    loadSolutionsFromBackend();
    const handleFocus = () => loadSolutionsFromBackend();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(loadSolutionsFromBackend, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#f1f5f9] text-slate-900 min-h-screen font-sans">
      
      {/* Banner Section */}
      <section className="relative py-16 bg-[#004b78] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-2 text-xs font-semibold text-white/80">
              <li><Link to="/" className="hover:underline">{t('nav.home')}</Link></li>
              <li>/</li>
              <li className="text-white font-bold">{t('nav.solutions')}</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {i18n.language === 'hi' ? t('pages.solutionsPage.title') : 'End-to-End Security Infrastructure For UAE Commercial & Industrial Sites.'}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed font-light">
            {i18n.language === 'hi' ? t('pages.solutionsPage.subtitle') : 'From initial site design and engineering to integration, compliance, and lifecycle maintenance.'}
          </p>

          <div className="pt-2">
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-xs tracking-wider uppercase shadow-md transition duration-300"
            >
              <span>Request an Enterprise Security Consultation</span>
              <i className="fa-solid fa-arrow-right-long text-xs"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Grid of All Solutions Connected to Backend */}
      <section className="py-16 bg-[#f8f9fa] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-list-check text-xs"></i>
              <span>Our Solutions ({solutions.length})</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Technical Authority. <span className="text-[#0073b7]">Trusted Delivery.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 overflow-hidden transition duration-300 flex flex-col justify-between"
              >
                <Link to={`/solutions/${item.id}`} className="block relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={item.secImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                    <span className="px-5 py-2 rounded-full bg-white text-slate-900 text-xs font-bold uppercase tracking-wider shadow-md">
                      Know More <i className="fa-solid fa-arrow-right ms-1 text-[10px]"></i>
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-slate-900 group-hover:text-[#0073b7] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      to={`/solutions/${item.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0073b7] hover:text-[#005a96] transition"
                    >
                      <span>Explore Solution Framework</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
