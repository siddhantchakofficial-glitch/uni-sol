import React, { useState, useRef, useEffect } from 'react';

export const Dropdown = ({ trigger, children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#f1f9ff] border border-slate-800 shadow-2xl p-2 z-50 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
