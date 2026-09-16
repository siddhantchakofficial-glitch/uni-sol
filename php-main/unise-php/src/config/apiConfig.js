export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
};

export const API_BASE = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'
  : (import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api');

export default API_BASE;
