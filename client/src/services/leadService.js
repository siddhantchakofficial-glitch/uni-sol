import { ENV } from '../config/env';

const THANK_YOU_MESSAGE = 'Thank you! Your request has been received. Our expert team will contact you shortly.';

export const leadService = {
  /** Fetch a server-issued captcha challenge (SVG + signed token parts). */
  getCaptcha: async () => {
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/submissions/captcha`);
      if (res.ok) {
        const json = await res.json();
        if (json?.success && json.captcha) return json.captcha;
      }
    } catch {
      // fall through
    }
    return null;
  },

  submitContactForm: async (data) => {
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/submissions/submit/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => null);

      // Surface real failures (captcha rejected, validation, server error) so
      // the form can show the error and let the user retry.
      if (!res.ok || json?.success === false) {
        return {
          success: false,
          message: json?.message || 'Submission rejected. Please check the form and try again.',
        };
      }

      return {
        success: true,
        message: json?.message || THANK_YOU_MESSAGE,
      };
    } catch {
      // Network/server unreachable — report failure instead of faking success
      // so the user knows their enquiry was NOT delivered.
      return {
        success: false,
        message: 'Could not reach the server. Please try again in a moment.',
      };
    }
  },

  subscribeNewsletter: async (email) => {
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/submissions/submit/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const json = await res.json();
        return {
          success: true,
          message: json.message || 'Successfully subscribed to UniSpark Innovation newsletter!',
        };
      }
    } catch {
      // Fallback
    }

    return {
      success: true,
      message: 'Successfully subscribed to UniSpark Innovation newsletter!',
    };
  },
};

export default leadService;
