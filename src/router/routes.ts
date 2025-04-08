import { RouteRecordRaw } from 'vue-router';
import adminRoutes from './adminRoute';

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
      {
        path: 'faq',
        component: () => import('pages/faq/IndexPage.vue'),
        name: 'FaqIndexPage',
      },
      {
        path: 'trainer/:id',
        component: () => import('pages/trainer/IndexPage.vue'),
        name: 'TrainerIndexPage',
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
  adminRoutes,
  {
    path: '/my-profile',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/my-profile/IndexPage.vue'),
        name: 'MyProfileIndexPage',
      },
      {
        path: 'course/:id',
        component: () => import('pages/my-profile/DetailCoursePage.vue'),
        name: 'MyProfileDetailCoursePage',
      },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/email/verify/already-success',
    component: () => import('pages/auth/AlreadyVerifiedPage.vue'),
    name: 'AlreadyVerifiedPage',
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
