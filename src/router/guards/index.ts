import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { Cookies } from 'quasar';
import { useUserStore } from 'src/stores/user';
import { useUser } from 'src/composables/auth/user';
import { AxiosError } from 'axios';

export const handleAuthState = async (
  to: RouteLocationNormalized,
  cookies: Cookies,
  store: ReturnType<typeof useUserStore>
): Promise<boolean> => {
  // If no token exists, return false immediately
  if (!cookies.get('token')) {
    store.resetUser();
    return false;
  }

  // Only try to fetch user data if we have a token
  if (store.$state.id === 0) {
    try {
      // The axios interceptor will handle token refresh if needed
      const response = await useUser(cookies.get('token'));
      store.setUser(response.data.user);
      return true;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        store.resetUser();
        cookies.remove('token', { path: '/' });
        cookies.remove('signedIn', { path: '/' });
      }
      return false;
    }
  }

  return true;
};

export const handleRouteAccess = (
  to: RouteLocationNormalized,
  isAuthenticated: boolean,
  isAdmin: boolean,
  next: NavigationGuardNext
): void => {
  // Admin routes - check first
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated) {
      next({
        name: 'auth.login',
        query: { redirect: to.fullPath },
      });
      return;
    }

    if (!isAdmin) {
      next({ name: 'unauthorized' });
      return;
    }

    next();
    return;
  }

  // Auth required routes
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next({
        name: 'auth.login',
        query: { redirect: to.fullPath },
      });
      return;
    }
    next();
    return;
  }

  // Guest only routes
  if (to.meta.requiresGuest) {
    if (isAuthenticated) {
      next('/');
      return;
    }
    next();
    return;
  }

  // Public routes
  next();
};
