import axios from 'axios';
import { API_BASE, TOKEN_KEY } from './constants';

const api = axios.create({
  baseURL:API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        status: null,
        message: 'Network error. Please check your connection.',
        data: null,
        raw: error,
      });
    }

    const { status, data } = error.response;

    if (status === 401) {
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
export const createApiController = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: () => controller.abort(),
  };
};

export default api;
