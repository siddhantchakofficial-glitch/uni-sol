import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroSection({ onOpenEnquiry }) {
  const { t, i18n } = useTranslation();
  // Hero settings state synced live with Backend (Admin -> MongoDB Atlas -> Cloudinary)
  const [heroConfig, setHeroConfig] = useState({
    title: 'Welcome to Unispark',
    heading: "UAE's Trusted Security Systems Partner",
    words: ["Design.", "Supply.", "Installation.", "Maintenance."],
    description: 'Protecting businesses, assets, and people across Dubai, Abu Dhabi, Sharjah, and the UAE — with world-class physical security infrastructure, expert engineers, and zero-compromise service.',
    button1: { text: 'Request a Free Site Survey', link: '/contact-us' },
    button2: { text: 'Call Us Now: +971 50 288 5874', link: 'tel:+971502885874' },
    videoUrl: ''
  });


  const [wordIndex, setWordIndex] = useState(0);

  // Fetch Hero Configuration from Backend API
  const loadHeroConfigFromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/hero`);
      const data = await res.json();
      if (data.success && data.data) {
        setHeroConfig({
          title: data.data.title || 'Welcome to Unispark',
          heading: data.data.heading || "UAE's Trusted Security Systems Partner",
          words: Array.isArray(data.data.words) && data.data.words.length > 0 ? data.data.words : ["Design.", "Supply.", "Installation.", "Maintenance."],
          description: data.data.description || 'Protecting businesses, assets, and people across Dubai, Abu Dhabi, Sharjah, and the UAE...',
          button1: {
            text: data.data.button1?.text || 'Request a Free Site Survey',
            link: data.data.button1?.link || '/contact-us'
          },
          button2: {
            text: data.data.button2?.text || 'Call Us Now: +971 50 288 5874',
            link: data.data.button2?.link || 'tel:+971502885874'
          },
          videoUrl: data.data.videoUrl || ''
        });
      }
    } catch (err) {
      console.warn('unise-php Hero: Error fetching hero config from backend:', err);
    }
  };

  useEffect(() => {
    loadHeroConfigFromBackend();

    const handleFocus = () => loadHeroConfigFromBackend();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadHeroConfigFromBackend();
    }, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // Word rotating animation interval
  useEffect(() => {
    if (!heroConfig.words || heroConfig.words.length === 0) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % heroConfig.words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [heroConfig.words]);

  const trustItems = [
    { icon: "fa-id-card-clip", text: "Licensed & UAE-Compliant" },
    { icon: "fa-handshake", text: "Hikvision Authorised Partner" },
    { icon: "fa-certificate", text: "Dahua Partner" },
    { icon: "fa-star", text: "ZKTeco Partner" },
    { icon: "fa-award", text: "10+ Years Field Experience" },
    { icon: "fa-map-location-dot", text: "Dubai · Abu Dhabi · Sharjah" },
    { icon: "fa-building-shield", text: "B2B & B2G Specialists" },
  ];

  const currentWord = heroConfig.words[wordIndex % heroConfig.words.length] || "Design.";

  return (
    <div className="relative bg-[#021827] text-white overflow-hidden min-h-[85vh] flex flex-col justify-between">
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video
          key={heroConfig.videoUrl || 'default-hero-video'}
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero.jpg"
          className="w-full h-full object-cover opacity-40"
        >
          {heroConfig.videoUrl ? (
            <source src={heroConfig.videoUrl} />
          ) : (
            <source src="/images/hero.webm" type="video/webm" />
          )}
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#021827] via-[#021827]/80 to-transparent"></div>
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 my-auto w-full">
        <div className="max-w-3xl space-y-6">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wide">
            <i className="fa-solid fa-circle-check text-cyan-300"></i>
            <span>{i18n.language === 'hi' ? t('hero.badge') : heroConfig.title}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            {i18n.language === 'hi' ? t('hero.titlePrefix') : heroConfig.heading} <br />
            <span className="inline-block text-cyan-300 transition-all duration-500">
              {i18n.language === 'hi' ? t(`hero.rotatingWords.${wordIndex % 5}`) : currentWord}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-light">
            {i18n.language === 'hi' ? t('hero.description') : heroConfig.description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            {heroConfig.button1.link.startsWith('/') ? (
              <Link
                to={heroConfig.button1.link}
                className="px-8 py-3.5 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition"
              >
                {i18n.language === 'hi' ? t('hero.ctaPrimary') : heroConfig.button1.text}
              </Link>
            ) : (
              <a
                href={heroConfig.button1.link}
                className="px-8 py-3.5 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition"
              >
                {i18n.language === 'hi' ? t('hero.ctaPrimary') : heroConfig.button1.text}
              </a>
            )}

            {heroConfig.button2.link.startsWith('/') ? (
              <Link
                to={heroConfig.button2.link}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <span>{i18n.language === 'hi' ? t('hero.ctaSecondary') : heroConfig.button2.text}</span>
              </Link>
            ) : (
              <a
                href={heroConfig.button2.link}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
              >
                <i className="fa-solid fa-phone text-cyan-300"></i>
                <span>{i18n.language === 'hi' ? t('hero.ctaSecondary') : heroConfig.button2.text}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
