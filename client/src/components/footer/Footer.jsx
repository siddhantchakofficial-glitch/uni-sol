import React from 'react';
import { Link } from 'react-router-dom';
import FooterLinks from './FooterLinks';
import SocialLinks from './SocialLinks';
import Newsletter from './Newsletter';
import { useSiteContext } from '../../context/SiteContext';
import { resolveMediaUrl } from '../../utils/mediaResolver';
import { ENV } from '../../config/env';
import logoImg from '../../assets/images/unispark-logo.png';

/*
 * Footer — fully CMS-connected via SiteContext:
 * - siteSettings.general: footer logo, description, newsletter copy,
 *   office addresses/phones, copyright (both regions).
 * - footerContent (page record `footer`): legal links, per-column
 *   visibility. Falls back to today's hardcoded values.
 * - FooterLinks/SocialLinks/Newsletter consume the same CMS sources.
 */
export const Footer = () => {
  const { siteSettings, footerContent } = useSiteContext();
  const gen = siteSettings?.general || {};
  const fc = footerContent || {};

  const footerLogoSrc = resolveMediaUrl(
    fc.logoUrl || gen.footerLogo || logoImg,
    logoImg
  );
  const description = fc.description || gen.footerDescription ||
    'UniSpark Innovation Private Limited is a DPIIT-recognized enterprise technology services company delivering CCTV video surveillance, access control, system integration, and global IT consulting across India and the UAE.';
  const copyright = (fc.copyrightText || gen.copyrightText ||
    '© {year} UniSpark Innovation Pvt. Ltd. All rights reserved.')
    .replace('{year}', new Date().getFullYear());

  const legalLinks = Array.isArray(fc.legalLinks) && fc.legalLinks.length > 0
    ? fc.legalLinks.filter((l) => l && l.visible !== false)
    : [
        { id: 'lg_1', label: 'Privacy Policy', path: '/privacy-policy' },
        { id: 'lg_2', label: 'Terms of Service', path: '/terms' },
        { id: 'lg_3', label: 'Cookie Policy', path: '/cookie-policy' },
        { id: 'lg_4', label: 'Disclaimer', path: '/disclaimer' },
      ];

  const officeIndia = fc.officeIndia || gen.officeIndia || {
    label: 'India Headquarters', address: ENV.ADDRESS_INDIA, phone: ENV.CONTACT_PHONE_INDIA,
  };
  const officeUAE = fc.officeUAE || gen.officeUAE || {
    label: 'UAE Regional Office', address: ENV.ADDRESS_UAE, phone: ENV.CONTACT_PHONE_UAE,
  };

  return (
    <footer className="bg-[#f1f9ff] border-t border-slate-800/80 pt-16 pb-12 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex rounded-md bg-white p-1" aria-label="UniSpark Innovation home">
              <img
                src={footerLogoSrc}
                alt={gen.siteName || 'UniSpark Innovation'}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {description}
            </p>
            <SocialLinks />
          </div>

          {/* Navigation Links — CMS columns via FooterLinks */}
          <div className="lg:col-span-5">
            <FooterLinks />
          </div>

          {/* Newsletter — CMS copy via Newsletter */}
          <div className="lg:col-span-3">
            <Newsletter />
          </div>
        </div>

        {/* Office Locations — CMS-controlled */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-900 text-xs">
          <div className="bg-[#f1f9ff]/60 p-4 rounded-xl border border-slate-800/60">
            <span className="text-blue-400 font-bold uppercase tracking-wider block mb-1">
              {officeIndia.label}
            </span>
            <p className="text-slate-300">{officeIndia.address}</p>
            <p className="text-slate-400 mt-1">Phone: {officeIndia.phone}</p>
          </div>
          <div className="bg-[#f1f9ff]/60 p-4 rounded-xl border border-slate-800/60">
            <span className="text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              {officeUAE.label}
            </span>
            <p className="text-slate-300">{officeUAE.address}</p>
            <p className="text-slate-400 mt-1">Phone: {officeUAE.phone}</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-900 text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>{copyright}</p>
          <div className="flex space-x-6">
            {legalLinks.map((link) => (
              <Link key={link.id || link.path} to={link.path || link.url || '#'} className="hover:text-slate-300">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
