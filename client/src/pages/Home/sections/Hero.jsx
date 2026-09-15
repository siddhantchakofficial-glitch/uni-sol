import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContext } from '../../../context/SiteContext';
import { FaArrowRight } from 'react-icons/fa';
import images from '../../../assets/images';

export const Hero = ({ data = {} }) => {
  const { setConsultationModalOpen } = useSiteContext();

  const heading = data?.heading || 'Designing Secure, Modern & Digital Enterprise Ecosystems.';
  const description = data?.description || 'UniSpark helps enterprises in India and the UAE unify Infrastructure, Cloud, Cybersecurity, Workplace, AI Video Intelligence and Aviation Operations into one integrated, resilient digital foundation.';
  const primaryBtnText = data?.primaryBtnText || 'Explore Capabilities';
  const primaryBtnLink = data?.primaryBtnLink || '/capabilities';
  const secondaryBtnText = data?.secondaryBtnText || 'Explore Industries';
  const secondaryBtnLink = data?.secondaryBtnLink || '/industries';
  const badge = data?.badge;

  return (
    <section className="relative min-h-[calc(100vh-104px)] py-20 lg:py-28 flex items-center justify-start overflow-hidden bg-[#071326]">
      {/* Background Hero Video or Overlay */}
      <div className="absolute inset-0 z-0">
        {data?.imageUrl ? (
          <img
            src={data.imageUrl}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-35"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={images.hero}
            className="w-full h-full object-cover opacity-35"
          >
            <source src={data?.videoUrl || images.heroWebm} type="video/webm" />
          </video>
        )}
        {/* Subtle Tech Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071326] via-[#071326]/85 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-left space-y-7">
        {badge && (
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-sky-400 uppercase bg-sky-950/60 border border-sky-800/60 rounded-full">
            {badge}
          </span>
        )}

        {/* Main Display Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-[58px] text-white leading-[1.18] tracking-tight max-w-5xl font-poppins">
          {heading}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl font-normal leading-relaxed">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 pt-4">
          <Link
            to={primaryBtnLink}
            className="btn-unispark-white-outline group"
          >
            <span>{primaryBtnText}</span>
            <FaArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to={secondaryBtnLink}
            className="btn-unispark-white-outline group"
          >
            <span>{secondaryBtnText}</span>
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
