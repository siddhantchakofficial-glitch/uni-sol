import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CtaSection({ data: propData, onOpenEnquiry }) {
  const { t, i18n } = useTranslation();
  const [internalData, setInternalData] = useState(null);

  useEffect(() => {
    if (!propData) {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      fetch(`${apiBase}/about`)
        .then(res => res.json())
        .then(d => {
          if (d.success && d.data) setInternalData(d.data);
        })
        .catch(err => console.warn('Error fetching cta section data:', err));
    }
  }, [propData]);

  const data = propData || internalData;

  const badge = data?.ctaBadge || '';
  const title = i18n.language === 'hi' ? t('cta.title') : (data?.ctaTitle || "Let's Discuss Your Security Requirements");
  const desc = i18n.language === 'hi' ? t('cta.subtitle') : (data?.ctaDesc || 'Whether you need a single CCTV installation or a full-site security infrastructure project, our team is ready to assess, design, and deliver.');
  const primaryBtnText = i18n.language === 'hi' ? t('cta.buttonPrimary') : (data?.ctaPrimaryBtnText || 'Request a Free Site Survey');
  const primaryBtnLink = data?.ctaPrimaryBtnLink || '/contact-us';
  const secondaryBtnText = i18n.language === 'hi' ? t('cta.buttonSecondary') : (data?.ctaSecondaryBtnText || 'Download Company Profile');
  const secondaryBtnLink = data?.ctaSecondaryBtnLink || '/company-profile.pdf';
  const bgImage = data?.ctaBgImage || '/images/home-cta.jpg';

  return (
    <section className="relative py-24 bg-[#030e21] text-white overflow-hidden border-t border-slate-800">
      {/* Background image */}
      {bgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-80"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      ) : null}

      {/* Dark overlay gradient matching Image 1 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030e21]/90 via-[#030e21]/75 to-[#030e21]/90 z-0 pointer-events-none" />

      {/* Ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        {badge ? (
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-sky-400 text-xs font-semibold uppercase tracking-wider shadow-lg">
            <i className="fa-solid fa-cubes text-xs"></i>
            <span>{badge}</span>
          </div>
        ) : null}

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {title.includes('Security Requirements') ? (
            <>
              {title.split('Security Requirements')[0]}
              <span className="text-[#38bdf8]">Security</span>
              <br className="hidden sm:inline" />
              <span className="text-[#38bdf8]">Requirements</span>
              {title.split('Security Requirements')[1]}
            </>
          ) : title.includes('Secure Your Site') ? (
            <>
              {title.split('Secure Your Site')[0]}
              <span className="text-[#38bdf8]">Secure Your Site?</span>
              {title.split('Secure Your Site')[1]}
            </>
          ) : (
            title
          )}
        </h2>

        <p className="text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-light">
          {desc}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          {primaryBtnLink.startsWith('http') ? (
            <a
              href={primaryBtnLink}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-full bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-xl flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <span>{primaryBtnText}</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </a>
          ) : (
            <Link
              to={primaryBtnLink}
              className="px-8 py-3.5 rounded-full bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-xl flex items-center gap-2 transition transform hover:-translate-y-0.5"
            >
              <span>{primaryBtnText}</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          )}

          {secondaryBtnText && (
            secondaryBtnLink.startsWith('http') || secondaryBtnLink.endsWith('.pdf') ? (
              <a
                href={secondaryBtnLink}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <span>{secondaryBtnText}</span>
              </a>
            ) : (
              <Link
                to={secondaryBtnLink}
                className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center gap-2 transition transform hover:-translate-y-0.5"
              >
                <span>{secondaryBtnText}</span>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
