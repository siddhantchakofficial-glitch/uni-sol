import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building, ArrowLeft, CheckCircle, ShieldAlert, ShieldCheck, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { industriesData } from '../data/industriesData';
import CtaSection from '../components/CtaSection';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';

export default function IndustryDetailPage({ onOpenEnquiry }) {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [industry, setIndustry] = useState(null);
  const [allIndustries, setAllIndustries] = useState(industriesData);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_BASE}/section5`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.cards) && data.data.cards.length > 0) {
        setAllIndustries(data.data.cards);
        const found = data.data.cards.find(c => c.id === slug);
        setIndustry(found || data.data.cards[0]);
      } else {
        const fallback = industriesData.find(i => i.id === slug) || industriesData[0];
        setIndustry(fallback);
        setAllIndustries(industriesData);
      }
    } catch {
      const fallback = industriesData.find(i => i.id === slug) || industriesData[0];
      setIndustry(fallback);
      setAllIndustries(industriesData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading industry data...</p>
        </div>
      </div>
    );
  }

  if (!industry) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Industry sector not found.</p>
      </div>
    );
  }

  // Helper: fallback to static data fields if CMS fields are empty
  const staticFallback = industriesData.find(i => i.id === slug) || {};

  const challenges = Array.isArray(industry.keyChallenges) && industry.keyChallenges.length > 0
    ? industry.keyChallenges
    : (staticFallback.keyChallenges || []).map(c => ({ title: '', desc: c, icon: 'fa-triangle-exclamation' }));

  const solutions = Array.isArray(industry.solutionsProvided) && industry.solutionsProvided.length > 0
    ? industry.solutionsProvided
    : (staticFallback.solutionsProvided || []).map(s => ({ title: '', desc: s, icon: 'fa-check' }));

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">

      {/* ===== BANNER ===== */}
      <section
        className="relative py-24 bg-slate-900 border-b border-slate-800 overflow-hidden"
        style={industry.bannerBgImage ? {
          backgroundImage: `linear-gradient(to bottom right, rgba(2,6,23,0.85), rgba(7,20,50,0.75)), url(${industry.bannerBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <Link to="/industries" className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> {t('nav.allIndustries')}
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <i className={`fa-solid ${industry.icon || 'fa-building'} text-xl`} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sector Framework</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {industry.pageTitle || `${industry.title} Security Solutions`}
          </h1>

          {industry.bannerTagline && (
            <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">
              {industry.bannerTagline}
            </p>
          )}

          {industry.subtitle && (
            <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed">
              {industry.subtitle}
            </p>
          )}

          {industry.heroCtaText && (
            <a
              href={industry.heroCtaLink || '/contact-us'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold tracking-wide uppercase transition shadow-lg"
              onClick={(e) => { if (industry.heroCtaLink && !industry.heroCtaLink.startsWith('http')) { e.preventDefault(); onOpenEnquiry && onOpenEnquiry(industry.title); } }}
            >
              {industry.heroCtaText}
            </a>
          )}
        </div>
      </section>

      {/* ===== OVERVIEW ===== */}
      {(industry.overviewParagraph1 || industry.overviewHeading || industry.description) && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {industry.overviewBadge && (
                <span className="inline-block text-xs font-bold tracking-widest text-cyan-400 uppercase">{industry.overviewBadge}</span>
              )}
              {industry.overviewHeading && (
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{industry.overviewHeading}</h2>
              )}
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {industry.overviewParagraph1 || industry.description || staticFallback.description}
              </p>
              {industry.overviewParagraph2 && (
                <p className="text-slate-400 leading-relaxed text-sm">{industry.overviewParagraph2}</p>
              )}
            </div>
            {(industry.overviewImage || industry.image) && (
              <div className="rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={industry.overviewImage || industry.image}
                  alt={industry.title}
                  className="w-full h-72 object-cover"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== MAIN CONTENT GRID ===== */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-10">

            {/* Key Challenges */}
            {challenges.length > 0 && (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                  {industry.keyChallengesHeading || 'Key Sector Security Challenges'}
                </h3>
                <div className="space-y-4">
                  {challenges.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {item.icon ? <i className={`fa-solid ${item.icon} text-xs`} /> : '!'}
                      </span>
                      <div>
                        {item.title && <p className="text-sm font-bold text-white mb-1">{item.title}</p>}
                        <p className="text-sm text-slate-300">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Solutions Provided */}
            {solutions.length > 0 && (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                  {industry.solutionsProvidedHeading || 'Tailored Security Solutions Implemented'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {solutions.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {item.icon ? <i className={`fa-solid ${item.icon} text-xs`} /> : <CheckCircle className="w-4 h-4" />}
                      </span>
                      <div>
                        {item.title && <p className="text-sm font-bold text-white mb-1">{item.title}</p>}
                        <p className="text-xs font-medium text-slate-300">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brands */}
            {Array.isArray(industry.brands) && industry.brands.length > 0 && (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-white">{industry.brandsHeading || 'APPROVED BRANDS & TECHNOLOGY'}</h3>
                  {industry.brandsSubheading && <p className="text-sm text-slate-400 mt-1">{industry.brandsSubheading}</p>}
                </div>
                <div className="flex flex-wrap gap-4">
                  {industry.brands.map((b, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 min-w-[100px]">
                      {b.src && (
                        <img src={b.src} alt={b.name} className="h-10 object-contain" onError={e => { e.target.style.display = 'none'; }} />
                      )}
                      <span className="text-xs text-slate-300 font-medium text-center">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Sectors */}
            {Array.isArray(industry.targetSectors) && industry.targetSectors.length > 0 && (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                <div>
                  {industry.sectorsBadge && <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">{industry.sectorsBadge}</span>}
                  <h3 className="text-xl font-bold text-white mt-1">{industry.sectorsHeading || 'SPECIALIZED VERTICALS SERVED'}</h3>
                  {industry.sectorsDesc && <p className="text-sm text-slate-400 mt-1">{industry.sectorsDesc}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {industry.targetSectors.map((sec, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                        <i className={`fa-solid ${sec.icon || 'fa-building'} text-sm`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{sec.title}</p>
                        {sec.desc && <p className="text-xs text-slate-400 mt-1">{sec.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose Us */}
            {Array.isArray(industry.whyChooseUs) && industry.whyChooseUs.length > 0 && (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                <div>
                  {industry.whyBadge && <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">{industry.whyBadge}</span>}
                  <h3 className="text-xl font-bold text-white mt-1">{industry.whyHeading || 'Why UniSpark?'}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {industry.whyChooseUs.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                        <i className={`fa-solid ${item.icon || 'fa-star'} text-sm`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{item.title}</p>
                        {item.desc && <p className="text-xs text-slate-400 mt-1">{item.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-lg font-bold text-white">Need Sector-Specific Advice?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consult with our specialized sector engineers for SIRA-compliant blueprints and site assessments.
              </p>
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry(`Consultation for ${industry.title}`)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg"
              >
                {industry.heroCtaText || 'Request Sector Assessment'}
              </button>
            </div>

            {/* Other Industries */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400">Other Industry Sectors</h4>
              <div className="space-y-2">
                {allIndustries.filter(i => i.id !== industry.id).map((item) => (
                  <Link
                    key={item.id}
                    to={`/industries/${item.id}`}
                    className="block p-3 rounded-xl hover:bg-slate-800 transition text-xs font-medium text-slate-300 hover:text-white flex items-center gap-2"
                  >
                    <i className={`fa-solid ${item.icon || 'fa-building'} text-cyan-400 text-xs`} />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      {(industry.ctaHeading || industry.ctaDesc) ? (
        <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-950 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{industry.ctaHeading}</h2>
            {industry.ctaDesc && <p className="text-slate-300 text-base leading-relaxed">{industry.ctaDesc}</p>}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {industry.ctaBtn1Text && (
                <a href={industry.ctaBtn1Link || '/contact-us'} className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm tracking-wide uppercase transition shadow-lg">
                  {industry.ctaBtn1Text}
                </a>
              )}
              {industry.ctaBtn2Text && (
                <a href={industry.ctaBtn2Link || 'tel:+971502885874'} className="px-8 py-4 rounded-xl border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-white font-semibold text-sm transition">
                  {industry.ctaBtn2Text}
                </a>
              )}
            </div>
          </div>
        </section>
      ) : (
        <CtaSection onOpenEnquiry={onOpenEnquiry} />
      )}

    </div>
  );
}
