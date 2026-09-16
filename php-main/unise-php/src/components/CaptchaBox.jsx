import React, { useEffect, useRef } from 'react';
import { RotateCw, AlertTriangle } from 'lucide-react';

export default function CaptchaBox({
  captchaInput,
  setCaptchaInput,
  captchaError,
  theme = 'light',
  onCaptchaGenerated
}) {
  const canvasRef = useRef(null);

  const generateCaptchaCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const drawCaptcha = (code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background fill
    ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#f1f5f9';
    ctx.fillRect(0, 0, width, height);

    // Random Background Lines (Noise reduction for bots)
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0, 115, 183, 0.3)';
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Random Noise Dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Colors palette for characters
    const colors = theme === 'dark'
      ? ['#38bdf8', '#60a5fa', '#34d399', '#f472b6', '#a78bfa']
      : ['#0073b7', '#0284c7', '#0d9488', '#d97706', '#6d28d9'];

    ctx.font = 'bold 22px monospace';
    ctx.textBaseline = 'middle';

    // Render characters with slight rotation & positioning offset
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const x = 16 + i * 24;
      const y = height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() - 0.5) * 0.35;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  const refreshCaptcha = () => {
    const newCode = generateCaptchaCode();
    drawCaptcha(newCode);
    if (onCaptchaGenerated) {
      onCaptchaGenerated(newCode);
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  return (
    <div className="space-y-2">
      <label className={`block text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
        Security Verification (CAPTCHA) *
      </label>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Canvas & Refresh Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-900 cursor-pointer"
            onClick={refreshCaptcha}
            title="Click to change CAPTCHA code"
          >
            <canvas ref={canvasRef} width="140" height="42" className="block select-none" />
          </div>
          <button
            type="button"
            onClick={refreshCaptcha}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title="Refresh CAPTCHA Code"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Input Field */}
        <div className="flex-1">
          <input
            type="text"
            required
            maxLength={6}
            placeholder="Type code above"
            value={captchaInput}
            onChange={(e) => {
              setCaptchaInput(e.target.value.toUpperCase());
            }}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-mono tracking-widest uppercase focus:outline-none transition ${
              theme === 'dark'
                ? 'bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500'
                : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#0073b7] focus:bg-white'
            }`}
          />
        </div>
      </div>

      {captchaError && (
        <p className="text-xs font-semibold text-rose-500 mt-1 flex items-center gap-1.5 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{captchaError}</span>
        </p>
      )}
    </div>
  );
}
