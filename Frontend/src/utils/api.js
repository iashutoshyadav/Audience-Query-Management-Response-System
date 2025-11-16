import axios from 'axios';
import { API_BASE, TOKEN_KEY } from './constants';

// -------------------------------------------------------------------
// Create Axios instance
// -------------------------------------------------------------------
const api = axios.create({
  baseURL:API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// -------------------------------------------------------------------
// Request Interceptor – Attach Token
// -------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore storage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------------------------------
// Response Interceptor – Global Error Normalization + Auth Handling
// -------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // No response → Network failure
    if (!error.response) {
      return Promise.reject({
        status: null,
        message: 'Network error. Please check your connection.',
        data: null,
        raw: error,
      });
    }

    const { status, data } = error.response;

    // Handle expired / invalid auth token
    if (status === 401) {
      // Consumers can decide to logout
      console.warn('⚠️ Unauthorized: Token expired or invalid');
    }

    return Promise.reject({
      status,
      message: data?.message || 'Something went wrong.',
      data,
      raw: error,
    });
  }
);

// -------------------------------------------------------------------
// Utility – Create cancelable API request controller
// -------------------------------------------------------------------
export const createApiController = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
  };
};

// -------------------------------------------------------------------
// Export Axios instance
// -------------------------------------------------------------------
export default api;
