import React from 'react';
import Loader from '../ui/Loader';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 bg-[#f1f9ff] flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-blue-500/30 animate-pulse">
        U
      </div>
      <Loader size="lg" />
      <span className="text-xs uppercase font-semibold text-slate-400 tracking-widest animate-pulse">
        Loading UniSpark Innovation...
      </span>
    </div>
  );
};

export default LoadingScreen;
