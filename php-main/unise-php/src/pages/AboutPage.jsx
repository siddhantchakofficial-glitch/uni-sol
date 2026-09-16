import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Eye, Building2, Wrench, Globe, CheckCircle2, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OurGroupSection from '../components/OurGroupSection';
import KeyDifferentiatorsSection from '../components/KeyDifferentiatorsSection';
import CtaSection from '../components/CtaSection';

const IconMap = {
  ShieldCheck,
  Target,
  Eye,
  Building2,
  Wrench,
  Globe,
  CheckCircle2,
  Award
};

export default function AboutPage({ onOpenEnquiry }) {
  const { t, i18n } = useTranslation();
  const [aboutData, setAboutData] = useState({
    bannerBadge: 'ABOUT UNISPARK SECURITY',
    bannerTitle: 'About UniSpark Security Systems',
    bannerDesc: 'UniSpark Innovation Security Systems & Equipment Trading L.L.C is a Dubai-registered company specialising in end-to-end physical security solutions — from design and supply to professional installation, commissioning, and long-term maintenance. We serve enterprises, real estate developers, aviation facilities, oil & gas installations, hospitality groups, healthcare institutions, and consumer properties across the UAE, bringing hands-on technical expertise and a zero-compromise commitment to security.',
    bannerBgImage: '',
    mainHeading: 'WHO WE ARE',
    mainDesc: 'We are a physical security company built on technical credibility, regulatory compliance, and a deep understanding of the UAE market. Our engineers have hands-on experience across every system category we offer — CCTV, access control, intruder alarm, fire detection, biometrics, perimeter security, and integrated control room design.\n\nWe do not sell security. We deliver it — with precision design, certified installation, and long-term maintenance agreements that ensure your systems remain operational and compliant at all times.',
    mission: {
      title: 'OUR MISSION',
      description: 'To be the UAE\'s most reliable security systems partner — delivering design, supply, installation, and maintenance of world-class physical security infrastructure that protects businesses, assets, and people with zero compromise.',
      icon: 'Target'
    },
    vision: {
      title: 'OUR VISION',
      description: 'To become a leading UAE-based security systems brand — synonymous with technical excellence, rapid response, and uncompromising commitment to safety across every sector we serve, from aviation and real estate to oil & gas and healthcare.',
      icon: 'Eye'
    },
    mainImage: '/images/abt-sec.jpg',
    glanceBadge: 'Quick Overview',
    glanceTitle: 'COMPANY AT A GLANCE',
    glanceCards: [
      { title: "Registered", desc: "Dubai, United Arab Emirates", icon: "Building2" },
      { title: "Business Type", desc: "Security Equipment Trading · Installation · Maintenance", icon: "Wrench" },
      { title: "Target Market", desc: "UAE Commercial, Industrial & Residential — B2B & B2G", icon: "Target" },
      { title: "Service Areas", desc: "Dubai · Abu Dhabi · Sharjah · UAE Nationwide", icon: "Globe" },
      { title: "Industries Served", desc: "Aviation · Real Estate · Oil & Gas · Hospitality · Healthcare · Consumer", icon: "Award" },
      { title: "Group", desc: "UniSpark Innovations Group — Sister Entity (Physical Security Division)", icon: "ShieldCheck" }
    ]
  });

  const loadAboutFromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/about`);
      const data = await res.json();
      if (data.success && data.data) {
        setAboutData(prev => ({
          ...prev,
          ...data.data,
          glanceCards: Array.isArray(data.data.glanceCards) && data.data.glanceCards.length > 0 ? data.data.glanceCards : prev.glanceCards
        }));
      }
    } catch (err) {
      console.warn('Error fetching about data:', err);
    }
  };

  useEffect(() => {
    loadAboutFromBackend();

    const handleFocus = () => loadAboutFromBackend();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const MissionIcon = IconMap[aboutData.mission?.icon] || Target;
  const VisionIcon = IconMap[aboutData.vision?.icon] || Eye;

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen">
      
      {/* Banner */}
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat border-b border-slate-200 overflow-hidden"
        style={{ backgroundImage: `url(${aboutData.bannerBgImage || '/images/contact-bg.jpg'})` }}
      >
        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <nav aria-label="breadcrumb">
            <ol className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-600">
              <li>
                <Link to="/" className="text-[#0073b7] hover:underline">{t('nav.home')}</Link>
              </li>
              <li className="text-slate-400">/</li>
              <li className="text-slate-700 font-bold">{t('nav.about')}</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0b192c] tracking-tight">
            {i18n.language === 'hi' ? t('pages.about.title') : aboutData.bannerTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-800 max-w-4xl leading-relaxed font-semibold">
            {i18n.language === 'hi' ? t('pages.about.subtitle') : aboutData.bannerDesc}
          </p>
        </div>
      </section>

      {/* Main Mission & Vision */}
      <section className="py-20 bg-white text-slate-900 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                  {aboutData.mainHeading.includes('ARE') ? (
                    <>
                      {aboutData.mainHeading.split('ARE')[0]}
                      <span className="text-[#0073b7]">ARE</span>
                      {aboutData.mainHeading.split('ARE')[1]}
                    </>
                  ) : (
                    aboutData.mainHeading
                  )}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {aboutData.mainDesc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center">
                    <MissionIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{aboutData.mission?.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {aboutData.mission?.description}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center">
                    <VisionIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{aboutData.vision?.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                    {aboutData.vision?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 overflow-hidden bg-slate-100 p-2 shadow-xl">
                <img
                  src={aboutData.mainImage}
                  alt={aboutData.mainHeading}
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Glance */}
      <section className="py-16 bg-[#f8fafc] text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider mb-2">
              <i className="fa-solid fa-chart-pie text-xs"></i>
              <span>{aboutData.glanceBadge || 'Quick Overview'}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              {aboutData.glanceTitle.includes('GLANCE') ? (
                <>
                  {aboutData.glanceTitle.split('GLANCE')[0]}
                  <span className="text-[#0073b7]">GLANCE</span>
                  {aboutData.glanceTitle.split('GLANCE')[1]}
                </>
              ) : (
                aboutData.glanceTitle
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {aboutData.glanceCards.map((item, idx) => {
              const IconComp = IconMap[item.icon] || CheckCircle2;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-start">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0073b7] flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold uppercase text-slate-900 tracking-wide">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <OurGroupSection data={aboutData} />
      <KeyDifferentiatorsSection data={aboutData} />
      <CtaSection data={aboutData} onOpenEnquiry={onOpenEnquiry} />
    </div>
  );
}
