import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import { qCookies } from 'src/boot/cookies';
import { StudentEnrollment } from 'src/models/enrollment';
import { Module } from 'src/models/module';
import { AssignmentSubmission } from 'src/models/module-content';

interface TrainerCourse {
  id: number;
  name: string;
  image: string | null;
  modules_count: number;
  enrollments_count: number;
}

export const useTrainerCourseStore = defineStore('trainerCourse', {
  state: () => ({
    trainerCourses: [] as TrainerCourse[],
    courseModulesList: [] as Module[],
    courseEnrollments: [] as StudentEnrollment[],
    selectedEnrollmentProgress: null as StudentEnrollment | null,
    assignmentSubmission: null as AssignmentSubmission | null,
  }),
  actions: {
    async getTrainerCourses(): Promise<void> {
      try {
        const response = await api.get('trainer/courses', {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        });
        this.trainerCourses = response.data;
      } catch (error) {
        console.error('Error fetching trainer courses:', error);
        throw error;
      }
    },
    async getCourseModules(courseId: number): Promise<void> {
      try {
        const response = await api.get(`trainer/courses/${courseId}/modules`, {
          headers: {
            Authorization: 'Bearer ' + qCookies.get('token'),
          },
        });
        this.courseModulesList = response.data; // Directly assign the array of modules
      } catch (error) {
        console.error('Error fetching course modules:', error);
        throw error;
      }
    },
    async getCourseEnrollments(courseId: number): Promise<void> {
      try {
        const response = await api.get(
          `trainer/courses/${courseId}/enrollments`,
          {
            headers: {
              Authorization: 'Bearer ' + qCookies.get('token'),
            },
          }
        );
        this.courseEnrollments = response.data; // Assuming data is nested under 'data'
      } catch (error) {
        console.error('Error fetching course enrollments:', error);
        throw error;
      }
    },
    async getEnrollmentProgress(enrollmentId: number): Promise<void> {
      try {
        const response = await api.get(
          `trainer/enrollments/${enrollmentId}/progress`,
          {
            headers: {
              Authorization: 'Bearer ' + qCookies.get('token'),
            },
          }
        );
        this.selectedEnrollmentProgress = response.data; // Assuming data is directly the enrollment object
      } catch (error) {
        console.error('Error fetching enrollment progress:', error);
        throw error;
      }
    },
    async getAssignmentSubmission(
      enrollmentId: number,
      moduleContentId: number
    ): Promise<void> {
      try {
        const response = await api.get(
          `trainer/enrollments/${enrollmentId}/assignments/${moduleContentId}/submission`,
          {
            headers: {
              Authorization: 'Bearer ' + qCookies.get('token'),
            },
          }
        );
        this.assignmentSubmission = response.data; // Assuming data is nested under 'data'
      } catch (error) {
        console.error('Error fetching assignment submission:', error);
        throw error;
      }
    },
    async gradeAssignment(
      enrollmentId: number,
      moduleContentId: number,
      score: number,
      feedback?: string
    ): Promise<void> {
      try {
        const payload = { score, feedback };
        await api.post(
          `trainer/enrollments/${enrollmentId}/assignments/${moduleContentId}/grade`,
          payload,
          {
            headers: {
              Authorization: 'Bearer ' + qCookies.get('token'),
            },
          }
        );
        // Optionally refetch submission to update UI
        await this.getAssignmentSubmission(enrollmentId, moduleContentId);
      } catch (error) {
        console.error('Error grading assignment:', error);
        throw error;
      }
    },
  },
});
