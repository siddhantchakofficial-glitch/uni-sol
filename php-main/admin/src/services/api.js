// ============================================================
// API Service — UniSol Admin CMS
// Automatically injects JWT auth token on every request.
// Falls back gracefully when backend is offline.
// ============================================================

export const getApiBaseUrl = () => {
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'http://localhost:5000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';
};

export const API_BASE_URL =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_BASE_URL || 'https://unispark-backend-api.onrender.com/api';

export const WEBSITE_BASE_URL =
  import.meta.env.VITE_WEBSITE_URL || 'https://uni-sol-seven.vercel.app';

// ─── Auth Helpers ────────────────────────────────────────────
const getToken = () => localStorage.getItem('admin_token') || '';

/** Build JSON headers with Bearer token */
const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

/** Build auth-only headers (for file uploads) */
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

/** Generic GET helper */
const apiGet = async (path) => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: authHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.warn(`API GET ${path}:`, err);
    return { success: false, message: 'Backend server is offline or unreachable' };
  }
};

/** Generic PUT helper */
const apiPut = async (path, body) => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.warn(`API PUT ${path}:`, err);
    return { success: false, message: 'Backend server is offline or unreachable' };
  }
};

/** Generic POST helper */
const apiPost = async (path, body) => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.warn(`API POST ${path}:`, err);
    return { success: false, message: 'Backend server is offline or unreachable' };
  }
};

/** Generic DELETE helper */
const apiDelete = async (path) => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.warn(`API DELETE ${path}:`, err);
    return { success: false, message: 'Backend server is offline or unreachable' };
  }
};

// ─── Health Check ────────────────────────────────────────────
export const checkApiHealth = async () => {
  try {
    const res = await fetch(`${API_BASE_URL.replace('/api', '/')}`);
    return await res.json();
  } catch {
    return { status: 'offline' };
  }
};

// ─── Footer ──────────────────────────────────────────────────
export const fetchFooterConfig = () => apiGet('/footer');
export const updateFooterConfig = (data) => apiPut('/footer', data);

// ─── Contact ─────────────────────────────────────────────────
export const fetchContactConfig = () => apiGet('/contact');
export const updateContactConfig = (data) => apiPut('/contact', data);

// ─── Enquiries / Form Submissions ────────────────────────────
export const fetchEnquiries = () => apiGet('/contact/message');
export const markEnquiryRead = (id) => apiPut(`/contact/message/${id}/read`, {});
export const deleteEnquiry = (id) => apiDelete(`/contact/message/${id}`);

// ─── Partners ────────────────────────────────────────────────
export const fetchPartnerConfig = () => apiGet('/partners');
export const updatePartnerConfig = (data) => apiPut('/partners', data);

// ─── Stats ───────────────────────────────────────────────────
export const fetchStatsConfig = () => apiGet('/stats');
export const updateStatsConfig = (data) => apiPut('/stats', data);

// ─── About ───────────────────────────────────────────────────
export const fetchAboutConfig = () => apiGet('/about');
export const updateAboutConfig = (data) => apiPut('/about', data);

// ─── Home Sections ───────────────────────────────────────────
export const fetchSection2Config = () => apiGet('/section2');
export const updateSection2Config = (data) => apiPut('/section2', data);

export const fetchSection3Config = () => apiGet('/section3');
export const updateSection3Config = (data) => apiPut('/section3', data);

export const fetchSection4Config = () => apiGet('/section4');
export const updateSection4Config = (data) => apiPut('/section4', data);

export const fetchSection5Config = () => apiGet('/section5');
export const updateSection5Config = (data) => apiPut('/section5', data);

export const fetchSection6Config = () => apiGet('/section6');
export const updateSection6Config = (data) => apiPut('/section6', data);

// ─── Hero ────────────────────────────────────────────────────
export const fetchHeroConfig = () => apiGet('/hero');
export const updateHeroConfig = (data) => apiPut('/hero', data);

// ─── Marquee ─────────────────────────────────────────────────
export const fetchMarqueeConfig = () => apiGet('/marquee');
export const updateMarqueeConfig = (data) => apiPut('/marquee', data);

// ─── Header ──────────────────────────────────────────────────
export const fetchHeaderConfig = () => apiGet('/header');
export const updateHeaderConfig = (data) => apiPut('/header', data);
export const deleteHeaderConfig = () => apiDelete('/header');

// ─── Users ───────────────────────────────────────────────────
export const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, { headers: authHeaders() });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, message: `Server error (${res.status}): ${text}` };
    }
    return await res.json();
  } catch (err) {
    console.warn('API fetchUsers:', err);
    return { success: false, message: 'Backend server is offline or unreachable' };
  }
};

export const createUser = (data) => apiPost('/users', data);
export const updateUserDetails = (id, data) => apiPut(`/users/${id}`, data);
export const deleteUserById = (id) => apiDelete(`/users/${id}`);

// ─── Auth ────────────────────────────────────────────────────
export const registerUser = (data) => apiPost('/auth/register', data);
export const loginUser = (credentials) => apiPost('/auth/login', credentials);
export const logoutUser = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', headers: authHeaders() });
  } catch {}
  return { success: true };
};

// ─── Media ───────────────────────────────────────────────────
export const fetchMedia = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiGet(`/media${qs ? `?${qs}` : ''}`);
};

export const uploadMedia = async (file, folder = 'general', altText = '') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('altText', altText || file.name);

    const res = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    });
    return await res.json();
  } catch (err) {
    console.warn('API uploadMedia:', err);
    return { success: false, message: 'Upload failed. Backend may be offline.' };
  }
};

export const deleteMedia = (id) => apiDelete(`/media/${id}`);

// ─── Site Settings ───────────────────────────────────────────
export const fetchSettings = () => apiGet('/settings');
export const updateSettings = (data) => apiPut('/settings', data);

// ─── Activity Log ────────────────────────────────────────────
export const fetchActivity = (limit = 20) => apiGet(`/activity?limit=${limit}`);

// ─── Submissions (enquiries via /api/submissions) ────────────
export const fetchSubmissions = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiGet(`/submissions${qs ? `?${qs}` : ''}`);
};
export const updateSubmissionStatus = (id, status) =>
  apiPut(`/submissions/${id}/status`, { status });
export const deleteSubmission = (id) => apiDelete(`/submissions/${id}`);
