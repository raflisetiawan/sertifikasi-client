import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import config from 'src/config/env.config';

declare module '@quasar/app-vite' {
  interface QSsrContext {
    api: AxiosInstance;
  }
}

// Create api instance with proper config
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: true, // Enable credentials
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(process.env.DEV && {
        'ngrok-skip-browser-warning': 'true',
      }),
    },
  });

  // Add request interceptor
  instance.interceptors.request.use((config) => {
    // You can add CSRF token here if needed
    return config;
  });

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createAxiosInstance();

export default boot(({ app, ssrContext }) => {
  const apiInstance = createAxiosInstance();

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = apiInstance;

  if (ssrContext) {
    ssrContext.api = apiInstance;
  }
});

export const storageBaseUrl = config.storageBaseUrl;
export { api };
