import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { LocalStorage } from 'quasar';
import { isAuthenticated } from 'src/composables/auth';
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
export default route(function () {
  const { $state, setUser } = useUserStore();
  Router.beforeEach(async (to, from, next) => {
    // set user store before rendering page
    if ($state.id === 0) {
      if (LocalStorage.getItem('token')) {
        try {
          const response = await useUser(LocalStorage.getItem('token'));
          setUser(response.data.user);
        } catch (error) {}
      }
    }

    if (to.meta.requiresAuth && !isAuthenticated()) {
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
