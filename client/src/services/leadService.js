import { fetchAPI } from './api';

export const leadService = {
  submitContactForm: async (data) => {
    console.log('Submitting contact lead form:', data);
    // Simulating API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Thank you! Your request has been received. Our expert team will contact you shortly.' });
      }, 600);
    });
  },
  subscribeNewsletter: async (email) => {
    console.log('Submitting newsletter subscription:', email);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Successfully subscribed to UniSpark Innovation newsletter!' });
      }, 500);
    });
  },
};
