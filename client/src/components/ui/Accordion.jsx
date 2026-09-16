import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { clsx } from 'clsx';

export const AccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border border-[#e5e7eb] rounded-xl bg-white overflow-hidden transition-all duration-300 hover:border-[#0470aa]/40">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-[#000000] hover:text-[#0470aa] transition-colors focus:outline-none cursor-pointer"
      >
        <span className="text-base sm:text-lg">{title}</span>
        <FaChevronDown
          className={clsx('w-4 h-4 text-[#0470aa] transition-transform duration-300', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pt-1 text-[#475467] text-sm leading-relaxed border-t border-[#e5e7eb]">
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
