import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { useSiteContext } from '../../context/SiteContext';

export const Toast = () => {
  const { toast } = useSiteContext();

  if (!toast) return null;

  const icons = {
    success: <FaCheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <FaExclamationCircle className="w-5 h-5 text-red-400" />,
    info: <FaInfoCircle className="w-5 h-5 text-blue-400" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#f1f9ff] border border-slate-700/80 px-4 py-3 rounded-xl shadow-2xl text-slate-100 text-sm animate-bounce-short">
      {icons[toast.type] || icons.info}
      <span>{toast.message}</span>
    </div>
  );
};

export default Toast;
