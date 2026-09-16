import React from 'react';
import { useSiteContext } from '../../context/SiteContext';
import Button from '../ui/Button';
import { FaCalendarCheck, FaArrowRight } from 'react-icons/fa';

export const CTASection = ({
  title = "Ready to Transform Your Enterprise Security & Infrastructure?",
  subtitle = "Schedule a confidential technical consultation with our senior solutions architects today.",
  backgroundImage,
}) => {
  const { setConsultationModalOpen } = useSiteContext();

  return (
    <section className="py-20 relative overflow-hidden bg-[#f1f9ff]">
      {/* Optional CMS background image — renders only when configured; keeps
          the existing gradient/graphic treatment otherwise untouched. */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Background Graphic Accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-slate-950 to-cyan-950/30 opacity-70" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 lg:p-16 border border-blue-500/20 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-2 shadow-lg shadow-blue-500/20">
            <FaCalendarCheck className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              icon={FaArrowRight}
              onClick={() => setConsultationModalOpen(true)}
            >
              Book Technical Consultation
            </Button>
            <a
              href="tel:+911145678900"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Or call our direct line: +91 11 4567 8900
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
