import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/common/SectionHeader';
import {
  FaCheckCircle,
  FaArrowRight,
  FaTimes,
  FaChevronDown,
  FaShieldAlt,
  FaUsers,
  FaLock,
  FaNetworkWired,
  FaBuilding,
  FaHeadset,
  FaCertificate,
  FaLayerGroup,
  FaChartLine,
} from 'react-icons/fa';

// Icon resolver helper for dynamic icon names
const ICON_MAP = {
  FaShieldAlt,
  FaUsers,
  FaLock,
  FaNetworkWired,
  FaBuilding,
  FaHeadset,
  FaCertificate,
  FaLayerGroup,
  FaChartLine,
};

export const resolveBlockIcon = (iconName, fallback = FaShieldAlt) => {
  if (!iconName) return fallback;
  if (typeof iconName !== 'string') return iconName;
  return ICON_MAP[iconName] || fallback;
};

/**
 * Shared building blocks for the International Enterprise Operations pages.
 * Every section adheres to the enterprise consulting & engineering visual style.
 */

// Full-width section wrapper with selectable tones
export const Section = ({
  tone = 'white',
  id,
  children,
  className = '',
}) => {
  let toneClass = 'bg-white';
  if (tone === 'tint') {
    toneClass = 'bg-[#f1f9ff] border-y border-sky-100';
  } else if (tone === 'slate') {
    toneClass = 'bg-slate-50 border-y border-slate-200/80';
  } else if (tone === 'gradient') {
    toneClass = 'bg-gradient-to-b from-white via-[#f1f9ff]/60 to-white border-y border-slate-100';
  }

  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${toneClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">{children}</div>
    </section>
  );
};

export const Intro = ({ badge, title, subtitle, center = true }) => (
  <SectionHeader badge={badge} title={title} subtitle={subtitle} center={center} />
);

export const Prose = ({ paragraphs = [], className = '' }) => (
  <div className={`space-y-4 text-sm sm:text-[15px] text-[#475467] leading-relaxed ${className}`}>
    {paragraphs.map((p, i) => (
      <p key={i}>{p}</p>
    ))}
  </div>
);

