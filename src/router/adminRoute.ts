import { RouteRecordRaw } from 'vue-router';

const adminRoutes: RouteRecordRaw = {
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
      path: 'trainer/create',
      component: () => import('pages/admin/trainer/CreatePage.vue'),
      name: 'TrainerAdminCreatePage',
    },
    {
      path: 'trainer/update/:id',
      component: () => import('pages/admin/trainer/EditPage.vue'),
      name: 'TrainerAdminUpdatePage',
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
        import('pages/admin/course/course-registrant/DetailRegistrantPage.vue'),
      name: 'CourseRegistrantDetailPage',
    },
    //module
    {
      path: 'course/:id/modules',
      component: () => import('pages/admin/module/IndexPage.vue'),
      name: 'ModuleAdminIndexPage',
    },

    {
      path: 'course/:courseId/modules/:moduleId/concepts',
      component: () => import('pages/admin/module/concept/IndexPage.vue'),
      name: 'ModuleConceptIndexPage',
    },
    {
      path: 'course/:courseId/modules/:moduleId/exercises',
      component: () => import('pages/admin/module/exercise/IndexPage.vue'),
      name: 'ModuleExerciseIndexPage',
    },
    {
      path: 'course/:courseId/benefits',
      component: () => import('pages/admin/course-benefit/IndexPage.vue'),
      name: 'CourseBenefitIndexPage',
    },
    {
      path: 'course/:courseId/modules/:moduleId/contents',
      component: () =>
        import('pages/admin/module/module-content/IndexPage.vue'),
      name: 'AdminModuleContentIndexPage',
    },

    {
      path: 'enrollment-review',
      component: () => import('pages/admin/enrollment-review/IndexPage.vue'),
      name: 'AdminEnrollmentReviewPage',
    },
    {
      path: 'live-sessions',
      component: () => import('pages/admin/LiveSessionIndexPage.vue'),
      name: 'AdminLiveSessionPage',
    },
    {
      path: 'forums',
      component: () => import('pages/admin/forum/IndexPage.vue'),
      name: 'AdminForumIndexPage',
    },
    {
      path: 'courses/:courseId/forum',
      component: () => import('pages/admin/forum/ForumAdminPage.vue'),
      name: 'AdminCourseForumPage',
    },
    {
      path: 'courses/:courseId/forum/create',
      component: () => import('pages/admin/forum/CreateForumPage.vue'),
      name: 'AdminCreateForumPage',
    },
    {
      path: 'forums/:id/edit',
      component: () => import('pages/admin/forum/EditForumPage.vue'),
      name: 'AdminEditForumPage',
    },
    {
      path: 'help-center/questions',
      component: () => import('pages/admin/HelpCenterAdminQuestionsPage.vue'),
      name: 'AdminHelpCenterQuestionsPage',
    },
  ],
  meta: { requiresAuth: true, requiresAdmin: true },
};

export default adminRoutes;
