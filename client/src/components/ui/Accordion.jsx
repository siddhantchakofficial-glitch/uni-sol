import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { clsx } from 'clsx';

export const AccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border border-slate-800/80 rounded-xl bg-[#f1f9ff]/60 overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-slate-100 hover:text-blue-400 transition-colors focus:outline-none cursor-pointer"
      >
        <span className="text-base sm:text-lg">{title}</span>
        <FaChevronDown
          className={clsx('w-4 h-4 text-blue-500 transition-transform duration-300', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pt-1 text-slate-400 text-sm leading-relaxed border-t border-slate-800/40">
          {children}
        </div>
      )}
    </div>
  );
};

export const Accordion = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3.5">
      {items.map((item, idx) => (
        <AccordionItem
          key={idx}
          title={item.question || item.title}
          isOpen={openIndex === idx}
          onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
        >
          {item.answer || item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
