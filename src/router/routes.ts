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
      {
        path: 'faq',
        component: () => import('pages/admin/faq/IndexPage.vue'),
        name: 'FaqAdminIndexPage',
      },
      {
        path: 'trainer',
        component: () => import('pages/admin/trainer/IndexPage.vue'),
        name: 'TrainerAdminIndexPage',
      },
      {
        path: 'course/material/:id',
        component: () => import('pages/admin/material/IndexPage.vue'),
        name: 'MaterialAdminIndexPage',
      },
      // registrant
      {
        path: 'course-registrant',
        component: () =>
          import('pages/admin/course/course-registrant/IndexPage.vue'),
        name: 'CourseRegistrantIndexPage',
      },
      {
        path: 'course-registrant/:id',
        component: () =>
          import(
            'pages/admin/course/course-registrant/DetailRegistrantPage.vue'
          ),
        name: 'CourseRegistrantDetailPage',
      },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
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
