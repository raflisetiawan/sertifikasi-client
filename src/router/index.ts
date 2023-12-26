import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { Cookies } from 'quasar';
import { isAdmin, isAuthenticated } from 'src/composables/auth';
import { useUserStore } from 'src/stores/user';
import { useUser } from 'src/composables/auth/user';

// Define the router instance outside of the route function
const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
  ? createWebHistory
  : createWebHashHistory;

const Router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createHistory(process.env.VUE_ROUTER_BASE),
});

// Use the router instance in the route function
export default route(function ({ ssrContext }) {
  const { $state, setUser } = useUserStore();
  const cookies = process.env.SERVER ? Cookies.parseSSR(ssrContext) : Cookies; // otherwise we're on client
  Router.beforeEach(async (to, from, next) => {
    // set user store before rendering page
    if ($state.id === 0) {
      if (cookies.get('token')) {
        try {
          const response = await useUser(cookies.get('token'));
          setUser(response.data.user);
        } catch (error) {}
      }
    }
    if (to.meta.requiresAdmin) {
      if (isAdmin()) next();
      else next({ name: 'UnauthorizedPage' });
    } else if (to.meta.requiresAuth && !isAuthenticated()) {
      if (to.name !== 'signin') {
        next({ name: 'SignInPage' });
      } else {
        next();
      }
    } else if (to.meta.requiresGuest && isAuthenticated()) {
      next('/');
    } else {
      next();
    }
  });

  return Router;
});

export { Router };
