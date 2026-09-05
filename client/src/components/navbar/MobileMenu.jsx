import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaChevronDown, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { NAV_LINKS } from '../../utils/constants';
import { useSiteContext } from '../../context/SiteContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export const MobileMenu = () => {
  const { mobileMenuOpen, closeMobileMenu, setConsultationModalOpen } = useSiteContext();
  const { user, isAuthenticated, serverOnline } = useAuth();
  const [openSubIndex, setOpenSubIndex] = useState(null);

  if (!mobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-xl lg:hidden flex flex-col justify-between p-6 animate-fade-in overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
          <Link to="/" onClick={closeMobileMenu} className="inline-block" aria-label="UniSpark Innovation home">
            <img
              src="/src/assets/images/unispark-logo.png"
              alt="UniSpark Innovation"
              className="h-10 w-auto"
            />
          </Link>

          <button
            onClick={closeMobileMenu}
            className="p-2 text-gray-500 hover:text-[#0470aa] rounded-full bg-gray-50 border border-gray-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {NAV_LINKS.map((item, idx) => {
            if (item.dropdown) {
              const isOpen = openSubIndex === idx;
              return (
                <div key={idx} className="border-b border-gray-100 pb-2">
                  <button
                    onClick={() => setOpenSubIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between py-3 text-left font-semibold text-[#000000] text-base hover:text-[#0470aa]"
                  >
                    <span>{item.name}</span>
                    <FaChevronDown
                      className={`w-3.5 h-3.5 text-[#0470aa] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pl-3 space-y-1 py-2 border-l-2 border-[#0470aa] ml-2">
                      {item.dropdown.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.path}
                          onClick={closeMobileMenu}
                          className="block text-sm text-[#475467] hover:text-[#0470aa] py-1.5"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={idx}
                to={item.path}
                onClick={closeMobileMenu}
                className="block py-3 text-base font-semibold text-[#000000] hover:text-[#0470aa] border-b border-gray-100"
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Contact CTAs */}
      <div className="pt-6 space-y-3 border-t border-gray-100 mt-6">
        <Link
          to="/contact"
          onClick={closeMobileMenu}
          className="btn-unispark-pill w-full text-center block"
        >
          CONTACT
        </Link>
        <Button
          variant="secondary"
          size="md"
          className="w-full"
          onClick={() => {
            closeMobileMenu();
            setConsultationModalOpen(true);
          }}
        >
          Schedule Consultation
        </Button>

        {/* Admin Server Portal link */}
        <Link
          to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
          onClick={closeMobileMenu}
          className="flex items-center justify-between py-2.5 px-4 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-sky-50/50 hover:border-[#0470aa]/30 text-xs font-semibold text-gray-700 hover:text-[#0470aa] transition-all w-full"
        >
          <span className="flex items-center gap-2">
            <FaShieldAlt className="text-[#0470aa] w-3.5 h-3.5" />
            <span>{isAuthenticated ? (user?.username ? `Admin (${user.username})` : 'Admin Dashboard') : 'Admin Portal'}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-normal">
            {serverOnline === true && (
              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Server Online
              </span>
            )}
            {serverOnline === false && (
              <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[10px] font-medium border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                Server Offline
              </span>
            )}
            {serverOnline === null && (
              <span className="text-gray-400 text-[10px]">Checking…</span>
            )}
          </span>
        </Link>
        <div className="flex items-center justify-center text-xs text-gray-500 pt-2">
          <a href="mailto:info@unisparkinnovation.com" className="flex items-center gap-1.5 hover:text-[#0470aa]">
            <FaEnvelope className="text-[#0470aa]" /> info@unisparkinnovation.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
