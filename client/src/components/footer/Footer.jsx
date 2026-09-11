import React from 'react';
import { Link } from 'react-router-dom';
import FooterLinks from './FooterLinks';
import SocialLinks from './SocialLinks';
import Newsletter from './Newsletter';
import { ENV } from '../../config/env';
import logoImg from '../../assets/images/unispark-logo.png';

export const Footer = () => {
  return (
    <footer className="bg-[#f1f9ff] border-t border-slate-800/80 pt-16 pb-12 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex rounded-md bg-white p-1" aria-label="UniSpark Innovation home">
              <img
                src={logoImg}
                alt="UniSpark Innovation"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              UniSpark Innovation Private Limited is a DPIIT-recognized enterprise technology services company delivering CCTV video surveillance, access control, system integration, and global IT consulting across India and the UAE.
            </p>
            <SocialLinks />
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-5">
            <FooterLinks />
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <Newsletter />
          </div>
        </div>

        {/* Office Locations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-900 text-xs">
          <div className="bg-[#f1f9ff]/60 p-4 rounded-xl border border-slate-800/60">
            <span className="text-blue-400 font-bold uppercase tracking-wider block mb-1">
              India Headquarters
            </span>
            <p className="text-slate-300">{ENV.ADDRESS_INDIA}</p>
            <p className="text-slate-400 mt-1">Phone: {ENV.CONTACT_PHONE_INDIA}</p>
          </div>
          <div className="bg-[#f1f9ff]/60 p-4 rounded-xl border border-slate-800/60">
            <span className="text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              UAE Regional Office
            </span>
            <p className="text-slate-300">{ENV.ADDRESS_UAE}</p>
            <p className="text-slate-400 mt-1">Phone: {ENV.CONTACT_PHONE_UAE}</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-900 text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} UniSpark Innovation Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-300">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-slate-300">
              Cookie Policy
            </Link>
            <Link to="/disclaimer" className="hover:text-slate-300">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
