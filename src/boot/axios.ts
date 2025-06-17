import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import config from 'src/config/env.config';
import { useUserStore } from 'src/stores/user';
import { qCookies } from 'src/boot/cookies';
declare module '@quasar/app-vite' {
  interface QSsrContext {
    api: AxiosInstance;
  }
}

// Create api instance with proper config
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: config.apiBaseUrl,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(process.env.DEV && {
        'ngrok-skip-browser-warning': 'true',
      }),
    },
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  // Add request interceptor to check token expiration
  instance.interceptors.request.use(
    async (config) => {
      const token = qCookies.get('token');
      const expiresAt = qCookies.get('expires_at');
      if (token && expiresAt) {
        const willExpireSoon =
          new Date(expiresAt).getTime() - Date.now() < 5 * 60 * 1000; // 5 minutes

        if (willExpireSoon && !isRefreshing) {
          isRefreshing = true;
          try {
            const response = await instance.post('auth/refresh');
            if (response.data.success) {
              const { token: newToken, expires_at: newExpiration } =
                response.data;

              qCookies.set('token', newToken, {
                path: '/',
                expires: '1d',
                secure: process.env.NODE_ENV === 'production',
              });
              qCookies.set('expires_at', newExpiration);

              config.headers.Authorization = `Bearer ${newToken}`;
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            // Clear auth state and redirect to login
            const userStore = useUserStore();
            userStore.resetUser();
            qCookies.remove('token', { path: '/' });
            qCookies.remove('expires_at', { path: '/' });
            window.location.href = '/auth/login';
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        }

        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for handling 401s
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await instance.post('auth/refresh');
          const { token, expires_at } = response.data;

          if (token) {
            qCookies.set('token', token, {
              path: '/',
              expires: '1d',
              secure: process.env.NODE_ENV === 'production',
            });
            qCookies.set('expires_at', expires_at);
            instance.defaults.headers.common.Authorization = `Bearer ${token}`;
            originalRequest.headers.Authorization = `Bearer ${token}`;

            processQueue(null, token);
            return instance(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError as Error);
          const userStore = useUserStore();
          userStore.resetUser();
          qCookies.remove('token', { path: '/' });
          qCookies.remove('expires_at', { path: '/' });

          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
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
