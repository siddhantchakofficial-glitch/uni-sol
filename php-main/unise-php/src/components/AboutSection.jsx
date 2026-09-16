import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AboutSection() {
  const { t, i18n } = useTranslation();
  // Section 2 state synced live with Backend (Admin Panel -> MongoDB Atlas -> Cloudinary)
  const [sec2Config, setSec2Config] = useState({
    title: 'Pioneering the Future of Secured Intelligence',
    heading: 'Next-Gen Architecture',
    description: 'UniSpark Innovation architectures orchestrate friction-free continuous analysis across critical enterprise vectors, neutralizing vulnerabilities before they cross your network perimeter.',
    card1: {
      title: 'Cognitive Shielding',
      description: 'Self-learning neural vectors adapt instantly to network threats.'
    },
    card2: {
      title: 'Microsecond Latency',
      description: 'Sub-atomic detection layers processing continuous data streams.'
    },
    ecosystemButton: {
      text: 'Our Ecosystem',
      link: '/about-us'
    },
    imageUrl: '/images/about-vision.jpg',
    imageButton: {
      text: '99.99% Threat Isolation',
      link: '/solutions'
    }
  });

  // Fetch Section 2 Configuration from Backend API
  const loadSection2FromBackend = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/section2`);
      const data = await res.json();
      if (data.success && data.data) {
        setSec2Config({
          title: data.data.title || 'Pioneering the Future of Secured Intelligence',
          heading: data.data.heading || 'Next-Gen Architecture',
          description: data.data.description || 'UniSpark Innovation architectures orchestrate friction-free continuous analysis...',
          card1: {
            title: data.data.card1?.title || 'Cognitive Shielding',
            description: data.data.card1?.description || 'Self-learning neural vectors adapt instantly...'
          },
          card2: {
            title: data.data.card2?.title || 'Microsecond Latency',
            description: data.data.card2?.description || 'Sub-atomic detection layers...'
          },
          ecosystemButton: {
            text: data.data.ecosystemButton?.text || 'Our Ecosystem',
            link: data.data.ecosystemButton?.link || '/about-us'
          },
          imageUrl: data.data.imageUrl || '/images/about-vision.jpg',
          imageButton: {
            text: data.data.imageButton?.text || '99.99% Threat Isolation',
            link: data.data.imageButton?.link || '/solutions'
          }
        });
      }
    } catch (err) {
      console.warn('unise-php AboutSection: Error fetching section2 config from backend:', err);
    }
  };

  useEffect(() => {
    loadSection2FromBackend();

    // Refetch when tab regains focus or on interval so Admin edits reflect live
    const handleFocus = () => loadSection2FromBackend();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadSection2FromBackend();
    }, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative py-20 bg-[#f1f5f9] text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0073b7] text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-atom text-xs animate-spin-slow"></i>
              <span>{i18n.language === 'hi' ? t('about.badge') : sec2Config.heading}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {i18n.language === 'hi' ? t('about.title') : sec2Config.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {i18n.language === 'hi' ? t('about.description') : sec2Config.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Card 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-brain text-sm"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {i18n.language === 'hi' ? t('about.card1Title') : sec2Config.card1.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {i18n.language === 'hi' ? t('about.card1Desc') : sec2Config.card1.description}
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-bolt text-sm"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {i18n.language === 'hi' ? t('about.card2Title') : sec2Config.card2.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {i18n.language === 'hi' ? t('about.card2Desc') : sec2Config.card2.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              {sec2Config.ecosystemButton.link.startsWith('/') ? (
                <Link
                  to={sec2Config.ecosystemButton.link}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-md transition"
                >
                  <span>{i18n.language === 'hi' ? t('about.ctaBtn') : sec2Config.ecosystemButton.text}</span>
                </Link>
              ) : (
                <a
                  href={sec2Config.ecosystemButton.link}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm shadow-md transition"
                >
                  <span>{i18n.language === 'hi' ? t('about.ctaBtn') : sec2Config.ecosystemButton.text}</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Image Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white p-2">
              <img
                src={sec2Config.imageUrl || '/images/about-vision.jpg'}
                alt="Security Infrastructure Analytics"
                className="w-full h-auto max-h-[460px] rounded-2xl object-cover"
                onError={(e) => { e.target.src = '/images/about-vision.jpg'; }}
              />

              {/* Floating Tech Badge */}
              {sec2Config.imageButton.text && (
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 flex items-center gap-4 shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-shield-halved text-base"></i>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{sec2Config.imageButton.text}</div>
                    <div className="text-xs text-slate-500">Continuous Live Security Matrix</div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
