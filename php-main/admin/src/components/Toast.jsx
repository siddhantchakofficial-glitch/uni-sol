import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, onClose, duration = 3500 }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      setLeaving(false);
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    setLeaving(false);
    const timer = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  if (!message || !visible) return null;

  const isError = message.startsWith('⚠️') || message.toLowerCase().includes('error') || message.toLowerCase().includes('fail');
  const isSuccess = message.startsWith('✅') || message.toLowerCase().includes('success') || message.toLowerCase().includes('saved');

  const accent = isError ? 'var(--danger)' : isSuccess ? 'var(--success)' : 'var(--primary)';
  const Icon = isError ? AlertCircle : isSuccess ? CheckCircle : Info;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.85rem 1.1rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-card)',
        border: `1px solid ${accent}`,
        boxShadow: 'var(--shadow-lg)',
        minWidth: '280px',
        maxWidth: '420px',
        transform: leaving ? 'translateX(140%)' : 'translateX(0)',
        opacity: leaving ? 0 : 1,
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
        animation: !leaving ? 'toastSlideIn 0.35s cubic-bezier(0.4,0,0.2,1)' : undefined,
      }}
    >
      <Icon size={18} color={accent} style={{ flexShrink: 0, marginTop: '0.05rem' }} />
      <p style={{ flex: 1, fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 500 }}>{message}</p>
      <button
        onClick={dismiss}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center' }}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        background: accent,
        borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        animation: `toastProgress ${duration}ms linear forwards`,
      }} />
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>
    </div>
  );
}