export const CheckList = ({ items = [], columns = 1 }) => (
  <ul
    className={`grid gap-3 ${
      columns === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : columns === 2
        ? 'sm:grid-cols-2'
        : ''
    }`}
  >
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3 text-sm text-[#262626] leading-relaxed">
        <FaCheckCircle className="w-4 h-4 mt-0.5 text-[#0470aa] shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

// Numbered challenge cards for Section 03
export const NumberCards = ({ items = [], columns = 3 }) => (
  <div
    className={`grid grid-cols-1 gap-6 ${
      columns === 5
        ? 'sm:grid-cols-2 lg:grid-cols-5'
        : columns === 4
        ? 'sm:grid-cols-2 lg:grid-cols-4'
        : columns === 2
        ? 'md:grid-cols-2'
        : 'sm:grid-cols-2 lg:grid-cols-3'
    }`}
  >
    {items.map((item, i) => (
      <div
        key={i}
        className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-3 hover:border-[#0470aa]/50 hover:shadow-xl hover:shadow-[#0470aa]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
      >
        <div className="space-y-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#0470aa]/10 text-[#0470aa] text-xs font-black group-hover:bg-[#0470aa] group-hover:text-white transition-colors duration-300">
            {item.num || String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="text-base font-bold text-[#000000] leading-snug group-hover:text-[#0470aa] transition-colors">
            {item.title}
          </h3>
          {item.desc && <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">{item.desc}</p>}
        </div>
      </div>
    ))}
  </div>
);

// Primary Domain Card with interactive Drawer for Section 04
export const DomainCard = ({ domain, onOpen, isOpen }) => {
  const Icon = resolveBlockIcon(domain.iconName || domain.icon, FaShieldAlt);

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-3xl p-7 sm:p-8 shadow-sm flex flex-col h-full transition-all duration-300 hover:border-[#0470aa]/50 hover:shadow-2xl hover:shadow-[#0470aa]/10 hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-5">
        <div className="w-14 h-14 rounded-2xl bg-[#0470aa]/10 border border-[#0470aa]/20 flex items-center justify-center text-[#0470aa] group-hover:bg-[#0470aa] group-hover:text-white transition-all duration-300 shadow-sm">
          <Icon className="w-7 h-7" />
        </div>
        {domain.badge && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0470aa] bg-[#f0f7fc] px-3 py-1 rounded-full border border-sky-100">
            {domain.badge}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-[#000000] leading-snug group-hover:text-[#0470aa] transition-colors">
        {domain.name}
      </h3>

      <p className="text-sm text-[#475467] leading-relaxed mt-3 mb-6">
        {domain.blurb}
      </p>

      <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
        <button
          type="button"
          onClick={() => onOpen(isOpen ? null : domain.name)}
          className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            isOpen
              ? 'bg-[#0470aa] text-white shadow-md'
              : 'bg-[#f4f8fb] text-[#0470aa] hover:bg-[#0470aa]/10'
          }`}
          aria-expanded={isOpen}
        >
          <span>{isOpen ? 'Close Domain Explorer' : 'Explore Relevant Domain'}</span>
          <FaChevronDown
            className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <Link
          to={domain.path}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0470aa] transition-colors px-1"
        >
          <span>View Domain Overview</span>
          <FaArrowRight className="w-2.5 h-2.5" />
        </Link>

        {isOpen && (
          <div className="rounded-2xl border border-sky-200/80 bg-[#f8fafc] p-4 sm:p-5 space-y-2.5 animate-fade-in mt-3 shadow-inner">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0470aa]">
                {domain.name} Capabilities
              </span>
              <button
                type="button"
                onClick={() => onOpen(null)}
                aria-label="Close"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </div>
            {domain.drawer?.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                className="block p-3 rounded-xl bg-white border border-[#e5e7eb] hover:border-[#0470aa]/50 hover:bg-[#f1f9ff] transition-all duration-200 shadow-2xs group/link"
              >
                <div className="text-sm font-bold text-slate-900 group-hover/link:text-[#0470aa] flex items-center justify-between">
                  <span>{item.name}</span>
                  <FaArrowRight className="w-3 h-3 text-slate-300 group-hover/link:text-[#0470aa] transition-transform group-hover/link:translate-x-0.5" />
                </div>
                {item.desc && (
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Detailed Solution Card for Section 05
export const SolutionCard = ({ solution }) => (
  <div className="bg-white border border-[#e5e7eb] rounded-3xl p-7 shadow-xs hover:border-[#0470aa]/50 hover:shadow-xl hover:shadow-[#0470aa]/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
    {solution.domain && (
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0470aa] bg-[#f0f7fc] px-3 py-1 rounded-full border border-sky-100 self-start mb-4">
        {solution.domain}
      </span>
    )}

    <h3 className="text-lg sm:text-xl font-bold text-[#000000] leading-snug group-hover:text-[#0470aa] transition-colors">
      {solution.title}
    </h3>

    <p className="text-xs sm:text-sm text-[#475467] leading-relaxed mt-2.5 mb-5">
      {solution.desc}
    </p>

    {solution.features && solution.features.length > 0 && (
      <ul className="space-y-2 mb-6 pt-4 border-t border-slate-100">
        {solution.features.map((feat, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <FaCheckCircle className="w-3.5 h-3.5 mt-0.5 text-[#0470aa] shrink-0" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>
    )}

    <div className="mt-auto pt-2">
      <Link
        to={solution.path}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0470aa] hover:text-[#035a88] transition-colors group-hover:translate-x-1 duration-200"
      >
        <span>Explore Solution</span>
        <FaArrowRight className="w-3 h-3" />
      </Link>
    </div>
  </div>
);

// Unified Capability Framework Card for Section 06
export const FrameworkStep = ({ step, title, desc, idx }) => (
  <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#0470aa]/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#0470aa]/5 rounded-bl-full pointer-events-none group-hover:bg-[#0470aa]/10 transition-colors" />
    <div className="space-y-3 relative z-10">
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#f0f7fc] border border-sky-100 text-[#0470aa] text-sm font-black">
        {step || String(idx + 1).padStart(2, '0')}
      </span>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {desc}
      </p>
    </div>
  </div>
);

// High-density Category Card for Section 07
export const CategoryCard = ({ category }) => (
  <Link
    to={category.path}
    className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-2xs hover:border-[#0470aa]/50 hover:shadow-xl hover:shadow-[#0470aa]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
  >
    <div className="space-y-2.5">
      {category.tag && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100 self-start inline-block">
          {category.tag}
        </span>
      )}
      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0470aa] transition-colors leading-snug">
        {category.title}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed">
        {category.desc}
      </p>
    </div>

    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0470aa]">
      <span>Learn More</span>
      <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

// Value Pillar Card for Section 08
export const ValuePillarCard = ({ title, desc, idx }) => (
  <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#0470aa]/40 hover:shadow-lg transition-all duration-300 space-y-3">
    <div className="w-10 h-10 rounded-xl bg-[#0470aa]/10 text-[#0470aa] flex items-center justify-center text-sm font-black">
      {String(idx + 1).padStart(2, '0')}
    </div>
    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
      {title}
    </h3>
    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
      {desc}
    </p>
  </div>
);

// Accordion for Section 10 FAQ
export const FAQAccordion = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen
                ? 'bg-white border-[#0470aa]/50 shadow-md shadow-[#0470aa]/5'
                : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span
                className={`text-sm sm:text-base font-bold transition-colors ${
                  isOpen ? 'text-[#0470aa]' : 'text-slate-900'
                }`}
              >
                {faq.question}
              </span>
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'bg-[#0470aa] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FaChevronDown className="w-3.5 h-3.5" />
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-fade-in">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const Insight = ({ children }) => (
  <div className="rounded-3xl border border-[#0470aa]/20 border-l-4 border-l-[#0470aa] bg-[#f4f8fb] p-6 sm:p-10 shadow-xs space-y-3">
    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0470aa] flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#0470aa]" />
      Executive Insight
    </span>
    <p className="text-sm sm:text-base text-[#262626] leading-relaxed font-normal">
      {children}
    </p>
  </div>
);

export const SplitImage = ({ image, title, paragraphs = [], reverse = false, badge }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    <div className={`lg:col-span-6 space-y-5 ${reverse ? 'lg:order-2' : ''}`}>
      {badge && (
        <span className="inline-block px-3.5 py-1 rounded-full bg-sky-50 border border-sky-100 text-xs font-bold uppercase tracking-wider text-[#0470aa]">
          {badge}
        </span>
      )}
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#000000] tracking-tight leading-tight">
        {title}
      </h3>
      <Prose paragraphs={paragraphs} />
    </div>
    <div className={`lg:col-span-6 ${reverse ? 'lg:order-1' : ''}`}>
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="w-full h-80 sm:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
      </div>
    </div>
  </div>
);

// Service card with optional bullet list and deep link (used across child domain pages)
export const ServiceGroup = ({ title, desc, bullets = [], to, linkLabel = 'Learn More' }) => (
  <div className="bg-[#f8fafc] border border-[#e5e7eb] rounded-2xl p-6 sm:p-7 space-y-4 flex flex-col h-full hover:border-[#0470aa]/40 hover:shadow-lg hover:shadow-[#0470aa]/5 transition-all duration-300">
    <h3 className="text-lg font-bold text-[#000000] leading-snug">{title}</h3>
    {desc && <p className="text-sm text-[#475467] leading-relaxed">{desc}</p>}
    {bullets.length > 0 && (
      <ul className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[#475467] leading-relaxed">
            <FaCheckCircle className="w-3.5 h-3.5 mt-1 text-[#0470aa] shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    )}
    {to && (
      <Link
        to={to}
        className="mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0470aa] hover:text-[#035a88] transition-colors pt-2"
      >
        <span>{linkLabel}</span>
        <FaArrowRight className="w-3 h-3" />
      </Link>
    )}
  </div>
);

