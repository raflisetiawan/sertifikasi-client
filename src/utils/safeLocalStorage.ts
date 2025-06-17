export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (process.env.CLIENT) {
      try {
        return localStorage.getItem(key);
      } catch (err) {
        console.error('Error accessing localStorage:', err);
        return null;
      }
    }
    return null;
  },

  setItem(key: string, value: string): void {
    if (process.env.CLIENT) {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.error('Error setting localStorage:', err);
      }
    }
  },

  removeItem(key: string): void {
    if (process.env.CLIENT) {
      try {
        localStorage.removeItem(key);
      } catch (err) {
        console.error('Error removing from localStorage:', err);
      }
    }
  },
};
