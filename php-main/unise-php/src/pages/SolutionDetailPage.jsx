import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { solutionsData } from '../data/solutionsData';

export default function SolutionDetailPage({ onOpenEnquiry }) {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();

  // Initial fallback solution from static data
  const staticFallback =
    solutionsData.find(
      (s) =>
        s.id === slug ||
        (slug === 'maintenance-contracts' && s.id.startsWith('maintenance-contracts'))
    ) || solutionsData[0];

  const [backendService, setBackendService] = useState(null);

  const loadServiceFromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/section3`);
      const data = await res.json();
      if (data.success && data.data && Array.isArray(data.data.services)) {
        const found = data.data.services.find(
          (s) =>
            s.id === slug ||
            (slug === 'maintenance-contracts' && s.id.startsWith('maintenance-contracts'))
        );
        if (found) {
          setBackendService(found);
        }
      }
    } catch (err) {
      console.warn('Error loading solution detail from backend:', err);
    }
  };

  useEffect(() => {
    loadServiceFromBackend();
    const handleFocus = () => loadServiceFromBackend();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(loadServiceFromBackend, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [slug]);

  const defaultTargetSectors = [
    { title: "Aviation", icon: "fa-plane", desc: "High-security tracking infrastructures suited strictly for critical tarmac, terminal, and access control environments." },
    { title: "Real Estate", icon: "fa-building", desc: "Comprehensive asset surveillance setups optimized across mixed-use spaces and high-rise commercial structures." },
    { title: "Oil & Gas", icon: "fa-oil-well", desc: "ATEX explosion-proof thermal imaging systems custom-engineered for heavy industrial perimeters." },
    { title: "Hospitality", icon: "fa-hotel", desc: "Discreet luxury-focused surveillance components balancing visitor safety requirements seamlessly." },
    { title: "Healthcare", icon: "fa-hospital", desc: "Compliance-certified security monitoring deployments built around stringent patient privacy guidelines." },
    { title: "Consumer", icon: "fa-shopping-cart", desc: "Highly scalable premium residential setups boasting interactive local app controls." }
  ];

  const defaultWhyChooseUs = [
    { title: "UAE-Compliant System Design", icon: "fa-file-shield", desc: "All relevant regulatory standards addressed at the design stage" },
    { title: "Multi-Brand Capability", icon: "fa-shuffle", desc: "We source the right technology for your specific requirements" },
    { title: "End-to-End Delivery", icon: "fa-circle-nodes", desc: "Survey, supply, installation, commissioning, and ongoing maintenance" },
    { title: "SLA-Governed Response", icon: "fa-handshake-angle", desc: "Emergency and planned maintenance covered under formal contract" }
  ];

  // Combine backend CMS data with static fallback
  const solution = {
    ...staticFallback,
    ...(backendService || {}),
    pageTitle: backendService?.pageTitle || backendService?.title || staticFallback.pageTitle || staticFallback.title,
    bannerTagline: backendService?.bannerTagline || 'Professional Installation · Commissioning · Long-Term Maintenance | UAE-Wide Coverage',
    heroCtaText: backendService?.heroCtaText || `Request a ${staticFallback.shortTitle || staticFallback.title} Site Survey`,
    heroCtaLink: backendService?.heroCtaLink || '/contact-us',
    overviewBadge: backendService?.overviewBadge || 'SERVICE OVERVIEW',
    overviewHeading: backendService?.overviewHeading || `COMPLETE ${staticFallback.title}`,
    description: backendService?.desc || backendService?.description || staticFallback.description,
    secImage: backendService?.secImage || staticFallback.secImage,
    scopeBadge: backendService?.scopeBadge || 'Scope of Work',
    scopeHeading: backendService?.scopeHeading || "WHAT'S INCLUDED IN OUR SERVICE",
    scopeOfWork:
      Array.isArray(backendService?.scopeOfWork) && backendService.scopeOfWork.length > 0
        ? backendService.scopeOfWork
        : staticFallback.scopeOfWork,
    brandsHeading: backendService?.brandsHeading || 'KEY BRANDS & TECHNOLOGY',
    brands:
      Array.isArray(backendService?.brands) && backendService.brands.length > 0
        ? backendService.brands
        : staticFallback.brands,
    sectorsBadge: backendService?.sectorsBadge || 'Targeted Sectors',
    sectorsHeading: backendService?.sectorsHeading || 'INDUSTRIES SERVED',
    sectorsDesc: backendService?.sectorsDesc || `Deploying specialized ${staticFallback.shortTitle || staticFallback.title} architecture designed for challenging environments across the Middle East.`,
    targetSectors:
      Array.isArray(backendService?.targetSectors) && backendService.targetSectors.length > 0
        ? backendService.targetSectors
        : defaultTargetSectors,
    whyBadge: backendService?.whyBadge || 'WHY CHOOSE US',
    whyHeading: backendService?.whyHeading || 'Why UniSpark For This Service',
    whyChooseUs:
      Array.isArray(backendService?.whyChooseUs) && backendService.whyChooseUs.length > 0
        ? backendService.whyChooseUs
        : defaultWhyChooseUs,
    ctaHeading: backendService?.ctaHeading || `Ready to Discuss Your ${staticFallback.title} Requirements?`,
    ctaDesc: backendService?.ctaDesc || 'Our engineers are available for site surveys across Dubai, Abu Dhabi, Sharjah, and all UAE locations.',
    ctaBtn1Text: backendService?.ctaBtn1Text || `Request a ${staticFallback.shortTitle || staticFallback.title} Site Survey`,
    ctaBtn1Link: backendService?.ctaBtn1Link || '/contact-us',
    ctaBtn2Text: backendService?.ctaBtn2Text || 'Call Our Team (+971 50 288 5874)',
    ctaBtn2Link: backendService?.ctaBtn2Link || 'tel:+971502885874'
  };

  return (
    <div className="bg-[#f1f5f9] text-slate-900 min-h-screen font-sans">
      
      {/* 1. Header Banner (Dark Ocean Blue #004b78) */}
      <section className="relative py-16 bg-[#004b78] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-2 text-xs font-semibold text-white/80">
              <li><Link to="/" className="hover:underline">{t('nav.home')}</Link></li>
              <li>/</li>
              <li><Link to="/solutions" className="hover:underline">{t('nav.solutions')}</Link></li>
              <li>/</li>
              <li className="text-white font-bold">{solution.title}</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {solution.pageTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed font-light">
            {solution.bannerTagline}
          </p>

          <div className="pt-2">
            {solution.heroCtaLink?.startsWith('http') ? (
              <a
                href={solution.heroCtaLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-xs tracking-wider uppercase shadow-md transition duration-300"
              >
                <span>{solution.heroCtaText}</span>
                <i className="fa-solid fa-arrow-right-long text-xs"></i>
              </a>
            ) : (
              <Link
                to={solution.heroCtaLink || '/contact-us'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-xs tracking-wider uppercase shadow-md transition duration-300"
              >
                <span>{solution.heroCtaText}</span>
                <i className="fa-solid fa-arrow-right-long text-xs"></i>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 2. Overview Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
                <i className={`fa-solid ${solution.icon || 'fa-shield-halved'} text-xs`}></i>
                <span>{solution.overviewBadge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight uppercase">
                {solution.overviewHeading.includes(solution.title) ? (
                  <>
                    {solution.overviewHeading.split(solution.title)[0]}
                    <span className="text-[#0073b7]">{solution.title}</span>
                    {solution.overviewHeading.split(solution.title)[1]}
                  </>
                ) : (
                  solution.overviewHeading
                )}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {solution.description}
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white p-2">
                <img
                  src={solution.secImage}
                  alt={solution.title}
                  className="w-full h-auto max-h-[400px] rounded-2xl object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Scope of Work Section (#f8f9fa) */}
      {solution.scopeOfWork && solution.scopeOfWork.length > 0 && (
        <section className="py-16 bg-[#f8f9fa] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
                <i className="fa-solid fa-list-check text-xs"></i>
                <span>{solution.scopeBadge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {solution.scopeHeading.includes('OUR SERVICE') ? (
                  <>
                    {solution.scopeHeading.split('OUR SERVICE')[0]}
                    <span className="text-[#0073b7]">OUR SERVICE</span>
                    {solution.scopeHeading.split('OUR SERVICE')[1]}
                  </>
                ) : (
                  solution.scopeHeading
                )}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {solution.scopeOfWork.map((scope, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center mb-4 text-xl">
                      <i className={`fa-solid ${scope.icon || 'fa-check'}`}></i>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-wide mb-2">
                      {scope.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {scope.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Key Brands & Technology Section */}
      {solution.brands && solution.brands.length > 0 && (
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {solution.brandsHeading.includes('TECHNOLOGY') ? (
                <>
                  {solution.brandsHeading.split('TECHNOLOGY')[0]}
                  <span className="text-[#0073b7]">TECHNOLOGY</span>
                  {solution.brandsHeading.split('TECHNOLOGY')[1]}
                </>
              ) : (
                solution.brandsHeading
              )}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {solution.brands.map((brand, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center w-40 h-28"
                >
                  <img
                    src={brand.src || brand.logoUrl}
                    alt={brand.name || brand.alt || 'Brand Logo'}
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Targeted Sectors Section */}
      <section className="py-16 bg-[#f1f5f9] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-industry text-xs"></i>
              <span>{solution.sectorsBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {solution.sectorsHeading.includes('SERVED') ? (
                <>
                  {solution.sectorsHeading.split('SERVED')[0]}
                  <span className="text-[#0073b7]">SERVED</span>
                  {solution.sectorsHeading.split('SERVED')[1]}
                </>
              ) : (
                solution.sectorsHeading
              )}
            </h2>
            {solution.sectorsDesc && (
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                {solution.sectorsDesc}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solution.targetSectors.map((sector, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xl shrink-0">
                    <i className={`fa-solid ${sector.icon || 'fa-building'}`}></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{sector.title}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{sector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why UniSpark For This Service */}
      <section className="py-16 bg-[#f8f9fa] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-shield-halved text-xs"></i>
              <span>{solution.whyBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {solution.whyHeading.includes('This Service') ? (
                <>
                  {solution.whyHeading.split('This Service')[0]}
                  <span className="text-[#0073b7]">This Service</span>
                  {solution.whyHeading.split('This Service')[1]}
                </>
              ) : (
                solution.whyHeading
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solution.whyChooseUs.map((w, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center text-xl">
                    <i className={`fa-solid ${w.icon || 'fa-check'}`}></i>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{w.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Block Section */}
      <section className="relative py-16 bg-[#030e21] text-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {solution.ctaHeading}
          </h2>

          <p className="text-base text-slate-300 max-w-2xl mx-auto font-light">
            {solution.ctaDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {solution.ctaBtn1Link?.startsWith('http') ? (
              <a
                href={solution.ctaBtn1Link}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-lg flex items-center gap-2 transition"
              >
                <span>{solution.ctaBtn1Text}</span>
                <i className="fa-solid fa-arrow-right-long text-xs"></i>
              </a>
            ) : (
              <Link
                to={solution.ctaBtn1Link || '/contact-us'}
                className="px-8 py-3.5 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-lg flex items-center gap-2 transition"
              >
                <span>{solution.ctaBtn1Text}</span>
                <i className="fa-solid fa-arrow-right-long text-xs"></i>
              </Link>
            )}

            {solution.ctaBtn2Text && (
              solution.ctaBtn2Link?.startsWith('http') || solution.ctaBtn2Link?.startsWith('tel:') ? (
                <a
                  href={solution.ctaBtn2Link}
                  className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm transition"
                >
                  {solution.ctaBtn2Text}
                </a>
              ) : (
                <Link
                  to={solution.ctaBtn2Link || '/contact-us'}
                  className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm transition"
                >
                  {solution.ctaBtn2Text}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
