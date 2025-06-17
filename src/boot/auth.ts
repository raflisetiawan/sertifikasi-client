import { boot } from 'quasar/wrappers';
import { Cookies } from 'quasar';
import { isAdmin, isAuthenticated } from 'src/composables/auth';
import { useUserStore } from 'src/stores/user';
import { handleAuthState, handleRouteAccess } from 'src/router/guards';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ ssrContext, router }) => {
  const store = useUserStore();
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies; // otherwise we're on client
  router.beforeEach(async (to, from, next) => {
    // Handle authentication state
    const authenticated = await handleAuthState(to, cookies, store);

    // Handle route access based on auth requirements
    handleRouteAccess(to, authenticated || isAuthenticated(), isAdmin(), next);
  });
});
