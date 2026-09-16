import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COUNTRIES, DEFAULT_COUNTRY, detectCountryFromPhone } from '../data/countries';
import CountrySelect from '../components/CountrySelect';
import CaptchaBox from '../components/CaptchaBox';

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    country: DEFAULT_COUNTRY.name,
    countryCode: DEFAULT_COUNTRY.dialCode,
    phone: '',
    location: '',
    enquiryType: '',
    service: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anti-Bot CAPTCHA & Honeypot State
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaExpected, setCaptchaExpected] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [config, setConfig] = useState({
    bannerTitle: "Get in Touch — We're Ready to Help",
    bannerDesc: "Whether you need a site survey, a product quotation, or information about our annual maintenance contracts — our team is ready to respond quickly and professionally. Contact us by phone, email, or complete the enquiry form below.",
    country: "United Arab Emirates",
    countryCode: "+971",
    phone: "+971 50 288 5874",
    whatsapp: "971502885874",
    email: "info@unisparkinnovation.com",
    address: "Dubai, United Arab Emirates",
    coverage: "Dubai · Abu Dhabi · Sharjah · UAE Nationwide",
    workingHours: "Sunday – Thursday, 8:00 AM – 6:00 PM (UAE)",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28884.867909334753!2d55.2707828!3d25.2048493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a6d0883%3A0x2f57581dbf302924!2sDubai!5e0!3m2!1sen!2sae!4v1625000000000!5m2!1sen!2sae",
    formBadge: "ENQUIRY FORM",
    formTitle: "Send us a message!",
    formSubtitle: "Fill in the details below and our technical engineering team will get back to you promptly.",
    formSuccessTitle: "Enquiry Dispatched!",
    formSuccessDesc: "Thank you for contacting UniSpark Innovation. Our technical engineering division will respond quickly within 2 business hours.",
    partnerLinks: [
      { title: "Looking for IT Services?", label: "Visit Horizon Hive Technology L.L.C", url: "https://horizonhivetechnology.com/" },
      { title: "Looking for HR Solutions?", label: "Visit UniSpark Innovations Human Resource Consultants L.L.C", url: "https://usihr.com/" }
    ]
  });

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';

  const loadConfig = async () => {
    try {
      const res = await fetch(`${apiBase}/contact`);
      const data = await res.json();
      if (data.success && data.data) {
        setConfig(prev => ({ ...prev, ...data.data }));
        if (data.data.country) {
          setFormData(prev => ({
            ...prev,
            country: prev.country === DEFAULT_COUNTRY.name ? data.data.country : prev.country,
            countryCode: prev.countryCode === DEFAULT_COUNTRY.dialCode ? (data.data.countryCode || prev.countryCode) : prev.countryCode
          }));
        }
      }
    } catch (err) {
      console.warn("Error fetching contact config:", err);
    }
  };

  useEffect(() => {
    loadConfig();
    const handleFocus = () => loadConfig();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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
      setIsSubmitting(false);
      return;
    }

    // Security CAPTCHA verification check
    if (!captchaInput || captchaInput.trim().toUpperCase() !== captchaExpected.trim().toUpperCase()) {
      setCaptchaError('Security CAPTCHA verification failed. Please enter the correct code shown.');
      setIsSubmitting(false);
      return;
    }

    setCaptchaError('');
    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/contact/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, honeypot })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setCaptchaInput('');
        setFormData({
          fullName: '',
          companyName: '',
          email: '',
          country: DEFAULT_COUNTRY.name,
          countryCode: DEFAULT_COUNTRY.dialCode,
          phone: '',
          location: '',
          enquiryType: '',
          service: '',
          message: ''
        });
      } else {
        alert("Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error. Please try again later.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#f1f5f9] text-slate-900 min-h-screen">
      
      {/* Header Banner (con-banner style) */}
      <section className="relative py-16 bg-[#004b78] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-2 text-xs font-semibold text-white/80">
              <li><Link to="/" className="hover:underline">{t('nav.home')}</Link></li>
              <li>/</li>
              <li className="text-white font-bold">{t('nav.contact')}</li>
            </ol>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {i18n.language === 'hi' ? t('pages.contact.title') : config.bannerTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed font-light">
            {i18n.language === 'hi' ? t('pages.contact.subtitle') : config.bannerDesc}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0073b7] flex items-center gap-2 mb-1">
              <i className="fa-solid fa-network-wired text-xs"></i> {config.formBadge || 'ENQUIRY FORM'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">{config.formTitle || 'Send us a message!'}</h2>
            {config.formSubtitle && (
              <p className="text-sm text-slate-500 mt-1 font-light">{config.formSubtitle}</p>
            )}
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{config.formSuccessTitle || 'Enquiry Dispatched!'}</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {config.formSuccessDesc || 'Thank you for contacting UniSpark Innovation. Our technical engineering division will respond quickly within 2 business hours.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1 (3 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#0073b7] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Company Name"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#0073b7] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#0073b7] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Row 2 (Country & Phone with Code & City/Location) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Searchable Country Selector */}
                <div>
                  <CountrySelect
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

                {/* Phone with Searchable Country Dial Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <CountrySelect
                      variant="dialCodeOnly"
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
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#0073b7] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* City / State / Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    City / Emirate / Location *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dubai / Abu Dhabi / Riyadh"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#0073b7] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Row 3 (Enquiry Type & Service of Interest) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Enquiry Type *
                  </label>
                  <select
                    required
                    value={formData.enquiryType}
                    onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#0073b7] focus:bg-white transition"
                  >
                    <option value="" disabled>Select Enquiry Type...</option>
                    <option value="Installation Project">Installation Project</option>
                    <option value="Equipment Supply">Equipment Supply</option>
                    <option value="AMC/PMC">AMC/PMC</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Service of Interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#0073b7] focus:bg-white transition"
                  >
                    <option value="" disabled>Select Service...</option>
                    <option value="CCTV">CCTV</option>
                    <option value="Access Control">Access Control</option>
                    <option value="Alarm Systems">Alarm Systems</option>
                    <option value="Fire Alarm">Fire Alarm</option>
                    <option value="Biometric">Biometric</option>
                    <option value="Perimeter">Perimeter</option>
                    <option value="System Integration">System Integration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Full Width Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Message / Brief Scope *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your project scope or requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#0073b7] focus:bg-white transition resize-none"
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
              <div className="pt-2 border-t border-slate-200">
                <CaptchaBox
                  captchaInput={captchaInput}
                  setCaptchaInput={(val) => {
                    setCaptchaInput(val);
                    if (captchaError) setCaptchaError('');
                  }}
                  captchaError={captchaError}
                  theme="light"
                  onCaptchaGenerated={(code) => setCaptchaExpected(code)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-[#0073b7] hover:bg-[#005a96] text-white font-bold text-sm rounded-xl shadow-md transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </div>

            </form>
          )}
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-12 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (4 Cards) */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center shrink-0 text-xl">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Call us</h4>
                  <a href={`tel:${config.phone.replace(/\s+/g, '')}`} className="text-[#0073b7] font-bold text-sm block hover:underline">{config.phone}</a>
                  <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noreferrer" className="text-emerald-600 font-bold text-xs block mt-1 hover:underline">
                    <i className="fa-brands fa-whatsapp me-1"></i> +{config.whatsapp} — WhatsApp Business
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center shrink-0 text-xl">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Email us</h4>
                  <a href={`mailto:${config.email}`} className="text-[#0073b7] font-bold text-sm block hover:underline">
                    <span className="text-slate-900 font-bold">Sales:</span> {config.email}
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center shrink-0 text-xl">
                  <i className="fa-solid fa-map-pin"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Company Address & Coverage</h4>
                  <span className="text-slate-900 font-bold text-sm block">{config.address}</span>
                  <span className="text-slate-500 text-xs block mt-1">
                    <strong>Coverage:</strong> {config.coverage}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0073b7] flex items-center justify-center shrink-0 text-xl">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Working Hours</h4>
                  <span className="text-slate-500 text-xs">{config.workingHours}</span>
                </div>
              </div>

            </div>

            {/* Right Column (Google Maps iframe) */}
            <div className="lg:col-span-6">
              <div className="h-full min-h-[350px] rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                <iframe
                  title="Location Map"
                  src={config.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '350px' }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Group Entity Links Banner */}
      {config.partnerLinks && config.partnerLinks.length > 0 && (
        <section className="py-12 bg-white border-t border-slate-200 text-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
              {config.partnerLinks.map((link, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                  <p className="text-sm font-medium text-slate-800">
                    {link.title}<br />
                    <a href={link.url} target="_blank" rel="noreferrer" className="text-[#0073b7] font-bold hover:underline">
                      {link.label}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
