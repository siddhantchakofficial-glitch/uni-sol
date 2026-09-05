import React from 'react';
import { FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

export const SocialLinks = () => {
  const socials = [
    { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <div className="flex items-center space-x-3">
      {socials.map((soc, idx) => {
        const Icon = soc.icon;
        return (
          <a
            key={idx}
            href={soc.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={soc.label}
            className="w-9 h-9 rounded-lg bg-[#f1f9ff] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
