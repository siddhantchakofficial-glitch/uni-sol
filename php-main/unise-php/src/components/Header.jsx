import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, Mail, Shield, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { solutionsData } from '../data/solutionsData';
import { industriesData } from '../data/industriesData';

export default function Header({ onOpenEnquiry }) {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(false);
  
  // Header settings fetched live from Backend (Admin Panel -> MongoDB)
  const [headerConfig, setHeaderConfig] = useState({
    email: 'info@unisparkinnovation.com',
    socialLinks: {
      facebook: 'https://www.facebook.com/UnisparkInnovation/',
      instagram: 'https://www.instagram.com/unispark_innovation/',
      twitter: 'https://x.com/unispark_inn',
      linkedin: 'https://www.linkedin.com/company/unispark-innovation/posts/?feedView=all'
    },
    logoUrl: '/images/logo.png'
  });

  const location = useLocation();

  // Fetch header configuration from backend API (MongoDB Atlas)
  const loadBackendHeaderConfig = async () => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
      const res = await fetch(`${apiBase}/header`);
      const data = await res.json();
      if (data.success && data.data) {
        setHeaderConfig({
          email: data.data.email || 'info@unisparkinnovation.com',
          socialLinks: {
            facebook: data.data.socialLinks?.facebook ?? 'https://www.facebook.com/UnisparkInnovation/',
            instagram: data.data.socialLinks?.instagram ?? 'https://www.instagram.com/unispark_innovation/',
            twitter: data.data.socialLinks?.twitter ?? 'https://x.com/unispark_inn',
            linkedin: data.data.socialLinks?.linkedin ?? 'https://www.linkedin.com/company/unispark-innovation/posts/?feedView=all'
          },
          logoUrl: data.data.logoUrl || '/images/logo.png'
        });
      }
    } catch (err) {
      console.warn('unise-php Header: Error fetching header config from backend:', err);
    }
  };

  useEffect(() => {
    loadBackendHeaderConfig();

    // Live sync: Refetch when window regains focus or on interval so Admin edits reflect automatically
    const handleFocus = () => loadBackendHeaderConfig();
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadBackendHeaderConfig();
    }, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSolutionsDropdownOpen(false);
    setIndustriesDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 shadow-sm">
      {/* Top Bar (Ocean Blue #0a6eab) */}
      <div className="bg-[#0a6eab] text-white py-2 px-4 text-xs font-medium border-b border-white/10 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href={`mailto:${headerConfig.email}`} className="flex items-center gap-2 text-white hover:text-sky-200 transition">
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>{headerConfig.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-white">
            <LanguageSwitcher />
            {headerConfig.socialLinks.facebook && (
              <a href={headerConfig.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-sky-200 transition">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            )}
            {headerConfig.socialLinks.instagram && (
              <a href={headerConfig.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-sky-200 transition">
                <i className="fa-brands fa-instagram"></i>
              </a>
            )}
            {headerConfig.socialLinks.twitter && (
              <a href={headerConfig.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-sky-200 transition">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            )}
            {headerConfig.socialLinks.linkedin && (
              <a href={headerConfig.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-sky-200 transition">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar (White Background #ffffff) */}
      <div className={`bg-white/95 backdrop-blur-md transition-all duration-300 border-b border-slate-200 ${isScrolled ? 'py-2 shadow-md' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={headerConfig.logoUrl || '/images/logo.png'}
              alt="UniSpark Innovation Security Systems"
              className="h-12 sm:h-14 w-auto object-contain"
              onError={(e) => { e.target.src = '/images/logo.png'; }}
            />
          </Link>

          {/* Desktop Links (Home, About Us, Solutions, Industries) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-800">
            <Link 
              to="/" 
              className={`transition hover:text-[#0a6eab] ${location.pathname === '/' ? 'text-[#0a6eab] font-bold' : 'text-slate-800'}`}
            >
              {t('nav.home')}
            </Link>

            <Link 
              to="/about-us" 
              className={`transition hover:text-[#0a6eab] ${location.pathname === '/about-us' ? 'text-[#0a6eab] font-bold' : 'text-slate-800'}`}
            >
              {t('nav.about')}
            </Link>

            {/* Solutions Dropdown */}
            <div 
              className="relative group py-2"
              onMouseEnter={() => setSolutionsDropdownOpen(true)}
              onMouseLeave={() => setSolutionsDropdownOpen(false)}
            >
              <Link 
                to="/solutions"
                className={`flex items-center gap-1.5 transition hover:text-[#0a6eab] ${location.pathname.startsWith('/solutions') ? 'text-[#0a6eab] font-bold' : 'text-slate-800'}`}
              >
                <span>{t('nav.solutions')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${solutionsDropdownOpen ? 'rotate-180 text-[#0a6eab]' : 'text-slate-500'}`} />
              </Link>

              {solutionsDropdownOpen && (
                <div className="absolute top-full -left-20 w-[780px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 grid grid-cols-3 gap-3 animate-fadeIn">
                  <div className="col-span-3 pb-3 border-b border-slate-100 flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0a6eab] flex items-center gap-2">
                      <Shield className="w-4 h-4" /> {t('nav.solutions')}
                    </span>
                    <Link to="/solutions" className="text-xs text-[#0a6eab] font-semibold hover:underline">{t('nav.allSolutions')} &rarr;</Link>
                  </div>
                  {solutionsData.map((item) => (
                    <Link
                      key={item.id}
                      to={`/solutions/${item.id}`}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0a6eab]/10 text-[#0a6eab] flex items-center justify-center shrink-0 group-hover:bg-[#0a6eab] group-hover:text-white transition">
                        <i className={`fa-solid ${item.icon} text-xs`}></i>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-[#0a6eab] transition">
                          {item.shortTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {item.summary}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div 
              className="relative group py-2"
              onMouseEnter={() => setIndustriesDropdownOpen(true)}
              onMouseLeave={() => setIndustriesDropdownOpen(false)}
            >
              <Link 
                to="/industries"
                className={`flex items-center gap-1.5 transition hover:text-[#0a6eab] ${location.pathname.startsWith('/industries') ? 'text-[#0a6eab] font-bold' : 'text-slate-800'}`}
              >
                <span>{t('nav.industries')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${industriesDropdownOpen ? 'rotate-180 text-[#0a6eab]' : 'text-slate-500'}`} />
              </Link>

              {industriesDropdownOpen && (
                <div className="absolute top-full -left-20 w-[640px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-3 animate-fadeIn">
                  <div className="col-span-2 pb-3 border-b border-slate-100 flex justify-between items-center mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0a6eab] flex items-center gap-2">
                      <Building className="w-4 h-4" /> {t('nav.industries')}
                    </span>
                    <Link to="/industries" className="text-xs text-[#0a6eab] font-semibold hover:underline">{t('nav.allIndustries')} &rarr;</Link>
                  </div>
                  {industriesData.map((ind) => (
                    <Link
                      key={ind.id}
                      to={`/industries/${ind.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0a6eab]/10 text-[#0a6eab] flex items-center justify-center shrink-0 group-hover:bg-[#0a6eab] group-hover:text-white transition">
                        <i className={`fa-solid ${ind.icon} text-xs`}></i>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-[#0a6eab] transition">
                          {ind.title}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {ind.subtitle}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Contact Us Pill Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/contact-us"
              className="px-7 py-2.5 rounded-full bg-[#0080c6] hover:bg-[#006ea8] text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5"
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#0a6eab]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bg-white border-b border-slate-200 p-6 space-y-4 max-h-[80vh] overflow-y-auto z-50 shadow-xl text-slate-800">
          <div className="pb-3 border-b border-slate-100">
            <LanguageSwitcher isMobile={true} />
          </div>
          <Link to="/" className="block py-2 text-base font-semibold border-b border-slate-100">{t('nav.home')}</Link>
          <Link to="/about-us" className="block py-2 text-base font-semibold border-b border-slate-100">{t('nav.about')}</Link>
          <Link to="/solutions" className="block py-2 text-base font-semibold border-b border-slate-100">{t('nav.solutions')}</Link>
          <Link to="/industries" className="block py-2 text-base font-semibold border-b border-slate-100">{t('nav.industries')}</Link>
          <Link to="/contact-us" className="block py-3 mt-4 text-center rounded-full bg-[#0080c6] text-white font-bold">{t('nav.contact')}</Link>
        </div>
      )}
    </header>
  );
}
