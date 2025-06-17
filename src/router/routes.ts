import { RouteRecordRaw } from 'vue-router';
import adminRoutes from './adminRoute';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/user/IndexPage.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('pages/user/AboutPage.vue'),
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('pages/user/ContactPage.vue'),
      },
      {
        path: 'courses',
        children: [
          {
            path: '',
            name: 'courses.index',
            component: () => import('pages/course/IndexPage.vue'),
          },
          {
            path: ':id',
            name: 'courses.show',
            component: () => import('pages/course/DetailPage.vue'),
          },
          {
            path: ':id/register',
            name: 'courses.register',
            component: () => import('pages/course/RegisterPage.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: 'faq',
        name: 'faq',
        component: () => import('pages/faq/IndexPage.vue'),
      },
      {
        path: 'trainers/:id',
        name: 'trainers.show',
        component: () => import('pages/trainer/IndexPage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        name: 'auth.login',
        component: () => import('pages/auth/SignInPage.vue'),
      },
      {
        path: 'register',
        name: 'auth.register',
        component: () => import('pages/auth/SignupPage.vue'),
      },
      {
        path: 'google/callback',
        name: 'auth.google.callback',
        component: () => import('pages/auth/GoogleCallbackPage.vue'),
      },
      {
        path: 'error',
        name: 'auth.error',
        component: () => import('pages/auth/AuthErrorPage.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/UserLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/user/DashboardPage.vue'),
      },
      {
        path: 'profile',
        name: 'user.profile',
        component: () => import('pages/user/ProfilePage.vue'),
      },
      {
        path: 'courses',
        children: [
          {
            path: '',
            name: 'dashboard.courses.index',
            component: () => import('pages/user/courses/IndexPage.vue'),
          },
          {
            path: ':id',
            name: 'dashboard.courses.show',
            component: () => import('pages/user/courses/DetailPage.vue'),
          },
          {
            path: ':courseId/modules/:moduleId/learn/:enrollmentId',
            name: 'dashboard.courses.module.learn',
            component: () =>
              import('pages/user/courses/learning/IndexPage.vue'),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: '/quiz-result/:courseId/:enrollmentId/:moduleId/:contentId',
        component: () => import('pages/user/courses/quiz/QuizResultPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'payments',
        name: 'dashboard.payments',
        component: () => import('pages/user/PaymentHistoryPage.vue'),
      },
      {
        path: '/quiz/:courseId/:enrollmentId/:moduleId/:contentId',
        component: () => import('pages/user/courses/quiz/QuizPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  adminRoutes,
  {
    path: '/email/verify',
    children: [
      {
        path: 'success',
        name: 'email.verify.success',
        component: () => import('pages/auth/AlreadyVerifiedPage.vue'),
      },
    ],
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('pages/UnauthorizedPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    name: 'error.404',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
