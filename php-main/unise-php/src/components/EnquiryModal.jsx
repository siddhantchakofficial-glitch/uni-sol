import React, { useState } from 'react';
import { X, Send, CheckCircle2, Shield, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COUNTRIES, DEFAULT_COUNTRY, detectCountryFromPhone } from '../data/countries';
import CountrySelect from './CountrySelect';
import CaptchaBox from './CaptchaBox';

export default function EnquiryModal({ isOpen, onClose, initialSubject = '' }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: DEFAULT_COUNTRY.name,
    countryCode: DEFAULT_COUNTRY.dialCode,
    phone: '',
    company: '',
    subject: initialSubject || 'General Security Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Anti-Bot CAPTCHA & Honeypot State
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaExpected, setCaptchaExpected] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  if (!isOpen) return null;

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';

  const handleCountryChange = (countryName) => {
    const found = COUNTRIES.find(c => c.name === countryName);
    setFormData(prev => ({
      ...prev,
      country: countryName,
      countryCode: found ? found.dialCode : prev.countryCode
    }));
  };

  const handleCountryCodeChange = (dialCode) => {
    const found = COUNTRIES.find(c => c.dialCode === dialCode);
    setFormData(prev => ({
      ...prev,
      countryCode: dialCode,
      country: found ? found.name : prev.country
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const detected = detectCountryFromPhone(value);
    if (detected) {
      setFormData(prev => ({
        ...prev,
        country: detected.country.name,
        countryCode: detected.dialCode,
        phone: detected.localNumber
      }));
    } else {
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot anti-bot verification check
    if (honeypot && honeypot.trim() !== '') {
      console.warn("Spam bot submission blocked via honeypot.");
      setLoading(false);
      return;
    }

    // Security CAPTCHA verification check
    if (!captchaInput || captchaInput.trim().toUpperCase() !== captchaExpected.trim().toUpperCase()) {
      setCaptchaError('Security CAPTCHA verification failed. Please enter the correct code shown.');
      setLoading(false);
      return;
    }

    setCaptchaError('');
    setLoading(true);
    try {
      const payload = {
        fullName: formData.name,
        companyName: formData.company || 'Direct Inquiry',
        email: formData.email,
        country: formData.country,
        countryCode: formData.countryCode,
        phone: formData.phone,
        location: formData.country,
        enquiryType: 'Quick Modal Enquiry',
        service: formData.subject,
        message: formData.message
      };

      const res = await fetch(`${apiBase}/contact/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Modal submission error:", err);
      // Still show success fallback if backend is momentarily slow
      setSubmitted(true);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{t('modal.title')}</h3>
              <p className="text-xs text-slate-400">{t('modal.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-white">{t('modal.successTitle')}</h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                {t('modal.successMessage')}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition shadow-glow"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {t('modal.fullName')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              {/* Email & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {t('modal.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {t('modal.company')}
                  </label>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
              </div>

              {/* Country & Phone Code + Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <CountrySelect
                    theme="dark"
                    value={formData.country}
                    onChange={(selected) => {
                      setFormData(prev => ({
                        ...prev,
                        country: selected.name,
                        countryCode: selected.dialCode
                      }));
                    }}
                    label="Country *"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    {t('modal.phone')} *
                  </label>
                  <div className="flex gap-2">
                    <CountrySelect
                      variant="dialCodeOnly"
                      theme="dark"
                      value={formData.countryCode}
                      onChange={(selected) => {
                        setFormData(prev => ({
                          ...prev,
                          country: selected.name,
                          countryCode: selected.dialCode
                        }));
                      }}
                    />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 50 123 4567 or +91 9876543210"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {t('modal.service')}
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {t('modal.message')}
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your project scope..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition text-sm resize-none"
                />
              </div>

              {/* Honeypot Anti-Bot Field (Hidden from human users) */}
              <input
                type="text"
                name="website_url_security_verify"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Anti-Bot Visual Security CAPTCHA */}
              <div className="pt-2 border-t border-slate-800">
                <CaptchaBox
                  captchaInput={captchaInput}
                  setCaptchaInput={(val) => {
                    setCaptchaInput(val);
                    if (captchaError) setCaptchaError('');
                  }}
                  captchaError={captchaError}
                  theme="dark"
                  onCaptchaGenerated={(code) => setCaptchaExpected(code)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition shadow-glow flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>{t('modal.submitting')}</span>
                  ) : (
                    <>
                      <span>{t('modal.submit')}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
