import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaShieldAlt } from 'react-icons/fa';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import { useSiteContext } from '../../context/SiteContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { resolveMediaUrl } from '../../utils/mediaResolver';
import logoImg from '../../assets/images/unispark-logo.png';

/*
 * Navbar — fully CMS-connected via SiteContext:
 * - headerContent (page record `header`): logo, topbar email, social links,
 *   nav CTA text/link, visibility switches.
 * - siteSettings.general: fallbacks (headerLogo, topbarEmail, navCta*).
 * - menus.header (existing menus API): extra top-level links merged after
 *   the built-in NAV_LINKS when configured.
 * Every element falls back to today's hardcoded values, so the UI is
 * pixel-identical when the CMS has no data yet.
 */
export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { toggleMobileMenu, headerContent, siteSettings } = useSiteContext();
  const { user, isAuthenticated, serverOnline } = useAuth();
  const adminPath = isAuthenticated ? '/admin/dashboard' : '/admin/login';

  const hc = headerContent || {};
  const gen = siteSettings?.general || {};

  // ── CMS-driven element values (existing design, CMS-controlled content) ──
  const showTopbar = hc.showTopbar !== false;
  const topbarEmail = hc.topbarEmail || gen.topbarEmail || 'info@unisparkinnovation.com';
  const headerLogoSrc = resolveMediaUrl(
    hc.logoUrl || gen.headerLogo || logoImg,
    logoImg
  );
  const navCtaText = hc.navCtaText || gen.navCtaText || 'CONTACT';
  const navCtaLink = hc.navCtaLink || gen.navCtaLink || '/contact';
  const showCta = hc.showCta !== false;
  const showLanguage = hc.showLanguage !== false;
  const socialCfg = hc.social || {};

  const socialItems = [
    { key: 'instagram', Icon: FaInstagram, label: 'Instagram', fallback: 'https://www.instagram.com' },
    { key: 'facebook', Icon: FaFacebookF, label: 'Facebook', fallback: 'https://www.facebook.com/UnisparkInnovation' },
    { key: 'twitter', Icon: FaTwitter, label: 'X (Twitter)', fallback: 'https://x.com/unispark_inn' },
    { key: 'linkedin', Icon: FaLinkedinIn, label: 'LinkedIn', fallback: 'https://in.linkedin.com/company/unispark-innovation' },
  ].map(({ key, Icon, label, fallback }) => ({
    key,
    Icon,
    label,
    href: socialCfg[key] ?? fallback,
    visible: socialCfg[`${key}Visible`] !== false,
  }));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* UniSpark Top Bar — CMS: topbarEmail + per-network visibility */}
      {showTopbar && (
      <div className="bg-[#0470aa] text-white text-xs py-2 px-4 sm:px-8 border-b border-[#035a88]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-normal opacity-90">Email:</span>
            <a
              href={`mailto:${topbarEmail}`}
              className="font-medium hover:underline text-white transition-opacity"
            >
              {topbarEmail}
            </a>
          </div>

          <div className="flex items-center space-x-3.5">
            {socialItems.map(({ key, Icon, label, href, visible }) =>
              visible ? (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white hover:opacity-80 transition-opacity"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ) : null
            )}
          </div>
        </div>
      </div>
      )}

      {/* Main Navbar */}
      <nav
        className={`bg-white transition-all duration-200 border-b border-gray-100 ${
          scrolled ? 'shadow-md py-2.5' : 'shadow-xs py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo — CMS-controlled via header record / settings */}
          <Link
            to="/"
            className="group flex items-center transition-transform hover:scale-[1.01]"
            aria-label={`${gen.siteName || 'UniSpark Innovation'} home`}
          >
            <img
              src={headerLogoSrc}
              alt={gen.siteName || 'UniSpark Innovation'}
              className="h-11 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Right CTA Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {showLanguage && <LanguageSelector compact={true} />}

            {showCta && (
              <Link
                to={navCtaLink}
                className="btn-unispark-pill text-xs py-2 px-6"
              >
                {navCtaText}
              </Link>
            )}

            {/* Connected Admin Button */}
            <Link
              to={adminPath}
              className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isAuthenticated
                  ? 'bg-[#0470aa]/10 text-[#0470aa] border-[#0470aa]/30 hover:bg-[#0470aa]/20'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:text-[#0470aa] hover:border-[#0470aa]/40 hover:bg-sky-50/60'
              }`}
              title={
                serverOnline === true
                  ? `Admin CMS • Server Connected (${isAuthenticated ? 'Logged in as ' + (user?.username || 'Admin') : 'Online'})`
                  : serverOnline === false
                  ? 'Admin CMS • Server Offline (http://localhost:5000)'
                  : 'Admin CMS • Checking server connection...'
              }
            >
              <FaShieldAlt
                className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                  isAuthenticated ? 'text-[#0470aa]' : 'text-gray-400 group-hover:text-[#0470aa]'
                }`}
              />
              <span>{isAuthenticated ? (user?.username ? user.username : 'Dashboard') : 'Admin'}</span>
              
              {/* Server Live Status Dot */}
              <span className="flex items-center ml-0.5" aria-hidden="true">
                {serverOnline === true && (
                  <span className="relative flex h-2 w-2" title="Server Online">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                {serverOnline === false && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" title="Server Offline"></span>
                )}
                {serverOnline === null && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse" title="Checking server..."></span>
                )}
              </span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle & Admin */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              to={adminPath}
              className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#0470aa] transition-colors flex items-center gap-1.5"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <FaShieldAlt className="w-4 h-4 text-[#0470aa]" />
              <span className="flex items-center">
                {serverOnline === true && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                )}
                {serverOnline === false && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                )}
              </span>
            </Link>
            {showCta && (
              <Link
                to={navCtaLink}
                className="btn-unispark-pill text-xs py-1.5 px-3.5"
              >
                {navCtaText}
              </Link>
            )}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:text-[#0470aa] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <FaBars className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <MobileMenu />
    </header>
  );
};

export default Navbar;
