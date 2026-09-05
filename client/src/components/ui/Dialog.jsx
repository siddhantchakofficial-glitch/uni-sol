import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export const Dialog = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f1f9ff]/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#f1f9ff] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          {title && <h3 className="text-xl font-bold text-slate-100">{title}</h3>}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
