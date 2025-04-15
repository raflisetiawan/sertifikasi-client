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
    headers: process.env.DEV
      ? {
          'ngrok-skip-browser-warning': 'true',
        }
      : undefined,
  });

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
