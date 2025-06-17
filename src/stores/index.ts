import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { Router } from 'vue-router';
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2';
/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)
  // Only use persisted state plugin on client-side
  if (process.env.CLIENT) {
    pinia.use(
      createPersistedStatePlugin({
        storage: {
          getItem: (key) => {
            try {
              return localStorage.getItem(key);
            } catch (err) {
              return null;
            }
          },
          setItem: (key, value) => {
            try {
              if (typeof value === 'object' && value !== null) {
                const safeValue = { ...value };
                if (safeValue.user) {
                  delete safeValue.user.token;
                  delete safeValue.user.id;
                  delete safeValue.user.phone_number;
                  delete safeValue.user.created_at;
                  delete safeValue.user.email_verified_at;
                  delete safeValue.user.role;
                }
                localStorage.setItem(key, JSON.stringify(safeValue));
              }
            } catch (err) {
              console.error('Error setting localStorage:', err);
            }
          },
          removeItem: (key) => {
            try {
              localStorage.removeItem(key);
            } catch (err) {
              console.error('Error removing from localStorage:', err);
            }
          },
        },
      })
    );
  }
  return pinia;
});
