import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '../../../context/SiteContext';
import { FaArrowRight } from 'react-icons/fa';

export const Hero = () => {
  const { setConsultationModalOpen } = useSiteContext();

  return (
    <section className="relative min-h-[calc(100vh-104px)] py-20 lg:py-28 flex items-center justify-start overflow-hidden bg-[#071326]">
      {/* Background Hero Video or Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/src/assets/images/hero.jpg"
          className="w-full h-full object-cover opacity-35"
        >
          <source src="/src/assets/images/hero.webm" type="video/webm" />
        </video>
        {/* Subtle Tech Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071326] via-[#071326]/85 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-left space-y-7">
        {/* Main Display Headline matching unisparkinnovation.com */}
        <h1 className="text-3xl sm:text-5xl lg:text-[58px] text-white leading-[1.18] tracking-tight max-w-5xl font-poppins">
          <span className="font-light italic text-slate-100">Designing </span>
          <span className="font-bold text-white">Secure, Modern </span>
          <span className="font-normal text-slate-200">&amp;</span>
          <br className="hidden sm:inline" />
          <span className="font-bold text-white">Digital Enterprise </span>
          <span className="font-light text-slate-100">Ecosystems.</span>
        </h1>

        {/* Authentic Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl font-normal leading-relaxed">
          UniSpark helps enterprises in India and the UAE unify Infrastructure, Cloud, Cybersecurity, Workplace, AI Video Intelligence and Aviation Operations into one integrated, resilient digital foundation.
        </p>

        {/* 3 Authentic Pill Buttons matching unisparkinnovation.com */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 pt-4">
          <Link
            to="/capabilities"
            className="btn-unispark-white-outline group"
          >
            <span>Explore Capabilities</span>
            <FaArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/industries"
            className="btn-unispark-white-outline group"
          >
            <span>Explore Industries</span>
            <FaArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/international"
            className="btn-unispark-white-outline group"
          >
            <span>Explore International Ops</span>
            <FaArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => setConsultationModalOpen(true)}
            className="btn-unispark-pill text-xs py-3 px-6"
          >
            Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
