import { RouteRecordRaw } from 'vue-router';

const trainerRoutes: RouteRecordRaw = {
  path: '/trainer',
  component: () => import('layouts/TrainerLayout.vue'),
  children: [
    {
      path: '',
      name: 'TrainerDashboard',
      component: () => import('pages/trainer/DashboardPage.vue'),
    },
    {
      path: 'courses',
      name: 'TrainerCourses',
      component: () => import('pages/trainer/MyCoursesPage.vue'),
    },
    {
      path: 'courses/:courseId',
      name: 'TrainerCourseDetail',
      component: () => import('pages/trainer/CourseDetailPage.vue'),
    },
    {
      path: 'modules/:moduleId',
      name: 'TrainerModuleDetail',
      component: () => import('pages/trainer/ModuleDetailPage.vue'),
    },
    {
      path: 'enrollments',
      name: 'TrainerEnrollments',
      component: () => import('pages/trainer/EnrollmentsPage.vue'),
    },
    {
      path: 'enrollments/:enrollmentId/progress',
      name: 'TrainerStudentProgress',
      component: () => import('pages/trainer/ProgressDetailPage.vue'),
    },
    {
      path: 'enrollments/:enrollmentId/assignments/:moduleContentId/submission',
      name: 'TrainerAssignmentSubmission',
      component: () => import('pages/trainer/AssignmentSubmissionPage.vue'),
    },
    {
      path: 'courses/:courseId/forum',
      name: 'TrainerCourseForum',
      component: () => import('pages/trainer/CourseForumPage.vue'),
    },
    {
      path: 'forums/:forumId',
      name: 'TrainerForumDetail',
      component: () => import('pages/trainer/ForumDetailPage.vue'),
    },
    {
      path: 'forums/:forumId/threads/create',
      name: 'TrainerCreateThread',
      component: () => import('pages/trainer/CreateThreadPage.vue'),
    },
    {
      path: 'threads/:threadId',
      name: 'TrainerThreadDetail',
      component: () => import('pages/trainer/ThreadDetailPage.vue'),
    },
  ],
  meta: { requiresAuth: true, requiresRole: 'trainer' },
};

export default trainerRoutes;
