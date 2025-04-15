interface EnvConfig {
  apiBaseUrl: string;
  storageBaseUrl: string;
  appName: string;
  isServer: boolean;
}

const config: EnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  storageBaseUrl:
    import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage',
  appName: import.meta.env.VITE_APP_NAME || 'UISI Online Learning',
  // Fix the type error by explicitly checking for string value
  isServer:
    process.env.MODE === 'ssr' && process.env.CLIENT?.toString() !== 'true',
};

export default config;
