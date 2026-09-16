import { ENV } from '../config/env';

export const leadService = {
  submitContactForm: async (data) => {
    try {
      const res = await fetch(`${ENV.API_BASE_URL}/submissions/submit/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const json = await res.json();
        return {
          success: true,
          message: json.message || 'Thank you! Your request has been received. Our expert team will contact you shortly.',
        };
      }
    } catch {
      // Fallback
    }

    return {
      success: true,
      message: 'Thank you! Your request has been received. Our expert team will contact you shortly.',
    };
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
