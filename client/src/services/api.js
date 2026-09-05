import { ENV } from '../config/env';

export const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`Simulating local fallback data for ${endpoint}:`, error.message);
    return null;
  }
};
