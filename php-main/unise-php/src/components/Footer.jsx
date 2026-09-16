import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { solutionsData } from '../data/solutionsData';
import { industriesData } from '../data/industriesData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';


const defaultFooter = {
  logoUrl: '/images/logo.png',
  companyName: 'UniSpark Innovation Security Systems & Equipment Trading L.L.C',
  companyTagline: 'Next-generation enterprise protection and cyber-physical infrastructure logic designed for global digital business velocity.',
  groupCompaniesLabel: 'Group Companies:',
  groupCompanies: [
    { label: 'Horizon Hive Technology L.L.C', url: 'https://horizonhivetechnology.com/' },
    { label: 'UniSpark Innovations HR Consultants L.L.C', url: 'https://usihr.com/' }
  ],
  socialLinks: [
    { platform: 'Facebook', icon: 'fa-facebook-f', url: 'https://www.facebook.com/UnisparkInnovation/' },
    { platform: 'Instagram', icon: 'fa-instagram', url: 'https://www.instagram.com/unispark_innovation/' },
    { platform: 'X / Twitter', icon: 'fa-x-twitter', url: 'https://x.com/unispark_inn' },
    { platform: 'LinkedIn', icon: 'fa-linkedin-in', url: 'https://www.linkedin.com/company/unispark-innovation/posts/?feedView=all' }
  ],
  solutionsColumnTitle: 'SOLUTIONS',
  industriesColumnTitle: 'INDUSTRIES',
  quickLinksColumnTitle: 'QUICK LINKS',
  quickLinks: [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about-us' },
    { label: 'Solutions', url: '/solutions' },
    { label: 'Industries', url: '/industries' },
    { label: 'Contact Us', url: '/contact-us' }
  ],
  serviceAreasLabel: 'Service Areas:',
  serviceAreas: 'Dubai | Abu Dhabi | Sharjah | UAE Nationwide',
  officeLocation: 'Dubai, United Arab Emirates',
  email: 'sales@unisparkinnovation.com',
  emailLabel: 'Sales',
  phone: '+971 50 288 5874',
  phoneLabel: 'Call',
  whatsappNumber: '971502885874',
  copyrightText: 'UniSpark Innovation Security Systems & Equipment Trading L.L.C. All rights reserved.'
};

