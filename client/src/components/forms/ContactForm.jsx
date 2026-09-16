import React, { useState, useCallback, useEffect } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Recaptcha from './Recaptcha';
import { leadService } from '../../services/leadService';
import { useSiteContext } from '../../context/SiteContext';
import { validateEmail, validateRequired, validatePhone } from '../../utils/validation';
import { FaPaperPlane, FaSyncAlt, FaShieldAlt } from 'react-icons/fa';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  location: '',
  enquiryType: '',
  service: '',
  message: '',
};

export const ContactForm = ({ onSuccess, options }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Google reCAPTCHA token (used when VITE_RECAPTCHA_SITE_KEY is configured).
  const [captchaToken, setCaptchaToken] = useState('');

  // Self-contained server captcha (used whenever no reCAPTCHA site key exists):
  // SVG challenge + signed token parts echoed back on submit.
  const [captcha, setCaptcha] = useState(null); // { id, svg, expiry, signature }
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const { showToast } = useSiteContext();

  const recaptchaEnabled = !!import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const loadCaptcha = useCallback(async () => {
    setCaptchaAnswer('');
    setCaptchaError('');
    const challenge = await leadService.getCaptcha();
    setCaptcha(challenge);
  }, []);

  useEffect(() => {
    if (!recaptchaEnabled) loadCaptcha();
  }, [recaptchaEnabled, loadCaptcha]);

  const enquiryTypes = options?.enquiryTypes || [
    'Request for Quotation (RFQ)',
    'Technical Consultation',
    'Maintenance / AMC Support',
    'Partnership / Distribution',
    'Careers',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCaptcha = React.useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot: hidden field humans never fill. Read straight from the DOM so
    // bots that stuff values programmatically (bypassing React events) are
    // caught too. Silently drop the submission if it is filled.
    if (e.target.elements?.website_url?.value) {
      showToast('Thank you! Your request has been received.', 'success');
      return;
    }

    const newErrors = {};

    if (!validateRequired(formData.name)) newErrors.name = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Valid phone number is required';
    if (!validateRequired(formData.service)) newErrors.service = 'Please select a service interest';
    if (!validateRequired(formData.message)) newErrors.message = 'Please provide details of your requirement';

    // Captcha gate — the form cannot be submitted without it.
    if (recaptchaEnabled) {
      if (!captchaToken) {
        showToast('Please verify that you are not a robot.', 'error');
        return;
      }
    } else {
      if (!captcha) {
        showToast('Security check is still loading — please wait a moment.', 'error');
        return;
      }
      if (!validateRequired(captchaAnswer)) {
        setCaptchaError('Please type the characters shown in the image.');
        return;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = recaptchaEnabled
        ? { ...formData, captchaToken }
        : {
            ...formData,
            captchaId: captcha?.id,
            captchaAnswer,
            captchaExpiry: captcha?.expiry,
            captchaSignature: captcha?.signature,
          };

      const res = await leadService.submitContactForm(payload);

      if (!res.success) {
        // Server rejected (wrong/expired captcha or validation) — surface the
        // reason and issue a fresh challenge; tokens are single-use.
        showToast(res.message, 'error');
        if (!recaptchaEnabled) loadCaptcha();
        return;
      }

      showToast(res.message, 'success');
      setFormData(EMPTY_FORM);
      setCaptchaToken('');
      if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
        try { window.grecaptcha.reset(); } catch { /* noop */ }
      }
      if (!recaptchaEnabled) loadCaptcha();
      if (onSuccess) onSuccess();
    } catch (err) {
      showToast('Failed to submit form. Please try again.', 'error');
      if (!recaptchaEnabled) loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 notranslate" translate="no">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="Full Name *"
          name="name"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Company Name"
          name="company"
          placeholder="Your Company Name"
          value={formData.company}
          onChange={handleChange}
        />
        <Input
          label="Email Address *"
          type="email"
          name="email"
          placeholder="name@domain.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="Phone Number *"
          name="phone"
          placeholder="+ XX XXX XXX XXXX"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <Select
          label="Private / Location *"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Select Location..."
          options={options?.locations || ['India', 'United Arab Emirates', 'Other International']}
        />
        <Select
          label="Enquiry Type *"
          name="enquiryType"
          value={formData.enquiryType}
          onChange={handleChange}
          placeholder="Select Enquiry Type ..."
          options={enquiryTypes}
        />
      </div>

      <Select
        label="Service Of Interest"
        name="service"
        value={formData.service}
        onChange={handleChange}
        error={errors.service}
        placeholder="Select Service..."
        options={options?.services || [
          'CCTV & AI Video Analytics',
          'Biometric & Physical Access Control',
          'Fire Alarm & Life Safety Systems',
          'Perimeter Intrusion Detection',
          'System Integration & Command Center (PSIM)',
          'Annual Maintenance Contracts (AMC/PMC)',
          'International Talent & IT Consulting',
        ]}
      />

      <Textarea
        label="Message / Project Scope *"
        name="message"
        rows={5}
        placeholder="Describe your project scope or requirements ..."
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
      />

      {recaptchaEnabled ? (
        /* Google reCAPTCHA — production option when a site key is configured. */
        <Recaptcha onChange={handleCaptcha} />
      ) : (
        /* Self-contained server captcha — the identity-verification row. */
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0470aa]">
            Identity Verification
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div
              className="relative shrink-0 overflow-hidden rounded-lg border border-[#d4e5f2] bg-[#f1f9ff]"
              title="Security verification image"
            >
              {captcha?.svg ? (
                <div
                  className="notranslate select-none [&>svg]:block"
                  translate="no"
                  dangerouslySetInnerHTML={{ __html: captcha.svg }}
                />
              ) : (
                <div className="flex h-[56px] w-[180px] items-center justify-center text-xs text-slate-400">
                  Loading…
                </div>
              )}
              <button
                type="button"
                onClick={loadCaptcha}
                title="Get a new code"
                aria-label="Get a new captcha code"
                className="absolute right-1 top-1 rounded-md bg-white/90 p-1.5 text-[#0470aa] shadow-sm transition hover:bg-white hover:text-[#03608f]"
              >
                <FaSyncAlt className="h-3 w-3" />
              </button>
            </div>

            <div className="min-w-[200px] flex-1">
              <Input
                label="Enter the code above *"
                name="captchaAnswer"
                placeholder="Type the characters shown"
                value={captchaAnswer}
                maxLength={8}
                autoComplete="off"
                onChange={(e) => {
                  setCaptchaAnswer(e.target.value.toUpperCase());
                  if (captchaError) setCaptchaError('');
                }}
                error={captchaError}
              />
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
            <FaShieldAlt className="h-3 w-3 text-[#0470aa]" />
            This check confirms a real person is submitting the enquiry. Codes are case-insensitive and valid for 10 minutes.
          </p>
        </div>
      )}

      {/* Honeypot — visually hidden; see handleSubmit. */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <Button
          type="submit"
          variant="primary"
          className="inline-flex items-center gap-2 px-6"
          disabled={loading}
        >
          <span>{loading ? 'Submitting...' : 'Submit Inquiry'}</span>
          <FaPaperPlane className="w-3.5 h-3.5" />
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
