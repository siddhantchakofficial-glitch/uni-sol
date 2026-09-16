import React, { useState } from 'react';
import {
  FaTimes, FaDesktop, FaTabletAlt, FaMobileAlt,
  FaExternalLinkAlt, FaEye, FaCheckCircle
} from 'react-icons/fa';

/**
 * LivePreviewModal renders the REAL React frontend components with current in-memory draft data.
 * Allows instant responsive preview across Desktop (100%), Tablet (768px), and Mobile (375px) viewports.
 */
export const LivePreviewModal = ({
  isOpen,
  onClose,
  title = 'Live Website Preview',
  publicPath = '/',
  children,
}) => {
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  if (!isOpen) return null;

  const viewportWidthClass =
    viewport === 'mobile'
      ? 'max-w-[390px] border-x border-gray-300 shadow-2xl rounded-3xl overflow-hidden my-4 mx-auto'
      : viewport === 'tablet'
      ? 'max-w-[768px] border-x border-gray-300 shadow-2xl rounded-2xl overflow-hidden my-4 mx-auto'
      : 'w-full';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Top Controls Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold font-poppins flex items-center gap-2">
              <FaEye className="text-[#0470aa]" /> {title}
            </h3>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700 hidden sm:inline-block">
            Real Component Render
          </span>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewport === 'desktop'
                ? 'bg-[#0470aa] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop View (Full Width)"
          >
            <FaDesktop className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewport === 'tablet'
                ? 'bg-[#0470aa] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <FaTabletAlt className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewport === 'mobile'
                ? 'bg-[#0470aa] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile View (375px)"
          >
            <FaMobileAlt className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Action / Close */}
        <div className="flex items-center gap-2">
          {publicPath && (
            <a
              href={publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open public page in new tab"
            >
              <FaExternalLinkAlt className="w-3 h-3" />
              <span className="hidden sm:inline">Open Live URL</span>
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Close Preview"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Preview Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-slate-900/50 p-0 sm:p-4 flex justify-center">
        <div
          className={`transition-all duration-300 bg-white min-h-full ${viewportWidthClass}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default LivePreviewModal;
