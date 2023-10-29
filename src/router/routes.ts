import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'HomePage',
      },
      {
        path: 'about',
        component: () => import('pages/AboutPage.vue'),
        name: 'AboutPage',
      },
      {
        path: 'contact',
        component: () => import('pages/ContactPage.vue'),
        name: 'ContactPage',
      },
      {
        path: 'course',
        component: () => import('pages/CoursePage.vue'),
        name: 'CoursePage',
      },
    ],
  },
  {
    path: '/signin',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/auth/SignInPage.vue'),
        name: 'SignInPage',
        meta: { requiresGuest: true },
      },
      {
        path: '/signup',
        component: () => import('pages/auth/SignupPage.vue'),
        name: 'SignUpPage',
        meta: { requiresGuest: true },
      },
    ],
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/admin/IndexPage.vue'),
        name: 'AdminPage',
      },
      {
        path: 'course',
        component: () => import('pages/admin/course/IndexPage.vue'),
        name: 'AdminCoursePage',
      },
      {
        path: 'course/create',
        component: () => import('pages/admin/course/CreatePage.vue'),
        name: 'CreateCoursePage',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/secret',
    component: () => import('pages/SecretPage.vue'),
    name: 'SecretPage',
    meta: { requiresAuth: true },
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