export default function Footer() {
  const { t } = useTranslation();
  const [footer, setFooter] = useState(defaultFooter);
  const [solutions, setSolutions] = useState(solutionsData);
  const [industries, setIndustries] = useState(industriesData);


  const fetchAll = async () => {
    try {
      const [footerRes, sec3Res, sec5Res] = await Promise.all([
        fetch(`${API_BASE}/footer`),
        fetch(`${API_BASE}/section3`),
        fetch(`${API_BASE}/section5`),
      ]);
      const [footerData, sec3Data, sec5Data] = await Promise.all([
        footerRes.json(),
        sec3Res.json(),
        sec5Res.json(),
      ]);

      if (footerData.success && footerData.data) {
        setFooter({ ...defaultFooter, ...footerData.data });
      }
      if (sec3Data.success && Array.isArray(sec3Data.data?.services) && sec3Data.data.services.length > 0) {
        setSolutions(sec3Data.data.services);
      }
      if (sec5Data.success && Array.isArray(sec5Data.data?.cards) && sec5Data.data.cards.length > 0) {
        setIndustries(sec5Data.data.cards);
      }
    } catch {
      // silently use defaults
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 8000);
    const onFocus = () => fetchAll();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const whatsappUrl = `https://wa.me/${footer.whatsappNumber || '971502885874'}`;

  return (
    <footer className="relative bg-[#004b78] text-slate-200 overflow-hidden pt-16 pb-8 border-t border-white/10 font-sans">

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-7 right-7 z-50 flex items-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition duration-300 group"
          aria-label="WhatsApp Business"
        >
          <div className="absolute inset-0 rounded-full bg-[#25D366] whatsapp-pulse-back pointer-events-none" />
          <div className="absolute inset-0 rounded-full bg-[#25D366] whatsapp-pulse-front pointer-events-none" />
          <i className="fa-brands fa-whatsapp text-2xl relative z-10" />
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">

          {/* ===== Brand Info Column ===== */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={footer.logoUrl || '/images/logo.png'}
                alt={footer.companyName}
                className="h-12 w-auto object-contain brightness-0 invert"
                onError={e => { e.target.src = '/images/logo.png'; }}
              />
            </Link>

            <h4 className="text-white text-xs font-bold leading-relaxed uppercase tracking-wider">
              {footer.companyName}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed opacity-90">
              {footer.companyTagline}
            </p>

            {/* Group Companies */}
            {Array.isArray(footer.groupCompanies) && footer.groupCompanies.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="inline-block px-3 py-1 rounded bg-white/10 text-white text-[11px] font-bold uppercase tracking-wider">
                  {footer.groupCompaniesLabel || 'Group Companies:'}
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {footer.groupCompanies.map((gc, idx) => (
                    <li key={idx}>
                      <a
                        href={gc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-link text-[10px]" /> {gc.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social Icons */}
            {Array.isArray(footer.socialLinks) && footer.socialLinks.length > 0 && (
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                {footer.socialLinks.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-[#004b78] transition"
                    aria-label={s.platform}
                    title={s.platform}
                  >
                    <i className={`fa-brands ${s.icon || 'fa-globe'} text-sm`} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ===== Solutions Column ===== */}
          <div className="lg:col-span-4 space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider border-b border-white/20 pb-2">
              {footer.solutionsColumnTitle || 'SOLUTIONS'}
            </h5>
            <ul className="space-y-2 text-xs text-slate-200">
              {solutions.map((s) => (
                <li key={s.id}>
                  <Link to={`/solutions/${s.id}`} className="hover:text-white transition flex items-center gap-2">
                    <i className={`fa-solid ${s.icon || 'fa-shield-halved'} text-[10px] opacity-70`} />
                    <span>{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Industries Column ===== */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider border-b border-white/20 pb-2">
              {footer.industriesColumnTitle || 'INDUSTRIES'}
            </h5>
            <ul className="space-y-2 text-xs text-slate-200">
              {industries.map((ind) => (
                <li key={ind.id}>
                  <Link to={`/industries/${ind.id}`} className="hover:text-white transition flex items-center gap-2">
                    <i className={`fa-solid ${ind.icon || 'fa-building'} text-[10px] opacity-70`} />
                    <span>{ind.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Quick Links Column ===== */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-white text-xs font-bold uppercase tracking-wider border-b border-white/20 pb-2">
              {footer.quickLinksColumnTitle || 'QUICK LINKS'}
            </h5>
            <ul className="space-y-2 text-xs text-slate-200">
              {(Array.isArray(footer.quickLinks) && footer.quickLinks.length > 0
                ? footer.quickLinks
                : defaultFooter.quickLinks
              ).map((ql, idx) => (
                <li key={idx}>
                  <Link to={ql.url} className="hover:text-white transition flex items-center gap-2">
                    <i className="fa-solid fa-angle-right text-[10px]" />
                    <span>{ql.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ===== Contact Strip ===== */}
        <div className="py-6 my-6 bg-white/10 rounded-2xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white">
          <div>
            <span className="inline-block px-3 py-1 rounded bg-white/10 text-white font-bold uppercase text-[10px] mb-1">
              {footer.serviceAreasLabel || 'Service Areas:'}
            </span>
            <div className="font-semibold text-white/90">{footer.serviceAreas}</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-base text-cyan-300" />
              <div>
                <img src="/images/dubai.svg" alt="Dubai Vector" className="h-6 w-auto mb-0.5 filter invert" onError={e => e.target.style.display = 'none'} />
                <div className="font-semibold">{footer.officeLocation}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <i className="fa-solid fa-envelope text-base text-cyan-300" />
              <div>
                <a href={`mailto:${footer.email}`} className="font-semibold hover:underline">
                  {footer.emailLabel}: {footer.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-base text-cyan-300" />
              <div className="font-bold">
                <a href={`tel:${footer.phone?.replace(/\s+/g, '')}`} className="hover:underline">
                  {footer.phoneLabel}: {footer.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Copyright Bar ===== */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-xs text-white/70 gap-4">
          <div>
            {t('footer.copyright')}
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition">{t('footer.privacy')}</Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition">{t('footer.terms')}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
