import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/user/IndexPage.vue'),
        name: 'HomePage',
      },
      {
        path: 'about',
        component: () => import('pages/user/AboutPage.vue'),
        name: 'AboutPage',
      },
      {
        path: 'contact',
        component: () => import('pages/user/ContactPage.vue'),
        name: 'ContactPage',
      },
      {
        path: 'course',
        component: () => import('pages/course/IndexPage.vue'),
        name: 'CoursePage',
      },
      {
        path: 'course/:id',
        component: () => import('pages/course/DetailPage.vue'),
        name: 'DetailCourseUserPage',
      },
      {
        path: 'course/:id/register',
        component: () => import('pages/course/RegisterPage.vue'),
        name: 'RegisterCourseUserPage',
        meta: { requiresAuth: true },
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
      {
        path: 'course/update/:id',
        component: () => import('pages/admin/course/UpdatePage.vue'),
        name: 'UpdateCoursePage',
      },
      {
        path: 'course/:id',
        component: () => import('pages/admin/course/DetailPage.vue'),
        name: 'DetailCoursePage',
      },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
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
    path: '/unauthorized',
    component: () => import('pages/UnauthorizedPage.vue'),
    name: 'UnauthorizedPage',
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
