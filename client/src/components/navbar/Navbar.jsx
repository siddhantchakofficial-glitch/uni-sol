import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaShieldAlt } from 'react-icons/fa';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import { useSiteContext } from '../../context/SiteContext';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/images/unispark-logo.png';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { toggleMobileMenu } = useSiteContext();
  const { user, isAuthenticated, serverOnline } = useAuth();
  const adminPath = isAuthenticated ? '/admin/dashboard' : '/admin/login';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      {/* UniSpark Top Bar */}
      <div className="bg-[#0470aa] text-white text-xs py-2 px-4 sm:px-8 border-b border-[#035a88]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-normal opacity-90">Email:</span>
            <a
              href="mailto:info@unisparkinnovation.com"
              className="font-medium hover:underline text-white transition-opacity"
            >
              info@unisparkinnovation.com
            </a>
          </div>

          <div className="flex items-center space-x-3.5">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <FaInstagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.facebook.com/UnisparkInnovation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://x.com/unispark_inn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <FaTwitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://in.linkedin.com/company/unispark-innovation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <FaLinkedinIn className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`bg-white transition-all duration-200 border-b border-gray-100 ${
          scrolled ? 'shadow-md py-2.5' : 'shadow-xs py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="group flex items-center transition-transform hover:scale-[1.01]"
            aria-label="UniSpark Innovation home"
          >
            <img
              src={logoImg}
              alt="UniSpark Innovation"
              className="h-11 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Right CTA Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/contact"
              className="btn-unispark-pill text-xs py-2 px-6"
            >
              CONTACT
            </Link>

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
            <Link
              to="/contact"
              className="btn-unispark-pill text-xs py-1.5 px-3.5"
            >
              CONTACT
            </Link>
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
